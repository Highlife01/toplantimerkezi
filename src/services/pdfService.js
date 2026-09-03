import jsPDF from 'jspdf';
import { storageService } from './storageService';

export const generateProposalPdf = (lead) => {
  const settings = storageService.getSettings();
  const financials = storageService.calculateLeadFinancials(lead);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Dark Luxury Header Background
  doc.setFillColor(15, 23, 42); // #0F172A (navy)
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent bar
  doc.setFillColor(212, 175, 55); // #D4AF37 (gold)
  doc.rect(0, 41, pageWidth, 2, 'F');

  // Brand Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('TOPLANTI MERKEZI', margin, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(212, 175, 55);
  doc.text('KURUMSAL ORGANIZASYON & ETKINLIK YONETIMI', margin, 24);

  doc.setTextColor(200, 210, 230);
  doc.setFontSize(8);
  doc.text('Turkiye Geneli Tek Merkezden Organizasyon Cozumleri', margin, 30);
  doc.text('Web: www.toplantimerkezi.com.tr  |  Tel: +90 850 308 00 00  |  E-posta: info@toplantimerkezi.com.tr', margin, 35);

  // Proposal Meta Box (Right aligned in header)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('KURUMSAL FIYAT TEKLIFI', pageWidth - margin - 60, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(220, 230, 245);
  doc.text(`Teklif No: ${lead.id}`, pageWidth - margin - 60, 25);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, pageWidth - margin - 60, 30);
  doc.text(`Gecerlilik: ${lead.validityDays || 15} Gun`, pageWidth - margin - 60, 35);

  // Customer & Event Details Box
  let y = 52;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F');
  doc.setDrawColor(220, 225, 235);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'S');

  // Customer Side
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('MUSTERI / FIRMA BILGILERI', margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Firma: ${lead.company || '-'}`, margin + 5, y + 15);
  doc.text(`Yetkili: ${lead.contactName || '-'} (${lead.title || 'Yetkili'})`, margin + 5, y + 21);
  doc.text(`Telefon: ${lead.phone || '-'}`, margin + 5, y + 27);
  doc.text(`E-posta: ${lead.email || '-'}`, margin + 5, y + 33);

  // Event Side
  const rightColX = margin + (contentWidth / 2) + 5;
  doc.setFont('helvetica', 'bold');
  doc.text('ORGANIZASYON DETAYLARI', rightColX, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.text(`Organizasyon Turu: ${lead.organizationType || '-'}`, rightColX, y + 15);
  doc.text(`Lokasyon: ${lead.city || '-'} ${lead.district ? '/ ' + lead.district : ''}`, rightColX, y + 21);
  doc.text(`Tarih: ${lead.targetDate || '-'} ${lead.isMultiDay ? ' - ' + (lead.endDate || '') : ''}`, rightColX, y + 27);
  doc.text(`Katilimci Sayisi: Yaklasik ${lead.attendees || 0} Kisi`, rightColX, y + 33);

  // Scope & Line Items Table
  y = 98;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('HIZMET KALEMLERI & TEKNIK OPERASYON KAPSAMI', margin, y);

  y += 5;
  // Table Header
  doc.setFillColor(30, 41, 59); // dark slate
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('No', margin + 4, y + 5.5);
  doc.text('Hizmet Kalemi / Aciklama', margin + 20, y + 5.5);
  doc.text('Kapsam', margin + 120, y + 5.5);
  doc.text('Durum', margin + 155, y + 5.5);

  y += 8;
  const items = [
    { no: '01', name: 'Mekan & Salon Tahsisi', desc: `${lead.city} bolgesinde etkinlik ihtiyacina uygun ana salon ve fuaye tahsisi.`, scope: `${lead.attendees || 0} Kisi` },
    { no: '02', name: 'Sahne & 3D Kurumsal Dekorasyon', desc: 'Etkinlik konseptine ozel ana sahne, moduler podyum, dijital kursu ve backdrop.', scope: 'Anahtar Teslim' },
    { no: '03', name: 'LED Ekran & Goruntu Rejisi', desc: 'P2 yuksek cozunurluklu dev LED ekran, 4K video switch masasi ve watchout sistemi.', scope: 'Profesyonel' },
    { no: '04', name: 'Profesyonel Ses & Isik Sistemleri', desc: 'Line Array ses sistemi, kablosuz mikrofonlar, robot moving head isiklar.', scope: 'Akustik Duzen' },
    { no: '05', name: 'Catering & Gurme Ikramlar', desc: 'Karsilama kokteyli, ozel coffee break istasyonlari ve kurumsal yemek menusu.', scope: 'Etkinlik Boyunca' },
    { no: '06', name: 'Kayit, Karsilama & Hostes Ekibi', desc: 'QR kodlu yaka karti basim istasyonu, karsilama personeli ve salon asistanlari.', scope: 'Kurumsal Ekip' },
    { no: '07', name: 'Foto & Video Produksiyon / Aftermovie', desc: '4K video cekimi, drone ile havadan goruntuleme ve same-day edit ozet kurgusu.', scope: 'Tam Kayit' }
  ];

  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 250 : 242, isEven ? 250 : 245, isEven ? 252 : 250);
    doc.rect(margin, y, contentWidth, 9, 'F');
    doc.setDrawColor(230, 235, 245);
    doc.line(margin, y + 9, margin + contentWidth, y + 9);

    doc.setTextColor(50, 60, 75);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(item.no, margin + 4, y + 6);
    doc.text(item.name, margin + 20, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 110, 125);
    doc.text(item.desc, margin + 20, y + 7.5);

    doc.setTextColor(50, 60, 75);
    doc.setFontSize(7.5);
    doc.text(item.scope, margin + 120, y + 6);
    doc.setTextColor(16, 185, 129); // green
    doc.text('Dahil', margin + 155, y + 6);

    y += 9;
  });

  // Financial Summary Box (Bottom Right)
  y += 6;
  const summaryX = margin + 100;
  const summaryWidth = contentWidth - 100;

  doc.setFillColor(245, 247, 250);
  doc.roundedRect(summaryX, y, summaryWidth, 32, 2, 2, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(summaryX, y, summaryWidth, 32, 2, 2, 'S');

  doc.setFontSize(8.5);
  doc.setTextColor(70, 80, 95);
  doc.setFont('helvetica', 'normal');
  doc.text('Ara Toplam (Hizmet Bedeli):', summaryX + 4, y + 8);
  doc.text(`${(financials.quotedPrice || 0).toLocaleString('tr-TR')} TL`, summaryX + summaryWidth - 4, y + 8, { align: 'right' });

  doc.text(`KDV (%${lead.vatRate || 20}):`, summaryX + 4, y + 15);
  doc.text(`${(financials.vatAmount || 0).toLocaleString('tr-TR')} TL`, summaryX + summaryWidth - 4, y + 15, { align: 'right' });

  doc.setFillColor(212, 175, 55);
  doc.rect(summaryX, y + 20, summaryWidth, 0.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GENEL TOPLAM:', summaryX + 4, y + 28);
  doc.setTextColor(180, 130, 20);
  doc.text(`${(financials.grandTotal || 0).toLocaleString('tr-TR')} TL`, summaryX + summaryWidth - 4, y + 28, { align: 'right' });

  // Payment Terms & Notes (Bottom Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ODEME & SARTNAME NOTLARI', margin, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 100, 115);
  const notesText = [
    '• Fiyatlarimiza sahne, LED, ses, isik, teknik ekip ve operasyon yonetimi dahildir.',
    '• Odeme %50 sozlesme imzasinda, %50 etkinlik bitiminde tahsil edilir.',
    '• Teklifimiz duzenlenme tarihinden itibaren ' + (lead.validityDays || 15) + ' gun gecerlidir.',
    '• Belirtilen tarihler haricindeki degisiklikler salon musaitligine baglidir.'
  ];
  notesText.forEach((nt, idx) => {
    doc.text(nt, margin, y + 12 + (idx * 5));
  });

  // Footer & Signatures
  y = 250;
  doc.setFillColor(240, 243, 248);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');

  // Client Approval
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MUSTERI ONAY / IMZA', margin + 15, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Firma Yetkili Kase & Imza:', margin + 15, y + 14);

  // Agency Approval
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TOPLANTI MERKEZI A.S.', margin + 110, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Operasyon Direktoru / Kase & Imza:', margin + 110, y + 14);

  // Bottom Notice
  doc.setFontSize(6.5);
  doc.setTextColor(140, 150, 165);
  doc.text('Bu belge Toplanti Merkezi CRM sistemi tarafindan resmi kurumsal teklif olarak uretilmistir. www.toplantimerkezi.com.tr', pageWidth / 2, 288, { align: 'center' });

  // Save / Download
  const fileName = `Toplanti_Merkezi_Teklif_${lead.company?.replace(/[^a-zA-Z0-9]/g, '_') || lead.id}.pdf`;
  doc.save(fileName);
};
