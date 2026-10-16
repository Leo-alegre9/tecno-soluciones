import { notFound } from 'next/navigation';
import RepairOrderShow from '@/views/Admin/RepairOrders/Show';
import { STATUSES, decorateOrder } from '@/lib/repairOrders';
import { createClient } from '@/lib/supabase/server';

async function findOrder(id) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('repair_orders')
        .select(
            '*, technician:profiles!repair_orders_technician_id_fkey(id, name), status_logs:repair_order_status_logs(*, user:profiles(id, name))',
        )
        .eq('id', id)
        .maybeSingle();
    return data;
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const order = await findOrder(id);
    return { title: order ? `Ficha ${order.code}` : 'Ficha no encontrada' };
}

export default async function RepairOrderPage({ params }) {
    const { id } = await params;
    const order = await findOrder(id);
    if (!order) notFound();

    return <RepairOrderShow order={decorateOrder(order)} statuses={STATUSES} />;
}
