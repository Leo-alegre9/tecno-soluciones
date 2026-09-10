import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function Pagination({ links, theme = 'light' }) {
    if (!links || links.length <= 3) return null;

    const dark = theme === 'dark';

    return (
        <nav className="flex flex-wrap items-center justify-center gap-1.5 pt-6">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className={cn('rounded-lg px-3 py-1.5 text-sm', dark ? 'text-ink-500' : 'text-ink-300')}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={cn(
                            'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                            link.active
                                ? 'bg-brand-gradient text-white shadow-brand'
                                : dark
                                  ? 'text-ink-300 hover:bg-white/10 hover:text-white'
                                  : 'text-ink-600 hover:bg-ink-100',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
