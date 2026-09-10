import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Button from '@/Components/UI/Button';
import ProductCard from '@/Components/ProductCard';
import ServiceCard from '@/Components/ServiceCard';
import DynamicIcon from '@/Components/DynamicIcon';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';
import { ShieldCheck, Clock3, Wrench, Sparkles, ArrowRight, Star } from 'lucide-react';

export default function Home({ featuredProducts, categories, services }) {
    const { settings } = usePage().props;
    const waHref = waLink(settings.whatsapp_number, 'Hola Tecno Soluciones! Quiero hacer una consulta.');

    return (
        <PublicLayout>
            <Head title="Servicio técnico de celulares, notebooks y microelectrónica en Corrientes" />

            {/* HERO */}
            <section className="relative overflow-hidden bg-ink-950">
                <div className="pointer-events-none absolute inset-0 bg-brand-gradient-radial" />
                <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold-300">
                            <Sparkles className="h-3.5 w-3.5" /> Especialistas en ecosistema Apple &amp; Android
                        </span>

                        <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                            Tu solución rápida y segura en{' '}
                            <span className="bg-brand-gradient bg-clip-text text-transparent">reparación</span> y
                            microelectrónica
                        </h1>

                        <p className="mt-5 max-w-xl text-lg text-ink-300">
                            Reparamos celulares, notebooks, PC y componentes electrónicos con diagnóstico
                            transparente y repuestos de calidad. Además, vendé equipos y accesorios desde nuestro
                            catálogo online.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button href={waHref} target="_blank" size="lg">
                                <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
                            </Button>
                            <Button href={route('catalog.index')} variant="outlineDark" size="lg">
                                Ver catálogo <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-ink-400">Diagnóstico</dt>
                                <dd className="mt-1 font-display text-lg font-bold text-white">Sin cargo</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-ink-400">Garantía</dt>
                                <dd className="mt-1 font-display text-lg font-bold text-white">Por escrito</dd>
                            </div>
                            <div>
                                <dt className="text-xs uppercase tracking-wide text-ink-400">Entrega</dt>
                                <dd className="mt-1 font-display text-lg font-bold text-white">Rápida</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="relative mx-auto flex w-full max-w-md items-center justify-center">
                        <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-brand-gradient opacity-25 blur-3xl" />
                        <img
                            src="/images/brand/logo-principal.png"
                            alt="Tecno Soluciones"
                            className="relative w-72 max-w-full drop-shadow-2xl sm:w-96"
                        />
                    </div>
                </div>
            </section>

            {/* CATEGORIES -> derive to consultation */}
            <section className="border-t border-white/5 bg-ink-950 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                                ¿Qué necesitás reparar hoy?
                            </h2>
                            <p className="mt-2 text-ink-400">Elegí una categoría y contanos qué le pasa a tu equipo.</p>
                        </div>
                        <Link
                            href={route('catalog.index')}
                            className="flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-300"
                        >
                            Ver catálogo de productos <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={route('contact.index', { asunto: category.name })}
                                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-ink-900 p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-brand"
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-brand-400 transition group-hover:bg-brand-gradient group-hover:text-white">
                                    <DynamicIcon name={category.icon} className="h-6 w-6" />
                                </span>
                                <span className="text-sm font-medium text-ink-100">{category.name}</span>
                                <span className="text-xs text-ink-400">Consultar</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="border-t border-white/5 bg-ink-900/40 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                                Nuestros servicios
                            </h2>
                            <p className="mt-2 text-ink-400">Trabajos que hacemos todos los días en el taller.</p>
                        </div>
                        <Link
                            href={route('services.index')}
                            className="flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-300"
                        >
                            Ver todos los servicios <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            {featuredProducts.length > 0 && (
                <section className="border-t border-white/5 bg-ink-950 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                                    Productos destacados
                                </h2>
                                <p className="mt-2 text-ink-400">Equipos y accesorios disponibles ahora.</p>
                            </div>
                            <Link
                                href={route('catalog.index')}
                                className="flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-300"
                            >
                                Ver catálogo completo <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* WHY US */}
            <section className="border-t border-white/5 bg-ink-900/40 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
                        ¿Por qué elegir Tecno Soluciones?
                    </h2>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: ShieldCheck, title: 'Garantía escrita', text: 'Todo trabajo sale con garantía y respaldo del taller.' },
                            { icon: Clock3, title: 'Diagnóstico rápido', text: 'Te decimos qué tiene tu equipo antes de cobrarte nada.' },
                            { icon: Wrench, title: 'Técnicos especializados', text: 'Expertos en Apple, Android, notebooks y microelectrónica.' },
                            { icon: Star, title: 'Buena reputación', text: 'Comunidad que nos recomienda en Corrientes.' },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl border border-white/10 bg-ink-900 p-6">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
                                    <item.icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-4 font-display text-base font-semibold text-white">{item.title}</h3>
                                <p className="mt-2 text-sm text-ink-400">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/5 bg-brand-gradient">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
                    <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                        ¿Tenés un equipo con problemas?
                    </h2>
                    <p className="max-w-xl text-white/90">
                        Contanos qué le pasa a tu celular, notebook o equipo y te respondemos al toque por WhatsApp.
                    </p>
                    <Button href={waHref} target="_blank" variant="dark" size="lg">
                        <WhatsAppIcon className="h-5 w-5" /> Escribinos ahora
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
