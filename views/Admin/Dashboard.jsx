'use client';

import Link from 'next/link';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/UI/StatCard';
import Card from '@/Components/UI/Card';
import StatusBadge from '@/Components/StatusBadge';
import FlexiChart, { PillSwitch } from '@/Components/Admin/FlexiChart';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useState } from 'react';
import {
    Wrench,
    DollarSign,
    TrendingUp,
    PackageX,
    MessageSquareWarning,
    ArrowUpRight,
} from 'lucide-react';

const METRICS = [
    { id: 'ingresos', label: 'Ingresos' },
    { id: 'ganancia', label: 'Ganancia' },
];

// "$ 110 mil" style labels for the chart axis.
const compactCurrency = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    notation: 'compact',
    maximumFractionDigits: 1,
});
const formatCompactCurrency = (value) => compactCurrency.format(value);

export default function Dashboard({ stats, monthlySeries, statusBreakdown, deviceTypeCounts, recentOrders, recentMessages, lowStockProducts }) {
    const [metric, setMetric] = useState('ingresos');
    const chartData = monthlySeries.map((row) => ({ label: row.label, value: row[metric] }));
    const average = chartData.length ? chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length : 0;

    return (
        <AdminLayout header="Dashboard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Wrench}
                    label="Equipos en curso"
                    value={stats.openOrders}
                    hint={`${stats.totalOrders} ingresados en total`}
                />
                <StatCard
                    icon={DollarSign}
                    label="Ingresos del mes"
                    value={formatCurrency(stats.monthRevenue)}
                    tone="gold"
                    hint={`${formatCurrency(stats.totalRevenue)} histórico`}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Ganancia del mes"
                    value={formatCurrency(stats.monthProfit)}
                    tone="success"
                    hint={`${formatCurrency(stats.totalProfit)} histórica`}
                />
                <StatCard
                    icon={PackageX}
                    label="Stock bajo"
                    value={stats.lowStockCount}
                    tone="warning"
                    hint={`${stats.productsCount} productos activos`}
                />
            </div>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <FlexiChart
                        data={chartData}
                        formatValue={formatCurrency}
                        formatAxis={formatCompactCurrency}
                        goal={average > 0 ? { value: average, label: 'Promedio' } : undefined}
                        header={
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="font-display text-base font-semibold text-ink-900">Últimos 6 meses</h2>
                                <PillSwitch
                                    options={METRICS}
                                    value={metric}
                                    onChange={setMetric}
                                    layoutId="dashboard-metric"
                                />
                            </div>
                        }
                    />
                </Card>

                <Card className="p-6">
                    <h2 className="font-display text-base font-semibold text-ink-900">Equipos por estado</h2>
                    <ul className="mt-4 space-y-3">
                        {statusBreakdown
                            .filter((s) => s.total > 0)
                            .map((s) => (
                                <li key={s.status} className="flex items-center justify-between text-sm">
                                    <StatusBadge status={s.status} label={s.label} />
                                    <span className="font-semibold text-ink-700">{s.total}</span>
                                </li>
                            ))}
                    </ul>

                    {deviceTypeCounts.length > 0 && (
                        <>
                            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-400">
                                Por tipo de equipo
                            </h3>
                            <ul className="mt-3 space-y-2">
                                {deviceTypeCounts.map((d) => (
                                    <li key={d.label} className="flex items-center justify-between text-sm text-ink-600">
                                        <span>{d.label}</span>
                                        <span className="font-semibold">{d.total}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Card>
            </div>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-base font-semibold text-ink-900">Últimos equipos ingresados</h2>
                        <Link href="/admin/repair-orders" className="flex items-center gap-1 text-sm font-semibold text-brand-600">
                            Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-xs uppercase tracking-wide text-ink-400">
                                    <th className="pb-2">Código</th>
                                    <th className="pb-2">Cliente</th>
                                    <th className="hidden pb-2 sm:table-cell">Equipo</th>
                                    <th className="pb-2">Estado</th>
                                    <th className="hidden pb-2 sm:table-cell">Ingreso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="py-2.5">
                                            <Link
                                                href={`/admin/repair-orders/${order.id}`}
                                                className="font-semibold text-brand-600 hover:underline"
                                            >
                                                {order.code}
                                            </Link>
                                        </td>
                                        <td className="py-2.5 pr-2 text-ink-700">{order.customer_name}</td>
                                        <td className="hidden py-2.5 text-ink-500 sm:table-cell">{order.brand} {order.model}</td>
                                        <td className="py-2.5">
                                            <StatusBadge status={order.status} label={order.status_label} />
                                        </td>
                                        <td className="hidden py-2.5 text-ink-500 sm:table-cell">{formatDate(order.received_at)}</td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-6 text-center text-ink-400">
                                            Todavía no hay equipos cargados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink-900">
                            <MessageSquareWarning className="h-4 w-4 text-brand-500" /> Mensajes recientes
                        </h2>
                        <Link href="/admin/messages" className="text-sm font-semibold text-brand-600">
                            Ver todos
                        </Link>
                    </div>
                    <ul className="mt-4 space-y-4">
                        {recentMessages.map((m) => (
                            <li key={m.id} className="text-sm">
                                <p className="font-semibold text-ink-800">{m.name}</p>
                                <p className="line-clamp-2 text-ink-500">{m.message}</p>
                            </li>
                        ))}
                        {recentMessages.length === 0 && <p className="text-sm text-ink-400">Sin mensajes por ahora.</p>}
                    </ul>

                    {lowStockProducts.length > 0 && (
                        <>
                            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-400">
                                Stock bajo
                            </h3>
                            <ul className="mt-3 space-y-2">
                                {lowStockProducts.map((p) => (
                                    <li key={p.id} className="flex items-center justify-between text-sm">
                                        <Link href={`/admin/products/${p.id}/edit`} className="text-ink-700 hover:text-brand-600">
                                            {p.name}
                                        </Link>
                                        <span className="font-semibold text-amber-600">{p.stock} u.</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
