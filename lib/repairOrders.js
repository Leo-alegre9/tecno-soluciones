export const STATUSES = {
    recibido: 'Recibido',
    diagnosticando: 'En diagnóstico',
    presupuestado: 'Presupuestado',
    aprobado: 'Aprobado por cliente',
    en_reparacion: 'En reparación',
    listo: 'Listo para retirar',
    entregado: 'Entregado',
    no_reparable: 'No reparable',
    cancelado: 'Cancelado',
};

export const DEVICE_TYPES = {
    celular: 'Celular',
    notebook: 'Notebook',
    pc: 'PC de escritorio',
    tablet: 'Tablet',
    componente: 'Componente / Microelectrónica',
    audio: 'Audio / Parlantes',
    otro: 'Otro',
};

export const CLOSED_STATUSES = ['entregado', 'no_reparable', 'cancelado'];

export function profitOf(order) {
    return Number(order.charged_price ?? 0) - Number(order.parts_cost ?? 0) - Number(order.labor_cost ?? 0);
}

// Adds the computed fields the Laravel model used to append.
export function decorateOrder(order) {
    return {
        ...order,
        profit: profitOf(order),
        status_label: STATUSES[order.status] ?? order.status,
        device_type_label: DEVICE_TYPES[order.device_type] ?? order.device_type,
        status_logs: order.status_logs
            ?.map((log) => ({ ...log, status_label: STATUSES[log.status] ?? log.status }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at) || b.id - a.id),
    };
}
