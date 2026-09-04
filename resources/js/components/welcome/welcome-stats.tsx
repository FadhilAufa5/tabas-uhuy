import { Building2, Clock, FileCheck, ShieldCheck } from 'lucide-react';
import React from 'react';

export function WelcomeStats() {
    const stats = [
        {
            icon: FileCheck,
            value: '100%',
            label: 'Digitalisasi Berita Acara',
            desc: 'Pencatatan nota dinas & dokumen penanganan tanpa kertas',
        },
        {
            icon: Clock,
            value: '< 2 Menit',
            label: 'Pencarian Solusi Kasus',
            desc: 'Akses cepat ke ratusan skenario & panduan SOP teruji',
        },
        {
            icon: Building2,
            value: '54+',
            label: 'Kantor Cabang Terhubung',
            desc: 'Standarisasi penanganan kasus di seluruh Indonesia',
        },
        {
            icon: ShieldCheck,
            value: '24/7',
            label: 'Kesiapan Akses Regulasi',
            desc: 'Dasar hukum PP & Perdir Taspen selalu mutakhir',
        },
    ];

    return (
        <section className="border-y border-border/60 bg-muted/20 py-12">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {stats.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center p-4 rounded-xl transition-transform hover:-translate-y-1"
                            >
                                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Icon className="size-5" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                                    {item.value}
                                </div>
                                <div className="text-sm font-semibold text-foreground mt-0.5">
                                    {item.label}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
