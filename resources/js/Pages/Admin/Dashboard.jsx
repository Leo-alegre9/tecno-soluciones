import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/UI/StatCard';
import Card from '@/Components/UI/Card';
import StatusBadge from '@/Components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import {
    Wrench,
    DollarSign,
    TrendingUp,
    PackageX,
    MessageSquareWarning,
    ArrowUpRight,
} from 'lucide-react';

export default function Dashboard({ stats, monthlySeries, statusBreakdown, deviceTypeCounts, recentOrders, recentMessages, lowStockProducts }) {
    return (
        <AdminLayout header="Dashboard">
            <Head title="Dashboard" />

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

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-base font-semibold text-ink-900">
                            Ingresos y ganancia (últimos meses)
                        </h2>
                    </div>
                    <div className="mt-4 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlySeries}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E9" />
                                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6E6E80' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#6E6E80' }} axisLine={false} tickLine={false} width={80} tickFormatter={(v) => formatCurrency(v)} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Bar dataKey="ingresos" fill="#FB7A3C" radius={[6, 6, 0, 0]} name="Ingresos" />
                                <Bar dataKey="ganancia" fill="#F0A93B" radius={[6, 6, 0, 0]} name="Ganancia" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
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

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-base font-semibold text-ink-900">Últimos equipos ingresados</h2>
                        <Link href={route('admin.repair-orders.index')} className="flex items-center gap-1 text-sm font-semibold text-brand-600">
                            Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-xs uppercase tracking-wide text-ink-400">
                                    <th className="pb-2">Código</th>
                                    <th className="pb-2">Cliente</th>
                                    <th className="pb-2">Equipo</th>
                                    <th className="pb-2">Estado</th>
                                    <th className="pb-2">Ingreso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="py-2.5">
                                            <Link
                                                href={route('admin.repair-orders.show', order.id)}
                                                className="font-semibold text-brand-600 hover:underline"
                                            >
                                                {order.code}
                                            </Link>
                                        </td>
                                        <td className="py-2.5 text-ink-700">{order.customer_name}</td>
                                        <td className="py-2.5 text-ink-500">{order.brand} {order.model}</td>
                                        <td className="py-2.5">
                                            <StatusBadge status={order.status} label={order.status_label} />
                                        </td>
                                        <td className="py-2.5 text-ink-500">{formatDate(order.received_at)}</td>
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
                        <Link href={route('admin.messages.index')} className="text-sm font-semibold text-brand-600">
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
                                        <Link href={route('admin.products.edit', p.id)} className="text-ink-700 hover:text-brand-600">
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
