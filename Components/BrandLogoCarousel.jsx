'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BRAND_LOGOS } from '@/lib/brandLogos';
import { cn } from '@/lib/utils';

// Row of brand logos where each slot periodically swaps to the next logo with a
// blur + roll-up transition, rippling left to right (after Framer's "Logo Blur
// Carousel"). Logos stay muted and take their brand color on hover.

const SLOTS = 5; // visible on desktop
const MOBILE_SLOTS = 3; // slots beyond this are hidden below `sm`
const INTERVAL_MS = 3000;
const STAGGER_MS = 150;
const BASE_HEIGHT = 34; // px height for a square logo; wider ones get shorter
const BLUR = 'blur(8px)';

const enter = { duration: 0.5, ease: 'easeInOut' };
const exit = { duration: 0.4, ease: 'easeInOut' };

// Same visual weight for every logo: scale height by 1/sqrt(aspect ratio).
function logoSize(aspect) {
    const height = Math.max(12, Math.min(BASE_HEIGHT, BASE_HEIGHT / Math.sqrt(aspect)));
    return { height, width: height * aspect };
}

// Brand colors too dark to read on the dark background fall back to white.
function hoverColor(hex) {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255);
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 0.2 ? '#FAFAFA' : hex;
}

function Logo({ logo }) {
    const { width, height } = logoSize(logo.aspect);
    return (
        <svg
            viewBox={logo.viewBox}
            width={width}
            height={height}
            fill="currentColor"
            className="max-w-full"
            aria-hidden="true"
            focusable="false"
        >
            <path d={logo.path} />
        </svg>
    );
}

export default function BrandLogoCarousel({ logos = BRAND_LOGOS, className }) {
    const containerRef = useRef(null);
    const reducedMotion = useReducedMotion();
    const [slots, setSlots] = useState(() => Array.from({ length: SLOTS }, (_, i) => i));
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(true);
    const [pageVisible, setPageVisible] = useState(true);

    // Only animate while the row is on screen and the tab is visible.
    useEffect(() => {
        const el = containerRef.current;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
        if (el) io.observe(el);
        const onVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    const canCycle = !reducedMotion && !paused && inView && pageVisible && logos.length > SLOTS;

    useEffect(() => {
        if (!canCycle) return undefined;
        let timeouts = [];
        const id = setInterval(() => {
            timeouts = Array.from({ length: SLOTS }, (_, i) =>
                setTimeout(() => {
                    setSlots((prev) => {
                        const next = prev.slice();
                        next[i] = (next[i] + SLOTS) % logos.length;
                        return next;
                    });
                }, i * STAGGER_MS),
            );
        }, INTERVAL_MS);
        return () => {
            clearInterval(id);
            timeouts.forEach(clearTimeout);
        };
    }, [canCycle, logos.length]);

    return (
        <div className={className}>
            {/* The animated row is decorative; screen readers get the full list instead. */}
            <ul className="sr-only">
                {logos.map((logo) => (
                    <li key={logo.name}>{logo.name}</li>
                ))}
            </ul>

            <div
                ref={containerRef}
                aria-hidden="true"
                onPointerEnter={() => setPaused(true)}
                onPointerLeave={() => setPaused(false)}
                className="flex items-center justify-between gap-6 sm:gap-8"
            >
                {slots.map((logoIndex, i) => {
                    const logo = logos[logoIndex % logos.length];
                    return (
                        <div
                            key={i}
                            style={{ '--brand': hoverColor(logo.hex) }}
                            className={cn(
                                'relative h-10 min-w-0 flex-1 items-center justify-center text-ink-400 opacity-70 transition duration-300 hover:text-[color:var(--brand)] hover:opacity-100',
                                i >= MOBILE_SLOTS ? 'hidden sm:flex' : 'flex',
                            )}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={logo.name}
                                    className="flex items-center justify-center"
                                    initial={reducedMotion ? false : { y: '60%', opacity: 0, filter: BLUR }}
                                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                                    exit={reducedMotion ? { opacity: 0 } : { y: '-60%', opacity: 0, filter: BLUR, transition: exit }}
                                    transition={enter}
                                >
                                    <Logo logo={logo} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
