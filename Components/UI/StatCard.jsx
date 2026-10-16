'use client';

import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, label, value, hint, tone = 'brand' }) {
    const tones = {
        brand: 'bg-brand-50 text-brand-600',
        gold: 'bg-gold-50 text-gold-700',
        ink: 'bg-ink-100 text-ink-700',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
    };

    return (
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-ink-500">{label}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-ink-900">{value}</p>
                    {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
                </div>
                {Icon && (
                    <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
                        <Icon className="h-5 w-5" />
                    </span>
                )}
            </div>
        </div>
    );
}
