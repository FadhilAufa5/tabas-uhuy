<?php

namespace App\Services;

use DOMDocument;
use DOMXPath;
use Illuminate\Http\UploadedFile;
use SimpleXMLElement;
use ZipArchive;

class SpreadsheetImportService
{
    /**
     * Standard column names we want to extract.
     */
    private const COLUMN_MAP = [
        'kode_kasus'   => ['kode_kasus', 'kode kasus', 'kode', 'kodekasus', 'id kasus', 'no kasus', 'nomor kasus', 'id_kasus', 'no_kasus'],
        'kategori'     => ['kategori', 'category', 'kategori kasus', 'kategorikasus', 'jenis', 'jenis kasus', 'kategori_kasus'],
        'kasus'        => ['kasus', 'case', 'uraian kasus', 'deskripsi kasus', 'masalah', 'problem', 'pertanyaan', 'uraian', 'judul', 'judul kasus', 'uraian_kasus', 'deskripsi_kasus'],
        'penyelesaian' => ['penyelesaian', 'solusi', 'solution', 'uraian penyelesaian', 'jawaban', 'penanganan', 'tindakan', 'langkah penyelesaian', 'uraian_penyelesaian', 'langkah_solusi'],
        'aturan'       => ['aturan', 'dasar aturan', 'dasar hukum', 'regulasi', 'landasan hukum', 'peraturan', 'uu', 'sop', 'dasar_aturan', 'dasar_hukum', 'referensi aturan', 'referensi_aturan'],
    ];

    /**
     * Parse an uploaded file (CSV, XLSX, XLS, TXT) into normalized records.
     *
     * @return array<int, array{kode_kasus: ?string, kategori: string, kasus: string, penyelesaian: string, aturan: ?string}>
     */
    public function parseFile(UploadedFile|string $file): array
    {
        $filePath = is_string($file) ? $file : ($file->getRealPath() ?: $file->getPathname());
        $extension = strtolower(is_string($file) ? pathinfo($file, PATHINFO_EXTENSION) : $file->getClientOriginalExtension());

        $rawRows = match ($extension) {
            'xlsx'  => $this->parseXlsx($filePath),
            'xls'   => $this->parseXls($filePath),
            default => $this->parseCsvOrText($filePath, $file instanceof UploadedFile ? $file->getContent() : null),
        };

        if (empty($rawRows)) {
            // Fallback: if XLSX/XLS failed, try CSV fallback
            $content = $file instanceof UploadedFile ? $file->getContent() : (file_exists($filePath) ? file_get_contents($filePath) : '');
            if (! empty($content)) {
                $rawRows = $this->parseCsvContent($content);
            }
        }

        if (empty($rawRows)) {
            return [];
        }

        return $this->normalizeAndMapRows($rawRows);
    }

    /**
     * Parse CSV or delimited text content into 2D array.
     *
     * @return array<int, array<int, string>>
     */
    public function parseCsvOrText(string $filePath, ?string $content = null): array
    {
        if ($content === null) {
            $content = file_exists($filePath) ? (file_get_contents($filePath) ?: '') : '';
        }

        return $this->parseCsvContent($content);
    }

    /**
     * Parse raw CSV string into rows with auto delimiter detection.
     *
     * @return array<int, array<int, string>>
     */
    public function parseCsvContent(string $content): array
    {
        // Remove UTF-8 BOM
        if (str_starts_with($content, "\xEF\xBB\xBF")) {
            $content = substr($content, 3);
        }

        $content = trim($content);
        if (empty($content)) {
            return [];
        }

        // Detect delimiter (comma, semicolon, tab, pipe)
        $sample = substr($content, 0, 2048);
        $delimiters = [',', ';', "\t", '|'];
        $bestDelimiter = ',';
        $maxCount = -1;

        foreach ($delimiters as $delim) {
            $count = substr_count($sample, $delim);
            if ($count > $maxCount) {
                $maxCount = $count;
                $bestDelimiter = $delim;
            }
        }

        $lines = preg_split('/\r\n|\r|\n/', $content);
        if (! $lines) {
            return [];
        }

        $rows = [];
        $stream = fopen('php://memory', 'r+');
        fwrite($stream, $content);
        rewind($stream);

        while (($data = fgetcsv($stream, 0, $bestDelimiter)) !== false) {
            // Trim each cell
            $cleanRow = array_map(fn ($val) => trim((string) $val), $data);
            if (! empty(array_filter($cleanRow, fn ($v) => $v !== ''))) {
                $rows[] = $cleanRow;
            }
        }
        fclose($stream);

        return $rows;
    }

