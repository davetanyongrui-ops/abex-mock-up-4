import { notFound, redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Render } from "@measured/puck";
import { config } from "@/lib/puck/config";
import { AdminEditProvider } from "@/components/admin/AdminEditProvider";
import { AdminControlBar } from "@/components/admin/AdminControlBar";

const ADMIN_EMAILS = ['rickytan@abex-engrg.com', 'sales@abex-engrg.com'];

export default async function InlineEditorPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug, locale } = await params;

    // ── 1. Server-side auth check (defence in depth) ───────────────────────
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
        redirect('/admin/login');
    }

    // ── 2. Fetch page data ─────────────────────────────────────────────────
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !page) {
        notFound();
    }

    const isZh = locale === 'zh';
    const contentBlocks = (isZh && page.content_zh_json)
        ? page.content_zh_json
        : page.content_json;

    const puckData = contentBlocks && typeof contentBlocks === 'object' && 'content' in contentBlocks
        ? contentBlocks
        : { content: Array.isArray(contentBlocks) ? contentBlocks : [], root: {} };

    // ── 3. Render with the inline editor ──────────────────────────────────
    return (
        <AdminEditProvider slug={slug} initialData={puckData}>
            {/* Editor Banner */}
            <div className="sticky top-0 z-50 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Inline Editor
                </span>
                <span className="text-amber-600">
                    Editing: <strong>{slug}</strong> ({locale.toUpperCase()}) — click any text to edit it directly
                </span>
                <a
                    href={`/${locale}/${slug === 'home' ? '' : slug}`}
                    className="ml-auto text-xs text-amber-700 underline hover:text-amber-900"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ↗ View Public Page
                </a>
            </div>

            <div className="bg-white min-h-screen">
                <Render config={config as any} data={puckData as any} />
            </div>

            <AdminControlBar />
        </AdminEditProvider>
    );
}
