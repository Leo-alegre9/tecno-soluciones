import { Head, usePage } from '@inertiajs/react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/UI/Container';
import Reveal from '@/Components/UI/Reveal';
import ServiceCard from '@/Components/ServiceCard';
import Button from '@/Components/UI/Button';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';
import { ChevronDown, ClipboardList, FileText, Wrench, PackageCheck } from 'lucide-react';

const SERVICE_SIZES = ['lg', 'wide'];
const SERVICE_SPANS = { lg: 'lg:col-span-2 lg:row-span-2', wide: 'lg:col-span-2' };

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

            <section className="py-16 sm:py-20">
                <Container className="max-w-3xl text-center">
                    <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Nuestros servicios</h1>
                    <p className="mt-4 text-muted-foreground">
                        Reparación y mantenimiento de celulares, notebooks, PC y microelectrónica en general, con
                        diagnóstico transparente y garantía escrita. Tocá un servicio para ver el detalle.
                    </p>
                </Container>
            </section>

            <section className="border-t border-border py-16 sm:py-20">
                <Container>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px]">
                        {services.map((service, index) => {
                            const size = SERVICE_SIZES[index] ?? 'default';
                            return (
                                <Reveal key={service.id} delay={index * 0.03} className={SERVICE_SPANS[size]}>
                                    <ServiceCard service={service} size={size} />
                                </Reveal>
                            );
                        })}
                    </div>
                </Container>
            </section>

            <section className="border-t border-border bg-surface/30 py-16 sm:py-20">
                <Container>
                    <h2 className="text-center font-display text-2xl font-bold text-foreground sm:text-3xl">
                        ¿Cómo trabajamos?
                    </h2>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={step.title} className="relative rounded-card border border-border bg-surface p-6">
                                <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                                    {index + 1}
                                </span>
                                <step.icon className="mt-2 h-6 w-6 text-primary" />
                                <h3 className="mt-3 font-display text-sm font-semibold text-foreground">{step.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="border-t border-border py-16 sm:py-20">
                <Container className="max-w-3xl">
                    <h2 className="text-center font-display text-2xl font-bold text-foreground">Preguntas frecuentes</h2>
                    <div className="mt-8 space-y-3">
                        {faqs.map((faq) => (
                            <Disclosure key={faq.q} as="div" className="rounded-card border border-border bg-surface">
                                {({ open }) => (
                                    <>
                                        <DisclosureButton className="flex min-h-[44px] w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground">
                                            {faq.q}
                                            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition duration-220 ${open ? 'rotate-180' : ''}`} />
                                        </DisclosureButton>
                                        <DisclosurePanel className="px-5 pb-4 text-sm text-muted-foreground">
                                            {faq.a}
                                        </DisclosurePanel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="relative overflow-hidden border-t border-border bg-brand-gradient">
                <Container className="relative flex flex-col items-center gap-5 py-14 text-center sm:py-16">
                    <h2 className="font-display text-2xl font-bold text-white">¿Listo para reparar tu equipo?</h2>
                    <Button
                        href={waLink(settings.whatsapp_number, 'Hola! Quiero consultar por un servicio técnico.')}
                        target="_blank"
                        variant="dark"
                        size="lg"
                    >
                        <WhatsAppIcon className="h-5 w-5" /> Escribinos por WhatsApp
                    </Button>
                </Container>
            </section>
        </PublicLayout>
    );
}