    /**
     * Parse .xlsx file using ZipArchive and XML.
     *
     * @return array<int, array<int, string>>
     */
    public function parseXlsx(string $filePath): array
    {
        if (! class_exists(ZipArchive::class)) {
            return [];
        }

        $zip = new ZipArchive();
        if ($zip->open($filePath) !== true) {
            return [];
        }

        // 1. Extract shared strings
        $sharedStrings = [];
        if ($zip->locateName('xl/sharedStrings.xml') !== false) {
            $xmlContent = $zip->getFromName('xl/sharedStrings.xml');
            if ($xmlContent) {
                $sstXml = @simplexml_load_string($xmlContent);
                if ($sstXml && isset($sstXml->si)) {
                    foreach ($sstXml->si as $si) {
                        $text = '';
                        if (isset($si->t)) {
                            $text = (string) $si->t;
                        } elseif (isset($si->r)) {
                            foreach ($si->r as $r) {
                                $text .= (string) ($r->t ?? '');
                            }
                        }
                        $sharedStrings[] = $text;
                    }
                }
            }
        }

        // 2. Locate sheet1.xml (or first worksheet)
        $sheetPath = 'xl/worksheets/sheet1.xml';
        if ($zip->locateName($sheetPath) === false) {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $name = $zip->getNameIndex($i);
                if ($name && str_starts_with($name, 'xl/worksheets/sheet') && str_ends_with($name, '.xml')) {
                    $sheetPath = $name;
                    break;
                }
            }
        }

        if ($zip->locateName($sheetPath) === false) {
            $zip->close();
            return [];
        }

        $sheetContent = $zip->getFromName($sheetPath);
        $zip->close();

        if (! $sheetContent) {
            return [];
        }

        $sheetXml = @simplexml_load_string($sheetContent);
        if (! $sheetXml || ! isset($sheetXml->sheetData->row)) {
            return [];
        }

        $rows = [];
        foreach ($sheetXml->sheetData->row as $rowNode) {
            $rowValues = [];
            $maxColIndex = 0;

            foreach ($rowNode->c as $cell) {
                $cellRef = (string) ($cell['r'] ?? '');
                $colLetters = preg_replace('/[0-9]/', '', $cellRef);
                $colIndex = $this->colLetterToIndex($colLetters);

                $cellType = (string) ($cell['t'] ?? '');
                $val = '';

                if ($cellType === 's') {
                    $idx = (int) ($cell->v ?? -1);
                    $val = $sharedStrings[$idx] ?? '';
                } elseif ($cellType === 'inlineStr') {
                    $val = (string) ($cell->is->t ?? '');
                } elseif ($cellType === 'b') {
                    $val = ((string) ($cell->v ?? '')) === '1' ? '1' : '0';
                } else {
                    $val = (string) ($cell->v ?? '');
                }

                $rowValues[$colIndex] = trim($val);
                if ($colIndex > $maxColIndex) {
                    $maxColIndex = $colIndex;
                }
            }

            // Fill missing gaps in the row
            $normalizedRow = [];
            for ($c = 0; $c <= $maxColIndex; $c++) {
                $normalizedRow[$c] = $rowValues[$c] ?? '';
            }

            if (! empty(array_filter($normalizedRow, fn ($v) => $v !== ''))) {
                $rows[] = $normalizedRow;
            }
        }

