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
     * Import Referensi Kasus from uploaded CSV file.
     */
    public function importCsv(Request $request): RedirectResponse
    {
        $request->validate([
            'file_csv' => 'required|file|max:5120',
        ], [
            'file_csv.required' => 'File CSV wajib diunggah.',
            'file_csv.max'      => 'Ukuran file CSV maksimal 5MB.',
        ]);

        $file     = $request->file('file_csv');
        $filePath = $file->getRealPath() ?: $file->getPathname();

        $rows = array_map('str_getcsv', file($filePath));

        if (empty($rows)) {
            return redirect()->back()->with('error', 'File CSV kosong.');
        }

        $headers = array_shift($rows);
        if (! $headers) {
            return redirect()->back()->with('error', 'Header CSV tidak valid.');
        }

        // Clean headers
        $cleanHeaders = array_map(function ($h) {
            return strtolower(trim(preg_replace('/[\x00-\x1F\x80-\xFF]/', '', (string) $h)));
        }, $headers);

        $count = 0;
        foreach ($rows as $row) {
            if (empty(array_filter($row))) {
                continue;
            }

            if (count($cleanHeaders) === count($row)) {
                $data = array_combine($cleanHeaders, $row);
            } else {
                continue;
            }

            if ($data && ! empty($data['kasus']) && ! empty($data['penyelesaian'])) {
                ReferensiKasus::create([
                    'kode_kasus'   => ! empty($data['kode_kasus']) ? $data['kode_kasus'] : ('KS-' . str_pad((string) (ReferensiKasus::count() + 1), 3, '0', STR_PAD_LEFT)),
                    'kategori'     => ! empty($data['kategori']) ? $data['kategori'] : 'Umum',
                    'kasus'        => $data['kasus'],
                    'penyelesaian' => $data['penyelesaian'],
                    'aturan'       => $data['aturan'] ?? null,
                ]);
                $count++;
            }
        }

        return redirect()->back()->with('success', "Berhasil mengimpor {$count} data referensi kasus dari CSV.");
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
