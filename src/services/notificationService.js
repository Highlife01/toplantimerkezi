/**
 * Toplantı Merkezi Çok Kanallı Bildirim Servisi (Notification Service)
 * Teklif taleplerinde e-posta, SMS ve WhatsApp bildirimlerini yönetir.
 * Webhook entegrasyonları, REST API ve direkt mesaj formatlamasını destekler.
 */

import { db, collection, addDoc, serverTimestamp } from './firebase';

export const notificationService = {
  /**
   * Yeni teklif talebi geldiğinde tüm aktif kanallara bildirim dağıtır
   * @param {Object} lead Teklif detayları
   * @param {Object} settings Sistem ve entegrasyon ayarları
   */
  dispatchNewQuoteNotifications: async (lead, settings = {}) => {
    const results = {
      emailSent: false,
      smsSent: false,
      whatsappReady: true,
      logs: []
    };

    console.log(`[Notification Engine] "${lead.id}" için bildirimler hazırlanıyor...`);

    // 1. Operasyon Masası ve Müşteri E-Posta Bildirimi
    try {
      if (settings.emailNotificationsEnabled && (settings.webhookUrl || settings.emailApiKey)) {
        const emailPayload = {
          type: 'new_quote_submitted',
          leadId: lead.id,
          company: lead.company,
          contactName: lead.contactName,
          phone: lead.phone,
          email: lead.email,
          city: lead.city,
          district: lead.district || '',
          organizationType: lead.organizationType,
          attendees: lead.attendees,
          budgetRange: lead.budgetRange,
          requirements: lead.requirements || [],
          targetDate: lead.targetDate,
          trackingUrl: `https://www.toplantimerkezi.com.tr/teklif-takip?kod=${lead.id}`,
          timestamp: new Date().toISOString()
        };

        if (settings.webhookUrl) {
          await fetch(settings.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload)
          });
          results.emailSent = true;
          results.logs.push('E-Posta Webhook başarıyla tetiklendi.');
        }
      }
    } catch (err) {
      console.warn('[Notification] E-Posta gönderim uyarısı:', err);
      results.logs.push(`E-Posta hatası: ${err.message}`);
    }

    // 2. SMS Bildirimi (Netgsm / Twilio / SMS Gateway)
    try {
      if (settings.smsNotificationsEnabled && settings.smsWebhookUrl) {
        const smsMessage = `Sayin ${lead.contactName}, ${lead.company} adina ${lead.organizationType} teklif talebiniz alinmistir. Takip Kodu: ${lead.id} Detaylar: https://www.toplantimerkezi.com.tr/teklif-takip?kod=${lead.id} Bizi tercih ettiginiz icin tesekkur ederiz. Toplanti Merkezi`;

        await fetch(settings.smsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: lead.phone,
            message: smsMessage,
            leadId: lead.id
          })
        });
        results.smsSent = true;
        results.logs.push('SMS Webhook başarıyla tetiklendi.');
      }
    } catch (err) {
      console.warn('[Notification] SMS gönderim uyarısı:', err);
      results.logs.push(`SMS hatası: ${err.message}`);
    }

    // 3. Bildirim Kaydını Firestore'a Günlükle (Audit Trail)
    try {
      if (db) {
        await addDoc(collection(db, 'notification_logs'), {
          leadId: lead.id,
          company: lead.company,
          recipientPhone: lead.phone,
          recipientEmail: lead.email,
          status: 'dispatched',
          channels: {
            email: results.emailSent,
            sms: results.smsSent,
            whatsapp: results.whatsappReady
          },
          createdAt: serverTimestamp()
        });
      }
    } catch (logErr) {
      console.warn('[Notification Log] Firestore günlükleme uyarısı:', logErr);
    }

    return results;
  },

  /**
   * WhatsApp Doğrudan Görüşme Mesaj Metni Üretici
   * @param {Object} lead Teklif detayları
   * @returns {string} Formatlanmış WhatsApp URL
   */
  generateWhatsAppQuoteLink: (lead, targetPhone = '+905320550945') => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const message = 
      `*🏛️ TOPLANTI MERKEZİ | KURUMSAL TEKLİF BAŞVURUSU*\n\n` +
      `📌 *Başvuru Kodu:* ${lead.id}\n` +
      `🏢 *Firma:* ${lead.company}\n` +
      `👤 *Yetkili:* ${lead.contactName} (${lead.title || 'Yetkili'})\n` +
      `📍 *Lokasyon:* ${lead.city} ${lead.district ? `(${lead.district})` : ''}\n` +
      `🎯 *Organizasyon:* ${lead.organizationType}\n` +
      `👥 *Katılımcı Sayısı:* ${lead.attendees} Kişi\n` +
      `📅 *Tarih:* ${lead.targetDate || 'Belirtilmedi'}\n` +
      `💰 *Bütçe Aralığı:* ${lead.budgetRange || 'Belirtilmedi'}\n\n` +
      `🔗 *Canlı Takip:* https://www.toplantimerkezi.com.tr/teklif-takip?kod=${lead.id}\n\n` +
      `Sayın Yetkili, teklif talebimiz hakkında ön bilgilendirme ve detayları görüşmek istiyoruz.`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  },

  /**
   * Admin Masasından Test Bildirimi Gönderme
   */
  sendTestNotification: async (settings) => {
    const dummyLead = {
      id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      company: 'Test Holding A.Ş.',
      contactName: 'Test Koordinatörü',
      phone: '+90 532 000 00 00',
      email: 'test@toplantimerkezi.com.tr',
      city: 'İstanbul',
      district: 'Levent',
      organizationType: 'Bayi Toplantısı',
      attendees: 250,
      budgetRange: '500.000 – 1.000.000 TL',
      targetDate: new Date().toISOString().split('T')[0],
      requirements: ['Mekân', 'Sahne', 'LED ekran', 'Catering']
    };

    return await notificationService.dispatchNewQuoteNotifications(dummyLead, settings);
  }
};
