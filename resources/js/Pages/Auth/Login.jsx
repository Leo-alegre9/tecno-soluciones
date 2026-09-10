import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Field, Input, Checkbox } from '@/Components/UI/Field';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Ingresar" />

            <h1 className="font-display text-xl font-bold text-ink-900">Panel de administración</h1>
            <p className="mt-1 text-sm text-ink-500">Ingresá con tu cuenta para gestionar el sitio.</p>

            {status && <div className="mt-4 text-sm font-medium text-emerald-600">{status}</div>}

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="Email" required error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </Field>

                <Field label="Contraseña" required error={errors.password}>
                    <Input
                        type="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </Field>

                <div className="flex items-center justify-between">
                    <Checkbox
                        label="Recordarme"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}
                </div>

                <Button type="submit" disabled={processing} className="w-full justify-center">
                    Ingresar
                </Button>
            </form>
        </GuestLayout>
    );
}
