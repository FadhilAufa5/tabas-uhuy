import { ChevronDown, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';

export function WelcomeFaq() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const faqs = [
        {
            q: 'Apa fungsi utama dari Sistem Berita Acara & Basis Kasus Taspen ini?',
            a: 'Sistem ini berfungsi sebagai platform terpadu bagi petugas layanan PT TASPEN (Persero) untuk mencatat dokumen Berita Acara penyelesaian kendala peserta, sekaligus menyediakan bank data rujukan SOP dan dasar hukum penanganan kasus layanan ASN dan pensiunan.',
        },
        {
            q: 'Bagaimana cara mencari solusi dari kasus layanan yang sedang dihadapi?',
            a: 'Petugas dapat menggunakan fitur pencarian cepat pada menu Referensi Kasus atau Dashboard. Cukup ketikkan kata kunci permasalahan, nama kategori, atau pasal regulasi. Sistem akan menampilkan langkah penyelesaian beserta tombol "Salin Solusi" instan.',
        },
        {
            q: 'Apakah dokumen Berita Acara dapat dilampiri berkas nota dinas pendukung?',
            a: 'Ya, formulir Berita Acara mendukung pengunggahan berkas digital (PDF/DOC/Gambar) sebagai nota dinas atau bukti kronologis penanganan kendala yang aman dan tersimpan di server.',
        },
        {
            q: 'Siapa saja yang memiliki hak akses ke dalam sistem?',
            a: 'Sistem menerapkan kontrol akses berbasis peran (Role-Based Access Control). Petugas Layanan dapat mengelola Berita Acara dan melihat SOP, sedangkan Administrator memiliki wewenang tambahan untuk mengelola pengguna, peran, dan bank data kasus master.',
        },
        {
            q: 'Apakah data statistik rekapitulasi dapat dipantau secara real-time?',
            a: 'Ya, Dashboard utama menyajikan grafik tren penanganan bulanan, persentase kategori masalah, serta status penyelesaian kasus yang diperbarui secara otomatis secara real-time.',
        },
    ];

    return (
        <section id="faq" className="border-t border-border/60 bg-muted/20 py-20 md:py-28">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <HelpCircle className="size-3.5" />
                        Tanya Jawab Seputar Sistem
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        Pertanyaan yang Sering Diajukan (FAQ)
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Informasi lengkap mengenai penggunaan portal, pencatatan berita acara, dan referensi kasus SOP.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className="rounded-xl border border-border/80 bg-card overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-foreground hover:text-blue-600 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                                            isOpen ? 'rotate-180 text-blue-600' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
