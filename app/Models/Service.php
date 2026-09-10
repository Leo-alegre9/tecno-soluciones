<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title', 'slug', 'icon', 'description', 'price_from', 'is_active', 'order',
    ];

    protected $casts = [
        'price_from' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
