import Home from '@/views/Public/Home';
import { withProductCount } from '@/lib/products';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
    title: 'Servicio técnico de celulares, notebooks y microelectrónica en Corrientes',
};

export default async function HomePage() {
    const supabase = await createClient();

    const [categories, services] = await Promise.all([
        supabase.from('categories').select('*, products(count)').order('sort_order'),
        supabase.from('services').select('*').eq('is_active', true).order('sort_order').limit(6),
    ]);

    return (
        <Home
            categories={(categories.data ?? []).map(withProductCount)}
            services={services.data ?? []}
        />
    );
}
