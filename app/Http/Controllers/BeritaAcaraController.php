<?php

namespace App\Http\Controllers;

use App\Models\BeritaAcara;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BeritaAcaraController extends Controller
{
    public function __construct(
        protected FileUploadService $fileUploadService
    ) {}

    /**
     * Display a listing of Berita Acara.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = BeritaAcara::query()->with('user:id,name,email');

        $dokumentasi = $request->input('dokumentasi');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_berita_acara', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('no_hp', 'like', "%{$search}%")
                    ->orWhere('permasalahan', 'like', "%{$search}%")
                    ->orWhere('solusi', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($dokumentasi === 'sudah_ttd') {
            $query->whereNotNull('foto_dokumentasi');
        } elseif ($dokumentasi === 'belum_ttd') {
            $query->whereNull('foto_dokumentasi');
        }

        $beritaAcaraList = $query->latest('id')->paginate(10)->withQueryString();

        $stats = [
            'total' => BeritaAcara::count(),
            'selesai' => BeritaAcara::where('status', 'Selesai')->count(),
            'dalam_proses' => BeritaAcara::where('status', 'Dalam Proses')->count(),
            'draft' => BeritaAcara::where('status', 'Draft')->count(),
            'sudah_ttd' => BeritaAcara::whereNotNull('foto_dokumentasi')->count(),
            'belum_ttd' => BeritaAcara::whereNull('foto_dokumentasi')->count(),
        ];

        return Inertia::render('berita-acara/index', [
            'items' => $beritaAcaraList,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
                'dokumentasi' => $dokumentasi ?? 'all',
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
            'no_hp' => 'nullable|string|max:30',
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
            $uploaded = $this->fileUploadService->uploadFile(
                $request->file('file_notas'),
                'notas'
            );
            $filePath = $uploaded['path'];
            $fileName = $uploaded['name'];
            $fileSize = $uploaded['size'];
        }

        BeritaAcara::create([
            'user_id' => $request->user()->id,
            'nomor_berita_acara' => $validated['nomor_berita_acara'],
            'nama' => $validated['nama'],
            'no_hp' => $validated['no_hp'] ?? null,
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
            'nomor_berita_acara' => 'required|string|max:100|unique:berita_acara,nomor_berita_acara,'.$beritaAcara->id,
            'nama' => 'required|string|max:255',
            'no_hp' => 'nullable|string|max:30',
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
            'no_hp' => $validated['no_hp'] ?? null,
            'permasalahan' => $validated['permasalahan'],
            'solusi' => $validated['solusi'],
            'status' => $validated['status'],
            'tanggal_kejadian' => $validated['tanggal_kejadian'],
        ];

        if ($request->hasFile('file_notas')) {
            $uploaded = $this->fileUploadService->replaceFile(
                $beritaAcara->file_notas,
                $request->file('file_notas'),
                'notas'
            );
            $data['file_notas'] = $uploaded['path'];
            $data['file_notas_name'] = $uploaded['name'];
            $data['file_notas_size'] = $uploaded['size'];
        }

        $beritaAcara->update($data);

        return redirect()->back()->with('success', 'Berita Acara berhasil diperbarui.');
    }

    /**
     * Upload foto dokumentasi tanda tangan berita acara fisik.
     */
    public function uploadDokumentasi(Request $request, BeritaAcara $beritaAcara): RedirectResponse
    {
        $request->validate([
            'foto_dokumentasi' => 'required|image|mimes:jpeg,jpg,png,webp|max:10240',
            'catatan_dokumentasi' => 'nullable|string|max:1000',
            'tandai_selesai' => 'nullable|boolean',
        ], [
            'foto_dokumentasi.required' => 'Foto dokumentasi tanda tangan wajib diunggah.',
            'foto_dokumentasi.image' => 'Berkas dokumentasi harus berupa gambar/foto.',
            'foto_dokumentasi.mimes' => 'Format foto harus berupa JPG, JPEG, PNG, atau WEBP.',
            'foto_dokumentasi.max' => 'Ukuran foto dokumentasi maksimal 10MB.',
        ]);

        $uploaded = $this->fileUploadService->replaceFile(
            $beritaAcara->foto_dokumentasi,
            $request->file('foto_dokumentasi'),
            'dokumentasi_ba',
            ['is_image' => true]
        );

        $data = [
            'foto_dokumentasi' => $uploaded['path'],
            'foto_dokumentasi_name' => $uploaded['name'],
            'foto_dokumentasi_size' => $uploaded['size'],
            'waktu_dokumentasi' => now(),
            'catatan_dokumentasi' => $request->input('catatan_dokumentasi'),
        ];

        // Jika opsi tandai_selesai dicentang atau status masih Dalam Proses/Draft, bisa otomatis jadi Selesai
        if ($request->boolean('tandai_selesai') || $beritaAcara->status !== 'Selesai') {
            $data['status'] = 'Selesai';
        }

        $beritaAcara->update($data);

        return redirect()->back()->with('success', 'Foto dokumentasi tanda tangan peserta berhasil disimpan.');
    }

    /**
     * Download foto dokumentasi tanda tangan.
     */
    public function downloadDokumentasi(BeritaAcara $beritaAcara): BinaryFileResponse|RedirectResponse
    {
        if (! $beritaAcara->foto_dokumentasi || ! Storage::disk('public')->exists($beritaAcara->foto_dokumentasi)) {
            return redirect()->back()->with('error', 'Foto dokumentasi tanda tangan tidak ditemukan di server.');
        }

        $path = Storage::disk('public')->path($beritaAcara->foto_dokumentasi);
        $name = $beritaAcara->foto_dokumentasi_name ?? basename($beritaAcara->foto_dokumentasi);

        return response()->download($path, $name);
    }

    /**
     * Delete foto dokumentasi tanda tangan.
     */
    public function deleteDokumentasi(BeritaAcara $beritaAcara): RedirectResponse
    {
        $this->fileUploadService->deleteFile($beritaAcara->foto_dokumentasi);

        $beritaAcara->update([
            'foto_dokumentasi' => null,
            'foto_dokumentasi_name' => null,
            'foto_dokumentasi_size' => null,
            'waktu_dokumentasi' => null,
            'catatan_dokumentasi' => null,
        ]);

        return redirect()->back()->with('success', 'Foto dokumentasi tanda tangan berhasil dihapus.');
    }

    /**
     * Remove the specified Berita Acara.
     */
    public function destroy(BeritaAcara $beritaAcara): RedirectResponse
    {
        $this->fileUploadService->deleteFile($beritaAcara->file_notas);
        $this->fileUploadService->deleteFile($beritaAcara->foto_dokumentasi);

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
