import {
    CreditCard,
    FileSpreadsheet,
    HelpCircle,
    RotateCcw,
    Scale,
    Shield,
    Users,
    Wrench,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';

export function WelcomeCategories() {
    const categories = [
        {
            name: 'Klaim JHT / JKM / JKK',
            icon: CreditCard,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800/40',
            sampleCases: [
                'Klaim Asuransi Kematian tanpa Ahli Waris Langsung',
                'Klaim Tabungan Hari Tua PNS Mutasi Antar-Daerah',
            ],
        },
        {
            name: 'Kepesertaan & Data ASN',
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-500/10 border-blue-300 dark:border-blue-800/40',
            sampleCases: [
                'Perbedaan NIP / Nama pada SK CPNS dan Dukcapil',
                'Pemutakhiran Status Tanggungan Anak Berkuliah',
            ],
        },
        {
            name: 'Penetapan Hak Pensiun',
            icon: Scale,
            color: 'text-purple-600 dark:text-purple-400',
            bg: 'bg-purple-500/10 border-purple-300 dark:border-purple-800/40',
            sampleCases: [
                'Pensiun Pertama Tertunda karena SK BKN Belum Terbit',
                'Pengalihan Hak Pensiun Janda/Duda Meninggal Dunia',
            ],
        },
        {
            name: 'Mutasi Gaji & Kantor Bayar',
            icon: RotateCcw,
            color: 'text-cyan-600 dark:text-cyan-400',
            bg: 'bg-cyan-500/10 border-cyan-300 dark:border-cyan-800/40',
            sampleCases: [
                'Pindah Kantor Bayar Pensiun Antar-Bank Mitra',
                'Koreksi Tunjangan Beras & Tunjangan Keluarga ASN',
            ],
        },
        {
            name: 'Kendala Teknis & Otentikasi',
            icon: Wrench,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-500/10 border-amber-300 dark:border-amber-800/40',
            sampleCases: [
                'Gagal Otentikasi Biometrik Wajah Penerima Pensiun Uzur',
                'Reset Enrollment enrollment perangkat smartphone',
            ],
        },
        {
            name: 'Administrasi & Hukum',
            icon: Shield,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-500/10 border-indigo-300 dark:border-indigo-800/40',
            sampleCases: [
                'Penanganan Pembatalan SK Pemberhentian PNS',
                'Penyusunan Berita Acara Rekonsiliasi Kas Daerah',
            ],
        },
    ];

    return (
        <section id="kategori" className="py-20 md:py-28">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                        Cakupan Topik Layanan
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        Kategori Kasus yang Siap Ditangani
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Setiap permasalahan telah dipetakan ke dalam kategori dengan regulasi dan panduan penyelesaian terstandarisasi.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <div
                                key={idx}
                                className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-md space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`size-10 rounded-xl flex items-center justify-center ${cat.bg} ${cat.color}`}
                                    >
                                        <Icon className="size-5" />
                                    </div>
                                    <h3 className="font-bold text-base text-foreground">
                                        {cat.name}
                                    </h3>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-border/50">
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        Contoh Kasus Terdaftar:
                                    </span>
                                    <ul className="space-y-1.5">
                                        {cat.sampleCases.map((sample, sIdx) => (
                                            <li
                                                key={sIdx}
                                                className="text-xs text-muted-foreground flex items-start gap-1.5"
                                            >
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>{sample}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
