import { notFound } from 'next/navigation';
import ProductForm from '@/views/Admin/Products/Form';
import { PRODUCT_SELECT, decorateProduct } from '@/lib/products';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Editar producto' };

export default async function EditProductPage({ params }) {
    const { id } = await params;
    const supabase = await createClient();

    const [{ data: product }, { data: categories }] = await Promise.all([
        supabase.from('products').select(PRODUCT_SELECT).eq('id', id).maybeSingle(),
        supabase.from('categories').select('*').order('name'),
    ]);
    if (!product) notFound();

    return <ProductForm product={decorateProduct(product)} categories={categories ?? []} />;
}
