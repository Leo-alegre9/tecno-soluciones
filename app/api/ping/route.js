import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase/config';

// cron-job.org calls this once a day so the free Supabase project registers
// activity and never gets paused (same setup as go-store).
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
        const { error } = await supabase.from('settings').select('key').limit(1);

        if (error) {
            return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
        }

        return NextResponse.json({ status: 'ok', message: 'Supabase activo ✅', timestamp: new Date().toISOString() });
    } catch {
        return NextResponse.json({ status: 'error', message: 'Error de conexión' }, { status: 500 });
    }
}
