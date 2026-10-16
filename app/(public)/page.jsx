import Home from '@/views/Public/Home';
import { PRODUCT_SELECT, decorateProduct, withProductCount } from '@/lib/products';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
    title: 'Servicio técnico de celulares, notebooks y microelectrónica en Corrientes',
};

export default async function HomePage() {
    const supabase = await createClient();

    const [featured, categories, services] = await Promise.all([
        supabase
            .from('products')
            .select(PRODUCT_SELECT)
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('sort_order')
            .limit(6),
        supabase.from('categories').select('*, products(count)').order('sort_order'),
        supabase.from('services').select('*').eq('is_active', true).order('sort_order').limit(6),
    ]);

    return (
        <Home
            featuredProducts={(featured.data ?? []).map(decorateProduct)}
            categories={(categories.data ?? []).map(withProductCount)}
            services={services.data ?? []}
        />
    );
}
