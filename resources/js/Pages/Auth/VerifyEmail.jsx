import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar email" />

            <h1 className="font-display text-xl font-bold text-ink-900">Verificá tu email</h1>
            <p className="mt-2 text-sm text-ink-500">
                Antes de continuar, hacé clic en el enlace que te enviamos por email. Si no lo recibiste, te
                podemos enviar otro.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mt-4 text-sm font-medium text-emerald-600">
                    Se envió un nuevo enlace de verificación a tu email.
                </div>
            )}

            <form onSubmit={submit} className="mt-6 flex items-center justify-between">
                <Button type="submit" disabled={processing}>
                    Reenviar email de verificación
                </Button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm font-medium text-ink-500 underline hover:text-ink-700"
                >
                    Cerrar sesión
                </Link>
            </form>
        </GuestLayout>
    );
}
