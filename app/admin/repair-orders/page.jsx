import RepairOrdersIndex from '@/views/Admin/RepairOrders/Index';
import { STATUSES, decorateOrder } from '@/lib/repairOrders';
import { pageFrom, paginate, rangeFor } from '@/lib/pagination';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Equipos y reparaciones' };

const PER_PAGE = 15;

export default async function RepairOrdersPage({ searchParams }) {
    const params = await searchParams;
    const filters = { estado: params.estado ?? '', buscar: params.buscar ?? '' };
    const page = pageFrom(params);
    const supabase = await createClient();

    let query = supabase
        .from('repair_orders')
        .select('*', { count: 'exact' })
        .order('received_at', { ascending: false })
        .range(...rangeFor(page, PER_PAGE));

    if (filters.estado) query = query.eq('status', filters.estado);
    if (filters.buscar) {
        // Commas and parentheses would break the PostgREST or() syntax.
        const term = filters.buscar.replace(/[,()]/g, ' ');
        query = query.or(
            `customer_name.ilike.%${term}%,code.ilike.%${term}%,brand.ilike.%${term}%,model.ilike.%${term}%`,
        );
    }

    const { data, count } = await query;

    return (
        <RepairOrdersIndex
            orders={paginate({
                data: (data ?? []).map(decorateOrder),
                total: count,
                page,
                perPage: PER_PAGE,
                path: '/admin/repair-orders',
                searchParams: filters,
            })}
            filters={filters}
            statuses={STATUSES}
        />
    );
}
