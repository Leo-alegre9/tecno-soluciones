import { z } from 'zod';

const emptyToNull = (value) => (value === '' || value === undefined ? null : value);

export const requiredText = (max, message = 'Este campo es obligatorio.') =>
    z.string().trim().min(1, message).max(max, `Máximo ${max} caracteres.`);

export const optionalText = (max) =>
    z.preprocess(emptyToNull, z.string().trim().max(max, `Máximo ${max} caracteres.`).nullable());

// '' must fail as "required" instead of being coerced to 0.
const emptyToUndefined = (value) => (value === '' || value === null ? undefined : value);

export const money = z.preprocess(
    emptyToUndefined,
    z.coerce.number({ error: 'Ingresá un número válido.' }).min(0, 'Debe ser 0 o más.'),
);

export const optionalMoney = z.preprocess(
    emptyToNull,
    z.coerce.number({ error: 'Ingresá un número válido.' }).min(0, 'Debe ser 0 o más.').nullable(),
);

export const integer = z.preprocess(
    emptyToUndefined,
    z.coerce.number({ error: 'Ingresá un número entero.' }).int('Ingresá un número entero.').min(0, 'Debe ser 0 o más.'),
);

export const optionalEmail = z.preprocess(emptyToNull, z.email('Ingresá un email válido.').max(120).nullable());

export const optionalUrl = (max) => z.preprocess(emptyToNull, z.url('Ingresá una URL válida.').max(max).nullable());

// Returns { data } on success or { errors: { field: message } } on failure.
export function validate(schema, input) {
    const result = schema.safeParse(input);
    if (result.success) return { data: result.data };

    const errors = {};
    for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key !== undefined && !errors[key]) errors[key] = issue.message;
    }
    return { errors };
}
