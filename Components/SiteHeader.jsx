'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { SLIDE_ROOT, SlideArrow, SlideFill } from '@/Components/UI/Button';
import { cn, waLink } from '@/lib/utils';

const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
];

const spring = { type: 'spring', bounce: 0.15, duration: 0.45 };

// Liquid-glass surfaces, adapted from the Framer "Liquid Glass Navbar" to the dark brand palette.
const rimStyle = {
    background:
        'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 10%, rgba(255,255,255,0.04) 45%, rgba(241,84,28,0.22) 85%, rgba(255,255,255,0.24) 100%)',
    boxShadow:
        '0 4px 2px rgba(0,0,0,0.04), 0 12px 6px rgba(0,0,0,0.08), 0 33px 16px rgba(0,0,0,0.12), 0 60px 30px rgba(0,0,0,0.2)',
};

const contentStyle = {
    background: 'linear-gradient(150deg, rgba(24,24,28,0.86) 0%, rgba(12,12,14,0.78) 50%, rgba(26,26,30,0.86) 100%)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.07), inset 0 -1px 1.5px rgba(0,0,0,0.6)',
};

const glassPillShadow =
    'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 20px -6px rgba(241,84,28,0.28), -3px -3px 10px rgba(255,255,255,0.03)';

const ctaStyle = {
    backgroundImage: 'linear-gradient(135deg, #F1541C 0%, #F0A93B 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 1px rgba(0,0,0,0.25), 0 7px 16px -6px rgba(241,84,28,0.55)',
};

const diagnosisMessage = 'Hola Tecno Soluciones! Quiero solicitar un diagnóstico.';

function GlassCTA({ href, className, onClick }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            style={ctaStyle}
            className={cn(
                SLIDE_ROOT,
                'items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-[0.01em] text-white hover:px-2 focus-visible:px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
                className,
            )}
        >
            <SlideFill />
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Solicitar diagnóstico</span>
            <SlideArrow />
        </a>
    );
}

export default function SiteHeader({ settings }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const navRef = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setOpen(false), [pathname]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        const onPointer = (e) => navRef.current && !navRef.current.contains(e.target) && setOpen(false);
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onPointer);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onPointer);
        };
    }, [open]);

    const currentHref = navigation.find((item) => (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)))?.href;
    const highlighted = hovered ?? currentHref;
    const ctaHref = waLink(settings.whatsapp_number, diagnosisMessage);

    return (
        <MotionConfig reducedMotion="user" transition={spring}>
            <header className="sticky top-0 z-40 px-2 pt-3 min-[360px]:px-3 sm:px-4 sm:pt-4">
                <motion.nav
                    ref={navRef}
                    layout
                    aria-label="Navegación principal"
                    style={{ ...rimStyle, borderRadius: open ? 30 : 999 }}
                    className={cn(
                        'mx-auto w-full max-w-[1000px] p-[3px] backdrop-blur-xl transition-opacity duration-220',
                        scrolled || open ? 'opacity-100' : 'opacity-95',
                    )}
                >
                    <motion.div
                        layout
                        style={{ ...contentStyle, borderRadius: open ? 27 : 999 }}
                        className="py-2 pl-3.5 pr-2"
                    >
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <Link href="/" className="flex min-w-0 items-center gap-2 pl-1">
                                <img src="/images/brand/isotipo-192.png" alt="" className="h-7 w-7 shrink-0" />
                                <span className="truncate font-display text-[15px] font-bold tracking-tight text-foreground">
                                    Tecno<span className="text-primary">Soluciones</span>
                                </span>
                            </Link>

                            {/* Desktop links */}
                            <ul className="hidden min-w-0 items-center gap-0.5 lg:flex xl:gap-1" onMouseLeave={() => setHovered(null)}>
                                {navigation.map((item) => {
                                    const active = currentHref === item.href;
                                    return (
                                        <li key={item.href} className="relative">
                                            {highlighted === item.href && (
                                                <motion.span
                                                    layoutId="nav-glass-pill"
                                                    aria-hidden="true"
                                                    className="absolute inset-0 rounded-full bg-white/[0.07]"
                                                    style={{ boxShadow: glassPillShadow }}
                                                />
                                            )}
                                            <Link
                                                href={item.href}
                                                aria-current={active ? 'page' : undefined}
                                                onMouseEnter={() => setHovered(item.href)}
                                                onFocus={() => setHovered(item.href)}
                                                onBlur={() => setHovered(null)}
                                                className={cn(
                                                    'relative block whitespace-nowrap px-3.5 py-2.5 text-sm xl:px-4 font-medium tracking-[0.01em] transition-colors duration-150',
                                                    highlighted === item.href ? 'text-foreground' : 'text-muted-foreground',
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            <GlassCTA href={ctaHref} className="hidden shrink-0 lg:inline-flex" />

                            {/* Mobile toggle */}
                            <motion.button
                                type="button"
                                onClick={() => setOpen((v) => !v)}
                                whileTap={{ scale: 0.9 }}
                                aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                                aria-expanded={open}
                                aria-controls="mobile-nav"
                                className="relative h-10 w-10 shrink-0 rounded-full bg-white/[0.07] lg:hidden"
                                style={{ boxShadow: glassPillShadow }}
                            >
                                <motion.span
                                    aria-hidden="true"
                                    className="absolute left-[11px] h-0.5 w-[18px] rounded-sm bg-foreground"
                                    animate={open ? { top: 19, rotate: 45 } : { top: 15, rotate: 0 }}
                                />
                                <motion.span
                                    aria-hidden="true"
                                    className="absolute left-[11px] h-0.5 w-[18px] rounded-sm bg-foreground"
                                    animate={open ? { top: 19, rotate: -45 } : { top: 23, rotate: 0 }}
                                />
                            </motion.button>
                        </div>

                        {/* Mobile panel */}
                        <AnimatePresence initial={false}>
                            {open && (
                                <motion.div
                                    id="mobile-nav"
                                    key="mobile-nav"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden lg:hidden"
                                >
                                    <ul className="flex flex-col gap-0.5 pt-3.5">
                                        {navigation.map((item) => {
                                            const active = currentHref === item.href;
                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        aria-current={active ? 'page' : undefined}
                                                        onClick={() => setOpen(false)}
                                                        style={active ? { boxShadow: glassPillShadow } : undefined}
                                                        className={cn(
                                                            'flex min-h-[44px] items-center rounded-full px-4 text-[15px] font-medium transition-colors',
                                                            active
                                                                ? 'bg-white/[0.07] text-foreground'
                                                                : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground',
                                                        )}
                                                    >
                                                        {item.name}
                                                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <GlassCTA href={ctaHref} onClick={() => setOpen(false)} className="mt-3 mb-1 flex min-h-[44px] w-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.nav>
            </header>
        </MotionConfig>
    );
}

export { navigation };
