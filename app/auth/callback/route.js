import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Landing point for Supabase email links (password recovery): swaps the
// one-time code for a session cookie and continues to `next`.
export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next');
    const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : '/admin';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
    }

    return NextResponse.redirect(`${origin}/login?error=link`);
}
