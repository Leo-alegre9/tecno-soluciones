import { ArrowRight } from 'lucide-react';
import DynamicIcon from '@/Components/DynamicIcon';
import { cn } from '@/lib/utils';

export default function RepairCategoryCard({ category, active, onSelect }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={active}
            className={cn(
                'group relative flex flex-col items-start gap-3 rounded-card border bg-surface p-5 text-left shadow-sm transition duration-180 ease-out-soft hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-hover',
                active ? 'border-primary/50 bg-surface-hover shadow-glow-sm' : 'border-border',
            )}
        >
            <span
                className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-control transition duration-180',
                    active ? 'bg-brand-gradient text-white' : 'bg-white/5 text-primary group-hover:bg-brand-gradient group-hover:text-white',
                )}
            >
                <DynamicIcon name={category.icon} className="h-5 w-5" />
            </span>

            <span className="text-sm font-semibold text-foreground">{category.name}</span>
            <span className="text-xs text-muted-foreground">Elegí y contanos el problema</span>

            <ArrowRight
                className={cn(
                    'absolute right-4 top-5 h-4 w-4 text-muted-foreground transition duration-180 ease-out-soft',
                    active ? 'translate-x-0 rotate-90 text-primary' : 'group-hover:translate-x-0.5',
                )}
            />
        </button>
    );
}
