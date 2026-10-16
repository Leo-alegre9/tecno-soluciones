'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import { Field, Input, Textarea, Select, Checkbox } from '@/Components/UI/Field';
import { ChevronLeft, ImagePlus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@/lib/useForm';
import { uniqueSlug } from '@/lib/slug';
import { integer, money, optionalMoney, optionalText, requiredText, validate } from '@/lib/validation';

const schema = z.object({
    category_id: z.preprocess((v) => (v === '' ? null : v), z.coerce.number().int().nullable()),
    name: requiredText(150),
    sku: optionalText(60),
    description: optionalText(5000),
    price: money,
    compare_price: optionalMoney,
    stock: integer,
    condition: z.enum(['nuevo', 'usado', 'reacondicionado']),
    is_featured: z.boolean(),
    is_active: z.boolean(),
});

export default function ProductForm({ product, categories }) {
    const isEdit = !!product;
    const [newImages, setNewImages] = useState([]);
    const [removeIds, setRemoveIds] = useState([]);

    const router = useRouter();
    const { data, setData, submit: submitForm, processing, errors } = useForm({
        category_id: product?.category_id ?? '',
        name: product?.name ?? '',
        sku: product?.sku ?? '',
        description: product?.description ?? '',
        price: product?.price ?? '',
        compare_price: product?.compare_price ?? '',
        stock: product?.stock ?? 0,
        condition: product?.condition ?? 'nuevo',
        is_featured: product?.is_featured ?? false,
        is_active: product?.is_active ?? true,
        images: [],
        remove_image_ids: [],
    });

    function handleImages(e) {
        const files = Array.from(e.target.files || []);
        setNewImages(files);
        setData('images', files);
    }

    function toggleRemove(id) {
        const next = removeIds.includes(id) ? removeIds.filter((i) => i !== id) : [...removeIds, id];
        setRemoveIds(next);
        setData('remove_image_ids', next);
    }

    function submit(e) {
        e.preventDefault();
        submitForm(
            async ({ images, remove_image_ids, ...input }) => {
                const parsed = validate(schema, input);
                if (parsed.errors) return parsed;
                const values = parsed.data;
                const supabase = createClient();

                let productId = product?.id;
                if (isEdit) {
                    if (values.name !== product.name) {
                        values.slug = await uniqueSlug(supabase, 'products', values.name, product.id);
                    }
                    const { error } = await supabase.from('products').update(values).eq('id', product.id);
                    if (error) throw error;
                } else {
                    values.slug = await uniqueSlug(supabase, 'products', values.name);
                    const { data: created, error } = await supabase.from('products').insert(values).select('id').single();
                    if (error) throw error;
                    productId = created.id;
                }

                await uploadImages(supabase, productId, images);

                if (remove_image_ids.length) {
                    const removed = product.images.filter((image) => remove_image_ids.includes(image.id));
                    await supabase.storage.from('products').remove(removed.map((image) => image.path));
                    const { error } = await supabase.from('product_images').delete().in('id', remove_image_ids);
                    if (error) throw error;
                }
            },
            {
                onSuccess: () => {
                    toast.success(isEdit ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
                    router.push('/admin/products');
                    router.refresh();
                },
            },
        );
    }

    async function uploadImages(supabase, productId, files) {
        if (!files.length) return;

        const currentMax = Math.max(-1, ...(product?.images ?? []).map((image) => image.sort_order));
        const rows = [];

        for (const [index, file] of files.entries()) {
            const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const path = `${productId}/${crypto.randomUUID()}.${extension}`;
            const { error } = await supabase.storage.from('products').upload(path, file, { contentType: file.type });
            if (error) throw error;
            rows.push({ product_id: productId, path, sort_order: currentMax + index + 1 });
        }

        const { error } = await supabase.from('product_images').insert(rows);
        if (error) throw error;
    }

    return (
        <AdminLayout header={isEdit ? 'Editar producto' : 'Nuevo producto'}>
            <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600">
                <ChevronLeft className="h-4 w-4" /> Volver a productos
            </Link>

            <form onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Nombre" required error={errors.name} className="sm:col-span-2">
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} />
                        </Field>

                        <Field label="Categoría" error={errors.category_id}>
                            <Select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
                                <option value="">Sin categoría</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </Select>
                        </Field>

                        <Field label="SKU / código interno" error={errors.sku}>
                            <Input value={data.sku} onChange={(e) => setData('sku', e.target.value)} />
                        </Field>

                        <Field label="Descripción" className="sm:col-span-2" error={errors.description}>
                            <Textarea rows={5} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </Field>

                        <Field label="Precio" required error={errors.price}>
                            <Input type="number" step="0.01" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} error={errors.price} />
                        </Field>

                        <Field label="Precio anterior (opcional)" error={errors.compare_price}>
                            <Input type="number" step="0.01" min="0" value={data.compare_price} onChange={(e) => setData('compare_price', e.target.value)} />
                        </Field>

                        <Field label="Stock" required error={errors.stock}>
                            <Input type="number" min="0" value={data.stock} onChange={(e) => setData('stock', e.target.value)} error={errors.stock} />
                        </Field>

                        <Field label="Condición" error={errors.condition}>
                            <Select value={data.condition} onChange={(e) => setData('condition', e.target.value)}>
                                <option value="nuevo">Nuevo</option>
                                <option value="usado">Usado</option>
                                <option value="reacondicionado">Reacondicionado</option>
                            </Select>
                        </Field>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                        <Checkbox
                            label="Producto destacado"
                            checked={data.is_featured}
                            onChange={(e) => setData('is_featured', e.target.checked)}
                        />
                        <Checkbox
                            label="Visible en el sitio"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-display text-sm font-semibold text-ink-900">Imágenes</h3>

                    {isEdit && product.images?.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {product.images.map((image) => (
                                <div key={image.id} className="relative">
                                    <img
                                        src={image.url}
                                        alt=""
                                        className={`h-20 w-full rounded-lg object-cover ${removeIds.includes(image.id) ? 'opacity-30' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleRemove(image.id)}
                                        className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 p-6 text-center text-sm text-ink-400 hover:border-brand-400 hover:text-brand-500">
                        <ImagePlus className="h-6 w-6" />
                        {newImages.length > 0 ? `${newImages.length} imagen(es) seleccionada(s)` : 'Agregar imágenes'}
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                    </label>
                    {errors.images && <p className="mt-1 text-xs text-red-600">{errors.images}</p>}

                    <Button type="submit" disabled={processing} className="mt-6 w-full justify-center">
                        {isEdit ? 'Guardar cambios' : 'Crear producto'}
                    </Button>
                </Card>
            </form>
        </AdminLayout>
    );
}
