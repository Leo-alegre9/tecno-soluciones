<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, ?string $default = null): ?string
    {
        return Cache::rememberForever("setting:{$key}", function () use ($key, $default) {
            return static::query()->where('key', $key)->value('value') ?? $default;
        });
    }

    public static function set(string $key, ?string $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("setting:{$key}");
    }

    public static function all_public(): array
    {
        return [
            'site_name' => static::get('site_name', 'Tecno Soluciones'),
            'tagline' => static::get('tagline', 'Servicio Técnico & Microelectrónica'),
            'whatsapp_number' => static::get('whatsapp_number', '5493794037947'),
            'phone_display' => static::get('phone_display', '+54 9 379 403-7947'),
            'email' => static::get('email', 'contacto@tecnosoluciones.com.ar'),
            'address' => static::get('address', 'Ayacucho 2970, Corrientes, Corrientes'),
            'city' => static::get('city', 'Corrientes, Argentina'),
            'schedule' => static::get('schedule', "Lunes a Viernes: 9 a 13 y 16 a 20 hs\nSábados: 9 a 13 hs"),
            'instagram_url' => static::get('instagram_url', 'https://www.instagram.com/tecnosoluciones.ctes/'),
            'map_embed_url' => static::get('map_embed_url', 'https://www.google.com/maps?q=Ayacucho+2970,+Corrientes&output=embed'),
        ];
    }
}
