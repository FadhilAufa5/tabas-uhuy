<?php

namespace App\Http\Controllers;

use App\Models\BeritaAcara;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BeritaAcaraController extends Controller
{
    /**
     * Display a listing of Berita Acara.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = BeritaAcara::query()->with('user:id,name,email');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_berita_acara', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('permasalahan', 'like', "%{$search}%")
                    ->orWhere('solusi', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $beritaAcaraList = $query->latest('id')->paginate(10)->withQueryString();

        $stats = [
            'total' => BeritaAcara::count(),
            'selesai' => BeritaAcara::where('status', 'Selesai')->count(),
            'dalam_proses' => BeritaAcara::where('status', 'Dalam Proses')->count(),
            'draft' => BeritaAcara::where('status', 'Draft')->count(),
        ];

        return Inertia::render('berita-acara/index', [
            'items' => $beritaAcaraList,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created Berita Acara.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_berita_acara' => 'required|string|max:100|unique:berita_acara,nomor_berita_acara',
            'nama' => 'required|string|max:255',
            'permasalahan' => 'required|string',
            'solusi' => 'required|string',
            'status' => 'required|string|in:Selesai,Dalam Proses,Draft',
            'tanggal_kejadian' => 'nullable|date',
            'file_notas' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ], [
            'nomor_berita_acara.required' => 'NOTAS (Nomor Taspen) wajib diisi.',
            'nomor_berita_acara.unique' => 'NOTAS (Nomor Taspen) ini sudah terdaftar dalam sistem.',
            'nama.required' => 'Nama pihak/pelapor wajib diisi.',
            'permasalahan.required' => 'Uraian permasalahan wajib diisi.',
            'solusi.required' => 'Uraian solusi penanganan wajib diisi.',
            'file_notas.mimes' => 'Format file lampiran harus berupa PDF, DOC, DOCX, JPG, atau PNG.',
            'file_notas.max' => 'Ukuran file lampiran maksimal 10MB.',
        ]);

        $filePath = null;
        $fileName = null;
        $fileSize = null;

        if ($request->hasFile('file_notas')) {
            $file = $request->file('file_notas');
            $fileName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $filePath = $file->store('notas', 'public');
        }

        BeritaAcara::create([
            'user_id' => $request->user()->id,
            'nomor_berita_acara' => $validated['nomor_berita_acara'],
            'nama' => $validated['nama'],
            'permasalahan' => $validated['permasalahan'],
            'solusi' => $validated['solusi'],
            'status' => $validated['status'],
            'tanggal_kejadian' => $validated['tanggal_kejadian'] ?? now()->toDateString(),
            'file_notas' => $filePath,
            'file_notas_name' => $fileName,
            'file_notas_size' => $fileSize,
        ]);

        return redirect()->back()->with('success', 'Berita Acara berhasil dibuat dan disimpan.');
    }

    /**
     * Update the specified Berita Acara.
     */
    public function update(Request $request, BeritaAcara $beritaAcara): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_berita_acara' => 'required|string|max:100|unique:berita_acara,nomor_berita_acara,' . $beritaAcara->id,
            'nama' => 'required|string|max:255',
            'permasalahan' => 'required|string',
            'solusi' => 'required|string',
            'status' => 'required|string|in:Selesai,Dalam Proses,Draft',
            'tanggal_kejadian' => 'nullable|date',
            'file_notas' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ], [
            'nomor_berita_acara.required' => 'NOTAS (Nomor Taspen) wajib diisi.',
            'nomor_berita_acara.unique' => 'NOTAS (Nomor Taspen) ini sudah terdaftar dalam sistem.',
            'nama.required' => 'Nama pihak/pelapor wajib diisi.',
            'permasalahan.required' => 'Uraian permasalahan wajib diisi.',
            'solusi.required' => 'Uraian solusi penanganan wajib diisi.',
        ]);

        $data = [
            'nomor_berita_acara' => $validated['nomor_berita_acara'],
            'nama' => $validated['nama'],
            'permasalahan' => $validated['permasalahan'],
            'solusi' => $validated['solusi'],
            'status' => $validated['status'],
            'tanggal_kejadian' => $validated['tanggal_kejadian'],
        ];

        if ($request->hasFile('file_notas')) {
            // Delete old file if exists
            if ($beritaAcara->file_notas && Storage::disk('public')->exists($beritaAcara->file_notas)) {
                Storage::disk('public')->delete($beritaAcara->file_notas);
            }

            $file = $request->file('file_notas');
            $data['file_notas_name'] = $file->getClientOriginalName();
            $data['file_notas_size'] = $file->getSize();
            $data['file_notas'] = $file->store('notas', 'public');
        }

        $beritaAcara->update($data);

        return redirect()->back()->with('success', 'Berita Acara berhasil diperbarui.');
    }

    /**
     * Remove the specified Berita Acara.
     */
    public function destroy(BeritaAcara $beritaAcara): RedirectResponse
    {
        if ($beritaAcara->file_notas && Storage::disk('public')->exists($beritaAcara->file_notas)) {
            Storage::disk('public')->delete($beritaAcara->file_notas);
        }

        $beritaAcara->delete();

        return redirect()->back()->with('success', 'Berita Acara berhasil dihapus.');
    }

    /**
     * Download the file notas.
     */
    public function download(BeritaAcara $beritaAcara): BinaryFileResponse|RedirectResponse
    {
        if (! $beritaAcara->file_notas || ! Storage::disk('public')->exists($beritaAcara->file_notas)) {
            return redirect()->back()->with('error', 'File notas tidak ditemukan di server.');
        }

        $path = Storage::disk('public')->path($beritaAcara->file_notas);
        $name = $beritaAcara->file_notas_name ?? basename($beritaAcara->file_notas);

        return response()->download($path, $name);
    }
}
