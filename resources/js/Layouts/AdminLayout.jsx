import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
    LayoutDashboard,
    Package,
    Tags,
    Wrench,
    Smartphone,
    MessageSquare,
    Settings,
    LogOut,
    Menu as MenuIcon,
    X,
    ChevronDown,
    ExternalLink,
    User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
    { name: 'Dashboard', href: 'admin.dashboard', icon: LayoutDashboard },
    { name: 'Equipos / Reparaciones', href: 'admin.repair-orders.index', icon: Smartphone },
    { name: 'Productos', href: 'admin.products.index', icon: Package },
    { name: 'Categorías', href: 'admin.categories.index', icon: Tags },
    { name: 'Servicios', href: 'admin.services.index', icon: Wrench },
    { name: 'Mensajes', href: 'admin.messages.index', icon: MessageSquare },
    { name: 'Configuración', href: 'admin.settings.edit', icon: Settings },
];

export default function AdminLayout({ header, children }) {
    const { props } = usePage();
    const { auth, flash } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-ink-50">
            <Toaster position="top-right" />

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-ink-950/60" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex h-full w-72 flex-col bg-ink-950 p-4">
                        <button
                            className="absolute right-4 top-4 text-ink-400"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            <div className="lg:flex">
                <aside className="hidden w-64 shrink-0 bg-ink-950 p-4 lg:flex lg:min-h-screen lg:flex-col">
                    <SidebarContent />
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-100 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
                        <div className="flex items-center gap-3">
                            <button
                                className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <MenuIcon className="h-5 w-5" />
                            </button>
                            {header && <h1 className="font-display text-lg font-semibold text-ink-900">{header}</h1>}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href={route('home')}
                                className="hidden items-center gap-1 text-sm text-ink-500 hover:text-brand-600 sm:flex"
                                target="_blank"
                            >
                                Ver sitio <ExternalLink className="h-3.5 w-3.5" />
                            </Link>

                            <Menu as="div" className="relative">
                                <MenuButton className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-ink-700 hover:bg-ink-100">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-white">
                                        <UserIcon className="h-4 w-4" />
                                    </span>
                                    {auth.user.name}
                                    <ChevronDown className="h-4 w-4 text-ink-400" />
                                </MenuButton>
                                <MenuItems className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-ink-100 focus:outline-none">
                                    <MenuItem>
                                        {({ focus }) => (
                                            <Link
                                                href={route('profile.edit')}
                                                className={cn(
                                                    'block rounded-lg px-3 py-2 text-sm text-ink-700',
                                                    focus && 'bg-ink-50',
                                                )}
                                            >
                                                Mi perfil
                                            </Link>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ focus }) => (
                                            <button
                                                onClick={() => router.post(route('logout'))}
                                                className={cn(
                                                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600',
                                                    focus && 'bg-red-50',
                                                )}
                                            >
                                                <LogOut className="h-4 w-4" /> Cerrar sesión
                                            </button>
                                        )}
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </header>

                    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
                </div>
            </div>
        </div>
    );
}

function SidebarContent() {
    return (
        <>
            <Link href={route('admin.dashboard')} className="mb-8 flex items-center gap-2 px-2">
                <img src="/images/brand/isotipo-192.png" alt="Tecno Soluciones" className="h-9 w-9" />
                <span className="font-display text-base font-bold text-white">
                    Tecno<span className="text-brand-400">Soluciones</span>
                </span>
            </Link>

            <nav className="flex-1 space-y-1">
                {nav.map((item) => {
                    const active = route().current(`${item.href}*`);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                                active
                                    ? 'bg-white/10 text-white'
                                    : 'text-ink-400 hover:bg-white/5 hover:text-white',
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <p className="mt-6 px-2 text-xs text-ink-500">Panel de administración</p>
        </>
    );
}
