'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { z } from 'zod';
import AdminLayout, { useAdminUser } from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import { Field, Input } from '@/Components/UI/Field';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@/lib/useForm';
import { requiredText, validate } from '@/lib/validation';

export default function ProfileEdit() {
    return (
        <AdminLayout header="Mi perfil">
            <div className="max-w-2xl space-y-6">
                <Card className="p-6">
                    <UpdateProfileInformationForm />
                </Card>

                <Card className="p-6">
                    <UpdatePasswordForm />
                </Card>
            </div>
        </AdminLayout>
    );
}

const profileSchema = z.object({
    name: requiredText(255),
    email: z.email('Ingresá un email válido.'),
});

function Saved({ show, children = 'Guardado.' }) {
    return (
        <Transition show={show} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
            <p className="text-sm text-ink-500">{children}</p>
        </Transition>
    );
}

function UpdateProfileInformationForm() {
    const user = useAdminUser();
    const router = useRouter();
    const [emailPending, setEmailPending] = useState(false);

    const { data, setData, submit, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const onSubmit = (e) => {
        e.preventDefault();
        submit(async (input) => {
            const parsed = validate(profileSchema, input);
            if (parsed.errors) return parsed;
            const supabase = createClient();

            const { error } = await supabase.from('profiles').update({ name: parsed.data.name }).eq('id', user.id);
            if (error) throw error;

            if (parsed.data.email !== user.email) {
                // Supabase sends a confirmation link; the email changes once it is clicked.
                const { error: emailError } = await supabase.auth.updateUser({ email: parsed.data.email });
                if (emailError) return { errors: { email: emailError.message } };
                setEmailPending(true);
            }

            router.refresh();
        });
    };

    return (
        <section>
            <header>
                <h2 className="font-display text-base font-semibold text-ink-900">Información del perfil</h2>
                <p className="mt-1 text-sm text-ink-500">Actualizá tu nombre y tu email de acceso.</p>
            </header>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
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

                {emailPending && (
                    <div className="text-sm font-medium text-emerald-600">
                        Te enviamos un enlace de confirmación al nuevo email. El cambio se aplica al hacer clic.
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>Guardar</Button>
                    <Saved show={recentlySuccessful} />
                </div>
            </form>
        </section>
    );
}

function UpdatePasswordForm() {
    const user = useAdminUser();
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, submit, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = async (e) => {
        e.preventDefault();

        const ok = await submit(async ({ current_password, password, password_confirmation }) => {
            if (password.length < 8) return { errors: { password: 'La contraseña debe tener al menos 8 caracteres.' } };
            if (password !== password_confirmation) {
                return { errors: { password_confirmation: 'Las contraseñas no coinciden.' } };
            }

            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: current_password,
            });
            if (authError) return { errors: { current_password: 'La contraseña actual es incorrecta.' } };

            const { error } = await supabase.auth.updateUser({ password });
            if (error) return { errors: { password: error.message } };
        });

        if (ok) {
            reset();
        } else {
            reset('current_password', 'password', 'password_confirmation');
            currentPasswordInput.current?.focus();
        }
    };

    return (
        <section>
            <header>
                <h2 className="font-display text-base font-semibold text-ink-900">Cambiar contraseña</h2>
                <p className="mt-1 text-sm text-ink-500">Usá una contraseña larga y segura.</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-4">
                <Field label="Contraseña actual" error={errors.current_password}>
                    <Input
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        error={errors.current_password}
                    />
                </Field>

                <Field label="Contraseña nueva" error={errors.password}>
                    <Input
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        error={errors.password}
                    />
                </Field>

                <Field label="Confirmar contraseña" error={errors.password_confirmation}>
                    <Input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        error={errors.password_confirmation}
                    />
                </Field>

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>Guardar</Button>
                    <Saved show={recentlySuccessful} />
                </div>
            </form>
        </section>
    );
}
