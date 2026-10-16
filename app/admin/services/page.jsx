import ServicesIndex from '@/views/Admin/Services/Index';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Servicios' };

export default async function ServicesPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('services').select('*').order('sort_order');

    return <ServicesIndex services={data ?? []} />;
}
