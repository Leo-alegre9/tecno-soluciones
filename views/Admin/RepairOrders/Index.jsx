'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { errorMessage } from '@/lib/useForm';
import { withQuery } from '@/lib/url';
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
    const router = useRouter();
    const [search, setSearch] = useState(filters.buscar || '');
    const [toDelete, setToDelete] = useState(null);

    function applyFilters(next) {
        router.replace(withQuery('/admin/repair-orders', { ...filters, ...next }), { scroll: false });
    }

    async function confirmDelete() {
        const order = toDelete;
        setToDelete(null);

        const { error } = await createClient().from('repair_orders').delete().eq('id', order.id);
        if (error) {
            toast.error(errorMessage(error));
            return;
        }
        toast.success('Ficha eliminada.');
        router.refresh();
    }

    return (
        <AdminLayout header="Equipos / Reparaciones">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-1 flex-wrap gap-3">
                    <form
                        className="relative w-full sm:w-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({ buscar: search });
                        }}
                    >
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por código, cliente o equipo..."
                            className="w-full pr-9 sm:w-72"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>

                    <Select value={filters.estado || ''} onChange={(e) => applyFilters({ estado: e.target.value })} className="w-full sm:w-56">
                        <option value="">Todos los estados</option>
                        {Object.entries(statuses).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </Select>
                </div>

                <Button href="/admin/repair-orders/create">
                    <Plus className="h-4 w-4" /> Nuevo ingreso
                </Button>
            </div>

            <Card className="mt-6 overflow-hidden">
                {/* Mobile: compact list */}
                <ul className="divide-y divide-ink-100 sm:hidden">
                    {orders.data.map((order) => (
                        <li key={order.id} className="flex items-start gap-2 p-4">
                            <Link href={`/admin/repair-orders/${order.id}`} className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-ink-800">{order.code}</span>
                                    <StatusBadge status={order.status} label={order.status_label} />
                                </div>
                                <p className="mt-1 truncate text-sm text-ink-700">
                                    {order.customer_name} · {order.brand} {order.model}
                                </p>
                                <p className="mt-0.5 text-xs text-ink-400">
                                    {formatDate(order.received_at)}
                                    {order.charged_price ? ` · ${formatCurrency(order.charged_price)}` : ''}
                                </p>
                            </Link>
                            <button
                                onClick={() => setToDelete(order)}
                                aria-label={`Eliminar ${order.code}`}
                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                    {orders.data.length === 0 && (
                        <li className="px-4 py-10 text-center text-sm text-ink-400">No hay equipos cargados con esos filtros.</li>
                    )}
                </ul>

                <div className="hidden overflow-x-auto sm:block">
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
                                                href={`/admin/repair-orders/${order.id}`}
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
