<?php

namespace App\Http\Controllers;

use App\Models\ReferensiKasus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReferensiKasusController extends Controller
{
    /** Allowed MIME types for lampiran */
    private const LAMPIRAN_MIMES = 'jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx';

    /** Max size in KB (5 MB) */
    private const LAMPIRAN_MAX_KB = 5120;

    /** Storage directory */
    private const LAMPIRAN_DIR = 'referensi-kasus';

    /**
     * Display a listing of Referensi Kasus.
     */
    public function index(Request $request): Response
    {
        $search   = $request->input('search');
        $kategori = $request->input('kategori');

        $query = ReferensiKasus::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_kasus', 'like', "%{$search}%")
                    ->orWhere('kasus', 'like', "%{$search}%")
                    ->orWhere('penyelesaian', 'like', "%{$search}%")
                    ->orWhere('aturan', 'like', "%{$search}%");
            });
        }

        if ($kategori && $kategori !== 'all') {
            $query->where('kategori', $kategori);
        }

        $items = $query->latest('id')->paginate(12)->withQueryString();

        $categories = ReferensiKasus::select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->pluck('kategori')
            ->toArray();

        $stats = [
            'total'            => ReferensiKasus::count(),
            'categories_count' => count($categories),
        ];

        return Inertia::render('referensi-kasus/index', [
            'items'      => $items,
            'filters'    => [
                'search'   => $search ?? '',
                'kategori' => $kategori ?? 'all',
            ],
            'categories' => $categories,
            'stats'      => $stats,
        ]);
    }

    /**
     * Store a newly created Referensi Kasus.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kasus'   => 'nullable|string|max:50',
            'kategori'     => 'required|string|max:100',
            'kasus'        => 'required|string',
            'penyelesaian' => 'required|string',
            'aturan'       => 'nullable|string',
            'lampiran'     => "nullable|file|max:" . self::LAMPIRAN_MAX_KB . "|mimes:" . self::LAMPIRAN_MIMES,
        ], [
            'kategori.required'     => 'Kategori kasus wajib diisi.',
            'kasus.required'        => 'Uraian kasus wajib diisi.',
            'penyelesaian.required' => 'Uraian penyelesaian wajib diisi.',
            'lampiran.max'          => 'Ukuran lampiran maksimal 5 MB.',
            'lampiran.mimes'        => 'Format lampiran harus berupa gambar (jpg, png, gif, webp), PDF, Word, atau Excel.',
        ]);

        if (empty($validated['kode_kasus'])) {
            $validated['kode_kasus'] = 'KS-' . str_pad((string) (ReferensiKasus::count() + 1), 3, '0', STR_PAD_LEFT);
        }

        // Handle file upload
        $lampiranData = $this->uploadLampiran($request);

        ReferensiKasus::create(array_merge(
            collect($validated)->except('lampiran')->toArray(),
            $lampiranData,
        ));

        return redirect()->back()->with('success', 'Referensi kasus baru berhasil ditambahkan.');
    }

    /**
     * Update the specified Referensi Kasus.
     */
    public function update(Request $request, ReferensiKasus $referensiKasus): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kasus'      => 'nullable|string|max:50',
            'kategori'        => 'required|string|max:100',
            'kasus'           => 'required|string',
            'penyelesaian'    => 'required|string',
            'aturan'          => 'nullable|string',
            'lampiran'        => "nullable|file|max:" . self::LAMPIRAN_MAX_KB . "|mimes:" . self::LAMPIRAN_MIMES,
            'hapus_lampiran'  => 'nullable|boolean',
        ], [
            'lampiran.max'   => 'Ukuran lampiran maksimal 5 MB.',
            'lampiran.mimes' => 'Format lampiran harus berupa gambar (jpg, png, gif, webp), PDF, Word, atau Excel.',
        ]);

        $updateData = collect($validated)->except(['lampiran', 'hapus_lampiran'])->toArray();

        // If user wants to remove the existing file
        if ($request->boolean('hapus_lampiran')) {
            $this->deleteLampiranFile($referensiKasus);
            $updateData = array_merge($updateData, [
                'lampiran'      => null,
                'lampiran_name' => null,
                'lampiran_size' => null,
            ]);
        }

        // If a new file is uploaded, replace the old one
        if ($request->hasFile('lampiran')) {
            $this->deleteLampiranFile($referensiKasus);
            $updateData = array_merge($updateData, $this->uploadLampiran($request));
        }

        $referensiKasus->update($updateData);

        return redirect()->back()->with('success', 'Referensi kasus berhasil diperbarui.');
    }

    /**
     * Remove the specified Referensi Kasus (file deletion handled by model booted).
     */
    public function destroy(ReferensiKasus $referensiKasus): RedirectResponse
    {
        $referensiKasus->delete();

        return redirect()->back()->with('success', 'Referensi kasus berhasil dihapus.');
    }

    /**
     * Download the lampiran file with the original filename.
     */
    public function downloadLampiran(ReferensiKasus $referensiKasus): StreamedResponse
    {
        abort_if(! $referensiKasus->lampiran, 404, 'Lampiran tidak ditemukan.');
        abort_if(! Storage::disk('local')->exists($referensiKasus->lampiran), 404, 'File lampiran tidak tersedia.');

        return Storage::disk('local')->download(
            $referensiKasus->lampiran,
            $referensiKasus->lampiran_name ?? basename($referensiKasus->lampiran),
        );
    }

    /**
     * Import Referensi Kasus from uploaded CSV or Excel file.
     */
    public function importCsv(Request $request, \App\Services\SpreadsheetImportService $importService): RedirectResponse
    {
        // Support either 'file_csv', 'file', or 'file_excel'
        $request->validate([
            'file_csv'   => 'nullable|file|max:10240',
            'file'       => 'nullable|file|max:10240',
            'file_excel' => 'nullable|file|max:10240',
        ], [
            'file_csv.max'   => 'Ukuran file maksimal 10MB.',
            'file.max'       => 'Ukuran file maksimal 10MB.',
            'file_excel.max' => 'Ukuran file maksimal 10MB.',
        ]);

        $file = $request->file('file_csv') ?? $request->file('file') ?? $request->file('file_excel');

        if (! $file) {
            return redirect()->back()->with('error', 'Silakan pilih file CSV atau Excel (.xlsx, .xls) untuk diimpor.');
        }

        try {
            $records = $importService->parseFile($file);
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Gagal membaca format file: ' . $e->getMessage());
        }

        if (empty($records)) {
            return redirect()->back()->with('error', 'Tidak ada baris data valid yang ditemukan. Pastikan file memiliki baris header dan kolom "kasus" serta "penyelesaian" terisi.');
        }

        $count = 0;
        $currentMaxNumber = (int) ReferensiKasus::max('id');

        \Illuminate\Support\Facades\DB::transaction(function () use ($records, &$count, &$currentMaxNumber) {
            foreach ($records as $data) {
                $currentMaxNumber++;
                $kodeKasus = ! empty($data['kode_kasus'])
                    ? $data['kode_kasus']
                    : ('KS-' . str_pad((string) $currentMaxNumber, 3, '0', STR_PAD_LEFT));

                ReferensiKasus::create([
                    'kode_kasus'   => $kodeKasus,
                    'kategori'     => ! empty($data['kategori']) ? $data['kategori'] : 'Umum',
                    'kasus'        => $data['kasus'],
                    'penyelesaian' => $data['penyelesaian'],
                    'aturan'       => $data['aturan'] ?? null,
                ]);
                $count++;
            }
        });

        return redirect()->back()->with('success', "Berhasil mengimpor {$count} data referensi kasus.");
    }

    /**
     * Download CSV template for importing Referensi Kasus.
     */
    public function downloadTemplate(): StreamedResponse
    {
        $filename = 'template_import_referensi_kasus.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, ['kode_kasus', 'kategori', 'kasus', 'penyelesaian', 'aturan']);
            fputcsv($handle, ['KS-001', 'Klaim', 'Contoh uraian masalah atau kasus pensiun', 'Contoh langkah-langkah penyelesaian atau solusi SOP', 'PP No. 70 Tahun 2015']);
            fputcsv($handle, ['KS-002', 'Pensiun', 'Contoh keterlambatan berkas klim otomatis', 'Lakukan verifikasi NIP dan koordinasi dengan unit BKN', 'UU No. 11 Tahun 1969']);
            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Export all Referensi Kasus to CSV format.
     */
    public function exportCsv(): StreamedResponse
    {
        $filename = 'referensi_kasus_' . date('Ymd_His') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            // Write UTF-8 BOM
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, ['kode_kasus', 'kategori', 'kasus', 'penyelesaian', 'aturan']);

            ReferensiKasus::chunk(100, function ($kasusList) use ($handle) {
                foreach ($kasusList as $item) {
                    fputcsv($handle, [
                        $item->kode_kasus,
                        $item->kategori,
                        $item->kasus,
                        $item->penyelesaian,
                        $item->aturan,
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }

    // ── Private Helpers ──────────────────────────────────────────────────────

    /**
     * Upload lampiran file and return the data array to merge into model attributes.
     *
     * @return array{lampiran: string, lampiran_name: string, lampiran_size: int}
     */
    private function uploadLampiran(Request $request): array
    {
        if (! $request->hasFile('lampiran')) {
            return [];
        }

        $file      = $request->file('lampiran');
        $original  = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filename  = Str::uuid() . '.' . $extension;
        $path      = $file->storeAs(self::LAMPIRAN_DIR, $filename, 'local');

        return [
            'lampiran'      => $path,
            'lampiran_name' => $original,
            'lampiran_size' => $file->getSize(),
        ];
    }

    /**
     * Delete the physical lampiran file from storage (does not update model).
     */
    private function deleteLampiranFile(ReferensiKasus $model): void
    {
        if ($model->lampiran && Storage::disk('local')->exists($model->lampiran)) {
            Storage::disk('local')->delete($model->lampiran);
        }
    }
}
