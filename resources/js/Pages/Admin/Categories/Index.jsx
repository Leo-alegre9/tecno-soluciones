import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { Field, Input } from '@/Components/UI/Field';
import DynamicIcon from '@/Components/DynamicIcon';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const ICON_SUGGESTIONS = ['smartphone', 'laptop', 'cpu', 'headphones', 'tablet', 'plug', 'monitor', 'gamepad-2', 'camera', 'watch'];

export default function CategoriesIndex({ categories }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        icon: 'cpu',
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(category) {
        setData({ name: category.name, icon: category.icon || 'cpu' });
        clearErrors();
        setEditing(category);
        setShowForm(true);
    }

    function submit(e) {
        e.preventDefault();
        const options = { onSuccess: () => setShowForm(false), preserveScroll: true };
        if (editing) {
            put(route('admin.categories.update', editing.id), options);
        } else {
            post(route('admin.categories.store'), options);
        }
    }

    function confirmDelete() {
        router.delete(route('admin.categories.destroy', toDelete.id), {
            onFinish: () => setToDelete(null),
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout header="Categorías">
            <Head title="Categorías" />

            <div className="flex justify-end">
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" /> Nueva categoría
                </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Card key={category.id} className="flex items-center gap-4 p-5">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                            <DynamicIcon name={category.icon} className="h-6 w-6" />
                        </span>
                        <div className="flex-1">
                            <p className="font-semibold text-ink-800">{category.name}</p>
                            <p className="text-xs text-ink-400">{category.products_count} productos</p>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => openEdit(category)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100">
                                <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => setToDelete(category)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal show={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar categoría' : 'Nueva categoría'}>
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Nombre" required error={errors.name}>
                        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} />
                    </Field>

                    <Field label="Ícono" hint="Elegí uno de los íconos disponibles abajo">
                        <Input value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                    </Field>

                    <div className="flex flex-wrap gap-2">
                        {ICON_SUGGESTIONS.map((icon) => (
                            <button
                                type="button"
                                key={icon}
                                onClick={() => setData('icon', icon)}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                                    data.icon === icon ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-ink-200 text-ink-500'
                                }`}
                            >
                                <DynamicIcon name={icon} className="h-4 w-4" />
                            </button>
                        ))}
                    </div>

                    <Button type="submit" disabled={processing} className="w-full justify-center">
                        {editing ? 'Guardar cambios' : 'Crear categoría'}
                    </Button>
                </form>
            </Modal>

            <ConfirmDialog
                show={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar categoría"
                description={`¿Eliminar "${toDelete?.name}"? Si tiene productos asociados no se podrá borrar.`}
            />
        </AdminLayout>
    );
}
