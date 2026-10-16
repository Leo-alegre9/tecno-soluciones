'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@/lib/useForm';

// Reached through the recovery email link (/auth/callback signs the user in first).
export default function ResetPassword() {
    const router = useRouter();
    const { data, setData, submit, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        const ok = await submit(async ({ password, password_confirmation }) => {
            if (password.length < 8) return { errors: { password: 'La contraseña debe tener al menos 8 caracteres.' } };
            if (password !== password_confirmation) {
                return { errors: { password_confirmation: 'Las contraseñas no coinciden.' } };
            }
            const { error } = await createClient().auth.updateUser({ password });
            if (error) throw error;
        });

        reset();
        if (ok) {
            toast.success('Contraseña actualizada.');
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <GuestLayout>
            <h1 className="font-display text-xl font-bold text-ink-900">Elegí una nueva contraseña</h1>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
