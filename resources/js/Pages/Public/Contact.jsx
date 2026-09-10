import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Button from '@/Components/UI/Button';
import { Field, Input, Textarea } from '@/Components/UI/Field';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function Contact() {
    const { settings } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        message: '',
        source: 'contacto',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const asunto = params.get('asunto');
        if (asunto) {
            setData('message', `Hola! Quiero consultar sobre: ${asunto}. `);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function submit(e) {
        e.preventDefault();
        post(route('contact.store'), {
            preserveScroll: true,
            onSuccess: () => {
                const waMessage = `Hola Tecno Soluciones! Soy ${data.name}. ${data.message}`;
                window.open(waLink(settings.whatsapp_number, waMessage), '_blank');
                reset();
            },
        });
    }

    return (
        <PublicLayout>
            <Head title="Contacto" />

            <section className="bg-ink-950 py-16">
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Contactanos</h1>
                    <p className="mt-4 text-ink-300">
                        Contanos qué necesitás y te respondemos por WhatsApp a la brevedad.
                    </p>
                </div>
            </section>

            <section className="border-t border-white/5 bg-ink-900/40 py-16">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
                        <h2 className="font-display text-xl font-semibold text-ink-900">Dejanos tu consulta</h2>
                        <p className="mt-1 text-sm text-ink-500">
                            Al enviar el formulario se abrirá WhatsApp con tu mensaje listo para enviar.
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <Field label="Nombre" required error={errors.name}>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Tu nombre"
                                    error={errors.name}
                                />
                            </Field>

                            <Field label="Teléfono" required error={errors.phone}>
                                <Input
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="Tu número de contacto"
                                    error={errors.phone}
                                />
                            </Field>

                            <Field label="Email (opcional)" error={errors.email}>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="tu@email.com"
                                    error={errors.email}
                                />
                            </Field>

                            <Field label="Mensaje" required error={errors.message}>
                                <Textarea
                                    rows={4}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Contanos qué le pasa a tu equipo o qué producto te interesa"
                                    error={errors.message}
                                />
                            </Field>

                            <Button type="submit" disabled={processing} className="w-full justify-center">
                                <WhatsAppIcon className="h-5 w-5" /> Enviar y continuar por WhatsApp
                            </Button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-sm">
                            <ul className="space-y-4 text-sm text-ink-300">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                                    <span>{settings.address}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                                    <span>{settings.phone_display}</span>
                                </li>
                                {settings.email && (
                                    <li className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                                        <span>{settings.email}</span>
                                    </li>
                                )}
                                <li className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                                    <span className="whitespace-pre-line">{settings.schedule}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-sm">
                            <iframe
                                title="Ubicación Tecno Soluciones"
                                src={settings.map_embed_url}
                                className="h-72 w-full grayscale invert-[.92] contrast-[.9]"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
