import {
    BarChart3,
    BookOpenCheck,
    CheckCircle,
    FileText,
    Search,
    ShieldCheck,
    Sparkles,
    Zap,
} from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WelcomeFeatures() {
    const features = [
        {
            icon: FileText,
            color: 'from-blue-600 to-cyan-500',
            iconColor: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-500/10',
            title: 'Pencatatan Berita Acara Digital',
            description:
                'Penyusunan Berita Acara kendala layanan secara terstruktur dan terstandarisasi, lengkap dengan lampiran nota dinas dan pelacakan status penanganan real-time.',
        },
        {
            icon: BookOpenCheck,
            color: 'from-purple-600 to-pink-500',
            iconColor: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-500/10',
            title: 'Bank Referensi Kasus & SOP',
            description:
                'Kumpulan skenario permasalahan riil layanan peserta ASN & Pensiunan, panduan penyelesaian langkah demi langkah, serta rujukan dasar hukum yang sah.',
        },
        {
            icon: BarChart3,
            color: 'from-indigo-600 to-blue-500',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-500/10',
            title: 'Rekapitulasi & Analytics Tren',
            description:
                'Visualisasi grafik bulanan penanganan kasus, pembagian kategori masalah layanan, dan analisis performa penyelesaian kendala di seluruh cabang.',
        },
        {
            icon: Search,
            color: 'from-emerald-600 to-teal-500',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            title: 'Pencarian Cepat & Salin Solusi',
            description:
                'Cari kasus berdasarkan kata kunci permasalahan atau pasal aturan, lalu salin panduan solusi hanya dengan satu klik untuk efisiensi petugas.',
        },
        {
            icon: ShieldCheck,
            color: 'from-amber-600 to-orange-500',
            iconColor: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-500/10',
            title: 'Akses Berbasis Peran & Keamanan',
            description:
                'Sistem otentikasi aman dengan kontrol hak akses untuk Admin, Supervisor, dan Petugas Layanan guna menjamin kerahasiaan dan integritas data.',
        },
        {
            icon: Zap,
            color: 'from-rose-600 to-red-500',
            iconColor: 'text-rose-600 dark:text-rose-400',
            bgColor: 'bg-rose-500/10',
            title: 'Standarisasi Mutu Layanan Prima',
            description:
                'Memastikan seluruh ASN dan pensiunan mendapatkan perlakuan solusi yang konsisten, adil, dan transparan di seluruh kantor cabang Taspen.',
        },
    ];

    return (
        <section id="fitur" className="py-20 md:py-28">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <Sparkles className="size-3.5 text-blue-600" />
                        Fitur Unggulan Sistem
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        Dirancang Khusus untuk Efisiensi Penanganan Kasus Taspen
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Integrasi menyeluruh antara dokumentasi Berita Acara hukum dan basis pengetahuan penyelesaian kendala layanan pensiun.
                    </p>
                </div>

                {/* Grid of Features */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feat, index) => {
                        const Icon = feat.icon;
                        return (
                            <Card
                                key={index}
                                className="group relative overflow-hidden border-border/70 bg-card/60 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-500/40"
                            >
                                <CardHeader className="space-y-3 pb-2">
                                    <div
                                        className={`size-12 rounded-xl ${feat.bgColor} ${feat.iconColor} flex items-center justify-center transition-transform group-hover:scale-110`}
                                    >
                                        <Icon className="size-6" />
                                    </div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        {feat.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
