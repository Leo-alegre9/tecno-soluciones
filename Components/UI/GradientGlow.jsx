'use client';

import { cn } from '@/lib/utils';

const positions = {
    'top-left': '-left-24 -top-24',
    'top-right': '-right-24 -top-24',
    'bottom-left': '-left-24 -bottom-24',
    'bottom-right': '-right-24 -bottom-24',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
};

const tones = {
    brand: 'bg-primary/20',
    accent: 'bg-accent/15',
};

/**
 * Purely decorative ambient blur — aria-hidden, no layout impact.
 */
export default function GradientGlow({ position = 'top-right', tone = 'brand', size = 'h-96 w-96', className }) {
    return (
        <div
            aria-hidden="true"
            className={cn('pointer-events-none absolute rounded-full blur-3xl', positions[position], tones[tone], size, className)}
        />
    );
}
