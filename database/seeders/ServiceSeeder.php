<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'title' => 'Diagnóstico técnico',
                'icon' => 'search-check',
                'description' => 'Revisión completa del equipo para detectar la falla real antes de presupuestar cualquier reparación.',
            ],
            [
                'title' => 'Service especializado Apple',
                'icon' => 'apple',
                'description' => 'Reparación de iPhone, iPad y Mac: pantallas, baterías, conectores de carga, cámaras y microsoldadura de placa.',
            ],
            [
                'title' => 'Reparación de celulares Android',
                'icon' => 'smartphone',
                'description' => 'Cambio de pantallas, baterías, módulos de carga, botones y reparación de placa en equipos Android de todas las marcas.',
            ],
            [
                'title' => 'Notebooks y PC de escritorio',
                'icon' => 'laptop',
                'description' => 'Mantenimiento, cambio de teclados y pantallas, actualización de memoria/SSD, formateo e instalación de software.',
            ],
            [
                'title' => 'Microelectrónica y microsoldadura',
                'icon' => 'cpu',
                'description' => 'Reparación de placas a nivel de componente: cortos, pistas dañadas, chips de carga y microcontroladores.',
            ],
            [
                'title' => 'Audio y parlantes',
                'icon' => 'headphones',
                'description' => 'Reparación de parlantes bluetooth, auriculares y equipos de audio: baterías, conectores y placas de sonido.',
            ],
            [
                'title' => 'Diseño y desarrollo web',
                'icon' => 'globe',
                'description' => 'Páginas web modernas y a medida para emprendimientos y comercios, igual que la que estás viendo ahora.',
            ],
        ];

        foreach ($services as $index => $service) {
            Service::query()->firstOrCreate(
                ['slug' => Str::slug($service['title'])],
                [
                    'title' => $service['title'],
                    'icon' => $service['icon'],
                    'description' => $service['description'],
                    'order' => $index,
                    'is_active' => true,
                ]
            );
        }
    }
}