        return $rows;
    }

    /**
     * Parse legacy .xls file (handles HTML tables, XML Spreadsheets, or PK zip aliases).
     *
     * @return array<int, array<int, string>>
     */
    public function parseXls(string $filePath): array
    {
        $content = file_exists($filePath) ? (file_get_contents($filePath) ?: '') : '';
        if (empty($content)) {
            return [];
        }

        // If it starts with PK\x03\x04, it's actually an XLSX archive
        if (str_starts_with($content, "PK\x03\x04")) {
            return $this->parseXlsx($filePath);
        }

        // If it's an HTML table export
        if (stripos($content, '<table') !== false) {
            $dom = new DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));
            $xpath = new DOMXPath($dom);
            $trNodes = $xpath->query('//tr');
            $rows = [];
            if ($trNodes) {
                foreach ($trNodes as $tr) {
                    $cells = [];
                    foreach ($tr->childNodes as $node) {
                        if (in_array(strtolower($node->nodeName), ['td', 'th'])) {
                            $cells[] = trim($node->textContent);
                        }
                    }
                    if (! empty(array_filter($cells, fn ($v) => $v !== ''))) {
                        $rows[] = $cells;
                    }
                }
            }
            if (! empty($rows)) {
                return $rows;
            }
        }

        // If it's an XML Spreadsheet 2003
        if (stripos($content, 'urn:schemas-microsoft-com:office:spreadsheet') !== false) {
            $xml = @simplexml_load_string($content);
            if ($xml) {
                $rows = [];
                foreach ($xml->Worksheet->Table->Row as $row) {
                    $cells = [];
                    foreach ($row->Cell as $cell) {
                        $cells[] = trim((string) ($cell->Data ?? ''));
                    }
                    if (! empty(array_filter($cells, fn ($v) => $v !== ''))) {
                        $rows[] = $cells;
                    }
                }
                if (! empty($rows)) {
                    return $rows;
                }
            }
        }

        // Fallback to CSV parser
        return $this->parseCsvContent($content);
    }

    /**
     * Convert column letters (A, B, ..., Z, AA, AB) to 0-based index.
     */
    private function colLetterToIndex(string $col): int
    {
        $col = strtoupper(trim($col));
        if ($col === '') {
            return 0;
        }

        $index = 0;
        $len = strlen($col);
        for ($i = 0; $i < $len; $i++) {
            $index = $index * 26 + (ord($col[$i]) - ord('A') + 1);
        }

        return max(0, $index - 1);
    }

    /**
     * Normalize header row and map data rows to standard schema.
     *
     * @param  array<int, array<int, string>>  $rawRows
     * @return array<int, array{kode_kasus: ?string, kategori: string, kasus: string, penyelesaian: string, aturan: ?string}>
     */
    private function normalizeAndMapRows(array $rawRows): array
    {
        if (count($rawRows) < 2) {
            return [];
        }

        $headerRow = array_shift($rawRows);
        $headerMap = [];

        // Match column headers
        foreach ($headerRow as $colIdx => $headerVal) {
            $cleanHeader = strtolower(trim(preg_replace('/[^a-zA-Z0-9]/', ' ', (string) $headerVal)));
            $cleanHeader = preg_replace('/\s+/', ' ', $cleanHeader);

            foreach (self::COLUMN_MAP as $field => $aliases) {
                if (in_array($cleanHeader, $aliases, true) || in_array(str_replace(' ', '_', $cleanHeader), $aliases, true)) {
                    $headerMap[$field] = $colIdx;
                    break;
                }
            }
        }

        // If 'kasus' or 'penyelesaian' not matched by name, fallback to positional if at least 2+ columns exist
        if (! isset($headerMap['kasus']) || ! isset($headerMap['penyelesaian'])) {
            // Positional fallback: 0: kode_kasus, 1: kategori, 2: kasus, 3: penyelesaian, 4: aturan
            if (count($headerRow) >= 5) {
                $headerMap = [
                    'kode_kasus'   => 0,
                    'kategori'     => 1,
                    'kasus'        => 2,
                    'penyelesaian' => 3,
                    'aturan'       => 4,
                ];
            } elseif (count($headerRow) >= 2) {
                $headerMap['kasus'] = 0;
                $headerMap['penyelesaian'] = 1;
            }
        }

        $records = [];
        foreach ($rawRows as $row) {
            $kasus = isset($headerMap['kasus']) && isset($row[$headerMap['kasus']])
                ? trim((string) $row[$headerMap['kasus']])
                : '';

            $penyelesaian = isset($headerMap['penyelesaian']) && isset($row[$headerMap['penyelesaian']])
                ? trim((string) $row[$headerMap['penyelesaian']])
                : '';

            // Ignore rows that don't have both kasus and penyelesaian
            if ($kasus === '' || $penyelesaian === '') {
                continue;
            }

            $kodeKasus = isset($headerMap['kode_kasus']) && isset($row[$headerMap['kode_kasus']])
                ? trim((string) $row[$headerMap['kode_kasus']])
                : null;

            $kategori = isset($headerMap['kategori']) && isset($row[$headerMap['kategori']])
                ? trim((string) $row[$headerMap['kategori']])
                : '';

            $aturan = isset($headerMap['aturan']) && isset($row[$headerMap['aturan']])
                ? trim((string) $row[$headerMap['aturan']])
                : null;

            $records[] = [
                'kode_kasus'   => $kodeKasus !== '' ? $kodeKasus : null,
                'kategori'     => $kategori !== '' ? $kategori : 'Umum',
                'kasus'        => $kasus,
                'penyelesaian' => $penyelesaian,
                'aturan'       => $aturan !== '' ? $aturan : null,
            ];
        }

        return $records;
    }
}
