import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/UI/Container';
import SectionHeader from '@/Components/UI/SectionHeader';
import GradientGlow from '@/Components/UI/GradientGlow';
import Reveal from '@/Components/UI/Reveal';
import Button from '@/Components/UI/Button';
import FeatureCard from '@/Components/UI/FeatureCard';
import ProductCard from '@/Components/ProductCard';
import ServiceCard from '@/Components/ServiceCard';
import HeroVisual from '@/Components/HeroVisual';
import RepairServiceFinder from '@/Components/RepairServiceFinder';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';
import { ShieldCheck, Clock3, Wrench, Sparkles, ArrowRight, Star } from 'lucide-react';

const SERVICE_SIZES = ['lg', 'wide'];
const SERVICE_SPANS = { lg: 'lg:col-span-2 lg:row-span-2', wide: 'lg:col-span-2' };

const WHY_US = [
    { icon: ShieldCheck, title: 'Garantía escrita', text: 'Todo trabajo sale con garantía y respaldo del taller.' },
    { icon: Clock3, title: 'Diagnóstico rápido', text: 'Te decimos qué tiene tu equipo antes de cobrarte nada.' },
    { icon: Wrench, title: 'Técnicos especializados', text: 'Expertos en Apple, Android, notebooks y microelectrónica.' },
    { icon: Star, title: 'Buena reputación', text: 'Comunidad que nos recomienda en Corrientes.' },
];

export default function Home({ featuredProducts, categories, services }) {
    const { settings } = usePage().props;
    const waHref = waLink(settings.whatsapp_number, 'Hola Tecno Soluciones! Quiero hacer una consulta.');

    return (
        <PublicLayout>
            <Head title="Servicio técnico de celulares, notebooks y microelectrónica en Corrientes" />

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
                <GradientGlow position="top-left" tone="brand" className="opacity-50" />
                <GradientGlow position="bottom-right" tone="accent" className="opacity-30" />

                <Container className="relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-1.5 text-xs font-semibold text-accent">
                            <Sparkles className="h-3.5 w-3.5" /> Servicio técnico &amp; microelectrónica
                        </span>

                        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
                            Tu solución rápida y segura en{' '}
                            <span className="text-gradient-brand">reparación</span> y microelectrónica
                        </h1>

                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            Reparamos celulares, notebooks, PC y componentes electrónicos con diagnóstico
                            transparente y repuestos de calidad. Además, vendé equipos y accesorios desde nuestro
                            catálogo online.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button href={waHref} target="_blank" size="lg">
                                <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
                            </Button>
                            <Button href={route('services.index')} variant="outlineDark" size="lg">
                                Ver servicios <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Diagnóstico</dt>
                                <dd className="mt-1 font-display text-lg font-bold text-foreground">Sin cargo</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Garantía</dt>
                                <dd className="mt-1 font-display text-lg font-bold text-foreground">Por escrito</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Atención</dt>
                                <dd className="mt-1 font-display text-lg font-bold text-foreground">Personalizada</dd>
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

            {/* SERVICES — bento */}
            <section className="border-t border-border bg-surface/30 py-16 sm:py-20">
                <Container>
                    <SectionHeader
                        title="Nuestros servicios"
                        description="Trabajos que hacemos todos los días en el taller."
                        action={{ href: route('services.index'), label: 'Ver todos los servicios' }}
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
                            action={{ href: route('catalog.index'), label: 'Ver catálogo completo' }}
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

            {/* WHY US */}
            <section className="border-t border-border bg-surface/30 py-16 sm:py-20">
                <Container>
                    <h2 className="text-center font-display text-2xl font-bold text-foreground sm:text-3xl">
                        ¿Por qué elegir Tecno Soluciones?
                    </h2>

                    <div className="mt-10 grid divide-y divide-border rounded-card border border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                        {WHY_US.map((item) => (
                            <FeatureCard key={item.title} icon={item.icon} title={item.title} description={item.text} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden border-t border-border bg-brand-gradient">
                <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-20" />
                <Container className="relative flex flex-col items-center gap-6 py-16 text-center sm:py-20">
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                        ¿Tenés un equipo con problemas?
                    </h2>
                    <p className="max-w-xl text-white/90">
                        Contanos qué le pasa a tu celular, notebook o equipo y te respondemos al toque por WhatsApp.
                    </p>
                    <Button href={waHref} target="_blank" variant="dark" size="lg">
                        <WhatsAppIcon className="h-5 w-5" /> Escribinos ahora
                    </Button>
                </Container>
            </section>
        </PublicLayout>
    );
}
