'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { errorMessage, useForm } from '@/lib/useForm';
import { optionalMoney, optionalText, requiredText, validate } from '@/lib/validation';
import { uniqueSlug } from '@/lib/slug';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';
import Modal from '@/Components/UI/Modal';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import { Field, Input, Textarea, Checkbox } from '@/Components/UI/Field';
import DynamicIcon from '@/Components/DynamicIcon';
import { formatCurrency } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const schema = z.object({
    title: requiredText(150),
    icon: optionalText(60),
    description: optionalText(2000),
    price_from: optionalMoney,
    is_active: z.boolean(),
});

const SERVICE_ICONS = ['wrench', 'apple', 'smartphone', 'laptop', 'cpu', 'headphones', 'globe', 'search-check', 'battery', 'hard-drive'];

export default function ServicesIndex({ services }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const router = useRouter();
    const supabase = createClient();

    const { data, setData, submit: submitForm, processing, errors, reset, clearErrors } = useForm({
        title: '',
        icon: 'wrench',
        description: '',
        price_from: '',
        is_active: true,
    });

    function openCreate() {
        reset();
        clearErrors();
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(service) {
        setData({
            title: service.title,
            icon: service.icon || 'wrench',
            description: service.description || '',
            price_from: service.price_from || '',
            is_active: service.is_active,
        });
        clearErrors();
        setEditing(service);
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
                    if (values.title !== editing.title) {
                        values.slug = await uniqueSlug(supabase, 'services', values.title, editing.id);
                    }
                    const { error } = await supabase.from('services').update(values).eq('id', editing.id);
                    if (error) throw error;
                    toast.success('Servicio actualizado.');
                } else {
                    values.slug = await uniqueSlug(supabase, 'services', values.title);
                    values.sort_order = Math.max(-1, ...services.map((s) => s.sort_order)) + 1;
                    const { error } = await supabase.from('services').insert(values);
                    if (error) throw error;
                    toast.success('Servicio creado.');
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
        const service = toDelete;
        setToDelete(null);

        const { error } = await supabase.from('services').delete().eq('id', service.id);
        if (error) {
            toast.error(errorMessage(error));
            return;
        }
        toast.success('Servicio eliminado.');
        router.refresh();
    }

    return (
        <AdminLayout header="Servicios">
            <div className="flex justify-end">
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4" /> Nuevo servicio
                </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <Card key={service.id} className="p-5">
                        <div className="flex items-start justify-between">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                                <DynamicIcon name={service.icon} className="h-5 w-5" />
                            </span>
                            <Badge tone={service.is_active ? 'success' : 'neutral'}>
                                {service.is_active ? 'Activo' : 'Oculto'}
                            </Badge>
                        </div>
                        <h3 className="mt-3 font-display text-sm font-semibold text-ink-900">{service.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs text-ink-500">{service.description}</p>
                        <p className="mt-2 text-xs font-semibold text-ink-600">
                            {service.price_from ? `Desde ${formatCurrency(service.price_from)}` : 'A consultar'}
                        </p>

                        <div className="mt-4 flex justify-end gap-1 border-t border-ink-100 pt-3">
                            <button onClick={() => openEdit(service)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100">
                                <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => setToDelete(service)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal show={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar servicio' : 'Nuevo servicio'}>
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Título" required error={errors.title}>
                        <Input value={data.title} onChange={(e) => setData('title', e.target.value)} error={errors.title} />
                    </Field>

                    <Field label="Ícono" hint="Elegí uno de los íconos disponibles abajo">
                        <Input value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                    </Field>

                    <div className="flex flex-wrap gap-2">
                        {SERVICE_ICONS.map((icon) => (
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

                    <Field label="Descripción" error={errors.description}>
                        <Textarea rows={3} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </Field>

                    <Field label="Precio desde (opcional)" error={errors.price_from}>
                        <Input type="number" step="0.01" min="0" value={data.price_from} onChange={(e) => setData('price_from', e.target.value)} />
                    </Field>

                    <Checkbox
                        label="Visible en el sitio"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                    />

                    <Button type="submit" disabled={processing} className="w-full justify-center">
                        {editing ? 'Guardar cambios' : 'Crear servicio'}
                    </Button>
                </form>
            </Modal>

            <ConfirmDialog
                show={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar servicio"
                description={`¿Eliminar "${toDelete?.title}"?`}
            />
        </AdminLayout>
    );
}
