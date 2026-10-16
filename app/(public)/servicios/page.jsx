import Services from '@/views/Public/Services';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Servicios' };

export default async function ServicesPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('services').select('*').eq('is_active', true).order('sort_order');

    return <Services services={data ?? []} />;
}
