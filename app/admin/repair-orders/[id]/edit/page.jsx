import { notFound } from 'next/navigation';
import RepairOrderForm from '@/views/Admin/RepairOrders/Form';
import { DEVICE_TYPES, STATUSES } from '@/lib/repairOrders';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data } = await supabase.from('repair_orders').select('code').eq('id', id).maybeSingle();
    return { title: data ? `Editar ${data.code}` : 'Ficha no encontrada' };
}

export default async function EditRepairOrderPage({ params }) {
    const { id } = await params;
    const supabase = await createClient();

    const [{ data: order }, { data: technicians }] = await Promise.all([
        supabase.from('repair_orders').select('*').eq('id', id).maybeSingle(),
        supabase.from('profiles').select('id, name').order('name'),
    ]);
    if (!order) notFound();

    return (
        <RepairOrderForm order={order} statuses={STATUSES} deviceTypes={DEVICE_TYPES} technicians={technicians ?? []} />
    );
}
