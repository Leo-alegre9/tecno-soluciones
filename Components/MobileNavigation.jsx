'use client';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import WhatsAppIcon from '@/Components/Icons/WhatsAppIcon';
import { cn, waLink } from '@/lib/utils';

export default function MobileNavigation({ open, onClose, navigation, currentHref, whatsappNumber }) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50 lg:hidden">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out-soft duration-220"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full justify-end">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out-soft duration-220"
                            enterFrom="translate-x-full opacity-0"
                            enterTo="translate-x-0 opacity-100"
                            leave="ease-in duration-150"
                            leaveFrom="translate-x-0 opacity-100"
                            leaveTo="translate-x-full opacity-0"
                        >
                            <DialogPanel className="flex h-full w-full max-w-xs flex-col border-l border-border bg-surface p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-elevated">
                                <div className="flex items-center justify-between">
                                    <span className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        Menú
                                    </span>
                                    <button
                                        onClick={onClose}
                                        className="rounded-control p-2 text-ink-300 transition hover:bg-white/5 hover:text-white"
                                        aria-label="Cerrar menú"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <nav className="mt-8 flex flex-1 flex-col gap-1">
                                    {navigation.map((item) => {
                                        const active = currentHref === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={onClose}
                                                className={cn(
                                                    'min-h-[44px] rounded-control px-4 py-3 text-base font-medium transition',
                                                    active
                                                        ? 'bg-white/10 text-primary'
                                                        : 'text-ink-300 hover:bg-white/5 hover:text-white',
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <a
                                    href={waLink(whatsappNumber, 'Hola Tecno Soluciones! Quiero solicitar un diagnóstico.')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex min-h-[44px] items-center justify-center gap-2 rounded-control bg-brand-gradient px-4 py-3 text-sm font-semibold text-white shadow-brand"
                                    onClick={onClose}
                                >
                                    <WhatsAppIcon className="h-5 w-5" /> Solicitar diagnóstico
                                </a>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
