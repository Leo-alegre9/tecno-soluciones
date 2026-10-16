'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@/lib/useForm';

export default function Login({ status }) {
    const router = useRouter();
    const { data, setData, submit, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        const ok = await submit(async ({ email, password }) => {
            const { error } = await createClient().auth.signInWithPassword({ email, password });
            if (error) return { errors: { email: 'Estas credenciales no coinciden con nuestros registros.' } };
        });

        if (ok) {
            router.push('/admin');
            router.refresh();
        } else {
            reset('password');
        }
    };

    return (
        <GuestLayout>
            <h1 className="font-display text-xl font-bold text-ink-900">Panel de administración</h1>
            <p className="mt-1 text-sm text-ink-500">Ingresá con tu cuenta para gestionar el sitio.</p>

            {status && <div className="mt-4 text-sm font-medium text-emerald-600">{status}</div>}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <Field label="Email" required error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        required
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </Field>

                <Field label="Contraseña" required error={errors.password}>
                    <Input
                        type="password"
                        value={data.password}
                        autoComplete="current-password"
                        required
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </Field>

                <div className="flex items-center justify-end">
                    <Link href="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <Button type="submit" disabled={processing} className="w-full justify-center">
                    Ingresar
                </Button>
            </form>
        </GuestLayout>
    );
}
