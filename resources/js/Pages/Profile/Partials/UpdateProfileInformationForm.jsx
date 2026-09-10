import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="font-display text-base font-semibold text-ink-900">Información del perfil</h2>
                <p className="mt-1 text-sm text-ink-500">Actualizá tu nombre y tu email de acceso.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="Nombre" required error={errors.name}>
                    <Input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        error={errors.name}
                    />
                </Field>

                <Field label="Email" required error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        error={errors.email}
                    />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm text-ink-600">
                            Tu email todavía no está verificado.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-medium text-brand-600 underline hover:text-brand-700"
                            >
                                Reenviar email de verificación.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-emerald-600">
                                Se envió un nuevo enlace de verificación a tu email.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>Guardar</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-ink-500">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
