import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Admin routes: bypass intl entirely, apply auth guard ────────────────
    if (pathname.startsWith('/admin')) {
        // Always let the login page through
        if (pathname.startsWith('/admin/login')) {
            return NextResponse.next({ request });
        }

        // Check Supabase session
        let response = NextResponse.next({ request });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return request.cookies.getAll(); },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        // 1. No session -> redirect to login
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // 2. Check if user is an admin in the profiles table
        // We use service role key if needed, or rely on RLS if authenticated
        // For middleware, we'll check the 'profiles' table for the user's role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            // Sign out the unauthorized user or just redirect
            console.log('Unauthorized access attempt by:', user.email);
            return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
        }

        return response;
    }

    // ── Public routes: intl locale middleware ────────────────────────────────
    return intlMiddleware(request);
}

export default middleware;

export const config = {
    matcher: [
        '/admin',
        '/admin/:path+',
        '/',
        '/(zh|en)/:path*',
        '/((?!_next|_vercel|api|admin|.*\\..*).*)',
    ],
};
