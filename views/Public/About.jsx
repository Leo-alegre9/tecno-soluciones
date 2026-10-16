'use client';

import { useSettings } from '@/lib/SettingsContext';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/UI/Container';
import Button from '@/Components/UI/Button';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import InstagramIcon from '@/Components/Icons/InstagramIcon';
import GradientGlow from '@/Components/UI/GradientGlow';
import { waLink } from '@/lib/utils';
import { Cpu, ShieldCheck, Smartphone, MapPin } from 'lucide-react';

const pillars = [
    {
        icon: Smartphone,
        title: 'Especialistas en Apple y Android',
        text: 'Reparamos a fondo iPhone, iPad, Mac y equipos Android: pantallas, baterías, conectores y placas.',
    },
    {
        icon: Cpu,
        title: 'Microelectrónica de precisión',
        text: 'Trabajamos a nivel de componente: microsoldadura, cortos y reparación de placas que otros descartan.',
    },
    {
        icon: ShieldCheck,
        title: 'Transparencia y garantía',
        text: 'Diagnóstico claro, presupuesto antes de reparar y garantía por escrito en cada trabajo.',
    },
];

export default function About() {
    const settings = useSettings();

    return (
        <PublicLayout>
            <section className="relative -mt-[var(--header-h)] overflow-hidden pb-16 pt-[calc(var(--header-h)+4rem)]">
                <GradientGlow position="top-right" tone="brand" className="opacity-30" />
                <Container className="relative max-w-3xl text-center">
                    <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="mx-auto h-12 w-12" />
                    <h1 className="mt-5 font-display text-3xl font-bold text-foreground sm:text-4xl">
                        Somos Tecno Soluciones
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        Un taller de servicio técnico y microelectrónica en Corrientes, enfocado en dar soluciones
                        rápidas, seguras y honestas para tus equipos.
                    </p>
                </Container>
            </section>

            <section className="border-t border-border py-16 sm:py-20">
                <Container>
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-2 lg:items-start">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-foreground">Nuestra misión</h2>
                            <p className="mt-4 leading-relaxed text-muted-foreground">
                                Acercar un servicio técnico confiable a Corrientes: revisamos cada equipo con
                                seriedad, explicamos la falla en criollo y reparamos con repuestos de calidad, ya
                                sea un celular, una notebook, una PC o un componente de microelectrónica.
                            </p>
                            <p className="mt-4 leading-relaxed text-muted-foreground">
                                También ponemos a la venta equipos y accesorios verificados a través de nuestro
                                catálogo, para que renueves tu tecnología con la misma confianza.
                            </p>

                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 font-semibold text-primary transition hover:text-accent"
                            >
                                <InstagramIcon className="h-5 w-5" /> Seguinos en Instagram
                            </a>
                        </div>

                        <div className="rounded-card-lg border border-border bg-surface p-8">
                            <div className="flex items-center gap-2 text-accent">
                                <MapPin className="h-5 w-5" />
                                <span className="text-sm font-semibold uppercase tracking-wide">Encontranos en</span>
                            </div>
                            <p className="mt-3 text-lg font-semibold text-foreground">{settings.address}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{settings.city}</p>
                            <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{settings.schedule}</p>
                            <Button
                                href={waLink(settings.whatsapp_number, 'Hola! Quiero saber más sobre Tecno Soluciones.')}
                                target="_blank"
                                className="mt-6"
                            >
                                <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="border-t border-border bg-surface/30 py-16 sm:py-20">
                <Container>
                    <h2 className="text-center font-display text-2xl font-bold text-foreground">Lo que nos define</h2>
                    <div className="mt-10 grid gap-6 sm:grid-cols-3">
                        {pillars.map((pillar) => (
                            <div key={pillar.title} className="rounded-card border border-border bg-surface p-6 text-center transition duration-180 hover:border-primary/30">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-control bg-brand-gradient text-white">
                                    <pillar.icon className="h-6 w-6" />
                                </span>
                                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                                    {pillar.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">{pillar.text}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="relative overflow-hidden border-t border-border bg-brand-gradient">
                <Container className="relative flex flex-col items-center gap-5 py-14 text-center sm:py-16">
                    <h2 className="font-display text-2xl font-bold text-white">¿Tu equipo necesita reparación?</h2>
                    <Button
                        href={waLink(settings.whatsapp_number, 'Hola! Quiero solicitar un diagnóstico.')}
                        target="_blank"
                        variant="dark"
                        size="lg"
                    >
                        <WhatsAppIcon className="h-5 w-5" /> Solicitar diagnóstico
                    </Button>
                </Container>
            </section>
        </PublicLayout>
    );
}
