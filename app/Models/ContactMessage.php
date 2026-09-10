<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = ['name', 'phone', 'email', 'source', 'message', 'is_attended'];

    protected $casts = [
        'is_attended' => 'boolean',
    ];
}
