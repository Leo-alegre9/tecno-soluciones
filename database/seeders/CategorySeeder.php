<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Celulares', 'icon' => 'smartphone'],
            ['name' => 'Notebooks & PC', 'icon' => 'laptop'],
            ['name' => 'Componentes & Microelectrónica', 'icon' => 'cpu'],
            ['name' => 'Audio & Parlantes', 'icon' => 'headphones'],
            ['name' => 'Tablets', 'icon' => 'tablet'],
            ['name' => 'Accesorios', 'icon' => 'plug'],
        ];

        foreach ($categories as $index => $category) {
            Category::query()->firstOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'icon' => $category['icon'],
                    'order' => $index,
                ]
            );
        }
    }
}
