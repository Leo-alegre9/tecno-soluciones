import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import DynamicIcon from '@/Components/DynamicIcon';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import Modal from '@/Components/UI/Modal';
import Button from '@/Components/UI/Button';
import { formatCurrency, waLink } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ service }) {
    const { settings } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="group flex w-full flex-col rounded-2xl border border-white/10 bg-ink-900 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-brand"
            >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
                    <DynamicIcon name={service.icon} className="h-6 w-6" />
                </span>
                <h3 className="font-display text-base font-semibold text-white">{service.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-400">
                    {service.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm font-medium text-ink-300">
                        {service.price_from ? `Desde ${formatCurrency(service.price_from)}` : 'Precio a consultar'}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-brand-400">
                        Ver más <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </button>

            <Modal show={open} onClose={() => setOpen(false)} maxWidth="sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
                    <DynamicIcon name={service.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 pr-8 font-display text-lg font-semibold text-ink-900">{service.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">
                    {service.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-ink-800">
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
