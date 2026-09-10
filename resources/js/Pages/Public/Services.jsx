import { Head, usePage } from '@inertiajs/react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import PublicLayout from '@/Layouts/PublicLayout';
import ServiceCard from '@/Components/ServiceCard';
import Button from '@/Components/UI/Button';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';
import { ChevronDown, ClipboardList, FileText, Wrench, PackageCheck } from 'lucide-react';

const steps = [
    { icon: ClipboardList, title: 'Recepción', text: 'Registramos el equipo, la falla y los accesorios que entregás.' },
    { icon: FileText, title: 'Diagnóstico y presupuesto', text: 'Revisamos el equipo y te avisamos el costo antes de avanzar.' },
    { icon: Wrench, title: 'Reparación', text: 'Trabajamos con repuestos de calidad y técnicos especializados.' },
    { icon: PackageCheck, title: 'Entrega con garantía', text: 'Te devolvemos el equipo funcionando, con garantía por escrito.' },
];

const faqs = [
    {
        q: '¿El diagnóstico tiene costo?',
        a: 'No, el diagnóstico inicial es gratuito. Solo abonás si decidís avanzar con la reparación.',
    },
    {
        q: '¿Qué garantía tienen las reparaciones?',
        a: 'Todos nuestros trabajos incluyen garantía por escrito sobre la falla reparada y los repuestos utilizados.',
    },
    {
        q: '¿Trabajan con todas las marcas?',
        a: 'Sí, atendemos equipos Apple, Samsung, Motorola, Xiaomi, notebooks de todas las marcas y componentes de microelectrónica en general.',
    },
    {
        q: '¿Puedo hacer seguimiento de mi equipo?',
        a: 'Sí, al ingresar tu equipo te damos un código de seguimiento y te vamos avisando el estado por WhatsApp.',
    },
];

export default function Services({ services }) {
    const { settings } = usePage().props;

    return (
        <PublicLayout>
            <Head title="Servicios" />

            <section className="bg-ink-950 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Nuestros servicios</h1>
                    <p className="mt-4 text-ink-300">
                        Reparación y mantenimiento de celulares, notebooks, PC y microelectrónica en general, con
                        diagnóstico transparente y garantía escrita. Tocá un servicio para ver el detalle.
                    </p>
                </div>
            </section>

            <section className="border-t border-white/5 bg-ink-950 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-white/5 bg-ink-900/40 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center font-display text-2xl font-bold text-white sm:text-3xl">
                        ¿Cómo trabajamos?
                    </h2>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={step.title} className="relative rounded-2xl border border-white/10 bg-ink-900 p-6">
                                <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                                    {index + 1}
                                </span>
                                <step.icon className="mt-2 h-6 w-6 text-brand-400" />
                                <h3 className="mt-3 font-display text-sm font-semibold text-white">{step.title}</h3>
                                <p className="mt-2 text-sm text-ink-400">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-white/5 bg-ink-950 py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-center font-display text-2xl font-bold text-white">Preguntas frecuentes</h2>
                    <div className="mt-8 space-y-3">
                        {faqs.map((faq) => (
                            <Disclosure key={faq.q} as="div" className="rounded-xl border border-white/10 bg-ink-900">
                                {({ open }) => (
                                    <>
                                        <DisclosureButton className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white">
                                            {faq.q}
                                            <ChevronDown className={`h-4 w-4 text-ink-400 transition ${open ? 'rotate-180' : ''}`} />
                                        </DisclosureButton>
                                        <DisclosurePanel className="px-5 pb-4 text-sm text-ink-400">
                                            {faq.a}
                                        </DisclosurePanel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-t border-white/5 bg-brand-gradient">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-14 text-center">
                    <h2 className="font-display text-2xl font-bold text-white">¿Listo para reparar tu equipo?</h2>
                    <Button
                        href={waLink(settings.whatsapp_number, 'Hola! Quiero consultar por un servicio técnico.')}
                        target="_blank"
                        variant="dark"
                        size="lg"
                    >
                        <WhatsAppIcon className="h-5 w-5" /> Escribinos por WhatsApp
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
