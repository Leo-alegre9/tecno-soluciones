import ProductForm from '@/views/Admin/Products/Form';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Nuevo producto' };

export default async function CreateProductPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    return <ProductForm product={null} categories={categories ?? []} />;
}
