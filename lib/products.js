export const PRODUCT_SELECT = '*, images:product_images(*), category:categories(*)';

export function imageUrl(path) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${path}`;
}

export function decorateProduct(product) {
    return {
        ...product,
        images: (product.images ?? [])
            .map((image) => ({ ...image, url: imageUrl(image.path) }))
            .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id),
    };
}

export function withProductCount(category) {
    const { products, ...rest } = category;
    return { ...rest, products_count: products?.[0]?.count ?? 0 };
}
