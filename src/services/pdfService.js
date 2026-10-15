import { jsPDF } from 'jspdf';
import { storageService, COST_ITEM_CATEGORIES } from './storageService';

let cachedFontBase64 = {
  regular: null,
  bold: null
};

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return typeof btoa === 'function' ? btoa(binary) : Buffer.from(buffer).toString('base64');
}

/**
 * Türkçe karakterlerin (ğ, Ğ, ü, Ü, ş, Ş, ı, İ, ö, Ö, ç, Ç, ₺) kusursuz görünmesi için
 * Unicode Roboto TTF fontlarını jsPDF VFS sistemine yükler.
 */
async function ensureTurkishFontsLoaded(doc) {
  try {
    if (!cachedFontBase64.regular || !cachedFontBase64.bold) {
      if (typeof window !== 'undefined' && typeof fetch === 'function') {
        const [regRes, boldRes] = await Promise.all([
          fetch('/fonts/Roboto-Regular.ttf'),
          fetch('/fonts/Roboto-Bold.ttf')
        ]);
        if (regRes.ok && boldRes.ok) {
          const [regBuf, boldBuf] = await Promise.all([
            regRes.arrayBuffer(),
            boldRes.arrayBuffer()
          ]);
          cachedFontBase64.regular = arrayBufferToBase64(regBuf);
          cachedFontBase64.bold = arrayBufferToBase64(boldBuf);
        }
      } else {
        // Node.js ortamı (Test & Doğrulama için)
        const fsMod = 'node:' + 'fs';
        const pathMod = 'node:' + 'path';
        const fs = await import(/* @vite-ignore */ fsMod);
        const path = await import(/* @vite-ignore */ pathMod);
        const regPath = path.resolve(process.cwd(), 'public/fonts/Roboto-Regular.ttf');
        const boldPath = path.resolve(process.cwd(), 'public/fonts/Roboto-Bold.ttf');
        if (fs.existsSync(regPath) && fs.existsSync(boldPath)) {
          cachedFontBase64.regular = fs.readFileSync(regPath).toString('base64');
          cachedFontBase64.bold = fs.readFileSync(boldPath).toString('base64');
        }
      }
    }

    if (cachedFontBase64.regular && cachedFontBase64.bold) {
      doc.addFileToVFS('Roboto-Regular.ttf', cachedFontBase64.regular);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      doc.addFileToVFS('Roboto-Bold.ttf', cachedFontBase64.bold);
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
      doc.setFont('Roboto', 'normal');
      return 'Roboto';
    }
  } catch {
    // Yedek fonta düş
  }
  return 'helvetica';
}

