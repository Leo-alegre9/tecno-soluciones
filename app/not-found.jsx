import Link from 'next/link';

export const metadata = { title: 'Página no encontrada' };

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
            <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-12 w-12" />
            <h1 className="font-display text-3xl font-bold text-foreground">Página no encontrada</h1>
            <p className="text-muted-foreground">La página que buscás no existe o fue movida.</p>
            <Link href="/" className="rounded-control bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-brand">
                Volver al inicio
            </Link>
        </div>
    );
}
