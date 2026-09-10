<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RepairOrder;
use App\Models\RepairOrderStatusLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RepairOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = RepairOrder::query()
            ->with('technician')
            ->when($request->string('estado')->toString(), fn ($q, $s) => $q->where('status', $s))
            ->when($request->string('buscar')->toString(), function ($q, $s) {
                $q->where(function ($sub) use ($s) {
                    $sub->where('customer_name', 'like', "%{$s}%")
                        ->orWhere('code', 'like', "%{$s}%")
                        ->orWhere('brand', 'like', "%{$s}%")
                        ->orWhere('model', 'like', "%{$s}%");
                });
            })
            ->latest('received_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/RepairOrders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['estado', 'buscar']),
            'statuses' => RepairOrder::STATUSES,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/RepairOrders/Form', [
            'order' => null,
            'statuses' => RepairOrder::STATUSES,
            'deviceTypes' => RepairOrder::DEVICE_TYPES,
            'technicians' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $order = RepairOrder::query()->create($data);

        RepairOrderStatusLog::query()->create([
            'repair_order_id' => $order->id,
            'status' => $order->status,
            'note' => 'Equipo ingresado.',
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('admin.repair-orders.show', $order)->with('success', "Equipo cargado con código {$order->code}.");
    }

    public function show(RepairOrder $repairOrder): Response
    {
        $repairOrder->load(['statusLogs.user', 'technician']);

        return Inertia::render('Admin/RepairOrders/Show', [
            'order' => $repairOrder,
            'statuses' => RepairOrder::STATUSES,
        ]);
    }

    public function edit(RepairOrder $repairOrder): Response
    {
        return Inertia::render('Admin/RepairOrders/Form', [
            'order' => $repairOrder,
            'statuses' => RepairOrder::STATUSES,
            'deviceTypes' => RepairOrder::DEVICE_TYPES,
            'technicians' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, RepairOrder $repairOrder): RedirectResponse
    {
        $data = $this->validateData($request);

        $statusChanged = $data['status'] !== $repairOrder->status;

        $repairOrder->update($data);

        if ($statusChanged) {
            $this->logStatus($repairOrder, $data['status'], $request->user()->id);
        }

        return redirect()->route('admin.repair-orders.show', $repairOrder)->with('success', 'Ficha actualizada correctamente.');
    }

    public function updateStatus(Request $request, RepairOrder $repairOrder): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:' . implode(',', array_keys(RepairOrder::STATUSES))],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $repairOrder->status = $data['status'];

        if ($data['status'] === 'entregado' && ! $repairOrder->delivered_at) {
            $repairOrder->delivered_at = now();
        }

        $repairOrder->save();

        $this->logStatus($repairOrder, $data['status'], $request->user()->id, $data['note'] ?? null);

        return back()->with('success', 'Estado actualizado.');
    }

    public function destroy(RepairOrder $repairOrder): RedirectResponse
    {
        $repairOrder->delete();

        return redirect()->route('admin.repair-orders.index')->with('success', 'Ficha eliminada.');
    }

    private function logStatus(RepairOrder $order, string $status, int $userId, ?string $note = null): void
    {
        RepairOrderStatusLog::query()->create([
            'repair_order_id' => $order->id,
            'status' => $status,
            'note' => $note,
            'user_id' => $userId,
        ]);
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'customer_name' => ['required', 'string', 'max:150'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'customer_dni' => ['nullable', 'string', 'max:30'],
            'device_type' => ['required', 'in:' . implode(',', array_keys(RepairOrder::DEVICE_TYPES))],
            'brand' => ['required', 'string', 'max:80'],
            'model' => ['required', 'string', 'max:80'],
            'serial_number' => ['nullable', 'string', 'max:120'],
            'reported_issue' => ['required', 'string', 'max:2000'],
            'accessories' => ['nullable', 'string', 'max:1000'],
            'device_password' => ['nullable', 'string', 'max:120'],
            'status' => ['required', 'in:' . implode(',', array_keys(RepairOrder::STATUSES))],
            'parts_cost' => ['required', 'numeric', 'min:0'],
            'labor_cost' => ['required', 'numeric', 'min:0'],
            'charged_price' => ['nullable', 'numeric', 'min:0'],
            'warranty_days' => ['required', 'integer', 'min:0'],
            'warranty_notes' => ['nullable', 'string', 'max:1000'],
            'internal_notes' => ['nullable', 'string', 'max:2000'],
            'technician_id' => ['nullable', 'exists:users,id'],
            'promised_at' => ['nullable', 'date'],
        ]);
    }
}
