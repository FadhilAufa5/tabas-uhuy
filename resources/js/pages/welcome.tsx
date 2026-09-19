import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import type { User } from '@/types';

export default function Welcome() {
    const { auth } = usePage<{ auth?: { user?: User | null } }>().props;
    const isAuthenticated = Boolean(auth?.user);

    return (
        <>
            <Head title="TASPEDIA - PT Taspen (Persero)" />

            <div className="relative min-h-screen flex flex-col justify-between bg-white text-slate-800 overflow-hidden font-sans select-none">
                {/* Ambient background glows matching design */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-100/60 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl"
                />

                {/* Top Header */}
                <header className="relative z-10 w-full px-6 py-6 sm:px-12 sm:py-8">
                    <div className="flex items-center gap-3">
                        <img
                            src="/taspediauhuy.png"
                            alt="TASPEDIA Logo"
                            className="h-12 w-12 object-contain"
                        />
                        <div className="flex flex-col">
                            <span className="text-lg sm:text-xl font-bold tracking-wider text-slate-900 leading-tight">
                                TASPEDIA
                            </span>
                            <span className="text-xs sm:text-sm italic font-medium text-slate-500 leading-tight">
                                Satu Kasus, Satu Referensi, Satu Solusi
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Hero Content */}
                <main className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-12 py-8">
                    <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        {/* Left Emblem */}
                        <div className="flex justify-center items-center">
                            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
                                <img
                                    src="/taspediauhuy.png"
                                    alt="TASPEDIA Emblem"
                                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Right Details */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tight text-slate-900">
                                TASPEDIA
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-normal max-w-xl">
                                Platform Pusat Pengetahuan dan Manajemen Kasus Terpadu PT TASPEN (Persero), untuk membantu petugas menghadirkan layanan yang cepat, tepat, dan konsisten bagi seluruh peserta.
                            </p>

                            <div className="pt-2">
                                <Link
                                    href={isAuthenticated ? dashboard().url : login().url}
                                    className="inline-flex items-center justify-center px-10 py-3 rounded-full bg-[#0B3B82] hover:bg-[#082d64] active:bg-[#062047] text-white font-semibold text-base shadow-lg shadow-blue-900/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                    {isAuthenticated ? 'Dashboard' : 'Login'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 w-full py-6 text-center text-xs sm:text-sm font-medium text-slate-500">
                    <p>© 2026 PT Taspen (Persero) - TASPEN Encyclopedia</p>
                </footer>
            </div>
        </>
    );
}
