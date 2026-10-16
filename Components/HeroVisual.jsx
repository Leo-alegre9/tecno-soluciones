import GradientGlow from '@/Components/UI/GradientGlow';

// Brand isotype floating over a soft glow.
export default function HeroVisual() {
    return (
        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center sm:max-w-lg" aria-hidden="true">
            <GradientGlow position="center" tone="brand" size="h-72 w-72" className="opacity-60" />
            <GradientGlow position="bottom-right" tone="accent" size="h-56 w-56" className="opacity-40" />

            {/* Faint ring behind the logo */}
            <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] bg-[radial-gradient(circle,rgba(241,84,28,0.10),transparent_65%)]" />

            <img
                src="/images/brand/isotipo-512.png"
                alt=""
                width={512}
                height={512}
                className="relative w-[82%] animate-float drop-shadow-[0_24px_48px_rgba(241,84,28,0.35)]"
            />
        </div>
    );
}
