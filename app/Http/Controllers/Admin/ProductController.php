<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['images', 'category'])
            ->when($request->string('buscar')->toString(), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->string('categoria')->toString(), fn ($q, $c) => $q->where('category_id', $c))
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => Category::query()->orderBy('name')->get(),
            'filters' => $request->only(['buscar', 'categoria']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::query()->orderBy('name')->get(),
            'product' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->boolean('is_active');

        $data['slug'] = $this->uniqueSlug($data['name']);

        $product = Product::query()->create($data);

        $this->storeImages($request, $product);

        return redirect()->route('admin.products.index')->with('success', 'Producto creado correctamente.');
    }

    public function edit(Product $product): Response
    {
        $product->load('images');

        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::query()->orderBy('name')->get(),
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_active'] = $request->boolean('is_active');

        if ($data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }

        $product->update($data);

        $this->storeImages($request, $product);

        if ($request->filled('remove_image_ids')) {
            $ids = collect($request->input('remove_image_ids'))->filter();
            $images = ProductImage::query()->whereIn('id', $ids)->where('product_id', $product->id)->get();
            foreach ($images as $image) {
                Storage::disk('public')->delete($image->path);
                $image->delete();
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $product->delete();

        return back()->with('success', 'Producto eliminado.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'sku' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'condition' => ['required', 'in:nuevo,usado,reacondicionado'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
        ]);
    }

    private function storeImages(Request $request, Product $product): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $currentMax = $product->images()->max('order') ?? -1;

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('products', 'public');

            ProductImage::query()->create([
                'product_id' => $product->id,
                'path' => $path,
                'order' => $currentMax + $index + 1,
            ]);
        }
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $i = 1;

        while (Product::query()->where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$original}-" . $i++;
        }

        return $slug;
    }
}
