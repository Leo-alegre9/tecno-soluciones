import { Link } from '@inertiajs/react';
import { ImageOff, ShoppingBag } from 'lucide-react';
import Badge from '@/Components/UI/Badge';
import { formatCurrency } from '@/lib/utils';

export default function ProductCard({ product }) {
    const image = product.images?.[0]?.url;

    return (
        <Link
            href={route('catalog.show', product.slug)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-sm transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-brand"
        >
            <div className="relative aspect-square overflow-hidden bg-ink-800">
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-600">
                        <ImageOff className="h-10 w-10" />
                    </div>
                )}

                {product.is_featured && (
                    <Badge tone="gold" className="absolute left-3 top-3">
                        Destacado
                    </Badge>
                )}
                {product.stock <= 0 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink-950/60 text-sm font-semibold text-white">
                        Sin stock
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1 p-4">
                {product.category && (
                    <span className="text-xs font-medium uppercase tracking-wide text-brand-400">
                        {product.category.name}
                    </span>
                )}
                <h3 className="line-clamp-2 font-display text-sm font-semibold text-white">{product.name}</h3>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <div>
                        <p className="font-display text-lg font-bold text-white">
                            {formatCurrency(product.price)}
                        </p>
                        {product.compare_price && (
                            <p className="text-xs text-ink-400 line-through">
                                {formatCurrency(product.compare_price)}
                            </p>
                        )}
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-ink-300 transition group-hover:bg-brand-500 group-hover:text-white">
                        <ShoppingBag className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
