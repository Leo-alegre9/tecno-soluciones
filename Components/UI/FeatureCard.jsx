'use client';

export default function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="flex flex-col gap-3 px-2 py-6 sm:px-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-control bg-white/5 text-primary">
                <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
    );
}
