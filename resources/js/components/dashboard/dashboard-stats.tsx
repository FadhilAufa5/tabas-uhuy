import { BookOpenCheck, CheckCircle2, FileText, Users } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsOverviewProps {
    stats: {
        total_berita_acara: number;
        total_referensi_kasus: number;
        ba_selesai: number;
        total_users: number;
    };
}

export function DashboardStats({ stats }: StatsOverviewProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/70 shadow-xs bg-card/70 backdrop-blur-xs transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Berita Acara
                    </CardTitle>
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                        <FileText className="size-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.total_berita_acara}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Dokumen penanganan kasus</p>
                </CardContent>
            </Card>

            <Card className="border-border/70 shadow-xs bg-card/70 backdrop-blur-xs transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Kasus Tertangani Selesai
                    </CardTitle>
                    <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stats.ba_selesai}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Telah diselesaikan tuntas</p>
                </CardContent>
            </Card>

            <Card className="border-border/70 shadow-xs bg-card/70 backdrop-blur-xs transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Basis Kasus & SOP
                    </CardTitle>
                    <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
                        <BookOpenCheck className="size-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {stats.total_referensi_kasus} Kasus
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Skenario solusi terdaftar</p>
                </CardContent>
            </Card>

            <Card className="border-border/70 shadow-xs bg-card/70 backdrop-blur-xs transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pengguna Sistem
                    </CardTitle>
                    <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
                        <Users className="size-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {stats.total_users} Akun
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Admin & Petugas Layanan</p>
                </CardContent>
            </Card>
        </div>
    );
}
