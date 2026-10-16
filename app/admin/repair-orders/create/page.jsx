import RepairOrderForm from '@/views/Admin/RepairOrders/Form';
import { DEVICE_TYPES, STATUSES } from '@/lib/repairOrders';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Nuevo ingreso' };

export default async function CreateRepairOrderPage() {
    const supabase = await createClient();
    const { data: technicians } = await supabase.from('profiles').select('id, name').order('name');

    return (
        <RepairOrderForm order={null} statuses={STATUSES} deviceTypes={DEVICE_TYPES} technicians={technicians ?? []} />
    );
}
