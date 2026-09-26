import { Link, usePage } from '@inertiajs/react';
import { ImageOff } from 'lucide-react';
import Badge from '@/Components/UI/Badge';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { formatCurrency, waLink } from '@/lib/utils';

export default function ProductCard({ product }) {
    const { settings } = usePage().props;
    const image = product.images?.[0]?.url;
    const onOffer = Boolean(product.compare_price);

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-sm transition duration-180 ease-out-soft hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-sm">
            <Link href={route('catalog.show', product.slug)} className="relative block aspect-square overflow-hidden bg-surface-elevated">
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 ease-out-soft group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-600">
                        <ImageOff className="h-10 w-10" />
                    </div>
                )}

                {(product.is_featured || onOffer) && (
                    <Badge tone={onOffer ? 'danger' : 'gold'} className="absolute left-3 top-3">
                        {onOffer ? 'Oferta' : 'Destacado'}
                    </Badge>
                )}
                {product.stock <= 0 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-semibold text-white backdrop-blur-[2px]">
                        Sin stock
                    </span>
                )}
            </Link>

            <div className="flex flex-1 flex-col gap-1 p-4">
                {product.category && (
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                        {product.category.name}
                    </span>
                )}
                <Link href={route('catalog.show', product.slug)}>
                    <h3 className="line-clamp-2 font-display text-sm font-semibold text-foreground transition hover:text-primary">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                    <div>
                        <p className="font-display text-lg font-bold text-foreground">
                            {formatCurrency(product.price)}
                        </p>
                        {product.compare_price && (
                            <p className="text-xs text-muted-foreground line-through">
                                {formatCurrency(product.compare_price)}
                            </p>
                        )}
                    </div>
                    <a
                        href={waLink(settings.whatsapp_number, `Hola! Quiero consultar por: ${product.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Consultar ${product.name} por WhatsApp`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-ink-300 transition duration-150 hover:bg-[#25D366] hover:text-white"
                    >
                        <WhatsAppIcon className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}
