import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const variants = {
    primary: 'bg-brand-gradient text-white shadow-brand hover:brightness-110 focus-visible:outline-brand-500',
    dark: 'bg-ink-900 text-white hover:bg-ink-800 focus-visible:outline-ink-900',
    outline: 'border border-ink-200 text-ink-700 hover:border-brand-400 hover:text-brand-600 bg-white',
    outlineDark: 'border border-white/15 text-white bg-white/5 hover:border-brand-400 hover:bg-white/10',
    ghost: 'text-ink-600 hover:bg-ink-100',
    ghostDark: 'text-ink-300 hover:bg-white/10 hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
    subtle: 'bg-ink-100 text-ink-700 hover:bg-ink-200',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2',
};

export default function Button({
    as,
    href,
    variant = 'primary',
    size = 'md',
    className,
    children,
    type = 'button',
    ...props
}) {
    const classes = cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
    );

    const Component = as || (href ? Link : 'button');

    if (Component === Link || href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} {...props}>
            {children}
        </button>
    );
}
