'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import { Field, Input, Textarea, Select } from '@/Components/UI/Field';
import { ChevronLeft } from 'lucide-react';
import { DEVICE_TYPES, STATUSES } from '@/lib/repairOrders';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@/lib/useForm';
import { fromDateTimeLocal, toDateTimeLocal } from '@/lib/utils';
import { integer, money, optionalMoney, optionalText, requiredText, validate } from '@/lib/validation';

const schema = z.object({
    customer_name: requiredText(150),
    customer_phone: requiredText(40),
    customer_dni: optionalText(30),
    device_type: z.enum(Object.keys(DEVICE_TYPES), 'Elegí un tipo de equipo.'),
    brand: requiredText(80),
    model: requiredText(80),
    serial_number: optionalText(120),
    reported_issue: requiredText(2000),
    accessories: optionalText(1000),
    device_password: optionalText(120),
    status: z.enum(Object.keys(STATUSES), 'Elegí un estado.'),
    parts_cost: money,
    labor_cost: money,
    charged_price: optionalMoney,
    warranty_days: integer,
    warranty_notes: optionalText(1000),
    internal_notes: optionalText(2000),
    technician_id: z.preprocess((v) => (v === '' ? null : v), z.uuid().nullable()),
    promised_at: z.string().transform(fromDateTimeLocal),
});

