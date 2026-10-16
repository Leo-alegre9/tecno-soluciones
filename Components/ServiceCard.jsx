'use client';

import { useState } from 'react';
import { useSettings } from '@/lib/SettingsContext';
import DynamicIcon from '@/Components/DynamicIcon';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import Modal from '@/Components/UI/Modal';
import Button from '@/Components/UI/Button';
import { formatCurrency, waLink, cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const sizeClasses = {
    lg: 'lg:col-span-2 lg:row-span-2 lg:p-8',
    wide: 'lg:col-span-2 lg:p-7',
    default: 'lg:p-6',
};

export default function ServiceCard({ service, size = 'default' }) {
    const settings = useSettings();
    const [open, setOpen] = useState(false);
    const featured = size !== 'default';

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    'group relative flex h-full w-full flex-col overflow-hidden rounded-card border border-border bg-surface p-6 text-left shadow-sm transition duration-180 ease-out-soft hover:-translate-y-1 hover:border-primary/40 hover:bg-surface-hover hover:shadow-glow-sm',
                    sizeClasses[size],
                )}
            >
                {featured && (
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition duration-300 group-hover:bg-primary/20" />
                )}

                <span
                    className={cn(
                        'relative mb-4 flex items-center justify-center rounded-control bg-brand-gradient text-white',
                        size === 'lg' ? 'h-14 w-14' : 'h-12 w-12',
                    )}
                >
                    <DynamicIcon name={service.icon} className={size === 'lg' ? 'h-7 w-7' : 'h-6 w-6'} />
                </span>

                <h3
                    className={cn(
                        'relative font-display font-semibold text-foreground',
                        size === 'lg' ? 'text-xl' : 'text-base',
                    )}
                >
                    {service.title}
                </h3>
                <p
                    className={cn(
                        'relative mt-2 flex-1 leading-relaxed text-muted-foreground',
                        size === 'lg' ? 'text-sm sm:max-w-md' : 'line-clamp-3 text-sm',
                    )}
                >
                    {service.description}
                </p>

                <div className="relative mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm font-medium text-ink-300">
                        {service.price_from ? `Desde ${formatCurrency(service.price_from)}` : 'Precio a consultar'}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary transition duration-180 group-hover:gap-1.5">
                        Ver servicio <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </button>

            <Modal show={open} onClose={() => setOpen(false)} maxWidth="sm" theme="dark">
                <span className="flex h-12 w-12 items-center justify-center rounded-control bg-brand-gradient text-white">
                    <DynamicIcon name={service.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 pr-8 font-display text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-ink-200">
                    {service.price_from ? `Desde ${formatCurrency(service.price_from)}` : 'Precio a consultar'}
                </p>

                <Button
                    href={waLink(settings.whatsapp_number, `Hola! Quiero consultar por: ${service.title}`)}
                    target="_blank"
                    className="mt-6 w-full justify-center"
                >
                    <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
                </Button>
            </Modal>
        </>
    );
}
