import { Link } from '@inertiajs/react';
import { BookOpenCheck, FileCheck2, Sparkles } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface DashboardBannerProps {
    userName?: string;
}

export function DashboardBanner({ userName = 'Petugas' }: DashboardBannerProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-6 md:p-8 text-white shadow-xl">
            <div className="relative z-10 max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
                    <Sparkles className="size-3.5 text-amber-300" />
                    Portal Layanan & Manajemen Kasus Taspen
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Selamat Datang, {userName}!
                </h1>
                <p className="text-sm md:text-base text-blue-100/90 leading-relaxed">
                    Monitor statistik rekapitulasi penanganan kasus layanan pensiun, telusuri referensi SOP hukum, dan kelola dokumen Berita Acara secara terintegrasi.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                    <Link href="/berita-acara">
                        <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-md">
                            <FileCheck2 className="mr-2 size-4" /> Kelola Berita Acara
                        </Button>
                    </Link>
                    <Link href="/referensi-kasus">
                        <Button
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md"
                        >
                            <BookOpenCheck className="mr-2 size-4" /> Database Kasus & SOP
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="absolute -right-10 -bottom-10 size-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        </div>
    );
}