export default function RepairOrderForm({ order, statuses, deviceTypes, technicians }) {
    const isEdit = !!order;
    const router = useRouter();

    const { data, setData, submit: submitForm, processing, errors } = useForm({
        customer_name: order?.customer_name ?? '',
        customer_phone: order?.customer_phone ?? '',
        customer_dni: order?.customer_dni ?? '',
        device_type: order?.device_type ?? 'celular',
        brand: order?.brand ?? '',
        model: order?.model ?? '',
        serial_number: order?.serial_number ?? '',
        reported_issue: order?.reported_issue ?? '',
        accessories: order?.accessories ?? '',
        device_password: order?.device_password ?? '',
        status: order?.status ?? 'recibido',
        parts_cost: order?.parts_cost ?? 0,
        labor_cost: order?.labor_cost ?? 0,
        charged_price: order?.charged_price ?? '',
        warranty_days: order?.warranty_days ?? 30,
        warranty_notes: order?.warranty_notes ?? '',
        internal_notes: order?.internal_notes ?? '',
        technician_id: order?.technician_id ?? '',
        promised_at: toDateTimeLocal(order?.promised_at),
    });

    function submit(e) {
        e.preventDefault();
        submitForm(async (input) => {
            const parsed = validate(schema, input);
            if (parsed.errors) return parsed;
            const values = parsed.data;
            const supabase = createClient();

            if (isEdit) {
                const statusChanged = values.status !== order.status;
                if (values.status === 'entregado' && !order.delivered_at) {
                    values.delivered_at = new Date().toISOString();
                }

                const { error } = await supabase.from('repair_orders').update(values).eq('id', order.id);
                if (error) throw error;

                if (statusChanged) {
                    const { error: logError } = await supabase
                        .from('repair_order_status_logs')
                        .insert({ repair_order_id: order.id, status: values.status });
                    if (logError) throw logError;
                }

                toast.success('Ficha actualizada correctamente.');
                router.push(`/admin/repair-orders/${order.id}`);
            } else {
                if (values.status === 'entregado') values.delivered_at = new Date().toISOString();

                const { data: created, error } = await supabase
                    .from('repair_orders')
                    .insert(values)
                    .select('id, code')
                    .single();
                if (error) throw error;

                toast.success(`Equipo cargado con código ${created.code}.`);
                router.push(`/admin/repair-orders/${created.id}`);
            }
            router.refresh();
        });
    }

    return (
        <AdminLayout header={isEdit ? `Editar ficha ${order.code}` : 'Nuevo ingreso de equipo'}>
            <Link
                href={isEdit ? `/admin/repair-orders/${order.id}` : '/admin/repair-orders'}
                className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600"
            >
                <ChevronLeft className="h-4 w-4" /> Volver
            </Link>

            <form onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
                <Card className="space-y-4 p-6">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                        Datos del cliente
                    </h2>

                    <Field label="Nombre y apellido" required error={errors.customer_name}>
                        <Input value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} error={errors.customer_name} />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Teléfono" required error={errors.customer_phone}>
                            <Input value={data.customer_phone} onChange={(e) => setData('customer_phone', e.target.value)} error={errors.customer_phone} />
                        </Field>
                        <Field label="DNI (opcional)" error={errors.customer_dni}>
                            <Input value={data.customer_dni} onChange={(e) => setData('customer_dni', e.target.value)} />
                        </Field>
                    </div>

                    <h2 className="pt-2 font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                        Datos del equipo
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Tipo de equipo" required error={errors.device_type}>
                            <Select value={data.device_type} onChange={(e) => setData('device_type', e.target.value)}>
                                {Object.entries(deviceTypes).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </Select>
                        </Field>
                        <Field label="Marca" required error={errors.brand}>
                            <Input value={data.brand} onChange={(e) => setData('brand', e.target.value)} error={errors.brand} />
                        </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Modelo" required error={errors.model}>
                            <Input value={data.model} onChange={(e) => setData('model', e.target.value)} error={errors.model} />
                        </Field>
                        <Field label="N° de serie / IMEI (opcional)" error={errors.serial_number}>
                            <Input value={data.serial_number} onChange={(e) => setData('serial_number', e.target.value)} />
                        </Field>
                    </div>

                    <Field label="Falla reportada por el cliente" required error={errors.reported_issue}>
                        <Textarea rows={3} value={data.reported_issue} onChange={(e) => setData('reported_issue', e.target.value)} error={errors.reported_issue} />
                    </Field>

                    <Field label="Accesorios entregados" error={errors.accessories}>
                        <Textarea rows={2} value={data.accessories} onChange={(e) => setData('accessories', e.target.value)} placeholder="Cargador, funda, chip, etc." />
                    </Field>

                    <Field label="Contraseña / patrón de desbloqueo (opcional)" error={errors.device_password}>
                        <Input value={data.device_password} onChange={(e) => setData('device_password', e.target.value)} />
                    </Field>
                </Card>

                <div className="space-y-6">
                    <Card className="space-y-4 p-6">
                        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                            Estado y costos
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Estado" required error={errors.status}>
                                <Select value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Técnico asignado" error={errors.technician_id}>
                                <Select value={data.technician_id} onChange={(e) => setData('technician_id', e.target.value)}>
                                    <option value="">Sin asignar</option>
                                    {technicians.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </Select>
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field label="Costo repuestos" error={errors.parts_cost}>
                                <Input type="number" step="0.01" min="0" value={data.parts_cost} onChange={(e) => setData('parts_cost', e.target.value)} />
                            </Field>
                            <Field label="Mano de obra" error={errors.labor_cost}>
                                <Input type="number" step="0.01" min="0" value={data.labor_cost} onChange={(e) => setData('labor_cost', e.target.value)} />
                            </Field>
                            <Field label="Precio al cliente" error={errors.charged_price}>
                                <Input type="number" step="0.01" min="0" value={data.charged_price} onChange={(e) => setData('charged_price', e.target.value)} placeholder="Se define al presupuestar" />
                            </Field>
                        </div>

                        <Field label="Fecha estimada de entrega (opcional)" error={errors.promised_at}>
                            <Input type="datetime-local" value={data.promised_at} onChange={(e) => setData('promised_at', e.target.value)} />
                        </Field>
                    </Card>

                    <Card className="space-y-4 p-6">
                        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                            Garantía y notas internas
                        </h2>

                        <Field label="Días de garantía" error={errors.warranty_days}>
                            <Input type="number" min="0" value={data.warranty_days} onChange={(e) => setData('warranty_days', e.target.value)} />
                        </Field>

                        <Field label="Notas de garantía" error={errors.warranty_notes}>
                            <Textarea rows={2} value={data.warranty_notes} onChange={(e) => setData('warranty_notes', e.target.value)} placeholder="Qué cubre / qué no cubre la garantía" />
                        </Field>

                        <Field label="Notas internas (no visibles para el cliente)" error={errors.internal_notes}>
                            <Textarea rows={3} value={data.internal_notes} onChange={(e) => setData('internal_notes', e.target.value)} />
                        </Field>

                        <Button type="submit" disabled={processing} className="w-full justify-center">
                            {isEdit ? 'Guardar cambios' : 'Registrar ingreso'}
                        </Button>
                    </Card>
                </div>
            </form>
        </AdminLayout>
    );
}
