import { CheckCircle2, Clock, FileEdit, FileStack, TrendingUp } from 'lucide-react';
import React from 'react';
import type { BeritaAcaraStats } from './types';

interface BaStatsProps {
    stats: BeritaAcaraStats;
}

export function BaStats({ stats }: BaStatsProps) {
    const total = stats.total || 0;
    const selesaiPct = total > 0 ? Math.round((stats.selesai / total) * 100) : 0;
    const prosesPct = total > 0 ? Math.round((stats.dalam_proses / total) * 100) : 0;
    const draftPct = total > 0 ? Math.round((stats.draft / total) * 100) : 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Total */}
            <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-blue-50/40 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-md dark:to-blue-950/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Total Berita Acara
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
                                {stats.total}
                            </span>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                Berkas
                            </span>
                        </div>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/20 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-500/20 dark:text-blue-400">
                        <FileStack className="size-6" />
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <TrendingUp className="size-3.5 text-blue-500" />
                        Seluruh arsip layanan
                    </span>
                    {stats.sudah_ttd !== undefined ? (
                        <span
                            className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                            title={`${stats.sudah_ttd} dari ${total} berkas telah ada foto dokumentasi tanda tangan`}
                        >
                            {stats.sudah_ttd}/{total} TTD
                        </span>
                    ) : (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                            100%
                        </span>
                    )}
                </div>
            </div>

            {/* Card 2: Selesai */}
            <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-emerald-50/40 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-md dark:to-emerald-950/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            Kasus Selesai
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight text-emerald-600 font-mono dark:text-emerald-400">
                                {stats.selesai}
                            </span>
                            <span className="text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">
                                ({selesaiPct}%)
                            </span>
                        </div>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <CheckCircle2 className="size-6" />
                    </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Telah tertangani tuntas</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {stats.selesai} berkas
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${selesaiPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Card 3: Dalam Proses */}
            <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-amber-50/40 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-md dark:to-amber-950/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Dalam Proses
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight text-amber-600 font-mono dark:text-amber-400">
                                {stats.dalam_proses}
                            </span>
                            <span className="text-xs font-medium text-amber-600/80 dark:text-amber-400/80">
                                ({prosesPct}%)
                            </span>
                        </div>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 transition-transform duration-300 group-hover:scale-110 dark:bg-amber-500/20 dark:text-amber-400">
                        <Clock className="size-6" />
                    </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Menunggu tindak lanjut</span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {stats.dalam_proses} berkas
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${prosesPct}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Card 4: Draft */}
            <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-slate-50/40 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-400/30 hover:shadow-md dark:to-slate-900/40">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Draft Arsip
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">
                                {stats.draft}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground">
                                ({draftPct}%)
                            </span>
                        </div>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border transition-transform duration-300 group-hover:scale-110">
                        <FileEdit className="size-6" />
                    </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Belum difinalisasi</span>
                        <span className="font-semibold text-foreground">
                            {stats.draft} berkas
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-slate-400 transition-all duration-500 dark:bg-slate-600"
                            style={{ width: `${draftPct}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
