import { redirect } from 'next/navigation';
import { AdminUserProvider } from '@/Layouts/AdminLayout';
import NotAdmin from '@/views/Admin/NotAdmin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminRootLayout({ children }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('name, role').eq('id', user.id).maybeSingle();

    if (profile?.role !== 'admin') {
        return <NotAdmin email={user.email} />;
    }

    return (
        <AdminUserProvider user={{ id: user.id, email: user.email, name: profile.name || user.email }}>
            {children}
        </AdminUserProvider>
    );
}
