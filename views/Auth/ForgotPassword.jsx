'use client';

import Link from 'next/link';
import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@/lib/useForm';

export default function ForgotPassword() {
    const [status, setStatus] = useState(null);
    const { data, setData, submit, processing, errors } = useForm({ email: '' });

    const onSubmit = (e) => {
        e.preventDefault();
        submit(
            async ({ email }) => {
                const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
                const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo });
                if (error) throw error;
            },
            { onSuccess: () => setStatus('Si el email está registrado, te enviamos un enlace para restablecer la contraseña.') },
        );
    };

    return (
        <GuestLayout>
            <h1 className="font-display text-xl font-bold text-ink-900">¿Olvidaste tu contraseña?</h1>
            <p className="mt-1 text-sm text-ink-500">
                Ingresá tu email y te enviaremos un enlace para elegir una nueva.
            </p>

            {status && <div className="mt-4 text-sm font-medium text-emerald-600">{status}</div>}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <Field label="Email" required error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        autoFocus
                        required
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </Field>

                <Button type="submit" disabled={processing} className="w-full justify-center">
                    Enviar enlace
                </Button>

                <Link href="/login" className="block text-center text-sm font-medium text-brand-600 hover:text-brand-700">
                    Volver a ingresar
                </Link>
            </form>
        </GuestLayout>
    );
}
