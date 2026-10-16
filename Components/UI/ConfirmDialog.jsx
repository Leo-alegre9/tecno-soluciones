'use client';

import Modal from '@/Components/UI/Modal';
import Button from '@/Components/UI/Button';

export default function ConfirmDialog({ show, onClose, onConfirm, title = '¿Confirmar acción?', description, confirmLabel = 'Eliminar', processing = false }) {
    return (
        <Modal show={show} onClose={onClose} title={title} maxWidth="sm">
            {description && <p className="text-sm text-ink-500">{description}</p>}
            <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={processing}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
