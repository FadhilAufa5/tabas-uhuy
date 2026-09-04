import type { BeritaAcara } from './types';

export function formatFileSize(bytes?: number | null): string {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
}

export function openPrintWindow(item: BeritaAcara): void {
    const now = new Date();
    const tanggalCetak = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Berita Acara – NOTAS ${item.nomor_berita_acara}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      color: #000;
      background: #fff;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 25mm 25mm 20mm 30mm;
      position: relative;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 12px;
      border-bottom: 3px double #000;
      margin-bottom: 18px;
    }
    .header-logo {
      width: 70px;
      height: 70px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-text { flex: 1; text-align: center; }
    .header-text .kementerian { font-size: 11pt; letter-spacing: 0.5px; }
    .header-text .instansi { font-size: 14pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
    .header-text .unit { font-size: 10.5pt; }
    .header-text .alamat { font-size: 9pt; color: #333; margin-top: 2px; }
    .doc-title { text-align: center; margin: 18px 0 8px; }
    .doc-title h1 { font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; }
    .doc-title .notas-num { font-size: 11pt; margin-top: 4px; }
    .divider { border: none; border-top: 1px solid #000; margin: 10px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 11pt; }
    .info-table td { padding: 5px 8px; vertical-align: top; }
    .info-table td.label { width: 38%; }
    .info-table td.colon { width: 3%; text-align: center; }
    .info-table td.value { width: 59%; }
    .section { margin: 16px 0; }
    .section-title { font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; }
    .section-content {
      border: 1px solid #000;
      padding: 10px 12px;
      min-height: 70px;
      font-size: 11pt;
      line-height: 1.6;
      white-space: pre-line;
    }
    .signature-area { display: flex; justify-content: space-between; margin-top: 40px; }
    .signature-box { width: 42%; text-align: center; font-size: 11pt; }
    .signature-box .sig-label { margin-bottom: 4px; }
    .signature-box .sig-place-date { margin-bottom: 60px; }
    .signature-box .sig-name {
      font-weight: bold;
      border-top: 1px solid #000;
      padding-top: 4px;
      display: inline-block;
      min-width: 150px;
    }
    .footer-note {
      position: absolute;
      bottom: 15mm;
      left: 30mm;
      right: 25mm;
      font-size: 8pt;
      color: #555;
      border-top: 1px solid #ccc;
      padding-top: 6px;
      text-align: center;
    }
    @media print {
      body { margin: 0; }
      .page { padding: 20mm 20mm 20mm 25mm; }
      .footer-note { position: fixed; bottom: 10mm; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-logo">
      <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="70" height="70" rx="8" fill="#1e3a8a"/>
        <text x="50%" y="38" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="13" font-weight="bold">TABAS</text>
        <text x="50%" y="53" dominant-baseline="middle" text-anchor="middle" fill="#93c5fd" font-family="Arial" font-size="7">PT TASPEN</text>
      </svg>
    </div>
    <div class="header-text">
      <div class="kementerian">PT TASPEN (PERSERO)</div>
      <div class="instansi">Kantor Cabang Bogor</div>
      <div class="unit">Divisi Layanan &amp; Administrasi Kepesertaan</div>
      <div class="alamat">Jl. Raya Pajajaran No. 1, Bogor 16143 | Telp. (0251) 8321234 | www.taspen.co.id</div>
    </div>
  </div>

  <div class="doc-title">
    <h1>Berita Acara Penanganan Layanan</h1>
    <div class="notas-num">Nomor NOTAS: <strong>${item.nomor_berita_acara}</strong></div>
  </div>
  <hr class="divider" />

  <table class="info-table">
    <tr>
      <td class="label">NOTAS (No. Taspen)</td>
      <td class="colon">:</td>
      <td class="value"><strong>${item.nomor_berita_acara}</strong></td>
    </tr>
    <tr>
      <td class="label">Nama Peserta / Pihak</td>
      <td class="colon">:</td>
      <td class="value">${item.nama}</td>
    </tr>
    <tr>
      <td class="label">Tanggal Kejadian</td>
      <td class="colon">:</td>
      <td class="value">${item.tanggal_kejadian || '-'}</td>
    </tr>
    <tr>
      <td class="label">Status Penanganan</td>
      <td class="colon">:</td>
      <td class="value">${item.status}</td>
    </tr>
    <tr>
      <td class="label">Petugas Pencatat</td>
      <td class="colon">:</td>
      <td class="value">${item.user?.name || '-'}</td>
    </tr>
  </table>

  <hr class="divider" />

  <div class="section">
    <div class="section-title">I. Uraian Permasalahan</div>
    <div class="section-content">${item.permasalahan}</div>
  </div>

  <div class="section">
    <div class="section-title">II. Solusi &amp; Tindak Lanjut</div>
    <div class="section-content">${item.solusi}</div>
  </div>

  <div class="signature-area">
    <div class="signature-box">
      <div class="sig-label">Peserta / Pihak Terkait,</div>
      <div class="sig-place-date">&nbsp;</div>
      <div class="sig-name">${item.nama}</div>
    </div>
    <div class="signature-box">
      <div class="sig-label">Bogor, ${tanggalCetak}</div>
      <div class="sig-place-date">Petugas Layanan PT TASPEN,</div>
      <div class="sig-name">${item.user?.name || 'Petugas'}</div>
    </div>
  </div>

  <div class="footer-note">
    Dokumen ini dicetak secara digital melalui Sistem TABAS – PT TASPEN (Persero).
    Dicetak pada: ${new Date().toLocaleString('id-ID')}
  </div>
</div>
<script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
}
