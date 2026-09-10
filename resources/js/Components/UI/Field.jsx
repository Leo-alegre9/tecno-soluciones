import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export function Field({ label, error, hint, required, className, children }) {
    return (
        <label className={cn('block', className)}>
            {label && (
                <span className="mb-1.5 block text-sm font-medium text-ink-700">
                    {label} {required && <span className="text-brand-500">*</span>}
                </span>
            )}
            {children}
            {hint && !error && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
            {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
        </label>
    );
}

const baseInput =
    'block w-full rounded-xl border-ink-200 text-ink-900 placeholder:text-ink-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm';

export const Input = forwardRef(function Input({ className, error, ...props }, ref) {
    return (
        <input
            ref={ref}
            className={cn(baseInput, error && 'border-red-300 focus:border-red-500 focus:ring-red-500', className)}
            {...props}
        />
    );
});

export const Textarea = forwardRef(function Textarea({ className, error, ...props }, ref) {
    return (
        <textarea
            ref={ref}
            className={cn(baseInput, error && 'border-red-300 focus:border-red-500 focus:ring-red-500', className)}
            {...props}
        />
    );
});

export function Select({ className, error, children, ...props }) {
    return (
        <select
            className={cn(baseInput, 'pr-10', error && 'border-red-300 focus:border-red-500 focus:ring-red-500', className)}
            {...props}
        >
            {children}
        </select>
    );
}

export function Checkbox({ className, label, ...props }) {
    return (
        <label className={cn('inline-flex items-center gap-2 text-sm text-ink-700', className)}>
            <input
                type="checkbox"
                className="rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                {...props}
            />
            {label}
        </label>
    );
}
