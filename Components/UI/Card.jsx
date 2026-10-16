'use client';

import { cn } from '@/lib/utils';

export default function Card({ className, children, ...props }) {
    return (
        <div
            className={cn('rounded-2xl border border-ink-100 bg-white shadow-sm', className)}
            {...props}
        >
            {children}
        </div>
    );
}
