import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />

            <h1 className="font-display text-xl font-bold text-ink-900">Confirmá tu contraseña</h1>
            <p className="mt-2 text-sm text-ink-500">
                Esta es un área segura. Confirmá tu contraseña antes de continuar.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Field label="Contraseña" required error={errors.password}>
                    <Input
                        type="password"
                        value={data.password}
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </Field>

                <Button type="submit" disabled={processing} className="w-full justify-center">
                    Confirmar
                </Button>
            </form>
        </GuestLayout>
    );
}
