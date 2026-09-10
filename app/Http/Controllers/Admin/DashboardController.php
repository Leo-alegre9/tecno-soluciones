<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Product;
use App\Models\RepairOrder;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $sixMonthsAgo = $now->copy()->subMonths(5)->startOfMonth();

        $delivered = RepairOrder::query()->where('status', 'entregado');

        $totalRevenue = (clone $delivered)->sum('charged_price');
        $totalProfit = (clone $delivered)->get()->sum('profit');

        $monthRevenue = (clone $delivered)->where('delivered_at', '>=', $startOfMonth)->sum('charged_price');
        $monthProfit = (clone $delivered)->where('delivered_at', '>=', $startOfMonth)->get()->sum('profit');

        $monthlySeries = (clone $delivered)
            ->where('delivered_at', '>=', $sixMonthsAgo)
            ->get()
            ->groupBy(fn (RepairOrder $order) => $order->delivered_at?->format('Y-m'))
            ->map(function ($orders, $month) {
                return [
                    'month' => $month,
                    'label' => Carbon::createFromFormat('Y-m', $month)->translatedFormat('M Y'),
                    'ingresos' => (float) $orders->sum('charged_price'),
                    'ganancia' => (float) $orders->sum('profit'),
                ];
            })
            ->values();

        $statusCounts = RepairOrder::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $statusBreakdown = collect(RepairOrder::STATUSES)->map(function ($label, $key) use ($statusCounts) {
            return [
                'status' => $key,
                'label' => $label,
                'total' => (int) ($statusCounts[$key] ?? 0),
            ];
        })->values();

        $deviceTypeCounts = RepairOrder::query()
            ->selectRaw('device_type, count(*) as total')
            ->groupBy('device_type')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($row) => [
                'label' => RepairOrder::DEVICE_TYPES[$row->device_type] ?? $row->device_type,
                'total' => (int) $row->total,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'openOrders' => RepairOrder::query()->whereNotIn('status', RepairOrder::CLOSED_STATUSES)->count(),
                'totalOrders' => RepairOrder::query()->count(),
                'totalRevenue' => (float) $totalRevenue,
                'totalProfit' => (float) $totalProfit,
                'monthRevenue' => (float) $monthRevenue,
                'monthProfit' => (float) $monthProfit,
                'productsCount' => Product::query()->count(),
                'lowStockCount' => Product::query()->where('is_active', true)->where('stock', '<=', 2)->count(),
                'unattendedMessages' => ContactMessage::query()->where('is_attended', false)->count(),
            ],
            'monthlySeries' => $monthlySeries,
            'statusBreakdown' => $statusBreakdown,
            'deviceTypeCounts' => $deviceTypeCounts,
            'recentOrders' => RepairOrder::query()->latest('received_at')->limit(6)->get(),
            'recentMessages' => ContactMessage::query()->latest()->limit(6)->get(),
            'lowStockProducts' => Product::query()->where('is_active', true)->where('stock', '<=', 2)->orderBy('stock')->limit(6)->get(),
        ]);
    }
}
