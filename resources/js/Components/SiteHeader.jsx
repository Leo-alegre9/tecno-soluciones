import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Container from '@/Components/UI/Container';
import Button from '@/Components/UI/Button';
import MobileNavigation from '@/Components/MobileNavigation';
import { cn, waLink } from '@/lib/utils';

const navigation = [
    { name: 'Inicio', href: 'home' },
    { name: 'Catálogo', href: 'catalog.index' },
    { name: 'Servicios', href: 'services.index' },
    { name: 'Nosotros', href: 'about.index' },
    { name: 'Contacto', href: 'contact.index' },
];

export default function SiteHeader({ settings }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const currentHref = navigation.find((item) => route().current(item.href))?.href;

    return (
        <header
            className={cn(
                'sticky top-0 z-40 border-b transition-colors duration-220',
                scrolled ? 'border-border bg-background/85 backdrop-blur-xl' : 'border-transparent bg-background/40 backdrop-blur-sm',
            )}
        >
            <Container className="flex h-16 items-center justify-between gap-6">
                <Link href={route('home')} className="flex shrink-0 items-center gap-2.5">
                    <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-8 w-8" />
                    <span className="font-display text-base font-bold tracking-tight text-foreground">
                        Tecno<span className="text-primary">Soluciones</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
                    {navigation.map((item) => {
                        const active = currentHref === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'rounded-control px-3.5 py-2 text-sm font-medium transition duration-150',
                                    active ? 'bg-white/[0.07] text-foreground' : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground',
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden shrink-0 lg:block">
                    <Button
                        href={waLink(settings.whatsapp_number, 'Hola Tecno Soluciones! Quiero solicitar un diagnóstico.')}
                        target="_blank"
                        size="sm"
                    >
                        Solicitar diagnóstico
                    </Button>
                </div>

                <button
                    className="rounded-control p-2 text-foreground lg:hidden"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Abrir menú"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </Container>

            <MobileNavigation
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                navigation={navigation}
                currentHref={currentHref}
                whatsappNumber={settings.whatsapp_number}
            />
        </header>
    );
}

export { navigation };
