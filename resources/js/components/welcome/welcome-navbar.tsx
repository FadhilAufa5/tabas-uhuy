import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpenCheck,
    Layers,
    LogIn,
    Shield,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import type { User } from '@/types';

interface WelcomeNavbarProps {
    user?: User | null;
}

export function WelcomeNavbar({ user }: WelcomeNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <AppLogoIcon className="size-6 fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-extrabold tracking-tight text-foreground flex items-center gap-1.5">
                            TASPEN
                            <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                KASUS & BA
                            </span>
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground leading-none">
                            Portal Layanan & Rekap Kasus
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <a
                        href="#fitur"
                        className="hover:text-foreground transition-colors"
                    >
                        Fitur Utama
                    </a>
                    <a
                        href="#alur-kerja"
                        className="hover:text-foreground transition-colors"
                    >
                        Alur Kerja
                    </a>
                    <a
                        href="#kategori"
                        className="hover:text-foreground transition-colors"
                    >
                        Kategori Layanan
                    </a>
                    <a
                        href="#faq"
                        className="hover:text-foreground transition-colors"
                    >
                        FAQ
                    </a>
                </nav>

                {/* Auth Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link href={dashboard()}>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-600/20 text-xs sm:text-sm font-semibold">
                                Buka Dashboard <ArrowRight className="ml-1.5 size-4" />
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={login()}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs sm:text-sm font-medium"
                                >
                                    <LogIn className="mr-1.5 size-3.5" /> Masuk
                                </Button>
                            </Link>
                            <Link href={register()}>
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm shadow-xs font-medium"
                                >
                                    Daftar Akun
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
