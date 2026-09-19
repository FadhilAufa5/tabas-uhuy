<?php

namespace Database\Seeders;

use App\Models\ReferensiKasus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class RekapKeluhanSeeder extends Seeder
{
    /**
     * Seed referensi kasus dari file:
     * database/seeders/csv/Rekap-Keluhan-Permasalahan-TASPEN.csv
     *
     * Format kolom CSV:
     *   No | Kasus / Permasalahan | Tindak Lanjut Penyelesaian | Peraturan
     */
    public function run(): void
    {
        $csvPath = database_path('seeders/csv/Rekap-Keluhan-Permasalahan-TASPEN.csv');

        if (! File::exists($csvPath)) {
            $this->command?->error("CSV file not found at: {$csvPath}");
            return;
        }

        $file = fopen($csvPath, 'r');

        // Skip header row
        $headers = fgetcsv($file);
        if ($headers === false) {
            $this->command?->error('Failed to read CSV headers.');
            fclose($file);
            return;
        }

        $this->command?->info('Membaca CSV: ' . basename($csvPath));
        $this->command?->info('Header ditemukan: ' . implode(' | ', array_map('trim', $headers)));

        /**
         * Kategori mapping berdasarkan konten kasus.
         * CSV tidak punya kolom kategori, kita deteksi otomatis.
         */
        $records = [];
        $rowNum  = 0;

        while (($row = fgetcsv($file)) !== false) {
            // Lewati baris kosong
            if (empty(array_filter($row))) {
                continue;
            }

            // Pastikan ada cukup kolom
            if (count($row) < 2) {
                continue;
            }

            $rowNum++;

            // Mapping kolom sesuai header CSV:
            // [0] No  [1] Kasus / Permasalahan  [2] Tindak Lanjut Penyelesaian  [3] Peraturan
            $nomorUrut    = trim($row[0] ?? '');
            $kasusText    = trim($row[1] ?? '');
            $penyelesaian = trim($row[2] ?? '');
            $peraturan    = trim($row[3] ?? '');

            if (empty($kasusText)) {
                continue;
            }

            // Buat kode kasus: KS-001, KS-002, …
            $kodeKasus = 'KS-' . str_pad($nomorUrut ?: $rowNum, 3, '0', STR_PAD_LEFT);

            // Deteksi kategori otomatis dari konten kasus
            $kategori = $this->detectKategori($kasusText . ' ' . $penyelesaian);

            $records[] = [
                'kode_kasus'  => $kodeKasus,
                'kategori'    => $kategori,
                'kasus'       => $kasusText,
                'penyelesaian'=> $penyelesaian,
                'aturan'      => $peraturan ?: null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }

        fclose($file);

        if (empty($records)) {
            $this->command?->warn('Tidak ada data yang dapat diimpor dari CSV.');
            return;
        }

        // Simpan / update data kasus secara aman tanpa truncate
        foreach ($records as $record) {
            ReferensiKasus::updateOrCreate(
                ['kode_kasus' => $record['kode_kasus']],
                [
                    'kategori'     => $record['kategori'],
                    'kasus'        => $record['kasus'],
                    'penyelesaian' => $record['penyelesaian'],
                    'aturan'       => $record['aturan'],
                ]
            );
        }

        $this->command?->info('✅ Berhasil menyelaraskan ' . count($records) . ' data referensi kasus dari Rekap Keluhan TASPEN.');
    }

    /**
     * Deteksi kategori berdasarkan kata kunci dalam teks kasus/penyelesaian.
     */
    private function detectKategori(string $text): string
    {
        $text = mb_strtolower($text);

        // Urutan prioritas — cek yang paling spesifik dulu
        if (preg_match('/tipikor|korupsi|kasus hukum|inkrah|inkracht|pidana|penahanan/u', $text)) {
            return 'Kasus Hukum';
        }

        if (preg_match('/pensiun\s+janda|pensiun\s+duda|pensiun\s+yatim|uang\s+duka|udw|c110|b110/u', $text)) {
            return 'Pensiun';
        }

        if (preg_match('/klaim|thtp|claimthp|sstmb|santunan|jkk|jkm|askem|tht\b/u', $text)) {
            return 'Klaim';
        }

        if (preg_match('/kepesertaan|nip|pppk|non\s+asn|anggota\s+legislatif|partai|pns\s+aktif/u', $text)) {
            return 'Kepesertaan';
        }

        if (preg_match('/mutasi|kantor\s+bayar|mitra\s+bayar|rapel|pemindahan/u', $text)) {
            return 'Mutasi';
        }

        if (preg_match('/pemalsuan|investigasi|konfirmasi|sk\s+pensiun|data\s+tdes|verifikasi/u', $text)) {
            return 'Administrasi';
        }

        if (preg_match('/kredit|hutang|bank|cicilan|lunas|pinjam/u', $text)) {
            return 'Keuangan';
        }

        return 'Umum';
    }
}
