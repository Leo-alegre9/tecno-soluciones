import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/UI/Container';
import Button from '@/Components/UI/Button';
import { Field, Input, Textarea } from '@/Components/UI/Field';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';
import { MapPin, Phone, Clock, Mail, CheckCircle2 } from 'lucide-react';

const schema = z.object({
    name: z.string().trim().min(1, 'Ingresá tu nombre.').max(120, 'Máximo 120 caracteres.'),
    phone: z.string().trim().min(1, 'Ingresá un teléfono de contacto.').max(40, 'Máximo 40 caracteres.'),
    email: z.string().trim().email('Ingresá un email válido.').max(120).optional().or(z.literal('')),
    message: z.string().trim().min(1, 'Contanos qué necesitás.').max(2000, 'Máximo 2000 caracteres.'),
});

export default function Contact() {
    const { settings } = usePage().props;
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: '', phone: '', email: '', message: '' },
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const asunto = params.get('asunto');
        if (asunto) {
            setValue('message', `Hola! Quiero consultar sobre: ${asunto}. `);
        }
    }, [setValue]);

    function onSubmit(data) {
        setSubmitting(true);
        setSuccess(false);

        router.post(
            route('contact.store'),
            { ...data, source: 'contacto' },
            {
                preserveScroll: true,
                onSuccess: () => {
                    const waMessage = `Hola Tecno Soluciones! Soy ${data.name}. ${data.message}`;
                    window.open(waLink(settings.whatsapp_number, waMessage), '_blank');
                    setSuccess(true);
                    reset();
                },
                onError: (serverErrors) => {
                    Object.entries(serverErrors).forEach(([field, message]) => {
                        setError(field, { type: 'server', message });
                    });
                },
                onFinish: () => setSubmitting(false),
            },
        );
    }

    return (
        <PublicLayout>
            <Head title="Contacto" />

            <section className="py-16">
                <Container className="max-w-3xl text-center">
                    <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Contactanos</h1>
                    <p className="mt-4 text-muted-foreground">
                        Contanos qué necesitás y te respondemos por WhatsApp a la brevedad.
                    </p>
                </Container>
            </section>

            <section className="border-t border-border py-16 sm:py-20">
                <Container className="grid max-w-6xl gap-10 lg:grid-cols-2">
                    <div className="rounded-card-lg border border-border bg-surface p-6 shadow-elevated sm:p-8">
                        <h2 className="font-display text-xl font-semibold text-foreground">Dejanos tu consulta</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Al enviar el formulario se abrirá WhatsApp con tu mensaje listo para enviar.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
                            <Field label="Nombre" required error={errors.name?.message} theme="dark">
                                <Input theme="dark" placeholder="Tu nombre" {...register('name')} />
                            </Field>

                            <Field label="Teléfono" required error={errors.phone?.message} theme="dark">
                                <Input theme="dark" placeholder="Tu número de contacto" {...register('phone')} />
                            </Field>

                            <Field label="Email (opcional)" error={errors.email?.message} theme="dark">
                                <Input theme="dark" type="email" placeholder="tu@email.com" {...register('email')} />
                            </Field>

                            <Field label="Mensaje" required error={errors.message?.message} theme="dark">
                                <Textarea
                                    theme="dark"
                                    rows={4}
                                    placeholder="Contanos qué le pasa a tu equipo o qué producto te interesa"
                                    {...register('message')}
                                />
                            </Field>

                            <Button type="submit" disabled={submitting} className="w-full justify-center">
                                {submitting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                        Enviando…
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle2 className="h-5 w-5" /> ¡Listo! Abrimos WhatsApp
                                    </>
                                ) : (
                                    <>
                                        <WhatsAppIcon className="h-5 w-5" /> Enviar y continuar por WhatsApp
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
                            <ul className="space-y-4 text-sm text-ink-300">
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <span>{settings.address}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <span>{settings.phone_display}</span>
                                </li>
                                {settings.email && (
                                    <li className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                        <span>{settings.email}</span>
                                    </li>
                                )}
                                <li className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                    <span className="whitespace-pre-line">{settings.schedule}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="overflow-hidden rounded-card border border-border shadow-sm">
                            <iframe
                                title="Ubicación Tecno Soluciones"
                                src={settings.map_embed_url}
                                className="h-72 w-full grayscale invert-[.92] contrast-[.9]"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}
