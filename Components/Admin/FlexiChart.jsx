'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

// Single-series chart with a pill switcher between curve / line / area / bars,
// dashed grid, optional reference line and a hover crosshair + tooltip
// (after Framer's "FlexiChart Pro"), styled for the light admin panel.

const TYPES = [
    { id: 'bars', label: 'Barras' },
    { id: 'curve', label: 'Curva' },
    { id: 'linear', label: 'Línea' },
    { id: 'area', label: 'Área' },
];

const COLORS = {
    accent: '#F1541C',
    grid: '#E4E4E9',
    label: '#9C9CAB',
    goal: '#9C9CAB',
};

const PAD = { top: 20, bottom: 30, left: 64, right: 16 };
const spring = { type: 'spring', damping: 28, stiffness: 200 };

export function PillSwitch({ options, value, onChange, layoutId }) {
    return (
        <div className="flex flex-wrap gap-0.5 rounded-[10px] bg-ink-50 p-1">
            {options.map((option) => {
                const active = option.id === value;
                return (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onChange(option.id)}
                        aria-pressed={active}
                        className={cn(
                            'relative rounded-[7px] px-3 py-1.5 text-xs font-medium transition-colors',
                            active ? 'text-ink-800' : 'text-ink-400 hover:text-ink-600',
                        )}
                    >
                        {active && (
                            <motion.span
                                layoutId={layoutId}
                                className="absolute inset-0 rounded-[7px] border border-ink-100 bg-white shadow-sm"
                                transition={spring}
                            />
                        )}
                        <span className="relative">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default function FlexiChart({
    data, // [{ label, value }]
    formatValue = (v) => String(Math.round(v)),
    formatAxis = formatValue,
    goal, // { value, label } — optional reference line
    defaultType = 'bars',
    header,
    height = 288,
}) {
    const [type, setType] = useState(defaultType);
    const [hovered, setHovered] = useState(null);
    const areaRef = useRef(null);
    const [width, setWidth] = useState(600);

    useEffect(() => {
        const el = areaRef.current;
        if (!el) return undefined;
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const compact = width < 480;
    const padLeft = compact ? PAD.left * 0.8 : PAD.left;
    const plotW = Math.max(width - padLeft - PAD.right, 10);
    const plotH = Math.max(height - PAD.top - PAD.bottom, 10);
    const baseline = height - PAD.bottom;

    const { max, min } = useMemo(() => {
        const values = data.map((d) => d.value);
        const high = Math.max(...values, goal?.value ?? 0, 0);
        const low = Math.min(...values, 0);
        return { max: high === 0 ? 100 : high * 1.15, min: low < 0 ? low * 1.1 : 0 };
    }, [data, goal]);

    const yOf = (v) => baseline - ((v - min) / (max - min || 1)) * plotH;
    const cell = plotW / Math.max(data.length, 1);

    const points = data.map((d, i) => ({ ...d, x: padLeft + i * cell + cell / 2, y: yOf(d.value) }));

    const paths = useMemo(() => {
        if (points.length < 2) return { line: '', curve: '', area: '' };
        let line = `M ${points[0].x} ${points[0].y}`;
        let curve = line;
        for (let i = 0; i < points.length - 1; i++) {
            const a = points[i];
            const b = points[i + 1];
            const dx = (b.x - a.x) / 3;
            // Same segment count for line and curve so the path can morph between them.
            line += ` C ${a.x} ${a.y}, ${b.x} ${b.y}, ${b.x} ${b.y}`;
            curve += ` C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
        }
        const close = ` L ${points.at(-1).x} ${baseline} L ${points[0].x} ${baseline} Z`;
        return { line, curve, area: curve + close };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(points), baseline]);

    const ticks = [min, min + (max - min) / 2, max];

    function onMove(e) {
        if (!areaRef.current || points.length === 0) return;
        const x = e.clientX - areaRef.current.getBoundingClientRect().left;
        if (x < padLeft - 20 || x > width - PAD.right + 20) return setHovered(null);
        const closest = points.reduce((best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best));
        setHovered(closest);
    }

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">{header}</div>
                <PillSwitch options={TYPES} value={type} onChange={setType} layoutId="flexichart-type" />
            </div>

            <div
                ref={areaRef}
                onMouseMove={onMove}
                onMouseLeave={() => setHovered(null)}
                className="relative w-full"
                style={{ height }}
            >
                <svg width={width} height={height} className="absolute inset-0 overflow-visible">
                    {ticks.map((tick, i) => (
                        <g key={i}>
                            <line
                                x1={padLeft}
                                x2={width - PAD.right}
                                y1={yOf(tick)}
                                y2={yOf(tick)}
                                stroke={COLORS.grid}
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padLeft - (compact ? 8 : 12)}
                                y={yOf(tick) + 4}
                                textAnchor="end"
                                fontSize={compact ? 10 : 12}
                                fontWeight="500"
                                fill={COLORS.label}
                            >
                                {formatAxis(tick)}
                            </text>
                        </g>
                    ))}

                    {goal && (
                        <g>
                            <line
                                x1={padLeft}
                                x2={width - PAD.right}
                                y1={yOf(goal.value)}
                                y2={yOf(goal.value)}
                                stroke={COLORS.goal}
                                strokeWidth="2"
                                strokeDasharray="6 6"
                                opacity="0.5"
                            />
                            {!compact && (
                                <text
                                    x={width - PAD.right - 8}
                                    y={yOf(goal.value) - 8}
                                    textAnchor="end"
                                    fontSize="10"
                                    fontWeight="600"
                                    letterSpacing="0.5"
                                    fill={COLORS.goal}
                                >
                                    {goal.label.toUpperCase()}
                                </text>
                            )}
                        </g>
                    )}

                    <AnimatePresence>
                        {type === 'area' && (
                            <motion.path
                                key="area"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.15, d: paths.area }}
                                exit={{ opacity: 0 }}
                                transition={spring}
                                fill={COLORS.accent}
                            />
                        )}
                    </AnimatePresence>

                    {(type === 'curve' || type === 'linear' || type === 'area') && (
                        <motion.path
                            initial={false}
                            animate={{ d: type === 'linear' ? paths.line : paths.curve }}
                            transition={spring}
                            fill="none"
                            stroke={COLORS.accent}
                            strokeWidth={compact ? 2 : 2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {type === 'bars' &&
                        points.map((p, i) => {
                            const barW = cell * 0.6;
                            return (
                                <motion.rect
                                    key={`${p.label}-${i}`}
                                    initial={{ y: baseline, height: 0, x: p.x - barW / 2, width: barW }}
                                    animate={{ x: p.x - barW / 2, y: Math.min(p.y, baseline - 2), width: barW, height: Math.max(baseline - p.y, 2) }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 180, delay: i * 0.04 }}
                                    rx="4"
                                    fill={COLORS.accent}
                                    opacity={hovered && hovered.x !== p.x ? 0.45 : 1}
                                />
                            );
                        })}

                    {type !== 'bars' &&
                        points.map((p, i) => (
                            <motion.circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                initial={false}
                                animate={{ r: hovered?.x === p.x ? (compact ? 4 : 5) : 0 }}
                                fill="#fff"
                                stroke={COLORS.accent}
                                strokeWidth="2.5"
                                pointerEvents="none"
                            />
                        ))}

                    {points.map((p, i) =>
                        compact && points.length > 5 && i % 2 !== 0 ? null : (
                            <text
                                key={i}
                                x={p.x}
                                y={baseline + (compact ? 18 : 22)}
                                textAnchor="middle"
                                fontSize={compact ? 10 : 12}
                                fontWeight="500"
                                fill={COLORS.label}
                            >
                                {p.label}
                            </text>
                        ),
                    )}

                    {hovered && (
                        <line
                            x1={hovered.x}
                            x2={hovered.x}
                            y1={PAD.top}
                            y2={baseline}
                            stroke={COLORS.accent}
                            strokeWidth="1.5"
                            opacity="0.2"
                            pointerEvents="none"
                        />
                    )}
                </svg>

                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            key="tooltip"
                            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: 10 }}
                            animate={{
                                opacity: 1,
                                x: '-50%',
                                scale: 1,
                                y: 0,
                                left: Math.min(Math.max(hovered.x, 56), width - 56),
                                bottom: height - hovered.y + 14,
                            }}
                            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: 5 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="pointer-events-none absolute z-10 flex flex-col items-center gap-0.5 whitespace-nowrap rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
                        >
                            <span className="text-[10px] font-medium opacity-70">{hovered.label}</span>
                            <span>{formatValue(hovered.value)}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
