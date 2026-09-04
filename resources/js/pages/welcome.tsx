import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import {
    WelcomeCategories,
    WelcomeCta,
    WelcomeFaq,
    WelcomeFeatures,
    WelcomeFooter,
    WelcomeHero,
    WelcomeNavbar,
    WelcomeStats,
    WelcomeWorkflow,
} from '@/components/welcome';
import type { User } from '@/types';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth?.user;

    return (
        <>
            <Head title="PT TASPEN (Persero) - Portal Berita Acara & Manajemen Kasus Pensiun" />

            <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-blue-600 selection:text-white">
                {/* 1. Navbar Header */}
                <WelcomeNavbar user={user} />

                {/* 2. Main Landing Page Sections */}
                <main className="flex-1">
                    {/* Hero Section */}
                    <WelcomeHero user={user} />

                    {/* Stats Metric Strip */}
                    <WelcomeStats />

                    {/* Core Features */}
                    <WelcomeFeatures />

                    {/* Workflow 3-Steps */}
                    <WelcomeWorkflow />

                    {/* Case Categories & Topics */}
                    <WelcomeCategories />

                    {/* FAQ */}
                    <WelcomeFaq />

                    {/* Final CTA Banner */}
                    <WelcomeCta user={user} />
                </main>

                {/* 3. Footer */}
                <WelcomeFooter />
            </div>
        </>
    );
}
