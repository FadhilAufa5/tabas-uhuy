import { CheckCircle2, Clock, FileText, Layers } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BeritaAcaraStats } from './types';

interface BaStatsProps {
    stats: BeritaAcaraStats;
}

export function BaStats({ stats }: BaStatsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Berita Acara
                    </CardTitle>
                    <Layers className="size-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">Dokumen terdaftar</p>
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Status Selesai
                    </CardTitle>
                    <CheckCircle2 className="size-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stats.selesai}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Telah tertangani tuntas</p>
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Dalam Proses
                    </CardTitle>
                    <Clock className="size-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {stats.dalam_proses}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Menunggu tindak lanjut</p>
                </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs bg-card/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Draft
                    </CardTitle>
                    <FileText className="size-4 text-neutral-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-neutral-600 dark:text-neutral-300">
                        {stats.draft}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Belum difinalisasi</p>
                </CardContent>
            </Card>
        </div>
    );
}
