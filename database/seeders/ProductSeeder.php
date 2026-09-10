<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Demo/placeholder catalog so the storefront isn't empty on first run.
     * Reemplazar o borrar estos productos desde el panel de administración.
     */
    public function run(): void
    {
        $products = [
            ['category' => 'Celulares', 'name' => 'iPhone 11 64GB', 'condition' => 'usado', 'price' => 380000, 'compare_price' => 420000, 'stock' => 2, 'featured' => true, 'description' => 'iPhone 11 reacondicionado, batería verificada, con garantía de nuestro taller.'],
            ['category' => 'Celulares', 'name' => 'Samsung Galaxy A34 128GB', 'condition' => 'nuevo', 'price' => 310000, 'stock' => 4, 'featured' => true, 'description' => 'Equipo nuevo sellado, garantía oficial.'],
            ['category' => 'Notebooks & PC', 'name' => 'Notebook Lenovo IdeaPad 3 i5', 'condition' => 'usado', 'price' => 520000, 'stock' => 1, 'featured' => true, 'description' => 'Notebook reacondicionada, 8GB RAM, SSD 256GB, ideal estudio y trabajo.'],
            ['category' => 'Notebooks & PC', 'name' => 'SSD 480GB Kingston', 'condition' => 'nuevo', 'price' => 45000, 'stock' => 10, 'description' => 'Repuesto nuevo para upgrade de PC o notebook.'],
            ['category' => 'Componentes & Microelectrónica', 'name' => 'Pantalla iPhone 12 (repuesto)', 'condition' => 'nuevo', 'price' => 95000, 'stock' => 5, 'description' => 'Módulo de pantalla compatible, instalación disponible en el local.'],
            ['category' => 'Componentes & Microelectrónica', 'name' => 'Batería genérica notebook', 'condition' => 'nuevo', 'price' => 38000, 'stock' => 6, 'description' => 'Batería de reemplazo para distintos modelos, consultar compatibilidad.'],
            ['category' => 'Audio & Parlantes', 'name' => 'Parlante Bluetooth JBL Go', 'condition' => 'nuevo', 'price' => 42000, 'stock' => 3, 'description' => 'Parlante portátil, resistente a salpicaduras.'],
            ['category' => 'Accesorios', 'name' => 'Cargador rápido tipo C 20W', 'condition' => 'nuevo', 'price' => 15000, 'stock' => 15, 'featured' => true, 'description' => 'Cargador original compatible, carga rápida certificada.'],
            ['category' => 'Tablets', 'name' => 'Tablet Samsung Galaxy Tab A9', 'condition' => 'nuevo', 'price' => 260000, 'stock' => 2, 'description' => 'Tablet nueva sellada con garantía oficial.'],
        ];

        foreach ($products as $index => $data) {
            $category = Category::query()->where('name', $data['category'])->first();

            Product::query()->firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id' => $category?->id,
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                    'price' => $data['price'],
                    'compare_price' => $data['compare_price'] ?? null,
                    'stock' => $data['stock'],
                    'condition' => $data['condition'],
                    'is_featured' => $data['featured'] ?? false,
                    'is_active' => true,
                    'order' => $index,
                ]
            );
        }
    }
}
