import Dashboard from '@/views/Admin/Dashboard';
import { CLOSED_STATUSES, DEVICE_TYPES, STATUSES, decorateOrder, profitOf } from '@/lib/repairOrders';
import { createClient } from '@/lib/supabase/server';
import { TIME_ZONE } from '@/lib/utils';

export const metadata = { title: 'Dashboard' };

const sum = (items, fn) => items.reduce((total, item) => total + fn(item), 0);

// "2026-09" in Argentina time.
const monthKey = (date) =>
    new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: TIME_ZONE })
        .format(new Date(date))
        .slice(0, 7);

export default async function DashboardPage() {
    const supabase = await createClient();

    const [ordersRes, productsRes, messagesRes] = await Promise.all([
        supabase
            .from('repair_orders')
            .select('id, code, customer_name, brand, model, status, device_type, charged_price, parts_cost, labor_cost, received_at, delivered_at')
            .order('received_at', { ascending: false }),
        supabase.from('products').select('id, name, stock, is_active'),
        supabase.from('contact_messages').select('id, name, message, is_attended, created_at').order('created_at', { ascending: false }),
    ]);

    const orders = (ordersRes.data ?? []).map(decorateOrder);
    const products = productsRes.data ?? [];
    const messages = messagesRes.data ?? [];

    const now = new Date();
    const currentMonth = monthKey(now);
    const delivered = orders.filter((o) => o.status === 'entregado');
    const deliveredThisMonth = delivered.filter((o) => o.delivered_at && monthKey(o.delivered_at) === currentMonth);

    // Last 6 months, oldest first.
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 15);
        months.push(monthKey(d));
    }
    // All 6 months, including empty ones, so the chart keeps a steady timeline.
    const monthlySeries = months.map((month) => {
        const inMonth = delivered.filter((o) => o.delivered_at && monthKey(o.delivered_at) === month);
        const [year, m] = month.split('-').map(Number);
        const name = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' })
            .format(new Date(Date.UTC(year, m - 1, 15)))
            .replace('.', '');
        return {
            month,
            label: name.charAt(0).toUpperCase() + name.slice(1),
            ingresos: sum(inMonth, (o) => Number(o.charged_price ?? 0)),
            ganancia: sum(inMonth, profitOf),
            count: inMonth.length,
        };
    });

    const statusBreakdown = Object.entries(STATUSES).map(([status, label]) => ({
        status,
        label,
        total: orders.filter((o) => o.status === status).length,
    }));

    const deviceCounts = {};
    for (const o of orders) deviceCounts[o.device_type] = (deviceCounts[o.device_type] ?? 0) + 1;
    const deviceTypeCounts = Object.entries(deviceCounts)
        .map(([type, total]) => ({ label: DEVICE_TYPES[type] ?? type, total }))
        .sort((a, b) => b.total - a.total);

    const lowStock = products.filter((p) => p.is_active && p.stock <= 2).sort((a, b) => a.stock - b.stock);

    return (
        <Dashboard
            stats={{
                openOrders: orders.filter((o) => !CLOSED_STATUSES.includes(o.status)).length,
                totalOrders: orders.length,
                totalRevenue: sum(delivered, (o) => Number(o.charged_price ?? 0)),
                totalProfit: sum(delivered, profitOf),
                monthRevenue: sum(deliveredThisMonth, (o) => Number(o.charged_price ?? 0)),
                monthProfit: sum(deliveredThisMonth, profitOf),
                productsCount: products.length,
                lowStockCount: lowStock.length,
                unattendedMessages: messages.filter((m) => !m.is_attended).length,
            }}
            monthlySeries={monthlySeries}
            statusBreakdown={statusBreakdown}
            deviceTypeCounts={deviceTypeCounts}
            recentOrders={orders.slice(0, 6)}
            recentMessages={messages.slice(0, 6)}
            lowStockProducts={lowStock.slice(0, 6)}
        />
    );
}
