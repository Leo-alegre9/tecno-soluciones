import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { waLink } from '@/lib/utils';

export default function WhatsAppFloat() {
    const { settings } = usePage().props;
    const [hovered, setHovered] = useState(false);

    return (
        <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40">
            <span
                role="tooltip"
                className={`absolute bottom-1/2 right-full mr-3 hidden translate-y-1/2 whitespace-nowrap rounded-control bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-elevated transition duration-150 sm:block ${
                    hovered ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            >
                Consultar por WhatsApp
            </span>

            <a
                href={waLink(settings.whatsapp_number, 'Hola Tecno Soluciones! Quiero hacer una consulta.')}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/30 transition duration-180 ease-out-soft hover:scale-105 focus-visible:scale-105"
                aria-label="Consultar por WhatsApp"
            >
                <WhatsAppIcon className="h-6 w-6" />
            </a>
        </div>
    );
}
