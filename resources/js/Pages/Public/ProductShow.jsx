import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import ProductCard from '@/Components/ProductCard';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { formatCurrency, waLink } from '@/lib/utils';
import { ChevronLeft, ImageOff, ShieldCheck } from 'lucide-react';

const conditionLabels = {
    nuevo: 'Nuevo',
    usado: 'Usado',
    reacondicionado: 'Reacondicionado',
};

export default function ProductShow({ product, related }) {
    const { settings } = usePage().props;
    const images = product.images?.length ? product.images : [null];
    const [active, setActive] = useState(0);

    const waHref = waLink(
        settings.whatsapp_number,
        `Hola! Te consulto por este producto: ${product.name} (${window.location.href})`,
    );

    return (
        <PublicLayout>
            <Head title={product.name} />

            <section className="bg-ink-950 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link
                        href={route('catalog.index')}
                        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink-400 hover:text-white"
                    >
                        <ChevronLeft className="h-4 w-4" /> Volver al catálogo
                    </Link>

                    <div className="grid gap-10 lg:grid-cols-2">
                        <div>
                            <div className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
                                {images[active] ? (
                                    <img
                                        src={images[active].url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-ink-600">
                                        <ImageOff className="h-16 w-16" />
                                    </div>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="mt-3 flex gap-3 overflow-x-auto">
                                    {images.map((image, index) => (
                                        <button
                                            key={image?.id ?? index}
                                            onClick={() => setActive(index)}
                                            className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                                                active === index ? 'border-brand-500' : 'border-transparent'
                                            }`}
                                        >
                                            <img src={image.url} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            {product.category && (
                                <span className="text-xs font-semibold uppercase tracking-wide text-brand-400">
                                    {product.category.name}
                                </span>
                            )}
                            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                                {product.name}
                            </h1>

                            <div className="mt-3 flex items-center gap-3">
                                <Badge tone="brand">{conditionLabels[product.condition] ?? product.condition}</Badge>
                                {product.stock > 0 ? (
                                    <Badge tone="success">En stock ({product.stock})</Badge>
                                ) : (
                                    <Badge tone="danger">Sin stock</Badge>
                                )}
                            </div>

                            <div className="mt-6 flex items-baseline gap-3">
                                <span className="font-display text-3xl font-extrabold text-white">
                                    {formatCurrency(product.price)}
                                </span>
                                {product.compare_price && (
                                    <span className="text-lg text-ink-400 line-through">
                                        {formatCurrency(product.compare_price)}
                                    </span>
                                )}
                            </div>

                            {product.description && (
                                <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-300">
                                    {product.description}
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button href={waHref} target="_blank" size="lg">
                                    <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
                                </Button>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-sm text-ink-400">
                                <ShieldCheck className="h-4 w-4 text-brand-400" /> Comprá con confianza, coordinamos
                                entrega o retiro en el local.
                            </div>
                        </div>
                    </div>

                    {related.length > 0 && (
                        <div className="mt-16 border-t border-white/10 pt-10">
                            <h2 className="mb-6 font-display text-xl font-bold text-white">También te puede interesar</h2>
                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                                {related.map((item) => (
                                    <ProductCard key={item.id} product={item} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
