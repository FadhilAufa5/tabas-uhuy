<?php

namespace App\Http\Controllers;

use App\Models\BeritaAcara;
use App\Models\ReferensiKasus;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with case recap chart and search.
     */
    public function index(Request $request): Response
    {
        $selectedMonth = $request->input('month', 'all'); // 'all' or '01'..'12'
        $selectedYear = $request->input('year', (string) date('Y'));

        // Category stats from Referensi Kasus
        $categories = ['Klaim', 'Kepesertaan', 'Pensiun', 'Teknis', 'Mutasi', 'Administrasi'];
        $categoryCounts = ReferensiKasus::selectRaw('kategori, count(*) as total')
            ->groupBy('kategori')
            ->pluck('total', 'kategori')
            ->toArray();

        $totalCases = ReferensiKasus::count();
        $categoryData = [];
        $categoryColors = [
            'Klaim' => '#10b981', // emerald
            'Kepesertaan' => '#3b82f6', // blue
            'Pensiun' => '#8b5cf6', // purple
            'Teknis' => '#f59e0b', // amber
            'Mutasi' => '#06b6d4', // cyan
            'Administrasi' => '#6366f1', // indigo
        ];

        foreach ($categories as $cat) {
            $count = $categoryCounts[$cat] ?? 0;
            $percentage = $totalCases > 0 ? round(($count / $totalCases) * 100, 1) : 0;
            $categoryData[] = [
                'category' => $cat,
                'count' => $count,
                'percentage' => $percentage,
                'color' => $categoryColors[$cat] ?? '#64748b',
            ];
        }

        // Monthly breakdown for Berita Acara & Cases
        $monthsList = [
            ['value' => '01', 'label' => 'Januari'],
            ['value' => '02', 'label' => 'Februari'],
            ['value' => '03', 'label' => 'Maret'],
            ['value' => '04', 'label' => 'April'],
            ['value' => '05', 'label' => 'Mei'],
            ['value' => '06', 'label' => 'Juni'],
            ['value' => '07', 'label' => 'Juli'],
            ['value' => '08', 'label' => 'Agustus'],
            ['value' => '09', 'label' => 'September'],
            ['value' => '10', 'label' => 'Oktober'],
            ['value' => '11', 'label' => 'November'],
            ['value' => '12', 'label' => 'Desember'],
        ];

        $monthlyStats = [];
        foreach ($monthsList as $m) {
            $baQuery = BeritaAcara::whereYear('created_at', $selectedYear)
                ->whereMonth('created_at', $m['value']);
            
            $kasusQuery = ReferensiKasus::whereYear('created_at', $selectedYear)
                ->whereMonth('created_at', $m['value']);

            $baCount = $baQuery->count();
            $kasusCount = $kasusQuery->count();

            $monthlyStats[] = [
                'month' => $m['value'],
                'monthName' => $m['label'],
                'shortName' => substr($m['label'], 0, 3),
                'beritaAcaraCount' => $baCount,
                'kasusCount' => $kasusCount,
                'total' => $baCount + $kasusCount,
            ];
        }

        // Filtered quick stats
        $baFilteredQuery = BeritaAcara::query();
        if ($selectedMonth !== 'all') {
            $baFilteredQuery->whereMonth('created_at', $selectedMonth);
        }

        $allCases = ReferensiKasus::select('id', 'kode_kasus', 'kategori', 'kasus', 'penyelesaian', 'aturan', 'created_at')
            ->latest('id')
            ->limit(50)
            ->get();

        $allBeritaAcara = BeritaAcara::select('id', 'nomor_berita_acara', 'nama', 'permasalahan', 'solusi', 'status', 'created_at')
            ->latest('id')
            ->limit(50)
            ->get();

        $stats = [
            'total_berita_acara' => BeritaAcara::count(),
            'total_referensi_kasus' => $totalCases,
            'ba_selesai' => BeritaAcara::where('status', 'Selesai')->count(),
            'total_users' => User::count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'categoryData' => $categoryData,
            'monthlyStats' => $monthlyStats,
            'monthsList' => $monthsList,
            'allCases' => $allCases,
            'allBeritaAcara' => $allBeritaAcara,
            'filters' => [
                'month' => $selectedMonth,
                'year' => $selectedYear,
            ],
        ]);
    }
}
