import { usePage } from '@inertiajs/react';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';

export default function WhatsAppFloat() {
    const { settings } = usePage().props;

    return (
        <a
            href={waLink(settings.whatsapp_number, 'Hola Tecno Soluciones! Quiero hacer una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pl-3 pr-3 text-white shadow-lg shadow-emerald-900/30 transition hover:pr-5"
            aria-label="Escribinos por WhatsApp"
        >
            <WhatsAppIcon className="h-6 w-6" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-xs">
                Escribinos
            </span>
        </a>
    );
}
