'use client';

import Link from 'next/link';
import { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
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

// "Icon slide" hover (after Framer's Icon Slide Button): a white pill grows from
// the right edge to fill the button, the text turns dark and slides left, and
// an arrow slides in. Horizontal padding shrinks by exactly the arrow + gap, so
// the button keeps its width. Enabled with <ButtonEffectProvider slide>.
const SlideContext = createContext(false);

export function ButtonEffectProvider({ slide = true, children }) {
    return <SlideContext.Provider value={slide}>{children}</SlideContext.Provider>;
}

const slideVariants = {
    primary: 'bg-brand-gradient text-white shadow-brand focus-visible:outline-brand-500',
    dark: 'bg-ink-900 text-white focus-visible:outline-ink-900',
    outlineDark: 'border border-white/15 bg-white/5 text-white focus-visible:outline-brand-500',
};

// Arrow 16px + gap 8px = 24px, so px-5 (40px) -> px-2 (16px). lg: 20 + 8 = 28 -> px-7 to px-3.5.
const slideSizes = {
    md: 'px-5 py-2.5 text-sm gap-2 hover:px-2 focus-visible:px-2',
    lg: 'px-7 py-3.5 text-base gap-2 hover:px-3.5 focus-visible:px-3.5',
};

export const SLIDE_ROOT =
    'group/slide relative isolate overflow-hidden rounded-full transition-[padding,color] duration-[400ms] ease-[cubic-bezier(0.44,0,0.56,1)] hover:text-ink-950 focus-visible:text-ink-950';

export function SlideFill() {
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-[calc(100%-2.5rem)] right-2 top-2 -z-10 rounded-full bg-white opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.44,0,0.56,1)] group-hover/slide:bottom-[-10%] group-hover/slide:left-[-10%] group-hover/slide:right-[-10%] group-hover/slide:top-[-10%] group-hover/slide:opacity-100 group-focus-visible/slide:bottom-[-10%] group-focus-visible/slide:left-[-10%] group-focus-visible/slide:right-[-10%] group-focus-visible/slide:top-[-10%] group-focus-visible/slide:opacity-100"
        />
    );
}

export function SlideArrow({ size = 'md' }) {
    const lg = size === 'lg';
    return (
        <span
            aria-hidden="true"
            className={cn(
                '-ml-2 flex w-0 shrink-0 items-center overflow-hidden opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.44,0,0.56,1)] group-hover/slide:ml-0 group-hover/slide:opacity-100 group-focus-visible/slide:ml-0 group-focus-visible/slide:opacity-100',
                lg ? 'group-hover/slide:w-5 group-focus-visible/slide:w-5' : 'group-hover/slide:w-4 group-focus-visible/slide:w-4',
            )}
        >
            <ArrowRight className={cn('shrink-0', lg ? 'h-5 w-5' : 'h-4 w-4')} />
        </span>
    );
}

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
    const slide = useContext(SlideContext) && variant in slideVariants && size in slideSizes;

    const classes = cn(
        'inline-flex items-center justify-center font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        slide
            ? [SLIDE_ROOT, slideVariants[variant], slideSizes[size]]
            : ['rounded-control transition duration-150', variants[variant], sizes[size]],
        className,
    );

    const content = slide ? (
        <>
            <SlideFill />
            {children}
            <SlideArrow size={size} />
        </>
    ) : (
        children
    );

    if (href && /^(https?:|mailto:|tel:)/.test(href)) {
        return (
            <motion.a href={href} rel="noopener noreferrer" className={classes} {...tap} {...props}>
                {content}
            </motion.a>
        );
    }

    if (as === Link || href) {
        return (
            <MotionLink href={href} className={classes} {...tap} {...props}>
                {content}
            </MotionLink>
        );
    }

    return (
        <motion.button type={type} className={classes} {...tap} {...props}>
            {content}
        </motion.button>
    );
}
