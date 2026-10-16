import clsx from 'clsx';

// Fixed so server and browser render the same dates (avoids hydration mismatches).
export const TIME_ZONE = 'America/Argentina/Buenos_Aires';
const TZ_OFFSET = '-03:00';

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
        timeZone: TIME_ZONE,
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
        timeZone: TIME_ZONE,
    }).format(new Date(value));
}

// ISO timestamp -> "YYYY-MM-DDTHH:mm" in Argentina time, for <input type="datetime-local">.
export function toDateTimeLocal(value) {
    if (!value) return '';
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
            timeZone: TIME_ZONE,
        })
            .formatToParts(new Date(value))
            .map((part) => [part.type, part.value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

// "YYYY-MM-DDTHH:mm" (Argentina time) -> ISO timestamp.
export function fromDateTimeLocal(value) {
    if (!value) return null;
    return new Date(`${value}:00${TZ_OFFSET}`).toISOString();
}

export function waLink(number, message) {
    const clean = String(number || '').replace(/\D/g, '');
    const text = encodeURIComponent(message || '');
    return `https://wa.me/${clean}${text ? `?text=${text}` : ''}`;
}

// Lets a long email wrap right after the "@" instead of mid-word.
export function breakableEmail(email) {
    return String(email ?? '').replace('@', '@​');
}
