import { Head, router, usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
    CategoryStat,
    DashboardBanner,
    DashboardCaseModal,
    DashboardCaseSearch,
    DashboardCategoryChart,
    DashboardChatbot,
    DashboardMonthlyChart,
    DashboardStats,
    MonthlyStat,
    MonthOption,
} from '@/components/dashboard';
import { dashboard } from '@/routes';
import type { BeritaAcara, ReferensiKasus, User } from '@/types';

interface Props {
    stats: {
        total_berita_acara: number;
        total_referensi_kasus: number;
        ba_selesai: number;
        total_users: number;
    };
    categoryData: CategoryStat[];
    monthlyStats: MonthlyStat[];
    monthsList: MonthOption[];
    allCases: ReferensiKasus[];
    allBeritaAcara: BeritaAcara[];
    filters: {
        month: string;
        year: string;
    };
}

export default function Dashboard({
    stats,
    categoryData,
    monthlyStats,
    monthsList,
    allCases = [],
    filters,
}: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth?.user;

    // Monthly Filter State
    const [selectedMonth, setSelectedMonth] = useState(filters.month || 'all');
    const [selectedYear] = useState(filters.year || '2026');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('all');
    const [selectedCaseDetail, setSelectedCaseDetail] =
        useState<ReferensiKasus | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Filter Change Handler
    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        router.get(
            dashboard(),
            {
                month: month,
                year: selectedYear,
            },
            { preserveState: true }
        );
    };

    // Filtered Cases for Interactive Search
    const filteredResults = useMemo(() => {
        if (!searchQuery && searchCategory === 'all') {
            return allCases.slice(0, 10);
        }

        return allCases.filter((item) => {
            const matchesQuery =
                !searchQuery ||
                item.kasus.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.penyelesaian
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (item.aturan &&
                    item.aturan.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.kode_kasus &&
                    item.kode_kasus
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));

            const matchesCategory =
                searchCategory === 'all' || item.kategori === searchCategory;

            return matchesQuery && matchesCategory;
        });
    }, [allCases, searchQuery, searchCategory]);

    // Copy Solution Handler
    const handleCopySolution = (item: ReferensiKasus) => {
        const text = `[KASUS]: ${item.kasus}\n\n[SOLUSI]:\n${item.penyelesaian}\n\n[ATURAN]:\n${item.aturan || '-'}`;
        navigator.clipboard.writeText(text);
        setCopiedId(item.id);
        toast.success('Solusi kasus berhasil disalin!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <>
            <Head title="Dashboard Analytics & Rekap Kasus - Taspen" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* 1. Welcome Banner */}
                <DashboardBanner userName={user?.name || 'Petugas'} />

                {/* 2. Stats Overview Cards */}
                <DashboardStats stats={stats} />

                {/* 3. Charts Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <DashboardMonthlyChart
                        monthlyStats={monthlyStats}
                        monthsList={monthsList}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={handleMonthChange}
                    />

                    <DashboardCategoryChart
                        categoryData={categoryData}
                        totalKasus={stats.total_referensi_kasus}
                    />
                </div>

                {/* 4. Case Reference & Search Table */}
                <DashboardCaseSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchCategory={searchCategory}
                    setSearchCategory={setSearchCategory}
                    filteredResults={filteredResults}
                    copiedId={copiedId}
                    onCopySolution={handleCopySolution}
                    onSelectCase={setSelectedCaseDetail}
                />
            </div>

            {/* 5. Detail Modal Dialog */}
            <DashboardCaseModal
                selectedCase={selectedCaseDetail}
                onClose={() => setSelectedCaseDetail(null)}
                onCopySolution={handleCopySolution}
            />

            {/* 6. Floating AI Chatbot with Shadcn Bubble Chat */}
            <DashboardChatbot
                allCases={allCases}
                userName={user?.name}
            />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
