import {
    ArrowRight,
    CheckCircle2,
    FileCheck2,
    FileSearch,
    Send,
    Sparkles,
} from 'lucide-react';
import React from 'react';

export function WelcomeWorkflow() {
    const steps = [
        {
            number: '01',
            icon: FileSearch,
            title: 'Identifikasi Permasalahan',
            desc: 'Petugas menerima kendala layanan dari peserta ASN / Pensiunan (misal: keterlambatan SK Pensiun, mutasi gaji, atau klaim klaim JHT ganda).',
            badge: 'Langkah Awal',
        },
        {
            number: '02',
            icon: Sparkles,
            title: 'Rujukan SOP & Regulasi Kasus',
            desc: 'Cari skenario permasalahan yang serupa di Bank Referensi Kasus untuk mendapatkan panduan langkah solusi resmi dan dasar hukum PP/Perdir.',
            badge: 'Analisis & Rujukan',
        },
        {
            number: '03',
            icon: FileCheck2,
            title: 'Penerbitan Berita Acara & Selesai',
            desc: 'Susun dokumen Berita Acara digital, lampirkan bukti nota dinas/dokumen pendukung, dan simpan status penanganan hingga tuntas 100%.',
            badge: 'Hasil & Arsip',
        },
    ];

    return (
        <section id="alur-kerja" className="border-t border-border/60 bg-muted/20 py-20 md:py-28">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Alur Kerja Penanganan
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        3 Langkah Mudah Selesaikan Kasus Layanan
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Sistem memandu petugas mulai dari pencocokan SOP hingga penerbitan Berita Acara resmi.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 relative">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={idx}
                                className="relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-xs transition-all hover:shadow-lg hover:border-indigo-500/50"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold">
                                        <Icon className="size-6" />
                                    </div>
                                    <span className="font-mono text-3xl font-extrabold text-muted-foreground/30">
                                        {step.number}
                                    </span>
                                </div>

                                <span className="inline-block w-fit rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                    {step.badge}
                                </span>

                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    {step.title}
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
