import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
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

const SERVICE_ICONS = ['wrench', 'apple', 'smartphone', 'laptop', 'cpu', 'headphones', 'globe', 'search-check', 'battery', 'hard-drive'];

export default function ServicesIndex({ services }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
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
        const options = { onSuccess: () => setShowForm(false), preserveScroll: true };
        if (editing) {
            put(route('admin.services.update', editing.id), options);
        } else {
            post(route('admin.services.store'), options);
        }
    }

    function confirmDelete() {
        router.delete(route('admin.services.destroy', toDelete.id), {
            onFinish: () => setToDelete(null),
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout header="Servicios">
            <Head title="Servicios" />

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
