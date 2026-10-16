// Builds the Laravel-style paginator shape ({ data, links }) the Pagination
// component already understands.
export function pageFrom(searchParams) {
    const page = parseInt(searchParams?.page ?? '1', 10);
    return Number.isFinite(page) && page > 0 ? page : 1;
}

export function rangeFor(page, perPage) {
    const from = (page - 1) * perPage;
    return [from, from + perPage - 1];
}

export function paginate({ data, total, page, perPage, path, searchParams }) {
    const lastPage = Math.max(1, Math.ceil((total ?? 0) / perPage));

    const urlFor = (p) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams ?? {})) {
            if (key !== 'page' && value) params.set(key, value);
        }
        if (p > 1) params.set('page', String(p));
        const qs = params.toString();
        return qs ? `${path}?${qs}` : path;
    };

    const links = [{ url: page > 1 ? urlFor(page - 1) : null, label: '&laquo; Anterior', active: false }];
    for (let p = 1; p <= lastPage; p++) {
        links.push({ url: urlFor(p), label: String(p), active: p === page });
    }
    links.push({ url: page < lastPage ? urlFor(page + 1) : null, label: 'Siguiente &raquo;', active: false });

    return { data: data ?? [], links, current_page: page, last_page: lastPage, total: total ?? 0 };
}
