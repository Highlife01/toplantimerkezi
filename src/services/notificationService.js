/**
 * Toplantı Merkezi Çok Kanallı Bildirim & Güvenli Webhook Servisi
 * - Olaylar: 'new_lead' (Yeni Talep), 'proposal_sent' (Teklif Gönderimi), 'customer_approved' (Müşteri Onayı/Yanıtı)
 * - Kanallar varsayılan olarak KAPALIDIR (enabled: false).
 * - API anahtarları ve Webhook sırları yalnızca superadmin yetkisiyle erişilebilen 'notification_secrets/config' dokümanında tutulur.
 * - SSRF koruması: İç ağ (RFC1918), localhost, link-local (169.254.x.x) ve HTTP hedefleri kesin olarak engellenir.
 * - Mükerrer gönderim (Idempotency) koruması ve yeniden deneme (Retry) kayıtları 'notification_logs' koleksiyonunda tutulur.
 */

import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from './firebase';

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /\.localhost$/i,
  /^metadata\.google\.internal$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^169\.254\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^0\.0\.0\.0$/,
  /^\[?::1\]?$/,
  /^\[?fe80:/i,
  /^\[?fc00:/i,
  /^\[?fd00:/i
];

export const DEFAULT_NOTIFICATION_CONFIG = {
  // Tüm kanallar varsayılan olarak KAPALIDIR
  webhookEnabled: false,
  telegramEnabled: false,
  whatsappApiEnabled: false,
  // Olay tetikleyicileri
  events: {
    new_lead: false,
    proposal_sent: false,
    customer_approved: false
  },
  // Doğrulanmış alıcı / hedef bilgileri (Sırlar hariç özet)
  webhookRecipientLabel: '',
  telegramChatId: '',
  whatsappPhoneNumberId: '',
  whatsappRecipientPhone: '',
  updatedAt: null,
  updatedBy: null
};

export const notificationService = {
  /**
   * Hassas anahtar veya URL maskeleme yardımcısı
   */
  maskSecret: (secret) => {
    if (!secret || typeof secret !== 'string') return '';
    const trimmed = secret.trim();
    if (trimmed.length <= 8) return '••••••••';
    return `${trimmed.slice(0, 4)}••••••••${trimmed.slice(-4)}`;
  },

  /**
   * SSRF ve Güvenli Webhook Hedef Doğrulaması
   */
  validateWebhookUrl: (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
      return { valid: false, reason: 'Webhook URL alanı boş bırakılamaz.' };
    }
    let parsed;
    try {
      parsed = new URL(rawUrl.trim());
    } catch {
      return { valid: false, reason: 'Geçersiz URL formatı.' };
    }

    if (parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Güvenlik kuralı: Webhook hedefi yalnızca HTTPS protokolü kullanmalıdır.' };
    }

    const host = parsed.hostname.toLowerCase();
    for (const pattern of PRIVATE_HOST_PATTERNS) {
      if (pattern.test(host)) {
        return {
          valid: false,
          reason: `Güvenlik engeli (SSRF Koruması): İç ağ, yerel sunucu veya metadata adreslerine (${host}) istek gönderilemez.`
        };
      }
    }

    if (parsed.port && parsed.port !== '443') {
      return {
        valid: false,
        reason: 'Güvenlik kuralı: Standart dışı portlara (443 harici) webhook isteği gönderilemez.'
      };
    }

    if (parsed.username || parsed.password) {
      return {
        valid: false,
        reason: 'URL içerisinde kullanıcı adı veya parola bulundurulamaz.'
      };
    }

    return { valid: true, normalizedUrl: parsed.toString(), host };
  },

  /**
   * Bildirim yapılandırmasını ve (varsa yetkili superadmin için) sırları getirir
   */
  getNotificationConfig: async () => {
    if (!db) return { ...DEFAULT_NOTIFICATION_CONFIG };
    try {
      const snap = await getDoc(doc(db, 'settings', 'notification_config'));
      if (snap.exists()) {
        return {
          ...DEFAULT_NOTIFICATION_CONFIG,
          ...snap.data(),
          events: {
            ...DEFAULT_NOTIFICATION_CONFIG.events,
            ...(snap.data().events || {})
          }
        };
      }
    } catch (err) {
      // Yetki veya bağlantı durumunda güvenli kapalı varsayılan döner
    }
    return { ...DEFAULT_NOTIFICATION_CONFIG };
  },

  /**
   * Sadece SuperAdmin tarafından okunabilen bildirim sırlarını getirir
   */
  getNotificationSecrets: async () => {
    if (!db) return { webhookUrl: '', telegramBotToken: '', whatsappAccessToken: '' };
    try {
      const snap = await getDoc(doc(db, 'notification_secrets', 'config'));
      if (snap.exists()) {
        return snap.data();
      }
    } catch {
      // Superadmin değilse okuma reddedilir (normal davranış)
    }
    return { webhookUrl: '', telegramBotToken: '', whatsappAccessToken: '' };
  },

  /**
   * Bildirim yapılandırmasını ve sırlarını güvenli şekilde kaydeder
   */
  saveNotificationConfigAndSecrets: async (config, secrets, actorEmail = '') => {
    if (!db) throw new Error('Firestore bağlantısı mevcut değil.');

    if (secrets?.webhookUrl) {
      const check = notificationService.validateWebhookUrl(secrets.webhookUrl);
      if (!check.valid) {
        throw new Error(check.reason);
      }
    }

    const sanitizedConfig = {
      webhookEnabled: Boolean(config.webhookEnabled),
      telegramEnabled: Boolean(config.telegramEnabled),
      whatsappApiEnabled: Boolean(config.whatsappApiEnabled),
      events: {
        new_lead: Boolean(config.events?.new_lead),
        proposal_sent: Boolean(config.events?.proposal_sent),
        customer_approved: Boolean(config.events?.customer_approved)
      },
      webhookRecipientLabel: String(config.webhookRecipientLabel || '').trim(),
      telegramChatId: String(config.telegramChatId || '').trim(),
      whatsappPhoneNumberId: String(config.whatsappPhoneNumberId || '').trim(),
      whatsappRecipientPhone: String(config.whatsappRecipientPhone || '').trim(),
      hasWebhookSecret: Boolean(secrets?.webhookUrl?.trim()),
      hasTelegramSecret: Boolean(secrets?.telegramBotToken?.trim()),
      hasWhatsappSecret: Boolean(secrets?.whatsappAccessToken?.trim()),
      webhookMasked: notificationService.maskSecret(secrets?.webhookUrl || ''),
      telegramTokenMasked: notificationService.maskSecret(secrets?.telegramBotToken || ''),
      whatsappTokenMasked: notificationService.maskSecret(secrets?.whatsappAccessToken || ''),
      updatedAt: new Date().toISOString(),
      updatedBy: actorEmail
    };

    await setDoc(doc(db, 'settings', 'notification_config'), sanitizedConfig, { merge: true });

    if (secrets) {
      await setDoc(
        doc(db, 'notification_secrets', 'config'),
        {
          webhookUrl: String(secrets.webhookUrl || '').trim(),
          telegramBotToken: String(secrets.telegramBotToken || '').trim(),
          whatsappAccessToken: String(secrets.whatsappAccessToken || '').trim(),
          updatedAt: new Date().toISOString(),
          updatedBy: actorEmail
        },
        { merge: true }
      );
    }

    return sanitizedConfig;
  },

  /**
   * Bildirim günlüklerini getirir
   */
  fetchNotificationLogs: async (maxCount = 50) => {
    if (!db) return [];
    try {
      const q = query(collection(db, 'notification_logs'), orderBy('dispatchedAt', 'desc'), limit(maxCount));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      return [];
    }
  },

  /**
   * Tekil kanal gönderimi ve günlükleme (Mükerrer kontrolü ile)
   */
  dispatchEventNotification: async ({
    eventType,
    lead,
    versionKey = 'v0',
    actorEmail = 'system',
    isTest = false,
    forceRetryLogId = null
  }) => {
    if (!db) {
      throw new Error('Veritabanı bağlantısı aktif değil.');
    }

    const config = await notificationService.getNotificationConfig();
    const secrets = await notificationService.getNotificationSecrets();

    // Test değilse ve ilgili olay tetikleyicisi kapalıysa gönderme
    if (!isTest && !config.events?.[eventType]) {
      return {
        dispatched: false,
        reason: `'${eventType}' olayı için otomatik bildirim tetikleyicisi kapalı.`,
        results: []
      };
    }

    const channelsToRun = [];
    if (config.webhookEnabled) {
      channelsToRun.push('webhook');
    }
    if (config.telegramEnabled) {
      channelsToRun.push('telegram');
    }
    if (config.whatsappApiEnabled) {
      channelsToRun.push('whatsapp');
    }

    if (channelsToRun.length === 0) {
      return {
        dispatched: false,
        reason: 'Aktif edilmiş hiçbir bildirim kanalı bulunmuyor (Tüm kanallar kapalı).',
        results: []
      };
    }

    const results = [];
    const baseIdempotencyKey = `${eventType}_${lead.id}_${versionKey}`;

    for (const channel of channelsToRun) {
      const logDocId = forceRetryLogId || (isTest
        ? `test_${channel}_${Date.now()}`
        : `${baseIdempotencyKey}_${channel}`.replace(/[^a-zA-Z0-9_-]/g, '_'));

      // Mükerrer (Idempotency) kontrolü (Test veya manuel retry değilse)
      let existingRetryCount = 0;
      if (!isTest) {
        try {
          const existingSnap = await getDoc(doc(db, 'notification_logs', logDocId));
          if (existingSnap.exists()) {
            const existingData = existingSnap.data();
            existingRetryCount = Number(existingData.retryCount) || 0;
            if (!forceRetryLogId && existingData.status === 'sent') {
              results.push({
                channel,
                status: 'skipped_duplicate',
                logId: logDocId,
                message: 'Aynı olay için daha önce başarılı bildirim gönderildiği için mükerrer gönderim engellendi.'
              });
              continue;
            }
          }
        } catch {
          // Okuma yetkisi yoksa devam et
        }
      }

      const nowIso = new Date().toISOString();
      let status = 'failed';
      let httpStatus = null;
      let errorMessage = null;
      let recipientMasked = '';

      try {
        if (channel === 'webhook') {
          const validation = notificationService.validateWebhookUrl(secrets.webhookUrl);
          if (!validation.valid) {
            throw new Error(validation.reason);
          }
          if (!config.webhookRecipientLabel) {
            throw new Error('Webhook alıcı/hedef tanımı doğrulanmamış.');
          }
          recipientMasked = `${config.webhookRecipientLabel} (${validation.host})`;

          const payload = {
            event: eventType,
            isTest,
            idempotencyKey: `${baseIdempotencyKey}_${channel}`,
            leadId: lead.id,
            company: lead.company,
            contactName: lead.contactName,
            organizationType: lead.organizationType,
            city: lead.city,
            attendees: lead.attendees,
            stage: lead.stage,
            versionKey,
            timestamp: nowIso
          };

          const response = await fetch(validation.normalizedUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          httpStatus = response.status;
          if (!response.ok) {
            throw new Error(`Webhook HTTP ${response.status} yanıtı döndürdü.`);
          }
          status = 'sent';
        } else if (channel === 'telegram') {
          const botToken = (secrets.telegramBotToken || '').trim();
          const chatId = (config.telegramChatId || '').trim();
          if (!botToken || !chatId) {
            throw new Error('Telegram Bot Token veya doğrulanmış Chat ID eksik.');
          }
          recipientMasked = `Chat: ${chatId}`;
          const tgUrl = `https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`;
          const textMsg =
            `[Toplantı Merkezi CRM - ${isTest ? 'TEST' : eventType.toUpperCase()}]\n` +
            `Kod: ${lead.id}\n` +
            `Firma: ${lead.company}\n` +
            `Yetkili: ${lead.contactName}\n` +
            `Organizasyon: ${lead.organizationType} (${lead.city})\n` +
            `Durum: ${lead.stage} (${versionKey})`;

          const response = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: textMsg })
          });
          httpStatus = response.status;
          if (!response.ok) {
            throw new Error(`Telegram API HTTP ${response.status} hatası.`);
          }
          status = 'sent';
        } else if (channel === 'whatsapp') {
          const waToken = (secrets.whatsappAccessToken || '').trim();
          const phoneNumberId = (config.whatsappPhoneNumberId || '').trim();
          const recipientPhone = (config.whatsappRecipientPhone || '').replace(/[^0-9]/g, '');
          if (!waToken || !phoneNumberId || !recipientPhone) {
            throw new Error('WhatsApp Cloud API Token, Phone Number ID veya doğrulanmış alıcı numarası eksik.');
          }
          recipientMasked = `+${recipientPhone.slice(0, 4)}••••${recipientPhone.slice(-2)}`;
          const waUrl = `https://graph.facebook.com/v20.0/${encodeURIComponent(phoneNumberId)}/messages`;
          const response = await fetch(waUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${waToken}`
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: recipientPhone,
              type: 'text',
              text: {
                body: `Toplantı Merkezi CRM [${eventType}]: ${lead.id} - ${lead.company} (${lead.organizationType}, ${lead.city}) - Durum: ${lead.stage}`
              }
            })
          });
          httpStatus = response.status;
          if (!response.ok) {
            throw new Error(`WhatsApp Cloud API HTTP ${response.status} hatası.`);
          }
          status = 'sent';
        }
      } catch (err) {
        status = 'failed';
        errorMessage = err?.message || 'Gönderim hatası';
      }

      const logRecord = {
        id: logDocId,
        idempotencyKey: `${baseIdempotencyKey}_${channel}`,
        eventType,
        leadId: lead.id,
        company: lead.company || '-',
        versionKey,
        channel,
        recipientMasked: recipientMasked || 'Yapılandırılmamış',
        status,
        httpStatus,
        errorMessage,
        retryCount: forceRetryLogId ? existingRetryCount + 1 : existingRetryCount,
        isTest: Boolean(isTest),
        dispatchedBy: actorEmail,
        dispatchedAt: nowIso,
        lastRetryAt: forceRetryLogId ? nowIso : null,
        serverTimestamp: serverTimestamp()
      };

      try {
        await setDoc(doc(db, 'notification_logs', logDocId), logRecord);
      } catch {
        // Günlük yazma uyarısı
      }

      results.push(logRecord);
    }

    return {
      dispatched: results.some(r => r.status === 'sent'),
      results
    };
  },

  /**
   * Başarısız bir bildirimi tekrar dener
   */
  retryNotificationLog: async (logRecord, actorEmail = 'admin') => {
    if (!logRecord || !logRecord.id) {
      throw new Error('Geçersiz bildirim kaydı.');
    }
    const syntheticLead = {
      id: logRecord.leadId || 'TLP-RETRY',
      company: logRecord.company || 'Firma',
      contactName: 'Yetkili',
      organizationType: 'Kurumsal Organizasyon',
      city: 'İstanbul',
      attendees: 0,
      stage: 'Tekrar Gönderim'
    };
    return await notificationService.dispatchEventNotification({
      eventType: logRecord.eventType || 'new_lead',
      lead: syntheticLead,
      versionKey: logRecord.versionKey || 'v0',
      actorEmail,
      isTest: Boolean(logRecord.isTest),
      forceRetryLogId: logRecord.id
    });
  },

  /**
   * Yönetici tarafından açıkça tetiklenen Test Bildirimi
   */
  sendExplicitAdminTest: async (actorEmail = 'admin') => {
    const testLead = {
      id: 'TLP-TEST-KONTROL',
      company: 'Sistem Entegrasyon Doğrulama Testi',
      contactName: 'CRM Yönetici Masası',
      organizationType: 'Sistem Testi',
      city: 'İstanbul',
      attendees: 100,
      stage: 'Test Gönderimi'
    };

    return await notificationService.dispatchEventNotification({
      eventType: 'new_lead',
      lead: testLead,
      versionKey: `test_${Date.now()}`,
      actorEmail,
      isTest: true
    });
  },

  /**
   * WhatsApp Doğrudan Görüşme Mesaj Metni Üretici (Manuel paylaşım linki)
   */
  generateWhatsAppQuoteLink: (lead, targetPhone = '+905320550945') => {
    const cleanPhone = (targetPhone || '').replace(/[^0-9]/g, '');
    const trackingUrl = lead.accessToken
      ? `https://www.toplantimerkezi.com.tr/teklif-takip?kod=${encodeURIComponent(lead.id)}&token=${encodeURIComponent(lead.accessToken)}`
      : `https://www.toplantimerkezi.com.tr/teklif-takip?kod=${encodeURIComponent(lead.id)}`;

    const message =
      `*TOPLANTI MERKEZİ | KURUMSAL TEKLİF BİLGİLENDİRMESİ*\n\n` +
      `Başvuru Kodu: ${lead.id}\n` +
      `Firma: ${lead.company}\n` +
      `Yetkili: ${lead.contactName} (${lead.title || 'Yetkili'})\n` +
      `Lokasyon: ${lead.city} ${lead.district ? `(${lead.district})` : ''}\n` +
      `Organizasyon: ${lead.organizationType}\n` +
      `Katılımcı Sayısı: ${lead.attendees} Kişi\n` +
      `Tarih: ${lead.targetDate || 'Belirtilmedi'}\n\n` +
      `Güvenli Teklif Takip Bağlantısı:\n${trackingUrl}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
};
