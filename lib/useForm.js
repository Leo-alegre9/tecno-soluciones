'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

// Small stand-in for Inertia's useForm: same data/setData/errors/processing
// API, but submit() runs whatever async Supabase logic the page passes in.
export function useForm(initialData) {
    const defaults = useRef(initialData);
    const [data, setDataState] = useState(initialData);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const setData = useCallback((keyOrValues, value) => {
        if (typeof keyOrValues === 'string') {
            setDataState((current) => ({ ...current, [keyOrValues]: value }));
        } else {
            setDataState((current) => ({ ...current, ...keyOrValues }));
        }
    }, []);

    const reset = useCallback((...fields) => {
        if (fields.length === 0) {
            setDataState(defaults.current);
            return;
        }
        setDataState((current) => {
            const next = { ...current };
            for (const field of fields) next[field] = defaults.current[field];
            return next;
        });
    }, []);

    const clearErrors = useCallback(() => setErrors({}), []);

    // action(data) may return { errors } to show field errors; throwing shows a toast.
    async function submit(action, { onSuccess } = {}) {
        setProcessing(true);
        setErrors({});
        try {
            const result = await action(data);
            if (result?.errors) {
                setErrors(result.errors);
                return false;
            }
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);
            onSuccess?.(result);
            return true;
        } catch (error) {
            toast.error(errorMessage(error));
            return false;
        } finally {
            setProcessing(false);
        }
    }

    return { data, setData, errors, setErrors, processing, recentlySuccessful, reset, clearErrors, submit };
}

export function errorMessage(error) {
    if (!error) return 'Ocurrió un error inesperado.';
    if (error.code === '23505') return 'Ya existe un registro con esos datos.';
    if (error.code === '42501') return 'No tenés permisos para realizar esta acción.';
    return error.message || 'Ocurrió un error inesperado.';
}
