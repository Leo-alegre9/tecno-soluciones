import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Pagination from '@/Components/UI/Pagination';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import StatusBadge from '@/Components/StatusBadge';
import { Input, Select } from '@/Components/UI/Field';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';

export default function RepairOrdersIndex({ orders, filters, statuses }) {
    const [search, setSearch] = useState(filters.buscar || '');
    const [toDelete, setToDelete] = useState(null);

    function applyFilters(next) {
        router.get(route('admin.repair-orders.index'), { ...filters, ...next }, { preserveState: true, replace: true });
    }

    function confirmDelete() {
        router.delete(route('admin.repair-orders.destroy', toDelete.id), {
            onFinish: () => setToDelete(null),
        });
    }

    return (
        <AdminLayout header="Equipos / Reparaciones">
            <Head title="Equipos y reparaciones" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-1 flex-wrap gap-3">
                    <form
                        className="relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({ buscar: search });
                        }}
                    >
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por código, cliente o equipo..."
                            className="w-72 pr-9"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>

                    <Select value={filters.estado || ''} onChange={(e) => applyFilters({ estado: e.target.value })} className="w-56">
                        <option value="">Todos los estados</option>
                        {Object.entries(statuses).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </Select>
                </div>

                <Button href={route('admin.repair-orders.create')}>
                    <Plus className="h-4 w-4" /> Nuevo ingreso
                </Button>
            </div>

            <Card className="mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
                            <tr>
                                <th className="px-4 py-3">Código</th>
                                <th className="px-4 py-3">Cliente</th>
                                <th className="px-4 py-3">Equipo</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Ingreso</th>
                                <th className="px-4 py-3">Precio</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-100">
                            {orders.data.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-4 py-3 font-semibold text-ink-800">{order.code}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-ink-700">{order.customer_name}</p>
                                        <p className="text-xs text-ink-400">{order.customer_phone}</p>
                                    </td>
                                    <td className="px-4 py-3 text-ink-500">{order.brand} {order.model}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={order.status} label={order.status_label} />
                                    </td>
                                    <td className="px-4 py-3 text-ink-500">{formatDate(order.received_at)}</td>
                                    <td className="px-4 py-3 text-ink-600">
                                        {order.charged_price ? formatCurrency(order.charged_price) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={route('admin.repair-orders.show', order.id)}
                                                className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => setToDelete(order)}
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-ink-400">
                                        No hay equipos cargados con esos filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Pagination links={orders.links} />

            <ConfirmDialog
                show={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar ficha de equipo"
                description={`¿Eliminar la ficha ${toDelete?.code}? Esta acción no se puede deshacer.`}
            />
        </AdminLayout>
    );
}
