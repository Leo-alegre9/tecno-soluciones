<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/Edit', [
            'settings' => Setting::all_public(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => ['required', 'string', 'max:100'],
            'tagline' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:500'],
            'whatsapp_number' => ['required', 'string', 'max:20'],
            'phone_display' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:120'],
            'address' => ['required', 'string', 'max:200'],
            'city' => ['nullable', 'string', 'max:100'],
            'schedule' => ['nullable', 'string', 'max:500'],
            'instagram_url' => ['nullable', 'url', 'max:200'],
            'map_embed_url' => ['nullable', 'url', 'max:500'],
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Configuración actualizada.');
    }
}
