import { ShieldCheck, Search, Cpu, Smartphone } from 'lucide-react';
import GradientGlow from '@/Components/UI/GradientGlow';

export default function HeroVisual() {
    return (
        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center sm:max-w-lg" aria-hidden="true">
            <GradientGlow position="center" tone="brand" size="h-72 w-72" className="opacity-60" />
            <GradientGlow position="bottom-right" tone="accent" size="h-56 w-56" className="opacity-40" />

            <div className="relative flex h-64 w-64 items-center justify-center rounded-card-lg border border-border bg-surface bg-grid-faint bg-grid shadow-elevated sm:h-72 sm:w-72">
                <div className="pointer-events-none absolute inset-0 rounded-card-lg bg-gradient-to-br from-white/[0.04] to-transparent" />
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-white shadow-brand">
                    <Smartphone className="h-9 w-9" />
                </span>
                <img
                    src="/images/brand/isotipo-192.png"
                    alt=""
                    className="absolute -bottom-4 -right-4 h-14 w-14 rounded-full border border-border bg-surface-elevated p-2 shadow-elevated"
                />
            </div>

            <div className="absolute -left-4 top-6 flex animate-float items-center gap-2.5 rounded-control border border-border bg-surface-elevated px-4 py-3 shadow-elevated sm:-left-8">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Garantía escrita</span>
            </div>

            <div className="absolute -right-2 top-1/3 flex animate-float-delayed items-center gap-2.5 rounded-control border border-border bg-surface-elevated px-4 py-3 shadow-elevated sm:-right-6">
                <Search className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium text-foreground">Diagnóstico sin cargo</span>
            </div>

            <div className="absolute -left-2 bottom-4 flex animate-float items-center gap-2.5 rounded-control border border-border bg-surface-elevated px-4 py-3 shadow-elevated sm:-left-10">
                <Cpu className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-foreground">Microelectrónica</span>
            </div>
        </div>
    );
}
