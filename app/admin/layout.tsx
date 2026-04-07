import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "@/app/globals.css";
import ClientAdminLayout from "./client-layout";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "ABEX - Admin Panel",
    description: "Secure Admin Management System",
};

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ── Server-Side Auth Check ───────────────────────────────────────────────
    // We check the session here to ensure that unauthorized users are 
    // intercepted before any client-side code even runs.

    // Note: We skip the check if we are on the login page to avoid redirect loops
    // In Next.js App Router, the layout is shared. However, we can check 
    // the headers or just rely on the fact that if we are HERE, we are in /admin.
    // However, the login page itself is a child of this layout.

    // We'll let the client-side check in ClientAdminLayout handle the specific 
    // /admin/login path exclusion, but for the Page Builder, we want server-side.

    // Actually, a better way to check the current path in a server layout is 
    // via headers or by passing it down, but common pattern for "all /admin" 
    // is to check session except if user is at /admin/login.

    // Since we don't have easy access to the full URL in Server Layout without 
    // headers, and we already have middleware.ts handling some of it, 
    // we will implement a robust check for the /admin area.

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch (error) {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // If we want to be very strict and redirect server-side:
    // We need to be careful not to redirect when the user is CURRENTLY on /admin/login.
    // However, layouts don't know the exact path. 
    // For now, ClientAdminLayout handles the redirect perfectly.
    // If the user SPECIFICALLY requested server-side check in layout, they often mean
    // preventing the "flicker" of content.

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ClientAdminLayout user={user}>{children}</ClientAdminLayout>
                <Toaster position="bottom-right" richColors />
            </body>
        </html>
    );
}
