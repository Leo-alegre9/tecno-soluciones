import { SettingsProvider } from '@/lib/SettingsContext';
import { getSettings } from '@/lib/settings';
import { createClient } from '@/lib/supabase/server';
import './globals.css';

// Loaded with a plain <link> (as in the Laravel version): next/font's build-time
// download breaks the Turbopack production build.
const FONTS_URL =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap';

export const metadata = {
    title: {
        default: 'Tecno Soluciones',
        template: '%s - Tecno Soluciones',
    },
    description:
        'Tecno Soluciones · Servicio técnico especializado en celulares, notebooks, PC y microelectrónica en Corrientes. Reparación, mantenimiento y venta de equipos y accesorios.',
    icons: {
        icon: '/images/brand/isotipo-32.png',
        apple: '/images/brand/isotipo-192.png',
    },
};

export default async function RootLayout({ children }) {
    const supabase = await createClient();
    const settings = await getSettings(supabase);

    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="stylesheet" href={FONTS_URL} />
            </head>
            <body className="font-sans antialiased bg-ink-950 text-ink-100">
                <SettingsProvider settings={settings}>{children}</SettingsProvider>
            </body>
        </html>
    );
}
