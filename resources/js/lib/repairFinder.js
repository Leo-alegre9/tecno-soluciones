// Central map of common problems shown once a repair category is selected in
// the "¿Qué necesitás reparar hoy?" finder. Keyed by Category#slug so it stays
// in sync with whatever categories exist in the database (see
// database/seeders/CategorySeeder.php for the default set). Unmapped
// categories fall back to a short generic list instead of breaking.

const REPAIR_OPTIONS = {
    celulares: ['Pantalla', 'Batería', 'No enciende', 'Pin de carga', 'Cámara', 'Software', 'Otro problema'],
    'notebooks-pc': ['Pantalla', 'Batería', 'No enciende', 'Teclado', 'Lentitud / formateo', 'Software', 'Otro problema'],
    'componentes-microelectronica': [
        'Reparación de placa',
        'Cortocircuito',
        'Microsoldadura',
        'Diagnóstico de componente',
        'Otro problema',
    ],
    'audio-parlantes': ['No enciende', 'Sin sonido / distorsión', 'Batería', 'Conector de carga', 'Otro problema'],
    tablets: ['Pantalla', 'Batería', 'No enciende', 'Pin de carga', 'Software', 'Otro problema'],
    accesorios: ['Diagnóstico', 'Reemplazo', 'Consulta de compatibilidad', 'Otro problema'],
};

const DEFAULT_OPTIONS = ['Diagnóstico general', 'Otro problema'];

export function repairOptionsFor(category) {
    return REPAIR_OPTIONS[category?.slug] ?? DEFAULT_OPTIONS;
}
