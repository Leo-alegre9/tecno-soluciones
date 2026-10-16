'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modal({ show, onClose, title, children, maxWidth = 'md', theme = 'light' }) {
    const dark = theme === 'dark';

    const widths = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-4xl',
    };

    return (
        <Transition show={show} as={Fragment} leave="duration-150">
            <Dialog onClose={onClose} className="relative z-50">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel
                                className={cn(
                                    'relative w-full rounded-card p-6 shadow-xl',
                                    dark ? 'border border-border bg-surface-elevated shadow-elevated' : 'bg-white',
                                    widths[maxWidth],
                                )}
                            >
                                {title ? (
                                    <div className="mb-4 flex items-center justify-between">
                                        <DialogTitle
                                            className={cn(
                                                'font-display text-lg font-semibold',
                                                dark ? 'text-foreground' : 'text-ink-900',
                                            )}
                                        >
                                            {title}
                                        </DialogTitle>
                                        <button
                                            onClick={onClose}
                                            className={cn(
                                                'rounded-control p-1',
                                                dark
                                                    ? 'text-ink-400 hover:bg-white/5 hover:text-white'
                                                    : 'text-ink-400 hover:bg-ink-100 hover:text-ink-600',
                                            )}
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className={cn(
                                            'absolute right-4 top-4 rounded-control p-1',
                                            dark
                                                ? 'text-ink-400 hover:bg-white/5 hover:text-white'
                                                : 'text-ink-400 hover:bg-ink-100 hover:text-ink-600',
                                        )}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                                {children}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
