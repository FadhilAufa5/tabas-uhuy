import { Link } from '@inertiajs/react';
import { Heart, ShieldCheck } from 'lucide-react';
import React from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

export function WelcomeFooter() {
    return (
        <footer className="border-t border-border/60 bg-background py-12 text-muted-foreground">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-8 border-b border-border/40">
                    {/* Col 1: Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <AppLogoIcon className="size-5 fill-current" />
                            </div>
                            <span className="font-bold text-foreground tracking-tight">
                                PT TASPEN (Persero)
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Sistem Manajemen Berita Acara & Bank Solusi Kasus Layanan ASN dan Penerima Pensiun Nasional.
                        </p>
                    </div>

                    {/* Col 2: Navigasi */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                            Navigasi Portal
                        </h4>
                        <ul className="space-y-1.5 text-xs">
                            <li>
                                <a href="#fitur" className="hover:text-foreground transition-colors">
                                    Fitur Utama
                                </a>
                            </li>
                            <li>
                                <a href="#alur-kerja" className="hover:text-foreground transition-colors">
                                    Alur Kerja Kasus
                                </a>
                            </li>
                            <li>
                                <a href="#kategori" className="hover:text-foreground transition-colors">
                                    Kategori Layanan
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="hover:text-foreground transition-colors">
                                    Tanya Jawab (FAQ)
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Modul Layanan */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                            Modul Sistem
                        </h4>
                        <ul className="space-y-1.5 text-xs">
                            <li>
                                <Link href="/berita-acara" className="hover:text-foreground transition-colors">
                                    Kelola Berita Acara
                                </Link>
                            </li>
                            <li>
                                <Link href="/referensi-kasus" className="hover:text-foreground transition-colors">
                                    Bank Referensi Kasus & SOP
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-foreground transition-colors">
                                    Otentikasi & Login Petugas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Keamanan & Kepatuhan */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                            Standar & Kepatuhan
                        </h4>
                        <div className="flex items-start gap-2 text-xs">
                            <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>
                                Terstandarisasi dengan regulasi BKN, KemenPAN-RB, dan Ketentuan Internal PT TASPEN (Persero).
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs">
                    <p>© {new Date().getFullYear()} PT TASPEN (Persero). All rights reserved.</p>
                    <p className="flex items-center gap-1 text-muted-foreground">
                        Taspen Hackathon 2026 • Transformasi Digital Layanan ASN
                    </p>
                </div>
            </div>
        </footer>
    );
}
