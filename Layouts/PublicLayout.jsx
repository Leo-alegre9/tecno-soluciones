'use client';

import { Toaster } from 'react-hot-toast';
import SiteHeader from '@/Components/SiteHeader';
import SiteFooter from '@/Components/SiteFooter';
import WhatsAppFloat from '@/Components/WhatsAppFloat';
import SiteBackground from '@/Components/SiteBackground';
import { ButtonEffectProvider } from '@/Components/UI/Button';
import { useSettings } from '@/lib/SettingsContext';

export default function PublicLayout({ children }) {
    const settings = useSettings();

    return (
        <div className="relative isolate min-h-screen overflow-x-clip bg-background font-sans text-foreground">
            <SiteBackground />

            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#0F0F12',
                        color: '#FAFAFA',
                        border: '1px solid rgba(255,255,255,0.08)',
                    },
                }}
            />

            <ButtonEffectProvider slide>
                <SiteHeader settings={settings} />

                <main>{children}</main>

                <SiteFooter settings={settings} />
                <WhatsAppFloat />
            </ButtonEffectProvider>
        </div>
    );
}
