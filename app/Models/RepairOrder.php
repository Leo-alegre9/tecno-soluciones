<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class RepairOrder extends Model
{
    public const STATUSES = [
        'recibido' => 'Recibido',
        'diagnosticando' => 'En diagnóstico',
        'presupuestado' => 'Presupuestado',
        'aprobado' => 'Aprobado por cliente',
        'en_reparacion' => 'En reparación',
        'listo' => 'Listo para retirar',
        'entregado' => 'Entregado',
        'no_reparable' => 'No reparable',
        'cancelado' => 'Cancelado',
    ];

    public const DEVICE_TYPES = [
        'celular' => 'Celular',
        'notebook' => 'Notebook',
        'pc' => 'PC de escritorio',
        'tablet' => 'Tablet',
        'componente' => 'Componente / Microelectrónica',
        'audio' => 'Audio / Parlantes',
        'otro' => 'Otro',
    ];

    public const CLOSED_STATUSES = ['entregado', 'no_reparable', 'cancelado'];

    protected $fillable = [
        'code', 'customer_name', 'customer_phone', 'customer_dni',
        'device_type', 'brand', 'model', 'serial_number',
        'reported_issue', 'accessories', 'device_password',
        'status', 'parts_cost', 'labor_cost', 'charged_price',
        'warranty_days', 'warranty_notes', 'internal_notes',
        'technician_id', 'received_at', 'promised_at', 'delivered_at',
    ];

    protected $casts = [
        'parts_cost' => 'decimal:2',
        'labor_cost' => 'decimal:2',
        'charged_price' => 'decimal:2',
        'received_at' => 'datetime',
        'promised_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    protected $appends = ['profit', 'status_label', 'device_type_label'];

    protected static function booted(): void
    {
        static::creating(function (RepairOrder $order) {
            if (empty($order->code)) {
                $next = ((int) static::query()->max('id')) + 1;
                $order->code = 'TS-' . now()->format('y') . '-' . Str::padLeft((string) $next, 5, '0');
            }
        });
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(RepairOrderStatusLog::class)->latest();
    }

    public function getProfitAttribute(): float
    {
        return (float) ($this->charged_price ?? 0) - (float) $this->parts_cost - (float) $this->labor_cost;
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getDeviceTypeLabelAttribute(): string
    {
        return self::DEVICE_TYPES[$this->device_type] ?? $this->device_type;
    }
}
