'use client';

import { useSettings } from '@/lib/SettingsContext';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/UI/Container';
import SectionHeader from '@/Components/UI/SectionHeader';
import GradientGlow from '@/Components/UI/GradientGlow';
import Reveal from '@/Components/UI/Reveal';
import Button from '@/Components/UI/Button';
import TypeText from '@/Components/UI/TypeText';
import ProductCard from '@/Components/ProductCard';
import ServiceCard from '@/Components/ServiceCard';
import HeroVisual from '@/Components/HeroVisual';
import RepairServiceFinder from '@/Components/RepairServiceFinder';
import BrandLogoCarousel from '@/Components/BrandLogoCarousel';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';


const HERO_DEVICES = ['celular', 'notebook', 'PC', 'tablet', 'iPhone', 'parlante'];

const SERVICE_SIZES = ['lg', 'wide'];
const SERVICE_SPANS = { lg: 'lg:col-span-2 lg:row-span-2', wide: 'lg:col-span-2' };

export default function Home({ featuredProducts, categories, services }) {
    const settings = useSettings();
    const waHref = waLink(settings.whatsapp_number, 'Hola Tecno Soluciones! Quiero hacer una consulta.');

    return (
        <PublicLayout>
            {/* HERO */}
            <section className="relative -mt-[var(--header-h)] overflow-hidden pt-[var(--header-h)]">
                <div className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
                <GradientGlow position="top-left" tone="brand" className="opacity-50" />
                <GradientGlow position="bottom-right" tone="accent" className="opacity-30" />

                <Container className="relative grid grid-cols-[minmax(0,1fr)] gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
                    <div className="min-w-0">
                        {/* Fixed line breaks (no hyphenation) so words are never split. */}
                        <h1 className="font-display text-[clamp(1.75rem,9vw,2.25rem)] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl xl:text-[3.5rem]">
                            <span className="block">Reparación rápida</span>
                            <span className="block">y segura para tu</span>
                            <span className="sr-only">{HERO_DEVICES.join(', ')}</span>
                            {/* Own line with a fixed height so the changing word never reflows the heading. */}
                            <span aria-hidden="true" className="block min-h-[1.08em]">
                                <TypeText words={HERO_DEVICES} className="text-gradient-brand" cursorClassName="text-primary" />
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                            Reparamos celulares, notebooks, PC y componentes electrónicos con diagnóstico
                            transparente y repuestos de calidad. Además, vendé equipos y accesorios desde nuestro
                            catálogo online.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button href={waHref} target="_blank" size="lg">
                                <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
                            </Button>
                            <Button href={'/servicios'} variant="outlineDark" size="lg">
                                Ver servicios
                            </Button>
                        </div>

                        <dl className="mt-12 flex flex-wrap gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid sm:grid-cols-3 sm:gap-6">
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Diagnóstico</dt>
                                <dd className="mt-1 font-display text-base font-bold text-foreground sm:text-lg">Sin cargo</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Garantía</dt>
                                <dd className="mt-1 font-display text-base font-bold text-foreground sm:text-lg">Por escrito</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Atención</dt>
                                <dd className="mt-1 font-display text-base font-bold text-foreground sm:text-lg">Personalizada</dd>
                            </div>
                        </dl>
                    </div>

                    <HeroVisual />
                </Container>
            </section>

            {/* SERVICE FINDER */}
            <section className="border-t border-border py-16 sm:py-20">
                <Container>
                    <div className="text-center">
                        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                            ¿Qué necesitás reparar hoy?
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
                            Elegí tu dispositivo y contanos qué problema tiene.
                        </p>
                    </div>

                    <div className="mt-10">
                        <RepairServiceFinder categories={categories} whatsappNumber={settings.whatsapp_number} />
                    </div>
                </Container>
            </section>

            {/* BRANDS */}
            <section className="border-t border-border py-10 sm:py-12">
                <Container className="max-w-5xl">
                    <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Trabajamos con todas las marcas
                    </p>
                    <BrandLogoCarousel className="mt-8" />
                </Container>
            </section>

            {/* SERVICES — bento */}
            <section className="border-t border-border bg-surface/30 py-16 sm:py-20">
                <Container>
                    <SectionHeader
                        title="Nuestros servicios"
                        description="Trabajos que hacemos todos los días en el taller."
                        action={{ href: '/servicios', label: 'Ver todos los servicios' }}
                    />

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]">
                        {services.map((service, index) => {
                            const size = SERVICE_SIZES[index] ?? 'default';
                            return (
                                <Reveal key={service.id} delay={index * 0.04} className={SERVICE_SPANS[size]}>
                                    <ServiceCard service={service} size={size} />
                                </Reveal>
                            );
                        })}
                    </div>
                </Container>
            </section>

            {/* FEATURED PRODUCTS */}
            {featuredProducts.length > 0 && (
                <section className="border-t border-border py-16 sm:py-20">
                    <Container>
                        <SectionHeader
                            title="Productos destacados"
                            description="Equipos y accesorios disponibles ahora."
                            action={{ href: '/catalogo', label: 'Ver catálogo completo' }}
                        />

                        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="w-[72%] shrink-0 snap-center sm:w-auto">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>
            )}
        </PublicLayout>
    );
}