export const formatCurrencyTR = (val) => {
  const num = Number(val) || 0;
  return `${num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
};

function resolveCategoryLabel(catIdOrLabel) {
  const found = (COST_ITEM_CATEGORIES || []).find(
    (c) => c.key === catIdOrLabel || c.category === catIdOrLabel
  );
  return found ? found.category : (catIdOrLabel || 'Kurumsal Hizmet');
}

/**
 * Kurumsal A4 Resmi Teklif PDF Üretici
 * KURAL: İç maliyetler (unitCost, totalCost), tedarikçi bilgileri (supplierName),
 * yönetici iç notları (notes) ve kâr marjı (grossProfit, marginPercent) KESİNLİKLE yer almaz.
 */
export const generateProposalPdf = async (leadOrPublicData, options = { saveFile: true, versionSnapshot: null }) => {
  if (!leadOrPublicData) {
    throw new Error('Teklif verisi bulunamadı.');
  }

  const settings = storageService.getSettings();
  const snapshot = options?.versionSnapshot || null;
  const costingBlock = leadOrPublicData.costing || {};

  const proposalId = leadOrPublicData.quoteCode || leadOrPublicData.leadId || leadOrPublicData.id || 'TLP-TEKLIF';
  const revisionLabel = snapshot?.revisionLabel
    || leadOrPublicData.currentRevisionLabel
    || (options?.revisionNumber !== undefined ? `Rev.${options.revisionNumber}` : (leadOrPublicData.currentVersion > 0 ? `Rev.${leadOrPublicData.currentVersion - 1}` : 'Rev.0'));
  const versionNumber = snapshot?.versionNumber || leadOrPublicData.currentVersion || 1;
  const validityDays = Number(snapshot?.validityDays ?? costingBlock.validityDays ?? leadOrPublicData.validityDays) || 15;
  const issueDateStr = snapshot?.publishedAt
    ? new Date(snapshot.publishedAt).toLocaleDateString('tr-TR')
    : new Date().toLocaleDateString('tr-TR');
  const validUntilStr = snapshot?.validUntil
    || leadOrPublicData.validUntil
    || new Date(Date.now() + validityDays * 86400000).toLocaleDateString('tr-TR');

  // Müşteriye gösterilecek kalemleri çıkar (Yalnızca satış fiyatı > 0 olan kalemler, iç maliyet olmadan!)
  let customerItems = [];
  let grossSaleExclVat = 0;
  let discountExclVat = 0;
  let netSaleExclVat = 0;
  let vatAmount = 0;
  let grandTotalInclVat = 0;

  if (Array.isArray(leadOrPublicData.customerLineItems)) {
    customerItems = leadOrPublicData.customerLineItems.map((it, idx) => ({
      no: it.no || String(idx + 1).padStart(2, '0'),
      category: resolveCategoryLabel(it.category),
      description: it.title || it.description || it.category || 'Kurumsal Hizmet',
      quantity: Number(it.quantity) || 1,
      unit: it.unit || 'Paket',
      unitSalePrice: Number(it.unitSalePriceExclVat) || Number(it.salePriceExclVat) || Number(it.salePrice) || 0,
      vatRate: it.vatRate !== undefined ? Number(it.vatRate) : 20,
      totalSalePrice: Number(it.salePriceExclVat) || Number(it.salePrice) || 0
    }));
    grossSaleExclVat = Number(leadOrPublicData.grossSaleExclVat ?? leadOrPublicData.saleSubtotalExclVat) || 0;
    discountExclVat = Number(leadOrPublicData.discountExclVat ?? leadOrPublicData.discountAmount) || 0;
    netSaleExclVat = Number(leadOrPublicData.netSaleExclVat ?? leadOrPublicData.netSaleAfterDiscount) || 0;
    vatAmount = Number(leadOrPublicData.vatAmount ?? leadOrPublicData.vatTotal) || 0;
    grandTotalInclVat = Number(leadOrPublicData.grandTotalInclVat) || 0;
  } else {
    const rawItems = Array.isArray(snapshot?.costItems)
      ? snapshot.costItems
      : Array.isArray(snapshot?.items)
        ? snapshot.items
        : Array.isArray(leadOrPublicData.costItems)
          ? leadOrPublicData.costItems
          : Array.isArray(costingBlock.items)
            ? costingBlock.items
            : [];
    const discountInput = Number(snapshot?.discountAmount ?? costingBlock.discountAmount ?? leadOrPublicData.discountAmount) || 0;
    const sourceObj = {
      ...leadOrPublicData,
      costItems: rawItems,
      discountAmount: discountInput
    };
    const fin = storageService.calculateLeadFinancials(sourceObj, { useEditorItems: true });

    customerItems = rawItems
      .filter((it) => Number(it.salePrice) > 0)
      .map((it, idx) => {
        const qty = Math.max(1, Number(it.quantity) || 1);
        const totalSale = Math.max(0, Number(it.salePrice) || 0);
        const detailText = [it.title, it.description].filter(Boolean).join(' — ');
        return {
          no: String(idx + 1).padStart(2, '0'),
          category: resolveCategoryLabel(it.category),
          description: detailText || resolveCategoryLabel(it.category),
          quantity: qty,
          unit: it.unit || 'Paket',
          unitSalePrice: Math.round((totalSale / qty) * 100) / 100,
          vatRate: it.vatRate !== undefined ? Number(it.vatRate) : 20,
          totalSalePrice: totalSale
        };
      });

    grossSaleExclVat = fin.grossSaleExclVat;
    discountExclVat = fin.discountExclVat;
    netSaleExclVat = fin.netSaleExclVat;
    vatAmount = fin.vatAmount;
    grandTotalInclVat = fin.grandTotalInclVat;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const fontName = await ensureTurkishFontsLoaded(doc);
  const pageWidth = doc.internal.pageSize.getWidth();   // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;          // 182mm
  const bottomLimit = pageHeight - 22;                  // 275mm (Alt bilgi için güvenli sınır)

  const drawMainHeader = () => {
    // Lacivert Kurumsal Antet Arka Planı
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 40, 'F');
    // Altın Vurgu Çizgisi
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 39, pageWidth, 1.8, 'F');

    // Kurumsal Logo Rozeti (TM)
    doc.setFillColor(212, 175, 55);
    doc.roundedRect(margin, 9, 13, 13, 2.5, 2.5, 'F');
    doc.setFont(fontName, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('TM', margin + 6.5, 17.2, { align: 'center' });

    // Şirket Unvanı & İletişim
    doc.setTextColor(255, 255, 255);
    doc.setFont(fontName, 'bold');
    doc.setFontSize(15);
    doc.text('TOPLANTI MERKEZİ', margin + 16, 14.5);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(212, 175, 55);
    doc.text(settings.companyName || 'Toplantı Merkezi Kurumsal Organizasyon A.Ş.', margin + 16, 19.5);

    doc.setTextColor(203, 213, 225);
    doc.setFontSize(7.5);
    doc.text(`Web: https://${settings.domain || 'www.toplantimerkezi.com.tr'}  |  Tel: ${settings.phone || '+90 532 055 09 45'}  |  E-posta: ${settings.email || 'info@toplantimerkezi.com.tr'}`, margin, 28);
    doc.text(`Merkez: ${settings.address || 'Büyükdere Cad. No:199 Levent / Maslak Plaza, Beşiktaş, İstanbul'}`, margin, 33.5);

    // Sağ Üst Teklif Kimlik Kutusu
    doc.setTextColor(255, 255, 255);
    doc.setFont(fontName, 'bold');
    doc.setFontSize(10.5);
    doc.text('RESMİ KURUMSAL FİYAT TEKLİFİ', pageWidth - margin, 12, { align: 'right' });

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    doc.text(`Teklif No: ${proposalId}`, pageWidth - margin, 18, { align: 'right' });
    doc.text(`Versiyon / Revizyon: v${versionNumber} (${revisionLabel})`, pageWidth - margin, 23, { align: 'right' });
    doc.text(`Düzenlenme Tarihi: ${issueDateStr}`, pageWidth - margin, 28, { align: 'right' });
    doc.text(`Geçerlilik: ${validityDays} Gün (Son: ${validUntilStr})`, pageWidth - margin, 33, { align: 'right' });
  };

  const drawContinuationHeader = () => {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 18, 'F');
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 17.5, pageWidth, 1, 'F');

    doc.setFont(fontName, 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text('TOPLANTI MERKEZİ KURUMSAL ORGANİZASYON A.Ş.', margin, 11);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(212, 175, 55);
    doc.text(`Teklif No: ${proposalId} (${revisionLabel}) — ${leadOrPublicData.company || ''}`, pageWidth - margin, 11, { align: 'right' });
  };

  const drawTableHeader = (startY) => {
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, startY, contentWidth, 8.5, 'F');
    doc.setFont(fontName, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('No', margin + 2.5, startY + 5.6);
    doc.text('Hizmet Kalemi & Açıklama', margin + 12, startY + 5.6);
    doc.text('Miktar / Birim', margin + 106, startY + 5.6);
    doc.text('Birim Fiyat (KDV H.)', margin + 148, startY + 5.6, { align: 'right' });
    doc.text('KDV', margin + 159, startY + 5.6, { align: 'right' });
    doc.text('Toplam (KDV H.)', margin + contentWidth - 2.5, startY + 5.6, { align: 'right' });
    return startY + 8.5;
  };

  // 1. Sayfa Başlığı
  drawMainHeader();
  let y = 47;

  // Müşteri ve Organizasyon Bilgileri Kutusu
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 36, 2.5, 2.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 36, 2.5, 2.5, 'S');

  doc.setFont(fontName, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('MÜŞTERİ / KURUM BİLGİLERİ', margin + 4, y + 7);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const compLine = doc.splitTextToSize(`Firma / Kurum: ${leadOrPublicData.company || '-'}`, 84)[0];
  doc.text(compLine, margin + 4, y + 13.5);
  doc.text(`Yetkili Kişi: ${leadOrPublicData.contactName || '-'} (${leadOrPublicData.title || 'Yetkili'})`, margin + 4, y + 19.5);
  doc.text(`Telefon: ${leadOrPublicData.phone || '-'}`, margin + 4, y + 25.5);
  doc.text(`E-posta: ${leadOrPublicData.email || '-'}`, margin + 4, y + 31.5);

  const rightX = margin + (contentWidth / 2) + 4;
  doc.setFont(fontName, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ORGANİZASYON DETAYLARI', rightX, y + 7);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Organizasyon Türü: ${leadOrPublicData.organizationType || '-'}`, rightX, y + 13.5);
  const locText = `${leadOrPublicData.city || '-'}${leadOrPublicData.district ? ' / ' + leadOrPublicData.district : ''}${leadOrPublicData.linkedVenueName ? ' (' + leadOrPublicData.linkedVenueName + ')' : ''}`;
  doc.text(doc.splitTextToSize(`Lokasyon / Mekân: ${locText}`, 84)[0], rightX, y + 19.5);
  const dateText = `${leadOrPublicData.targetDate || 'Planlanıyor'}${leadOrPublicData.isMultiDay && leadOrPublicData.endDate ? ' – ' + leadOrPublicData.endDate : ''}`;
  doc.text(`Etkinlik Tarihi: ${dateText}`, rightX, y + 25.5);
  doc.text(`Katılımcı Sayısı: ${leadOrPublicData.attendees || 0} Kişi`, rightX, y + 31.5);

  y += 43;

  // Hizmet Kalemleri Tablosu Başlığı
  doc.setFont(fontName, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('HİZMET KALEMLERİ VE SATIŞ FİYATLARI TABLOSU (KDV HARİÇ)', margin, y);
  y += 4;

  y = drawTableHeader(y);

  if (customerItems.length === 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, contentWidth, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 12, 'S');
    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Kalem bazlı satış fiyatlandırması hazırlanmaktadır.', margin + 6, y + 7.5);
    y += 12;
  } else {
    customerItems.forEach((item, idx) => {
      doc.setFont(fontName, 'normal');
      doc.setFontSize(7.8);
      const descLines = doc.splitTextToSize(`${item.category}: ${item.description}`, 90);
      const rowHeight = Math.max(9.5, descLines.length * 4.2 + 3.5);

      // Sayfa taşma kontrolü (Çok sayfalı tabloda başlığı tekrarlar!)
      if (y + rowHeight > bottomLimit) {
        doc.addPage();
        drawContinuationHeader();
        y = 24;
        y = drawTableHeader(y);
      }

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

      doc.setFont(fontName, 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(item.no, margin + 2.5, y + 5.5);

      doc.setFont(fontName, 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(15, 23, 42);
      doc.text(descLines, margin + 12, y + 5.2);

      doc.text(`${item.quantity} ${item.unit}`, margin + 106, y + 5.5);
      doc.text(formatCurrencyTR(item.unitSalePrice), margin + 148, y + 5.5, { align: 'right' });
      doc.text(`%${item.vatRate}`, margin + 159, y + 5.5, { align: 'right' });

      doc.setFont(fontName, 'bold');
      doc.text(formatCurrencyTR(item.totalSalePrice), margin + contentWidth - 2.5, y + 5.5, { align: 'right' });

      y += rowHeight;
    });
  }

  // Finansal Özet Kutusu İçin Sayfa Taşma Kontrolü
  const summaryBoxHeight = discountExclVat > 0 ? 38 : 32;
  if (y + summaryBoxHeight + 10 > bottomLimit) {
    doc.addPage();
    drawContinuationHeader();
    y = 25;
  } else {
    y += 6;
  }

  const summaryX = margin + 96;
  const summaryW = contentWidth - 96;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, y, summaryW, summaryBoxHeight, 2, 2, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(summaryX, y, summaryW, summaryBoxHeight, 2, 2, 'S');

  let sumY = y + 7;
  doc.setFont(fontName, 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(51, 65, 85);

  if (discountExclVat > 0) {
    doc.text('Ara Toplam (KDV Hariç):', summaryX + 4, sumY);
    doc.text(formatCurrencyTR(grossSaleExclVat), summaryX + summaryW - 4, sumY, { align: 'right' });
    sumY += 5.5;

    doc.setTextColor(180, 83, 9);
    doc.text('Kurumsal İndirim (KDV Hariç):', summaryX + 4, sumY);
    doc.text(`-${formatCurrencyTR(discountExclVat)}`, summaryX + summaryW - 4, sumY, { align: 'right' });
    sumY += 5.5;
    doc.setTextColor(51, 65, 85);
  }

  doc.setFont(fontName, 'bold');
  doc.text('Net Toplam (KDV Hariç):', summaryX + 4, sumY);
  doc.text(formatCurrencyTR(netSaleExclVat), summaryX + summaryW - 4, sumY, { align: 'right' });
  sumY += 6;

  doc.setFont(fontName, 'normal');
  doc.text('Hesaplanan KDV Tutarı:', summaryX + 4, sumY);
  doc.text(formatCurrencyTR(vatAmount), summaryX + summaryW - 4, sumY, { align: 'right' });
  sumY += 4;

  doc.setFillColor(212, 175, 55);
  doc.rect(summaryX + 3, sumY, summaryW - 6, 0.5, 'F');
  sumY += 6;

  doc.setFont(fontName, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('GENEL TOPLAM (KDV DAHİL):', summaryX + 4, sumY);
  doc.setTextColor(180, 130, 20);
  doc.text(formatCurrencyTR(grandTotalInclVat), summaryX + summaryW - 4, sumY, { align: 'right' });

  y += summaryBoxHeight + 8;

  // Kapsam, Kapsam Dışı Hizmetler, Ödeme Planı ve Şartlar Bölümü
  const sections = [
    {
      title: '1. HİZMET KAPSAMI (DAHİL OLAN HİZMETLER)',
      text: snapshot?.includedScope || leadOrPublicData.includedScope || 'Teklif tablosunda belirtilen tüm mekân, sahne, LED ekran, ses/ışık, catering ve teknik operasyon kalemleri dahildir.'
    },
    {
      title: '2. KAPSAM DIŞI HİZMETLER',
      text: snapshot?.excludedScope || leadOrPublicData.excludedScope || 'Tabloda açıkça belirtilmeyen ek talepler, kişisel harcamalar ve resmi harçlar kapsam dışıdır.'
    },
    {
      title: '3. ÖDEME PLANI',
      text: snapshot?.paymentPlan || leadOrPublicData.paymentPlan || '%50 sözleşme onayında avans, %50 organizasyon tamamlandığında fatura karşılığı kurumsal banka havalesi/EFT.'
    },
    {
      title: '4. GENEL ŞARTLAR VE GEÇERLİLİK KOŞULLARI',
      text: snapshot?.terms || leadOrPublicData.terms || `Bu teklif düzenlenme tarihinden itibaren ${validityDays} gün süreyle geçerlidir. Fiyatlarımız KDV hariç olarak hesaplanmış olup KDV ayrıca eklenmiştir.`
    }
  ];

  sections.forEach(sec => {
    doc.setFont(fontName, 'normal');
    doc.setFontSize(7.8);
    const wrapped = doc.splitTextToSize(sec.text, contentWidth - 8);
    const blockHeight = wrapped.length * 4 + 10;

    if (y + blockHeight > bottomLimit) {
      doc.addPage();
      drawContinuationHeader();
      y = 25;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, blockHeight, 2, 2, 'S');

    doc.setFont(fontName, 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    doc.text(sec.title, margin + 4, y + 5.5);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(51, 65, 85);
    doc.text(wrapped, margin + 4, y + 10);

    y += blockHeight + 3.5;
  });

  // İmza ve Mutabakat Kutusu
  const sigHeight = 26;
  if (y + sigHeight > bottomLimit) {
    doc.addPage();
    drawContinuationHeader();
    y = 25;
  } else {
    y += 2;
  }

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, sigHeight, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, sigHeight, 2, 2, 'S');

  doc.setFont(fontName, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('MÜŞTERİ ONAYI (KAŞE & İMZA)', margin + 8, y + 7);
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Firma: ${leadOrPublicData.company || '-'}`, margin + 8, y + 12.5);
  doc.text(`Yetkili: ${leadOrPublicData.contactName || '-'}`, margin + 8, y + 17.5);
  doc.text('Tarih ve İmza:', margin + 8, y + 22.5);

  doc.setFont(fontName, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('TOPLANTI MERKEZİ KURUMSAL ORGANİZASYON A.Ş.', rightX, y + 7);
  doc.setFont(fontName, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Kurumsal Operasyon ve Teklif Direktörlüğü', rightX, y + 12.5);
  doc.text(`Ref: ${proposalId} / ${revisionLabel}`, rightX, y + 17.5);
  doc.text('Kaşe ve İmza:', rightX, y + 22.5);

  // Tüm Sayfalara Alt Bilgi ve Sayfa Numaraları (Sayfa X / Y) Ekle
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${settings.companyName || 'Toplantı Merkezi Kurumsal Organizasyon A.Ş.'} — Resmi Kurumsal Teklif Belgesi (${proposalId} / ${revisionLabel})`,
      margin,
      pageHeight - 9.5
    );
    doc.setFont(fontName, 'bold');
    doc.text(
      `Sayfa ${p} / ${totalPages}`,
      pageWidth - margin,
      pageHeight - 9.5,
      { align: 'right' }
    );
  }

  const safeCompany = String(leadOrPublicData.company || proposalId)
    .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_-]/g, '_')
    .slice(0, 40);
  const fileName = `Toplanti_Merkezi_Teklif_${proposalId}_${revisionLabel.replace('.', '')}_${safeCompany}.pdf`;

  if (options?.saveFile !== false && !options?.returnDoc && typeof window !== 'undefined') {
    doc.save(fileName);
  }

  return {
    doc,
    fileName,
    totalPages,
    pageCount: totalPages,
    proposalId,
    revisionLabel,
    netSaleExclVat,
    vatAmount,
    grandTotalInclVat
  };
};

export const pdfService = {
  generateProposalPdf,
  formatCurrencyTR
};

export default pdfService;
