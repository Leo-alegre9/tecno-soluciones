import MessagesIndex from '@/views/Admin/Messages/Index';
import { pageFrom, paginate, rangeFor } from '@/lib/pagination';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Mensajes' };

const PER_PAGE = 20;

export default async function MessagesPage({ searchParams }) {
    const page = pageFrom(await searchParams);
    const supabase = await createClient();

    const { data, count } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(...rangeFor(page, PER_PAGE));

    return (
        <MessagesIndex
            messages={paginate({ data, total: count, page, perPage: PER_PAGE, path: '/admin/messages' })}
        />
    );
}
