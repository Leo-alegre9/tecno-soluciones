import { notFound } from 'next/navigation';
import ProductShow from '@/views/Public/ProductShow';
import { PRODUCT_SELECT, decorateProduct } from '@/lib/products';
import { createClient } from '@/lib/supabase/server';

async function findProduct(slug) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
    return data;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await findProduct(slug);
    return { title: product?.name ?? 'Producto no encontrado' };
}

export default async function ProductPage({ params }) {
    const { slug } = await params;
    const product = await findProduct(slug);
    if (!product) notFound();

    const supabase = await createClient();
    let related = supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('is_active', true)
        .neq('id', product.id)
        .limit(4);
    if (product.category_id) related = related.eq('category_id', product.category_id);
    const { data: relatedProducts } = await related;

    return <ProductShow product={decorateProduct(product)} related={(relatedProducts ?? []).map(decorateProduct)} />;
}
