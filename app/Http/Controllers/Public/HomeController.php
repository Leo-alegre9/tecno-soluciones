<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Home', [
            'featuredProducts' => Product::query()
                ->with(['images', 'category'])
                ->where('is_active', true)
                ->where('is_featured', true)
                ->orderBy('order')
                ->limit(6)
                ->get(),
            'categories' => Category::query()->withCount('products')->orderBy('order')->get(),
            'services' => Service::query()->where('is_active', true)->orderBy('order')->limit(6)->get(),
        ]);
    }
}
