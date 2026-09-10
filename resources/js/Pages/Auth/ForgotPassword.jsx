import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar contraseña" />

            <h1 className="font-display text-xl font-bold text-ink-900">¿Olvidaste tu contraseña?</h1>
            <p className="mt-2 text-sm text-ink-500">
                Ingresá tu email y te enviaremos un enlace para elegir una nueva contraseña.
            </p>

            {status && <div className="mt-4 text-sm font-medium text-emerald-600">{status}</div>}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="Email" required error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </Field>

                <Button type="submit" disabled={processing} className="w-full justify-center">
                    Enviar enlace de recuperación
                </Button>
            </form>
        </GuestLayout>
    );
}
