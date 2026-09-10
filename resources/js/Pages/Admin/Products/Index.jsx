import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Pagination from '@/Components/UI/Pagination';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { Input, Select } from '@/Components/UI/Field';
import { formatCurrency } from '@/lib/utils';
import { Plus, Search, Pencil, Trash2, ImageOff } from 'lucide-react';

export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.buscar || '');
    const [toDelete, setToDelete] = useState(null);

    function applyFilters(next) {
        router.get(route('admin.products.index'), { ...filters, ...next }, { preserveState: true, replace: true });
    }

    function confirmDelete() {
        router.delete(route('admin.products.destroy', toDelete.id), {
            onFinish: () => setToDelete(null),
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout header="Productos">
            <Head title="Productos" />

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-1 flex-wrap gap-3">
                    <form
                        className="relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({ buscar: search });
                        }}
                    >
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar producto..."
                            className="w-64 pr-9"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
                            <Search className="h-4 w-4" />
                        </button>
                    </form>

                    <Select
                        value={filters.categoria || ''}
                        onChange={(e) => applyFilters({ categoria: e.target.value })}
                        className="w-56"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </Select>
                </div>

                <Button href={route('admin.products.create')}>
                    <Plus className="h-4 w-4" /> Nuevo producto
                </Button>
            </div>

            <Card className="mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
                            <tr>
                                <th className="px-4 py-3">Producto</th>
                                <th className="px-4 py-3">Categoría</th>
                                <th className="px-4 py-3">Precio</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-100">
                            {products.data.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-100">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0].url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageOff className="h-5 w-5 text-ink-300" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-ink-800">{product.name}</p>
                                                {product.is_featured && (
                                                    <Badge tone="gold" className="mt-1">Destacado</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-ink-500">{product.category?.name ?? '—'}</td>
                                    <td className="px-4 py-3 font-medium text-ink-700">{formatCurrency(product.price)}</td>
                                    <td className="px-4 py-3">
                                        <span className={product.stock <= 2 ? 'font-semibold text-amber-600' : 'text-ink-600'}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge tone={product.is_active ? 'success' : 'neutral'}>
                                            {product.is_active ? 'Activo' : 'Oculto'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <Link
                                                href={route('admin.products.edit', product.id)}
                                                className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => setToDelete(product)}
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-ink-400">
                                        No hay productos cargados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Pagination links={products.links} />

            <ConfirmDialog
                show={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar producto"
                description={`¿Seguro que querés eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </AdminLayout>
    );
}
