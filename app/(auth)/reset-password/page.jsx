import { redirect } from 'next/navigation';
import ResetPassword from '@/views/Auth/ResetPassword';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Restablecer contraseña' };

export default async function ResetPasswordPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/login?error=link');

    return <ResetPassword />;
}
