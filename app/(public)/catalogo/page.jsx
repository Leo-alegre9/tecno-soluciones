import Catalog from '@/views/Public/Catalog';
import { PRODUCT_SELECT, decorateProduct, withProductCount } from '@/lib/products';
import { pageFrom, paginate, rangeFor } from '@/lib/pagination';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Catálogo de productos' };

const PER_PAGE = 12;

export default async function CatalogPage({ searchParams }) {
    const params = await searchParams;
    const filters = { categoria: params.categoria ?? '', buscar: params.buscar ?? '' };
    const page = pageFrom(params);
    const supabase = await createClient();

    const { data: categories } = await supabase.from('categories').select('*, products(count)').order('sort_order');

    let query = supabase
        .from('products')
        .select(PRODUCT_SELECT, { count: 'exact' })
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('sort_order')
        .range(...rangeFor(page, PER_PAGE));

    if (filters.categoria) {
        const category = categories?.find((c) => c.slug === filters.categoria);
        query = query.eq('category_id', category?.id ?? -1);
    }
    if (filters.buscar) {
        query = query.ilike('name', `%${filters.buscar}%`);
    }

    const { data, count } = await query;

    return (
        <Catalog
            products={paginate({
                data: (data ?? []).map(decorateProduct),
                total: count,
                page,
                perPage: PER_PAGE,
                path: '/catalogo',
                searchParams: filters,
            })}
            categories={(categories ?? []).map(withProductCount)}
            filters={filters}
        />
    );
}
