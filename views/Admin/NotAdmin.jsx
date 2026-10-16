'use client';

import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { useSignOut } from '@/Layouts/AdminLayout';

export default function NotAdmin({ email }) {
    const signOut = useSignOut();

    return (
        <GuestLayout>
            <h1 className="font-display text-xl font-bold text-ink-900">Sin permisos de administrador</h1>
            <p className="mt-2 text-sm text-ink-500">
                La cuenta <strong>{email}</strong> no tiene acceso al panel. Pedile a un administrador que te
                habilite.
            </p>
            <Button onClick={signOut} className="mt-6 w-full justify-center">
                Cerrar sesión
            </Button>
        </GuestLayout>
    );
}
