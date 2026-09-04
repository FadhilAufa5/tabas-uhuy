<?php

namespace App\Http\Controllers;

use App\Models\ReferensiKasus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReferensiKasusController extends Controller
{
    /**
     * Display a listing of Referensi Kasus.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
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
            'total' => ReferensiKasus::count(),
            'categories_count' => count($categories),
        ];

        return Inertia::render('referensi-kasus/index', [
            'items' => $items,
            'filters' => [
                'search' => $search ?? '',
                'kategori' => $kategori ?? 'all',
            ],
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created Referensi Kasus.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kasus' => 'nullable|string|max:50',
            'kategori' => 'required|string|max:100',
            'kasus' => 'required|string',
            'penyelesaian' => 'required|string',
            'aturan' => 'nullable|string',
        ], [
            'kategori.required' => 'Kategori kasus wajib diisi.',
            'kasus.required' => 'Uraian kasus wajib diisi.',
            'penyelesaian.required' => 'Uraian penyelesaian wajib diisi.',
        ]);

        if (empty($validated['kode_kasus'])) {
            $validated['kode_kasus'] = 'KS-' . str_pad((string) (ReferensiKasus::count() + 1), 3, '0', STR_PAD_LEFT);
        }

        ReferensiKasus::create($validated);

        return redirect()->back()->with('success', 'Referensi kasus baru berhasil ditambahkan.');
    }

    /**
     * Update the specified Referensi Kasus.
     */
    public function update(Request $request, ReferensiKasus $referensiKasus): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kasus' => 'nullable|string|max:50',
            'kategori' => 'required|string|max:100',
            'kasus' => 'required|string',
            'penyelesaian' => 'required|string',
            'aturan' => 'nullable|string',
        ]);

        $referensiKasus->update($validated);

        return redirect()->back()->with('success', 'Referensi kasus berhasil diperbarui.');
    }

    /**
     * Remove the specified Referensi Kasus.
     */
    public function destroy(ReferensiKasus $referensiKasus): RedirectResponse
    {
        $referensiKasus->delete();

        return redirect()->back()->with('success', 'Referensi kasus berhasil dihapus.');
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
            'file_csv.max' => 'Ukuran file CSV maksimal 5MB.',
        ]);

        $file = $request->file('file_csv');
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

            // Ensure matching column count
            if (count($cleanHeaders) === count($row)) {
                $data = array_combine($cleanHeaders, $row);
            } else {
                continue;
            }

            if ($data && ! empty($data['kasus']) && ! empty($data['penyelesaian'])) {
                ReferensiKasus::create([
                    'kode_kasus' => ! empty($data['kode_kasus']) ? $data['kode_kasus'] : ('KS-' . str_pad((string) (ReferensiKasus::count() + 1), 3, '0', STR_PAD_LEFT)),
                    'kategori' => ! empty($data['kategori']) ? $data['kategori'] : 'Umum',
                    'kasus' => $data['kasus'],
                    'penyelesaian' => $data['penyelesaian'],
                    'aturan' => $data['aturan'] ?? null,
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
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
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
}
