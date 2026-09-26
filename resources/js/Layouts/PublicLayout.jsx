import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SiteHeader from '@/Components/SiteHeader';
import SiteFooter from '@/Components/SiteFooter';
import WhatsAppFloat from '@/Components/WhatsAppFloat';

export default function PublicLayout({ children }) {
    const { props } = usePage();
    const { settings, flash } = props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
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

            <SiteHeader settings={settings} />

            <main>{children}</main>

            <SiteFooter settings={settings} />
            <WhatsAppFloat />
        </div>
    );
}
