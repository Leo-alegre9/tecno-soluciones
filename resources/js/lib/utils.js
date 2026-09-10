import clsx from 'clsx';

export function cn(...inputs) {
    return clsx(inputs);
}

export function formatCurrency(value) {
    const number = Number(value ?? 0);
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(number);
}

export function formatDate(value, options = {}) {
    if (!value) return '—';
    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...options,
    }).format(new Date(value));
}

export function formatDateTime(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

export function waLink(number, message) {
    const clean = String(number || '').replace(/\D/g, '');
    const text = encodeURIComponent(message || '');
    return `https://wa.me/${clean}${text ? `?text=${text}` : ''}`;
}
