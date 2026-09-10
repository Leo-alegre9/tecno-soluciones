import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            <h1 className="font-display text-xl font-bold text-ink-900">Elegí una nueva contraseña</h1>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="Email" required error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </Field>

                <Field label="Nueva contraseña" required error={errors.password}>
                    <Input
                        type="password"
                        value={data.password}
                        autoComplete="new-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </Field>

                <Field label="Confirmar contraseña" required error={errors.password_confirmation}>
                    <Input
                        type="password"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                    />
                </Field>

                <Button type="submit" disabled={processing} className="w-full justify-center">
                    Restablecer contraseña
                </Button>
            </form>
        </GuestLayout>
    );
}
