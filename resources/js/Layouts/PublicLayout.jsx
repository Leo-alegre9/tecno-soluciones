import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Menu, X, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import InstagramIcon from '@/Components/Icons/InstagramIcon';
import WhatsAppFloat from '@/Components/WhatsAppFloat';

const navigation = [
    { name: 'Inicio', href: 'home' },
    { name: 'Catálogo', href: 'catalog.index' },
    { name: 'Servicios', href: 'services.index' },
    { name: 'Nosotros', href: 'about.index' },
    { name: 'Contacto', href: 'contact.index' },
];

export default function PublicLayout({ children }) {
    const { props } = usePage();
    const { settings, flash } = props;
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-ink-950 font-sans text-ink-100">
            <Toaster position="top-center" />

            <header
                className={`sticky top-0 z-30 border-b transition-all ${
                    scrolled
                        ? 'border-white/10 bg-ink-950/90 shadow-lg shadow-black/20 backdrop-blur'
                        : 'border-transparent bg-ink-950/60 backdrop-blur-sm'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link href={route('home')} className="flex items-center gap-2">
                        <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-9 w-9" />
                        <span className="font-display text-lg font-bold tracking-tight text-white">
                            Tecno<span className="text-brand-400">Soluciones</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-8 lg:flex">
                        {navigation.map((item) => {
                            const active = route().current(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className={`text-sm font-medium transition ${
                                        active ? 'text-brand-400' : 'text-ink-300 hover:text-white'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        className="rounded-lg p-2 text-white lg:hidden"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Abrir menú"
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {open && (
                    <div className="border-t border-white/10 bg-ink-950 px-4 py-4 lg:hidden">
                        <nav className="flex flex-col gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    onClick={() => setOpen(false)}
                                    className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                                        route().current(item.href)
                                            ? 'bg-white/10 text-brand-400'
                                            : 'text-ink-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            <main>{children}</main>

            <Footer settings={settings} />
            <WhatsAppFloat />
        </div>
    );
}

function Footer({ settings }) {
    return (
        <footer className="border-t border-white/10 bg-ink-950 text-ink-300">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
                <div>
                    <div className="flex items-center gap-2">
                        <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-9 w-9" />
                        <span className="font-display text-lg font-bold text-white">
                            Tecno<span className="text-brand-400">Soluciones</span>
                        </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ink-400">{settings.bio ?? settings.tagline}</p>
                    <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink-300 hover:text-brand-400"
                    >
                        <InstagramIcon className="h-4 w-4" /> @tecnosoluciones.ctes
                    </a>
                </div>

                <div>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                        Navegación
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <Link href={route(item.href)} className="text-ink-400 hover:text-white">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                        Contacto
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-ink-400">
                        <li className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.address}
                        </li>
                        <li className="flex items-start gap-2">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.phone_display}
                        </li>
                        {settings.email && (
                            <li className="flex items-start gap-2">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.email}
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                        Horarios
                    </h3>
                    <p className="mt-4 flex items-start gap-2 whitespace-pre-line text-sm text-ink-400">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.schedule}
                    </p>
                </div>
            </div>

            <div className="border-t border-white/10 py-6 text-center text-xs text-ink-400">
                © {new Date().getFullYear()} Tecno Soluciones — Servicio Técnico & Microelectrónica. Todos los
                derechos reservados.
            </div>
        </footer>
    );
}
