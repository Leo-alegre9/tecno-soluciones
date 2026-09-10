<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['images', 'category'])
            ->where('is_active', true)
            ->when($request->string('categoria')->toString(), function ($query, $slug) {
                $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
            })
            ->when($request->string('buscar')->toString(), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('is_featured')
            ->orderBy('order')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Public/Catalog', [
            'products' => $products,
            'categories' => Category::query()->withCount('products')->orderBy('order')->get(),
            'filters' => $request->only(['categoria', 'buscar']),
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load(['images', 'category']);

        $related = Product::query()
            ->with(['images'])
            ->where('is_active', true)
            ->where('id', '!=', $product->id)
            ->when($product->category_id, fn ($q) => $q->where('category_id', $product->category_id))
            ->limit(4)
            ->get();

        return Inertia::render('Public/ProductShow', [
            'product' => $product,
            'related' => $related,
        ]);
    }
}
