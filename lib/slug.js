export function slugify(text) {
    return String(text ?? '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Same behaviour as the old Laravel uniqueSlug(): name, name-1, name-2...
export async function uniqueSlug(supabase, table, text, ignoreId = null) {
    const base = slugify(text) || 'item';
    let query = supabase.from(table).select('id, slug').like('slug', `${base}%`);
    if (ignoreId) query = query.neq('id', ignoreId);
    const { data, error } = await query;
    if (error) throw error;

    const taken = new Set((data ?? []).map((row) => row.slug));
    let slug = base;
    let i = 1;
    while (taken.has(slug)) slug = `${base}-${i++}`;
    return slug;
}
