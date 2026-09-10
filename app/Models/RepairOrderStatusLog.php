<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairOrderStatusLog extends Model
{
    protected $fillable = ['repair_order_id', 'status', 'note', 'user_id'];

    protected $appends = ['status_label'];

    public function repairOrder(): BelongsTo
    {
        return $this->belongsTo(RepairOrder::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return RepairOrder::STATUSES[$this->status] ?? $this->status;
    }
}
