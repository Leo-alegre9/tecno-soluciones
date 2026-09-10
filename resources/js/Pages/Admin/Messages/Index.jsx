import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Button from '@/Components/UI/Button';
import ConfirmDialog from '@/Components/UI/ConfirmDialog';
import Pagination from '@/Components/UI/Pagination';
import { formatDateTime, waLink } from '@/lib/utils';
import { CheckCircle2, Circle, MessageCircle, Trash2 } from 'lucide-react';

export default function MessagesIndex({ messages }) {
    const [toDelete, setToDelete] = useState(null);

    function toggleAttended(message) {
        router.put(route('admin.messages.update', message.id), {}, { preserveScroll: true });
    }

    function confirmDelete() {
        router.delete(route('admin.messages.destroy', toDelete.id), {
            onFinish: () => setToDelete(null),
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout header="Mensajes de contacto">
            <Head title="Mensajes" />

            <div className="space-y-4">
                {messages.data.map((message) => (
                    <Card key={message.id} className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-ink-800">{message.name}</p>
                                    <Badge tone={message.is_attended ? 'success' : 'warning'}>
                                        {message.is_attended ? 'Atendido' : 'Pendiente'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-ink-400">
                                    {message.phone} {message.email ? `· ${message.email}` : ''} · {formatDateTime(message.created_at)}
                                </p>
                            </div>

                            <div className="flex gap-1">
                                <Button variant="subtle" size="sm" href={waLink(message.phone, `Hola ${message.name}! Te escribimos de Tecno Soluciones.`)} target="_blank">
                                    <MessageCircle className="h-4 w-4" /> Responder
                                </Button>
                                <button
                                    onClick={() => toggleAttended(message)}
                                    className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                                    title={message.is_attended ? 'Marcar como pendiente' : 'Marcar como atendido'}
                                >
                                    {message.is_attended ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                </button>
                                <button onClick={() => setToDelete(message)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <p className="mt-3 whitespace-pre-line text-sm text-ink-600">{message.message}</p>
                    </Card>
                ))}

                {messages.data.length === 0 && (
                    <Card className="p-10 text-center text-ink-400">Todavía no llegaron mensajes.</Card>
                )}
            </div>

            <Pagination links={messages.links} />

            <ConfirmDialog
                show={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar mensaje"
                description="¿Eliminar este mensaje de contacto?"
            />
        </AdminLayout>
    );
}
