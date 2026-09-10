import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import { Field, Input, Textarea, Select } from '@/Components/UI/Field';
import { ChevronLeft } from 'lucide-react';

export default function RepairOrderForm({ order, statuses, deviceTypes, technicians }) {
    const isEdit = !!order;

    const { data, setData, post, put, processing, errors } = useForm({
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
        promised_at: order?.promised_at ? order.promised_at.substring(0, 16) : '',
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.repair-orders.update', order.id));
        } else {
            post(route('admin.repair-orders.store'));
        }
    }

    return (
        <AdminLayout header={isEdit ? `Editar ficha ${order.code}` : 'Nuevo ingreso de equipo'}>
            <Head title={isEdit ? `Editar ${order.code}` : 'Nuevo ingreso'} />

            <Link
                href={isEdit ? route('admin.repair-orders.show', order.id) : route('admin.repair-orders.index')}
                className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600"
            >
                <ChevronLeft className="h-4 w-4" /> Volver
            </Link>

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
                <Card className="space-y-4 p-6">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                        Datos del cliente
                    </h2>

                    <Field label="Nombre y apellido" required error={errors.customer_name}>
                        <Input value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} error={errors.customer_name} />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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

                        <div className="grid grid-cols-2 gap-4">
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

                        <div className="grid grid-cols-3 gap-4">
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
