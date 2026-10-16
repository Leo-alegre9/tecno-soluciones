import CategoriesIndex from '@/views/Admin/Categories/Index';
import { withProductCount } from '@/lib/products';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Categorías' };

export default async function CategoriesPage() {
    const supabase = await createClient();
    const { data } = await supabase.from('categories').select('*, products(count)').order('sort_order');

    return <CategoriesIndex categories={(data ?? []).map(withProductCount)} />;
}
