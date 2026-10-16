// withQuery('/catalogo', { categoria: 'celulares', buscar: '' }) -> '/catalogo?categoria=celulares'
export function withQuery(path, params = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') query.set(key, value);
    }
    const qs = query.toString();
    return qs ? `${path}?${qs}` : path;
}
