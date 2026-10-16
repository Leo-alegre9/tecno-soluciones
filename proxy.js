import { createServerClient } from '@supabase/ssr';
import { SUPABASE_KEY, SUPABASE_URL } from '@/lib/supabase/config';
import { NextResponse } from 'next/server';

// Refreshes the Supabase session cookie on every request and keeps guests out
// of the admin panel. Real authorization is enforced by RLS in the database.
export async function proxy(request) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    if (!user && pathname.startsWith('/admin')) {
        return redirectTo(request, '/login');
    }

    if (user && pathname === '/login') {
        return redirectTo(request, '/admin');
    }

    return response;
}

function redirectTo(request, pathname) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = '';
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
