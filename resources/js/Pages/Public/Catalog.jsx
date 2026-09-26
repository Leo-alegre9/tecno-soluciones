import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/UI/Container';
import ProductCard from '@/Components/ProductCard';
import DynamicIcon from '@/Components/DynamicIcon';
import Pagination from '@/Components/UI/Pagination';
import { Input } from '@/Components/UI/Field';
import { Search, PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Catalog({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.buscar || '');

    function submitSearch(e) {
        e.preventDefault();
        router.get(route('catalog.index'), { ...filters, buscar: search }, { preserveState: true, replace: true });
    }

    return (
        <PublicLayout>
            <Head title="Catálogo de productos" />

            <section className="py-14">
                <Container>
                    <h1 className="font-display text-3xl font-bold text-foreground">Catálogo</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Equipos, repuestos y accesorios disponibles. Consultá stock y coordiná la compra por
                        WhatsApp.
                    </p>
                </Container>
            </section>

            <section className="border-t border-border py-10">
                <Container>
                    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                        <aside className="space-y-6">
                            <form onSubmit={submitSearch} className="relative">
                                <Input
                                    theme="dark"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar producto..."
                                    className="pr-10"
                                />
                                <button
                                    type="submit"
                                    aria-label="Buscar"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>

                            <div>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Categorías
                                </h3>
                                <nav className="space-y-1">
                                    <Link
                                        href={route('catalog.index', { buscar: filters.buscar })}
                                        className={cn(
                                            'flex min-h-[44px] items-center justify-between rounded-control px-3 py-2 text-sm font-medium transition',
                                            !filters.categoria
                                                ? 'bg-white/10 text-primary'
                                                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                                        )}
                                    >
                                        Todas
                                    </Link>
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={route('catalog.index', { categoria: category.slug, buscar: filters.buscar })}
                                            className={cn(
                                                'flex min-h-[44px] items-center gap-2 rounded-control px-3 py-2 text-sm font-medium transition',
                                                filters.categoria === category.slug
                                                    ? 'bg-white/10 text-primary'
                                                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                                            )}
                                        >
                                            <DynamicIcon name={category.icon} className="h-4 w-4" />
                                            {category.name}
                                            <span className="ml-auto text-xs text-muted-foreground">{category.products_count}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        <div>
                            {products.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border py-20 text-center">
                                    <PackageSearch className="h-10 w-10 text-ink-600" />
                                    <p className="mt-4 font-medium text-muted-foreground">
                                        No encontramos productos con esos filtros.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}

                            <Pagination links={products.links} theme="dark" />
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}
