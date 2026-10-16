'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SectionHeader({ eyebrow, title, description, action, align = 'between', className }) {
    return (
        <div
            className={cn(
                'flex flex-wrap items-end gap-4',
                align === 'between' ? 'justify-between' : 'flex-col items-center text-center',
                className,
            )}
        >
            <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
                {eyebrow && (
                    <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary">
                        {eyebrow}
                    </span>
                )}
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {title}
                </h2>
                {description && <p className="mt-2 text-muted-foreground">{description}</p>}
            </div>

            {action && (
                <Link
                    href={action.href}
                    className="group flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-accent"
                >
                    {action.label}
                    <ArrowRight className="h-4 w-4 transition-transform duration-220 ease-out-soft group-hover:translate-x-0.5" />
                </Link>
            )}
        </div>
    );
}
