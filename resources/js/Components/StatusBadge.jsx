import Badge from '@/Components/UI/Badge';

const toneByStatus = {
    recibido: 'info',
    diagnosticando: 'warning',
    presupuestado: 'warning',
    aprobado: 'brand',
    en_reparacion: 'brand',
    listo: 'success',
    entregado: 'success',
    no_reparable: 'danger',
    cancelado: 'neutral',
};

export default function StatusBadge({ status, label }) {
    return <Badge tone={toneByStatus[status] || 'neutral'}>{label ?? status}</Badge>;
}
