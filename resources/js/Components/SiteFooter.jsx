import { Link } from '@inertiajs/react';
import { MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react';
import Container from '@/Components/UI/Container';
import Button from '@/Components/UI/Button';
import InstagramIcon from '@/Components/Icons/InstagramIcon';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';
import { navigation } from '@/Components/SiteHeader';

export default function SiteFooter({ settings }) {
    return (
        <footer className="border-t border-border bg-background">
            <div className="border-b border-border bg-surface/60">
                <Container className="flex flex-col items-center gap-5 py-14 text-center">
                    <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                        ¿Necesitás reparar tu equipo?
                    </h2>
                    <p className="max-w-xl text-muted-foreground">
                        Contanos qué le pasa y te respondemos por WhatsApp con el diagnóstico.
                    </p>
                    <Button
                        href={waLink(settings.whatsapp_number, 'Hola Tecno Soluciones! Quiero solicitar un diagnóstico.')}
                        target="_blank"
                        size="lg"
                    >
                        <WhatsAppIcon className="h-5 w-5" /> Solicitar diagnóstico
                    </Button>
                </Container>
            </div>

            <Container className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
                <div>
                    <div className="flex items-center gap-2">
                        <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-8 w-8" />
                        <span className="font-display text-base font-bold text-foreground">
                            Tecno<span className="text-primary">Soluciones</span>
                        </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {settings.bio ?? settings.tagline}
                    </p>
                    <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
                    >
                        <InstagramIcon className="h-4 w-4" /> @tecnosoluciones.ctes
                    </a>
                </div>

                <div>
                    <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">
                        Navegación
                    </h3>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {navigation.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={route(item.href)}
                                    className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
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
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {settings.email}
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">
                        Horarios
                    </h3>
                    <p className="mt-4 flex items-start gap-2.5 whitespace-pre-line text-sm text-muted-foreground">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {settings.schedule}
                    </p>
                </div>
            </Container>

            <div className="border-t border-border py-6">
                <Container>
                    <p className="text-center text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Tecno Soluciones — Servicio Técnico &amp; Microelectrónica. Todos
                        los derechos reservados.
                    </p>
                </Container>
            </div>
        </footer>
    );
}
