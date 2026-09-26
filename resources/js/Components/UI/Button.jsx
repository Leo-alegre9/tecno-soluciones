import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

const MotionLink = motion.create(Link);

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
    const shouldReduceMotion = useReducedMotion();
    const tap = shouldReduceMotion ? {} : { whileTap: { scale: 0.97 } };

    const classes = cn(
        'inline-flex items-center justify-center rounded-control font-semibold transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
    );

    const Component = as || (href ? Link : 'button');

    if (Component === Link || href) {
        return (
            <MotionLink href={href} className={classes} {...tap} {...props}>
                {children}
            </MotionLink>
        );
    }

    return (
        <motion.button type={type} className={classes} {...tap} {...props}>
            {children}
        </motion.button>
    );
}
