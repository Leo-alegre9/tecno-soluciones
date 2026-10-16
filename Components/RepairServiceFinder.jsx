'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import RepairCategoryCard from '@/Components/RepairCategoryCard';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { repairOptionsFor } from '@/lib/repairFinder';
import { waLink, cn } from '@/lib/utils';

export default function RepairServiceFinder({ categories, whatsappNumber }) {
    const [selected, setSelected] = useState(null);
    const [problem, setProblem] = useState(null);
    const shouldReduceMotion = useReducedMotion();

    function selectCategory(category) {
        setProblem(null);
        setSelected((current) => (current?.id === category.id ? null : category));
    }

    const options = selected ? repairOptionsFor(selected) : [];
    const message = selected
        ? `Hola Tecno Soluciones! Quiero solicitar un diagnóstico para: ${selected.name}${problem ? ` — ${problem}` : ''}.`
        : '';

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                    <RepairCategoryCard
                        key={category.id}
                        category={category}
                        active={selected?.id === category.id}
                        onSelect={() => selectCategory(category)}
                    />
                ))}
            </div>

            <AnimatePresence initial={false}>
                {selected && (
                    <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="mt-6 rounded-card border border-border bg-surface p-6">
                            <p className="text-sm font-medium text-foreground">
                                ¿Qué le pasa a tu <span className="text-primary">{selected.name.toLowerCase()}</span>?
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setProblem((current) => (current === option ? null : option))}
                                        className={cn(
                                            'min-h-[44px] rounded-full border px-4 text-sm font-medium transition duration-150',
                                            problem === option
                                                ? 'border-primary/60 bg-brand-gradient text-white'
                                                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                                        )}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                                <a
                                    href={waLink(whatsappNumber, message)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-[44px] items-center gap-2 rounded-control bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition hover:brightness-110"
                                >
                                    <WhatsAppIcon className="h-4 w-4" /> Solicitar diagnóstico
                                </a>
                                <a
                                    href={`/contacto?asunto=${encodeURIComponent(`${selected.name}${problem ? ` - ${problem}` : ''}`)}`}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                                >
                                    o completá el formulario <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
