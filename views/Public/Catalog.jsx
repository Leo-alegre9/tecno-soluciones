'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Container from '@/Components/UI/Container';
import ProductCard from '@/Components/ProductCard';
import DynamicIcon from '@/Components/DynamicIcon';
import Pagination from '@/Components/UI/Pagination';
import { Input } from '@/Components/UI/Field';
import { Search, PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { withQuery } from '@/lib/url';

const categoryLinkClass =
    'flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition lg:rounded-control lg:px-3';

export default function Catalog({ products, categories, filters }) {
    const router = useRouter();
    const [search, setSearch] = useState(filters.buscar || '');

    function submitSearch(e) {
        e.preventDefault();
        router.replace(withQuery('/catalogo', { ...filters, buscar: search }), { scroll: false });
    }

    return (
        <PublicLayout>
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
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
                        <aside className="min-w-0 space-y-4 lg:space-y-6">
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
                                <h3 className="mb-3 hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:block">
                                    Categorías
                                </h3>
                                {/* Mobile: one row of scrollable chips. Desktop: vertical list. */}
                                <nav
                                    aria-label="Categorías"
                                    className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
                                >
                                    <Link
                                        href={withQuery('/catalogo', { buscar: filters.buscar })}
                                        scroll={false}
                                        className={cn(
                                            categoryLinkClass,
                                            !filters.categoria
                                                ? 'border-primary/40 bg-white/10 text-primary lg:border-transparent'
                                                : 'border-border text-muted-foreground hover:bg-white/5 hover:text-foreground lg:border-transparent',
                                        )}
                                    >
                                        Todas
                                    </Link>
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={withQuery('/catalogo', { categoria: category.slug, buscar: filters.buscar })}
                                            scroll={false}
                                            className={cn(
                                                categoryLinkClass,
                                                filters.categoria === category.slug
                                                    ? 'border-primary/40 bg-white/10 text-primary lg:border-transparent'
                                                    : 'border-border text-muted-foreground hover:bg-white/5 hover:text-foreground lg:border-transparent',
                                            )}
                                        >
                                            <DynamicIcon name={category.icon} className="h-4 w-4 shrink-0" />
                                            {category.name}
                                            <span className="text-xs text-muted-foreground lg:ml-auto">{category.products_count}</span>
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
