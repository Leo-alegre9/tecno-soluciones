import ProductsIndex from '@/views/Admin/Products/Index';
import { PRODUCT_SELECT, decorateProduct } from '@/lib/products';
import { pageFrom, paginate, rangeFor } from '@/lib/pagination';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Productos' };

const PER_PAGE = 15;

export default async function ProductsPage({ searchParams }) {
    const params = await searchParams;
    const filters = { buscar: params.buscar ?? '', categoria: params.categoria ?? '' };
    const page = pageFrom(params);
    const supabase = await createClient();

    let query = supabase
        .from('products')
        .select(PRODUCT_SELECT, { count: 'exact' })
        .order('id', { ascending: false })
        .range(...rangeFor(page, PER_PAGE));
    if (filters.buscar) query = query.ilike('name', `%${filters.buscar}%`);
    if (filters.categoria) query = query.eq('category_id', filters.categoria);

    const [{ data, count }, { data: categories }] = await Promise.all([
        query,
        supabase.from('categories').select('*').order('name'),
    ]);

    return (
        <ProductsIndex
            products={paginate({
                data: (data ?? []).map(decorateProduct),
                total: count,
                page,
                perPage: PER_PAGE,
                path: '/admin/products',
                searchParams: filters,
            })}
            categories={categories ?? []}
            filters={filters}
        />
    );
}
