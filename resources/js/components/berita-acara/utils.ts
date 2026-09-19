import type { BeritaAcara } from './types';

export function formatFileSize(bytes?: number | null): string {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
}

/**
 * Format tanggal ke format Bahasa Indonesia yang rapi.
 * Contoh output: "10 September 2026" atau "10 Sep 2026"
 */
export function formatTanggalIndo(
    dateStr?: string | null,
    options: { monthFormat?: 'short' | 'long' } = { monthFormat: 'long' }
): string {
    if (!dateStr) return '-';

    try {
        const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.split(' ')[0];
        const parts = cleanDate.split('-');

        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const d = new Date(year, month, day);

            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: options.monthFormat ?? 'long',
                    year: 'numeric',
                });
            }
        }

        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;

        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: options.monthFormat ?? 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

/**
 * Normalisasi format tanggal untuk HTML input type="date" (YYYY-MM-DD)
 */
export function formatTanggalInput(dateStr?: string | null): string {
    if (!dateStr) return '';
    if (dateStr.includes('T')) {
        return dateStr.split('T')[0];
    }
    if (dateStr.includes(' ')) {
        return dateStr.split(' ')[0];
    }
    return dateStr;
}

function escapeHtml(text?: string | null): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function openPrintWindow(item: BeritaAcara): void {
    const now = new Date();
    const tanggalCetak = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const itemAny = item as Record<string, any>;
    const noHp = itemAny.no_hp || itemAny.telepon || itemAny.phone || itemAny.nomor_telepon || '';

    const dotsIdentitas = '.........................................................................................................';
    const dotsName = '.....................................';
    const dotsSig = '...................................................';

    const tanggalDisplay = item.tanggal_kejadian
        ? `Bogor, ${formatTanggalIndo(item.tanggal_kejadian, { monthFormat: 'long' })}`
        : item.nama
          ? `Bogor, ${tanggalCetak}`
          : 'Bogor,.........................................20';

    const logoUrl = `${window.location.origin}/logo-taspen%20no%20bg.png`;

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Berita Acara – ${escapeHtml(item.nomor_berita_acara) || 'Complaint Handling'}</title>
  <base href="${window.location.origin}/">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      color: #000;
      background: #fff;
      line-height: 1.35;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 16mm 22mm 16mm 22mm;
      position: relative;
      background: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header .logo {
      width: 140px;
      height: auto;
      display: block;
      margin: 0 auto 12px auto;
    }
    .header .doc-title {
      font-size: 13pt;
      font-weight: bold;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 1.3;
    }
    .header .doc-subtitle {
      font-size: 12pt;
      font-style: italic;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 2px;
      line-height: 1.3;
    }
    .section-title {
      font-size: 11pt;
      font-weight: normal;
      margin-bottom: 5px;
    }
    .identitas-table {
      width: calc(100% - 24px);
      margin-left: 24px;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .identitas-table td {
      padding: 2px 0;
      font-size: 11pt;
      vertical-align: top;
    }
    .identitas-table .col-label {
      width: 80px;
      white-space: nowrap;
    }
    .identitas-table .col-colon {
      width: 20px;
      text-align: center;
    }
    .identitas-table .col-value {
      word-break: break-word;
    }
    .section-block {
      margin-bottom: 14px;
    }
    .rounded-box {
      border: 2px solid #000;
      border-radius: 16px;
      width: 100%;
      box-sizing: border-box;
    }
    .box-large {
      min-height: 140px;
      padding: 10px 14px;
      font-size: 11pt;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .statement-section {
      text-align: center;
      margin-top: 14px;
      margin-bottom: 14px;
    }
    .statement-text {
      font-size: 11pt;
      margin-bottom: 6px;
    }
    .statement-box {
      border: 2px solid #000;
      border-radius: 8px;
      height: 34px;
      width: 100%;
      box-sizing: border-box;
    }
    .closing-paragraph {
      font-size: 11pt;
      line-height: 1.45;
      text-align: justify;
      margin-bottom: 24px;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 11pt;
    }
    .sig-col {
      width: 45%;
      text-align: center;
    }
    .sig-date-spacer {
      height: 18px;
    }
    .sig-date {
      height: 18px;
      line-height: 18px;
      margin-bottom: 2px;
      white-space: nowrap;
    }
    .sig-role {
      margin-bottom: 55px;
    }
    .sig-name {
      white-space: nowrap;
    }
    @media print {
      @page {
        size: A4 portrait;
        margin: 12mm 18mm 12mm 18mm;
      }
      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        width: 100%;
        min-height: auto;
        margin: 0;
        padding: 0;
        background: #fff;
        page-break-inside: avoid;
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <img src="${logoUrl}" alt="Taspen" class="logo" />
    <div class="doc-title">BERITA ACARA</div>
    <div class="doc-subtitle">COMPLAINT HANDLING</div>
  </div>

  <div class="section-block">
    <div class="section-title">A.&nbsp; Identitas Peserta</div>
    <table class="identitas-table">
      <tbody>
        <tr>
          <td class="col-label">Nama</td>
          <td class="col-colon">:</td>
          <td class="col-value">${escapeHtml(item.nama) || dotsIdentitas}</td>
        </tr>
        <tr>
          <td class="col-label">Notas</td>
          <td class="col-colon">:</td>
          <td class="col-value">${escapeHtml(item.nomor_berita_acara) || dotsIdentitas}</td>
        </tr>
        <tr>
          <td class="col-label">No. Hp</td>
          <td class="col-colon">:</td>
          <td class="col-value">${escapeHtml(noHp) || dotsIdentitas}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section-block">
    <div class="section-title">B.&nbsp; Permasalahan</div>
    <div class="rounded-box box-large">${escapeHtml(item.permasalahan)}</div>
  </div>

  <div class="section-block">
    <div class="section-title">C.&nbsp; Solusi</div>
    <div class="rounded-box box-large">${escapeHtml(item.solusi)}</div>
  </div>

  <div class="statement-section">
    <div class="statement-text">Ditulis ulang kalimat “<strong>Saya telah memahami</strong>” oleh peserta</div>
    <div class="statement-box"></div>
  </div>

  <div class="closing-paragraph">
    Demikian berita acara ini dibuat dengan sebenarnya. Bahwa Bpk/Ibu. ${item.nama ? escapeHtml(item.nama) : dotsName}, menyatakan telah menerima dan memahami penjelasan yang disampaikan oleh petugas TASPEN, dan memahami bahwa seluruh kebijakan mengikuti ketentuan peraturan yang berlaku dan terbaru, termasuk apabila terdapat perubahan di kemudian hari.
  </div>

  <div class="signatures">
    <div class="sig-col left">
      <div class="sig-date-spacer"></div>
      <div class="sig-role">Petugas,</div>
      <div class="sig-name">(${escapeHtml(item.user?.name) || dotsSig})</div>
    </div>
    <div class="sig-col right">
      <div class="sig-date">${tanggalDisplay}</div>
      <div class="sig-role">Peserta,</div>
      <div class="sig-name">(${escapeHtml(item.nama) || dotsSig})</div>
    </div>
  </div>
</div>

<script>
  window.addEventListener('load', function() {
    var images = Array.prototype.slice.call(document.images);
    Promise.all(images.map(function(img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function(resolve) {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })).then(function() {
      setTimeout(function() {
        window.print();
      }, 250);
    });
  });
</script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=900,height=750');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }
}

