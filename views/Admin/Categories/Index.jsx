'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { errorMessage, useForm } from '@/lib/useForm';
import { optionalText, requiredText, validate } from '@/lib/validation';
import { uniqueSlug } from '@/lib/slug';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Modal from '@/Components/UI/Modal';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { Field, Input } from '@/Components/UI/Field';
import DynamicIcon from '@/Components/DynamicIcon';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const schema = z.object({
    name: requiredText(100),
    icon: optionalText(60),
});

const ICON_SUGGESTIONS = ['smartphone', 'laptop', 'cpu', 'headphones', 'tablet', 'plug', 'monitor', 'gamepad-2', 'camera', 'watch'];

export default function CategoriesIndex({ categories }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const router = useRouter();
    const supabase = createClient();

    const { data, setData, submit: submitForm, processing, errors, reset, clearErrors } = useForm({
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
        submitForm(
            async (input) => {
                const parsed = validate(schema, input);
                if (parsed.errors) return parsed;
                const values = parsed.data;

                if (editing) {
                    if (values.name !== editing.name) {
                        values.slug = await uniqueSlug(supabase, 'categories', values.name, editing.id);
                    }
                    const { error } = await supabase.from('categories').update(values).eq('id', editing.id);
                    if (error) throw error;
                    toast.success('Categoría actualizada.');
                } else {
                    values.slug = await uniqueSlug(supabase, 'categories', values.name);
                    values.sort_order = Math.max(-1, ...categories.map((c) => c.sort_order)) + 1;
                    const { error } = await supabase.from('categories').insert(values);
                    if (error) throw error;
                    toast.success('Categoría creada.');
                }
            },
            {
                onSuccess: () => {
                    setShowForm(false);
                    router.refresh();
                },
            },
        );
    }

    async function confirmDelete() {
        const category = toDelete;
        setToDelete(null);

        if (category.products_count > 0) {
            toast.error('No se puede eliminar: tiene productos asociados. Reasigná o eliminá esos productos primero.');
            return;
        }

        const { error } = await supabase.from('categories').delete().eq('id', category.id);
        if (error) {
            toast.error(errorMessage(error));
            return;
        }
        toast.success('Categoría eliminada.');
        router.refresh();
    }

    return (
        <AdminLayout header="Categorías">
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
