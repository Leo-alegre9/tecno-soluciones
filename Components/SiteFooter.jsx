'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import Container from '@/Components/UI/Container';
import InstagramIcon from '@/Components/Icons/InstagramIcon';
import { navigation } from '@/Components/SiteHeader';
import { breakableEmail } from '@/lib/utils';

// Scroll-in effect from Framer's "Simple Footer": the brand block and the
// copyright fade in from 97% scale, the link columns rise 60px. It replays
// every time the footer comes back into view.
const transition = { duration: 0.6, ease: [0.12, 0.23, 0.5, 1] };
const viewport = { amount: 0.5, once: false };
const fromScale = { opacity: 0, scale: 0.97 };
const fromBelow = { opacity: 0, y: 60 };
const shown = { opacity: 1, scale: 1, y: 0 };

function Reveal({ from, className, children }) {
    const reducedMotion = useReducedMotion();
    if (reducedMotion) return <div className={className}>{children}</div>;

    return (
        <motion.div className={className} initial={from} whileInView={shown} viewport={viewport} transition={transition}>
            {children}
        </motion.div>
    );
}

export default function SiteFooter({ settings }) {
    return (
        <footer className="border-t border-border bg-background">
            <Container className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
                <Reveal from={fromScale}>
                    <div className="flex items-center gap-2">
                        <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-8 w-8" />
                        <span className="font-display text-base font-bold text-foreground">
                            Tecno<span className="text-primary">Soluciones</span>
                        </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {settings.bio || settings.tagline}
                    </p>
                    <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
                    >
                        <InstagramIcon className="h-4 w-4" /> @tecnosoluciones.ctes
                    </a>
                </Reveal>

                <Reveal from={fromBelow}>
                    <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">
                        Navegación
                    </h3>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                <Reveal from={fromBelow}>
                    <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">
                        Contacto
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {settings.address}
                        </li>
                        <li className="flex items-start gap-2.5">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {settings.phone_display}
                        </li>
                        {settings.email && (
                            <li className="flex items-start gap-2.5">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> <span className="min-w-0 [overflow-wrap:anywhere]">{breakableEmail(settings.email)}</span>
                            </li>
                        )}
                    </ul>
                </Reveal>

                <Reveal from={fromBelow}>
                    <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">
                        Horarios
                    </h3>
                    <p className="mt-4 flex items-start gap-2.5 whitespace-pre-line text-sm text-muted-foreground">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {settings.schedule}
                    </p>
                </Reveal>
            </Container>

            <div className="border-t border-border py-6">
                <Container>
                    <Reveal from={fromScale}>
                        <p className="text-center text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Tecno Soluciones — Servicio Técnico &amp; Microelectrónica.
                            Todos los derechos reservados.
                        </p>
                    </Reveal>
                </Container>
            </div>
        </footer>
    );
}
