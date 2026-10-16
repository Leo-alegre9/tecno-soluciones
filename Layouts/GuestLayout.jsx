'use client';

import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
            <Toaster position="top-center" />
            <div className="pointer-events-none absolute inset-0 bg-brand-gradient-radial" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

            <Link href="/" className="relative mb-8 flex items-center gap-2">
                <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-10 w-10" />
                <span className="font-display text-xl font-bold text-white">
                    Tecno<span className="text-brand-400">Soluciones</span>
                </span>
            </Link>

            <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">{children}</div>
        </div>
    );
}
