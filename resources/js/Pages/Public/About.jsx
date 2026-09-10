import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Button from '@/Components/UI/Button';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import InstagramIcon from '@/Components/Icons/InstagramIcon';
import { waLink } from '@/lib/utils';
import { Cpu, ShieldCheck, Smartphone, MapPin } from 'lucide-react';

const values = [
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
    const { settings } = usePage().props;

    return (
        <PublicLayout>
            <Head title="Nosotros" />

            <section className="bg-ink-950 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <img
                        src="/images/brand/isotipo-192.png"
                        alt="Tecno Soluciones"
                        className="mx-auto h-16 w-16"
                    />
                    <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">
                        Somos Tecno Soluciones
                    </h1>
                    <p className="mt-4 text-ink-300">
                        Un taller de servicio técnico y microelectrónica en Corrientes, enfocado en dar soluciones
                        rápidas, seguras y honestas para tus equipos.
                    </p>
                </div>
            </section>

            <section className="border-t border-white/5 bg-ink-950 py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-white">Nuestra misión</h2>
                            <p className="mt-4 leading-relaxed text-ink-300">
                                Acercar un servicio técnico confiable a Corrientes: revisamos cada equipo con
                                seriedad, explicamos la falla en criollo y reparamos con repuestos de calidad, ya
                                sea un celular, una notebook, una PC o un componente de microelectrónica.
                            </p>
                            <p className="mt-4 leading-relaxed text-ink-300">
                                También ponemos a la venta equipos y accesorios verificados a través de nuestro
                                catálogo, para que renueves tu tecnología con la misma confianza.
                            </p>

                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-400 hover:text-brand-300"
                            >
                                <InstagramIcon className="h-5 w-5" /> Seguinos en Instagram
                            </a>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-ink-900 p-8">
                            <div className="flex items-center gap-2 text-gold-300">
                                <MapPin className="h-5 w-5" />
                                <span className="text-sm font-semibold uppercase tracking-wide">Encontranos en</span>
                            </div>
                            <p className="mt-3 text-lg font-semibold text-white">{settings.address}</p>
                            <p className="mt-1 text-sm text-ink-400">{settings.city}</p>
                            <p className="mt-4 whitespace-pre-line text-sm text-ink-300">{settings.schedule}</p>
                            <Button
                                href={waLink(settings.whatsapp_number, 'Hola! Quiero saber más sobre Tecno Soluciones.')}
                                target="_blank"
                                className="mt-6"
                            >
                                <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-white/5 bg-ink-900/40 py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center font-display text-2xl font-bold text-white">Lo que nos define</h2>
                    <div className="mt-10 grid gap-6 sm:grid-cols-3">
                        {values.map((value) => (
                            <div key={value.title} className="rounded-2xl border border-white/10 bg-ink-900 p-6 text-center">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
                                    <value.icon className="h-6 w-6" />
                                </span>
                                <h3 className="mt-4 font-display text-base font-semibold text-white">
                                    {value.title}
                                </h3>
                                <p className="mt-2 text-sm text-ink-400">{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
