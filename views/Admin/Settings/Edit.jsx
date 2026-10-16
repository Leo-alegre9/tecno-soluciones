'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import { Field, Input, Textarea } from '@/Components/UI/Field';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@/lib/useForm';
import { optionalEmail, optionalText, optionalUrl, requiredText, validate } from '@/lib/validation';

const schema = z.object({
    site_name: requiredText(100),
    tagline: optionalText(150),
    bio: optionalText(500),
    whatsapp_number: requiredText(20),
    phone_display: optionalText(40),
    email: optionalEmail,
    address: requiredText(200),
    city: optionalText(100),
    schedule: optionalText(500),
    instagram_url: optionalUrl(200),
    map_embed_url: optionalUrl(500),
});

export default function SettingsEdit({ settings }) {
    const router = useRouter();
    const { data, setData, submit: submitForm, processing, errors } = useForm({ ...settings });

    function submit(e) {
        e.preventDefault();
        submitForm(
            async (input) => {
                const parsed = validate(schema, input);
                if (parsed.errors) return parsed;

                const rows = Object.entries(parsed.data).map(([key, value]) => ({ key, value }));
                const { error } = await createClient().from('settings').upsert(rows);
                if (error) throw error;
            },
            {
                onSuccess: () => {
                    toast.success('Configuración actualizada.');
                    router.refresh();
                },
            },
        );
    }

    return (
        <AdminLayout header="Configuración del sitio">
            <form onSubmit={submit} className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
                <Card className="space-y-4 p-6">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                        Identidad
                    </h2>
                    <Field label="Nombre del sitio" required error={errors.site_name}>
                        <Input value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} error={errors.site_name} />
                    </Field>
                    <Field label="Tagline" error={errors.tagline}>
                        <Input value={data.tagline} onChange={(e) => setData('tagline', e.target.value)} />
                    </Field>
                    <Field label="Bio corta (footer)" error={errors.bio}>
                        <Textarea rows={3} value={data.bio} onChange={(e) => setData('bio', e.target.value)} />
                    </Field>
                </Card>

                <Card className="space-y-4 p-6">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                        Contacto
                    </h2>
                    <Field label="Número de WhatsApp" required hint="Con código de país, solo números. Ej: 5493794037947" error={errors.whatsapp_number}>
                        <Input value={data.whatsapp_number} onChange={(e) => setData('whatsapp_number', e.target.value)} error={errors.whatsapp_number} />
                    </Field>
                    <Field label="Teléfono para mostrar" error={errors.phone_display}>
                        <Input value={data.phone_display} onChange={(e) => setData('phone_display', e.target.value)} />
                    </Field>
                    <Field label="Email" error={errors.email}>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    </Field>
                    <Field label="Instagram (URL)" error={errors.instagram_url}>
                        <Input value={data.instagram_url} onChange={(e) => setData('instagram_url', e.target.value)} />
                    </Field>
                </Card>

                <Card className="space-y-4 p-6">
                    <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-400">
                        Ubicación y horarios
                    </h2>
                    <Field label="Dirección" required error={errors.address}>
                        <Input value={data.address} onChange={(e) => setData('address', e.target.value)} error={errors.address} />
                    </Field>
                    <Field label="Ciudad" error={errors.city}>
                        <Input value={data.city} onChange={(e) => setData('city', e.target.value)} />
                    </Field>
                    <Field label="Horario de atención" hint="Se muestra tal cual lo escribas (podés usar varias líneas)" error={errors.schedule}>
                        <Textarea rows={3} value={data.schedule} onChange={(e) => setData('schedule', e.target.value)} />
                    </Field>
                    <Field label="URL de mapa embebido (Google Maps)" hint="Desde Google Maps: Compartir > Insertar un mapa > copiar la URL del src" error={errors.map_embed_url}>
                        <Input value={data.map_embed_url} onChange={(e) => setData('map_embed_url', e.target.value)} />
                    </Field>
                </Card>

                <div className="flex items-start">
                    <Button type="submit" disabled={processing} size="lg">
                        Guardar configuración
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
