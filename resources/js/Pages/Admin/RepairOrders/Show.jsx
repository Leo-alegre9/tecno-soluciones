import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { Field, Select, Textarea } from '@/Components/UI/Field';
import { formatCurrency, formatDateTime, waLink } from '@/lib/utils';
import { ChevronLeft, Pencil, Trash2, MessageCircle, Eye, EyeOff } from 'lucide-react';

export default function RepairOrderShow({ order, statuses }) {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const { data, setData, put, processing, reset } = useForm({
        status: order.status,
        note: '',
    });

    function submitStatus(e) {
        e.preventDefault();
        put(route('admin.repair-orders.status', order.id), {
            preserveScroll: true,
            onSuccess: () => reset('note'),
        });
    }

    function destroy() {
        router.delete(route('admin.repair-orders.destroy', order.id));
    }

    const waMessage = `Hola ${order.customer_name}! Te escribimos de Tecno Soluciones sobre tu equipo ${order.brand} ${order.model} (código ${order.code}). Estado actual: ${order.status_label}.`;

    return (
        <AdminLayout header={`Ficha ${order.code}`}>
            <Head title={`Ficha ${order.code}`} />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href={route('admin.repair-orders.index')} className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600">
                    <ChevronLeft className="h-4 w-4" /> Volver al listado
                </Link>

                <div className="flex gap-2">
                    <Button
                        variant="subtle"
                        size="sm"
                        href={waLink(order.customer_phone, waMessage)}
                        target="_blank"
                    >
                        <MessageCircle className="h-4 w-4" /> Escribir al cliente
                    </Button>
                    <Button variant="outline" size="sm" href={route('admin.repair-orders.edit', order.id)}>
                        <Pencil className="h-4 w-4" /> Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setConfirmingDelete(true)}>
                        <Trash2 className="h-4 w-4" /> Eliminar
                    </Button>
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-ink-400">Código de ingreso</p>
                            <p className="font-display text-2xl font-bold text-ink-900">{order.code}</p>
                        </div>
                        <StatusBadge status={order.status} label={order.status_label} />
                    </div>

                    <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                        <Item label="Cliente" value={order.customer_name} />
                        <Item label="Teléfono" value={order.customer_phone} />
                        <Item label="DNI" value={order.customer_dni || '—'} />
                        <Item label="Equipo" value={`${order.brand} ${order.model}`} />
                        <Item label="Tipo" value={order.device_type_label} />
                        <Item label="N° de serie" value={order.serial_number || '—'} />
                    </dl>

                    <div className="mt-6 space-y-4 border-t border-ink-100 pt-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Falla reportada</p>
                            <p className="mt-1 text-sm text-ink-700">{order.reported_issue}</p>
                        </div>
                        {order.accessories && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Accesorios entregados</p>
                                <p className="mt-1 text-sm text-ink-700">{order.accessories}</p>
                            </div>
                        )}
                        {order.device_password && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Contraseña / patrón</p>
                                <button
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="mt-1 flex items-center gap-2 text-sm font-medium text-ink-700"
                                >
                                    {showPassword ? order.device_password : '••••••••'}
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        )}
                        {order.internal_notes && (
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Notas internas</p>
                                <p className="mt-1 whitespace-pre-line text-sm text-ink-700">{order.internal_notes}</p>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                            Costos y ganancia
                        </h3>
                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-ink-500">Repuestos</dt>
                                <dd className="text-ink-700">{formatCurrency(order.parts_cost)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-ink-500">Mano de obra</dt>
                                <dd className="text-ink-700">{formatCurrency(order.labor_cost)}</dd>
                            </div>
                            <div className="flex justify-between border-t border-ink-100 pt-2">
                                <dt className="text-ink-500">Precio al cliente</dt>
                                <dd className="font-semibold text-ink-800">
                                    {order.charged_price ? formatCurrency(order.charged_price) : 'Pendiente'}
                                </dd>
                            </div>
                            <div className="flex justify-between border-t border-ink-100 pt-2">
                                <dt className="font-semibold text-ink-700">Ganancia</dt>
                                <dd className={`font-bold ${order.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {formatCurrency(order.profit)}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-4 rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
                            Garantía: {order.warranty_days} días.
                            {order.warranty_notes && <p className="mt-1">{order.warranty_notes}</p>}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                            Actualizar estado
                        </h3>
                        <form onSubmit={submitStatus} className="mt-4 space-y-3">
                            <Field label="Nuevo estado">
                                <Select value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    {Object.entries(statuses).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Nota (opcional)">
                                <Textarea rows={2} value={data.note} onChange={(e) => setData('note', e.target.value)} placeholder="Ej: se pidió el repuesto, listo para retirar..." />
                            </Field>
                            <Button type="submit" disabled={processing} className="w-full justify-center">
                                Actualizar estado
                            </Button>
                        </form>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                            Historial
                        </h3>
                        <ol className="mt-4 space-y-4 border-l border-ink-100 pl-4">
                            {order.status_logs?.map((log) => (
                                <li key={log.id} className="relative">
                                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                                    <StatusBadge status={log.status} label={log.status_label} />
                                    {log.note && <p className="mt-1 text-sm text-ink-600">{log.note}</p>}
                                    <p className="mt-1 text-xs text-ink-400">
                                        {formatDateTime(log.created_at)} {log.user ? `· ${log.user.name}` : ''}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                show={confirmingDelete}
                onClose={() => setConfirmingDelete(false)}
                onConfirm={destroy}
                title="Eliminar ficha"
                description={`¿Eliminar la ficha ${order.code}? Esta acción no se puede deshacer.`}
            />
        </AdminLayout>
    );
}

function Item({ label, value }) {
    return (
        <div>
            <dt className="text-xs uppercase tracking-wide text-ink-400">{label}</dt>
            <dd className="mt-0.5 font-medium text-ink-800">{value}</dd>
        </div>
    );
}
