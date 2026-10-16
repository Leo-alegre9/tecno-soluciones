import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase/config';

let client;

export function createClient() {
    if (!client) {
        client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return client;
}
