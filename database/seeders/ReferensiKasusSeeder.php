<?php

namespace Database\Seeders;

use App\Models\ReferensiKasus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ReferensiKasusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvPath = database_path('data/referensi_kasus.csv');

        if (! File::exists($csvPath)) {
            $this->command?->warn("CSV file not found at: {$csvPath}");
            return;
        }

        $file = fopen($csvPath, 'r');
        $headers = fgetcsv($file);

        if ($headers === false) {
            fclose($file);
            return;
        }

        // Clean headers (trim BOM & whitespace)
        $headers = array_map(function ($header) {
            return trim(preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $header));
        }, $headers);

        $records = [];
        while (($row = fgetcsv($file)) !== false) {
            if (empty(array_filter($row))) {
                continue;
            }

            $data = array_combine($headers, $row);
            if ($data) {
                $records[] = [
                    'kode_kasus' => $data['kode_kasus'] ?? null,
                    'kategori' => $data['kategori'] ?? 'Umum',
                    'kasus' => $data['kasus'] ?? '',
                    'penyelesaian' => $data['penyelesaian'] ?? '',
                    'aturan' => $data['aturan'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        fclose($file);

        if (! empty($records)) {
            // Truncate existing and insert
            ReferensiKasus::truncate();
            ReferensiKasus::insert($records);
            $this->command?->info('Berhasil mengimpor ' . count($records) . ' data referensi kasus dari CSV.');
        }
    }
}
