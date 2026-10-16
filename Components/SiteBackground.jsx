// Fixed, decorative page background: faint PCB-style traces along both sides
// (with an occasional orange pulse travelling a trace) plus a fine film grain.
// Traces are generated from a fixed seed, so server and client render the same
// markup. Must sit inside an `isolate` parent — it uses a negative z-index.

const W = 560; // panel viewBox width
const H = 1000; // panel viewBox height
const SPACING = 12; // distance between parallel traces in a bus
const DIAG = Math.SQRT2 - 1; // corner shift that keeps 45° bends parallel

const TRACE = 'rgba(255,255,255,0.075)';
const TRACE_ACCENT = 'rgba(241,84,28,0.2)';

function random(seed) {
    // mulberry32
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const snap = (n) => Math.round(n / 4) * 4;

// Groups ("buses") of 1–4 parallel traces that run in from the outer edge,
// bend 45° together, and end in solder pads at staggered lengths.
function generatePanel(seed) {
    const rnd = random(seed);
    const traces = [];
    let y = 30 + rnd() * 40;

    while (y < H - 20) {
        const count = 1 + Math.floor(rnd() * 4);
        const dir = rnd() < 0.5 ? -1 : 1;
        const run = snap(60 + rnd() * 180);
        const bend = snap(24 + rnd() * 70);
        const accent = rnd() < 0.22;

        for (let i = 0; i < count; i++) {
            const y0 = y + i * SPACING;
            const x1 = run - dir * i * SPACING * DIAG;
            const y1 = y0 + dir * bend;
            const tail = snap(40 + rnd() * 200);
            const points = [
                [-4, y0],
                [x1, y0],
                [x1 + bend, y1],
                [Math.min(W - 10, x1 + bend + tail), y1],
            ];
            traces.push({
                d: points.map(([px, py], n) => `${n ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' '),
                end: points[points.length - 1],
                accent,
            });
        }

        y += count * SPACING + 36 + rnd() * 90;
    }

    // A few traces carry a travelling pulse, spread out down the panel.
    const pulses = [0.15, 0.5, 0.8]
        .map((f) => Math.floor(f * traces.length))
        .map((index, n) => ({ d: traces[index].d, duration: 7 + n * 2.5, delay: n * 2.3 + (seed % 3) }));

    return { traces, pulses };
}

const LEFT = generatePanel(7);
const RIGHT = generatePanel(23);

const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Panel({ panel, side }) {
    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio={side === 'left' ? 'xMinYMid slice' : 'xMaxYMid slice'}
            className="absolute top-0 h-full w-[46vw] max-w-[560px] sm:w-[38vw]"
            style={{
                [side]: 0,
                // Drawn for the left edge; the right panel is mirrored.
                transform: side === 'right' ? 'scaleX(-1)' : undefined,
                maskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black 0%, black 30%, transparent 100%)',
            }}
            aria-hidden="true"
        >
            <g fill="none" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                {panel.traces.map((trace, i) => (
                    <path key={i} d={trace.d} stroke={trace.accent ? TRACE_ACCENT : TRACE} />
                ))}
            </g>
            <g strokeWidth="1.25">
                {panel.traces.map((trace, i) => (
                    <circle
                        key={i}
                        cx={trace.end[0]}
                        cy={trace.end[1]}
                        r="3.5"
                        fill="#050505"
                        stroke={trace.accent ? TRACE_ACCENT : TRACE}
                    />
                ))}
            </g>
            <g fill="none" strokeLinecap="round" className="trace-pulses">
                {panel.pulses.map((pulse, i) => (
                    <g key={i} style={{ '--pulse-duration': `${pulse.duration}s`, '--pulse-delay': `${pulse.delay}s` }}>
                        <path d={pulse.d} pathLength="1" stroke="rgba(241,84,28,0.25)" strokeWidth="5" className="trace-pulse" />
                        <path d={pulse.d} pathLength="1" stroke="#F1541C" strokeWidth="1.5" className="trace-pulse" />
                    </g>
                ))}
            </g>
        </svg>
    );
}

export default function SiteBackground() {
    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 opacity-70 sm:opacity-100">
                <Panel panel={LEFT} side="left" />
                <Panel panel={RIGHT} side="right" />
            </div>
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px' }} />
        </div>
    );
}
