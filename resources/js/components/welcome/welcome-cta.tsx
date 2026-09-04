import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpenCheck, Sparkles } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { User } from '@/types';

interface WelcomeCtaProps {
    user?: User | null;
}

export function WelcomeCta({ user }: WelcomeCtaProps) {
    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 md:p-14 text-white shadow-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute -right-16 -bottom-16 size-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                    <div className="absolute -left-16 -top-16 size-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl space-y-5 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="size-3.5 text-amber-300" />
                            Siap Melayani ASN & Pensiunan dengan Prima
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                            Tingkatkan Kualitas & Standarisasi Penanganan Kasus Bersama Taspen
                        </h2>

                        <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                            Mulai catat Berita Acara secara digital, telusuri rujukan solusi kasus hukum, dan pantau rekapitulasi secara akurat hari ini.
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 pt-2">
                            {user ? (
                                <Link href={dashboard()}>
                                    <Button
                                        size="lg"
                                        className="bg-white text-blue-800 hover:bg-blue-50 font-bold shadow-lg shadow-black/10 px-6 h-12"
                                    >
                                        Buka Dashboard Layanan <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button
                                            size="lg"
                                            className="bg-white text-blue-800 hover:bg-blue-50 font-bold shadow-lg shadow-black/10 px-6 h-12"
                                        >
                                            Masuk ke Portal <ArrowRight className="ml-2 size-4" />
                                        </Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md font-semibold h-12"
                                        >
                                            Daftar Petugas Baru
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
