<?php

namespace Database\Seeders;

use App\Models\RepairOrder;
use App\Models\RepairOrderStatusLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class RepairOrderSeeder extends Seeder
{
    /**
     * Datos de demostración para que el dashboard de estadísticas tenga
     * contenido de ejemplo. Se pueden borrar libremente desde el panel.
     */
    public function run(): void
    {
        $admin = User::query()->first();

        $samples = [
            ['device_type' => 'celular', 'brand' => 'Apple', 'model' => 'iPhone 12', 'issue' => 'No enciende, se moja el equipo', 'status' => 'entregado', 'parts' => 45000, 'labor' => 20000, 'price' => 110000, 'days_ago' => 58],
            ['device_type' => 'celular', 'brand' => 'Samsung', 'model' => 'Galaxy S21', 'issue' => 'Pantalla rota', 'status' => 'entregado', 'parts' => 60000, 'labor' => 15000, 'price' => 130000, 'days_ago' => 50],
            ['device_type' => 'notebook', 'brand' => 'HP', 'model' => 'Pavilion 15', 'issue' => 'No carga la batería', 'status' => 'entregado', 'parts' => 30000, 'labor' => 15000, 'price' => 75000, 'days_ago' => 45],
            ['device_type' => 'celular', 'brand' => 'Motorola', 'model' => 'Moto G22', 'issue' => 'Cambio de módulo de carga', 'status' => 'entregado', 'parts' => 18000, 'labor' => 10000, 'price' => 45000, 'days_ago' => 40],
            ['device_type' => 'componente', 'brand' => 'Genérico', 'model' => 'Placa fuente PC', 'issue' => 'Cortocircuito en fuente', 'status' => 'entregado', 'parts' => 12000, 'labor' => 12000, 'price' => 35000, 'days_ago' => 33],
            ['device_type' => 'celular', 'brand' => 'Apple', 'model' => 'iPhone XR', 'issue' => 'Cambio de batería', 'status' => 'entregado', 'parts' => 22000, 'labor' => 8000, 'price' => 48000, 'days_ago' => 28],
            ['device_type' => 'notebook', 'brand' => 'Lenovo', 'model' => 'IdeaPad 3', 'issue' => 'Formateo y limpieza', 'status' => 'entregado', 'parts' => 0, 'labor' => 15000, 'price' => 25000, 'days_ago' => 20],
            ['device_type' => 'audio', 'brand' => 'JBL', 'model' => 'Charge 4', 'issue' => 'No enciende', 'status' => 'entregado', 'parts' => 8000, 'labor' => 9000, 'price' => 28000, 'days_ago' => 15],
            ['device_type' => 'celular', 'brand' => 'Samsung', 'model' => 'A34', 'issue' => 'Pantalla táctil no responde', 'status' => 'en_reparacion', 'parts' => 55000, 'labor' => 0, 'price' => null, 'days_ago' => 6],
            ['device_type' => 'celular', 'brand' => 'Apple', 'model' => 'iPhone 13', 'issue' => 'Cámara trasera no enfoca', 'status' => 'presupuestado', 'parts' => 0, 'labor' => 0, 'price' => null, 'days_ago' => 4],
            ['device_type' => 'notebook', 'brand' => 'ASUS', 'model' => 'Vivobook 15', 'issue' => 'Se apaga sola / recalienta', 'status' => 'diagnosticando', 'parts' => 0, 'labor' => 0, 'price' => null, 'days_ago' => 2],
            ['device_type' => 'celular', 'brand' => 'Xiaomi', 'model' => 'Redmi Note 12', 'issue' => 'Cambio de pin de carga', 'status' => 'recibido', 'parts' => 0, 'labor' => 0, 'price' => null, 'days_ago' => 1],
        ];

        foreach ($samples as $index => $s) {
            $receivedAt = now()->subDays($s['days_ago']);

            $order = RepairOrder::query()->create([
                'customer_name' => 'Cliente demo ' . ($index + 1),
                'customer_phone' => '379400000' . str_pad((string) $index, 2, '0', STR_PAD_LEFT),
                'device_type' => $s['device_type'],
                'brand' => $s['brand'],
                'model' => $s['model'],
                'reported_issue' => $s['issue'],
                'status' => $s['status'],
                'parts_cost' => $s['parts'],
                'labor_cost' => $s['labor'],
                'charged_price' => $s['price'],
                'warranty_days' => 30,
                'technician_id' => $admin?->id,
                'received_at' => $receivedAt,
                'delivered_at' => $s['status'] === 'entregado' ? $receivedAt->copy()->addDays(3) : null,
                'created_at' => $receivedAt,
                'updated_at' => $receivedAt,
            ]);

            RepairOrderStatusLog::query()->create([
                'repair_order_id' => $order->id,
                'status' => $order->status,
                'note' => 'Carga inicial de demostración.',
                'user_id' => $admin?->id,
                'created_at' => $receivedAt,
                'updated_at' => $receivedAt,
            ]);
        }
    }
}
