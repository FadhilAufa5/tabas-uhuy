import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpenCheck,
    CheckCircle2,
    FileCheck2,
    Scale,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard, login } from '@/routes';
import type { User } from '@/types';

interface WelcomeHeroProps {
    user?: User | null;
}

export function WelcomeHero({ user }: WelcomeHeroProps) {
    return (
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
            {/* Background Decorative Gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[450px] w-[700px] rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/10 blur-3xl" />
            <div className="absolute top-10 right-10 -z-10 size-72 rounded-full bg-cyan-500/15 blur-3xl" />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                    {/* Left Column: Headline & Action */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        {/* Innovation Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 backdrop-blur-xs">
                            <Sparkles className="size-3.5 text-amber-500" />
                            <span>TASPEN HACKATHON 2026 • DIGITALISASI LAYANAN ASN</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                            Solusi Cerdas Pengelolaan{' '}
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Berita Acara & Bank Kasus
                            </span>{' '}
                            Layanan Pensiun
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Ayo awali hari ini dengan senyuman dan jangan lupa selalu berikan layanan prima.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                            {user ? (
                                <Link href={dashboard()}>
                                    <Button
                                        size="lg"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 px-6 h-12"
                                    >
                                        Buka Dashboard Saya <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button
                                        size="lg"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/25 px-6 h-12"
                                    >
                                        Masuk ke Portal Layanan <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>
                            )}

                            <a href="#kategori">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-border bg-background/60 hover:bg-muted/80 backdrop-blur-xs font-medium h-12"
                                >
                                    <BookOpenCheck className="mr-2 size-4 text-purple-600" />
                                    Lihat Basis Kasus & SOP
                                </Button>
                            </a>
                        </div>

                        {/* Trust Checkmarks */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>Sesuai Regulasi & PP Pensiun</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>Pencatatan Berita Acara Terenkripsi</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>Audit Trail Multi-Petugas</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Card Preview */}
                    <div className="lg:col-span-5">
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            {/* Glow behind card */}
                            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl" />

                            <div className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-md space-y-4">
                                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-red-500" />
                                        <div className="size-3 rounded-full bg-amber-500" />
                                        <div className="size-3 rounded-full bg-emerald-500" />
                                        <span className="text-[11px] font-mono text-muted-foreground ml-1">
                                            BA-TASPEN-LIVE.ID
                                        </span>
                                    </div>
                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 text-[10px] font-semibold">
                                        ● Online System
                                    </Badge>
                                </div>

                                {/* Preview Item 1 */}
                                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                            KS-KLM-001
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-semibold">
                                            Kategori: Klaim JHT
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-foreground">
                                        PNS Wafat sebelum BUP tanpa Ahli Waris Terdaftar
                                    </p>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                                        Solusi: Verifikasi Surat Keterangan Ahli Waris dari Kelurahan/Kecamatan dan Penetapan Pengadilan Negeri sesuai SOP Taspen No. 42/2024.
                                    </p>
                                </div>

                                {/* Preview Item 2 */}
                                <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-300">
                                            <FileCheck2 className="size-3.5" />
                                            Berita Acara Terbit
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                            Status: Selesai
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        NOTAS/2026/03/0089 - Rekonsiliasi Hak Pensiun Pertama Gol. IV/a
                                    </p>
                                    <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground border-t border-border/40">
                                        <span>Petugas: Layanan Cabang Utama</span>
                                        <span>Hari ini, 10:45 WIB</span>
                                    </div>
                                </div>

                                {/* Live Metrics Strip */}
                                <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <div className="text-sm font-bold text-foreground">
                                            &lt; 5 Menit
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            Waktu Rujukan SOP
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            100% Akurat
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            Kesesuaian Regulasi
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
