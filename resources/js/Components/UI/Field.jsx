import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export function Field({ label, error, hint, required, className, theme = 'light', children }) {
    const dark = theme === 'dark';

    return (
        <label className={cn('block', className)}>
            {label && (
                <span className={cn('mb-1.5 block text-sm font-medium', dark ? 'text-ink-200' : 'text-ink-700')}>
                    {label} {required && <span className="text-brand-400">*</span>}
                </span>
            )}
            {children}
            {hint && !error && (
                <span className={cn('mt-1.5 block text-xs', dark ? 'text-ink-500' : 'text-ink-400')}>{hint}</span>
            )}
            {error && <span className="mt-1.5 block text-xs font-medium text-red-400">{error}</span>}
        </label>
    );
}

const baseInput =
    'block w-full rounded-control text-sm shadow-sm transition duration-150 disabled:cursor-not-allowed disabled:opacity-60';

const toneClasses = {
    light: 'border-ink-200 text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:ring-brand-500',
    dark:
        'border-white/10 bg-white/5 text-white placeholder:text-ink-500 focus:border-brand-500 focus:ring-brand-500/40 focus-visible:outline-none',
};

const errorClasses = {
    light: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    dark: 'border-red-500/50 focus:border-red-500 focus:ring-red-500/40',
};

export const Input = forwardRef(function Input({ className, error, theme = 'light', ...props }, ref) {
    return (
        <input
            ref={ref}
            className={cn(baseInput, toneClasses[theme], error && errorClasses[theme], className)}
            aria-invalid={Boolean(error)}
            {...props}
        />
    );
});

export const Textarea = forwardRef(function Textarea({ className, error, theme = 'light', ...props }, ref) {
    return (
        <textarea
            ref={ref}
            className={cn(baseInput, toneClasses[theme], error && errorClasses[theme], className)}
            aria-invalid={Boolean(error)}
            {...props}
        />
    );
});

export function Select({ className, error, theme = 'light', children, ...props }) {
    return (
        <select
            className={cn(baseInput, toneClasses[theme], 'pr-10', error && errorClasses[theme], className)}
            aria-invalid={Boolean(error)}
            {...props}
        >
            {children}
        </select>
    );
}

export function Checkbox({ className, label, theme = 'light', ...props }) {
    const dark = theme === 'dark';
    return (
        <label className={cn('inline-flex items-center gap-2 text-sm', dark ? 'text-ink-200' : 'text-ink-700', className)}>
            <input
                type="checkbox"
                className={cn(
                    'rounded text-brand-500 focus:ring-brand-500',
                    dark ? 'border-white/20 bg-white/5' : 'border-ink-300',
                )}
                {...props}
            />
            {label}
        </label>
    );
}
