import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ClientPuckRender } from "@/components/ClientPuckRender";

export const revalidate = 60; // 1 min cache for dynamic CMS pages

export default async function CMSDynamicPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;

    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !page) {
        notFound();
    }

    // Determine which language content to use
    const isZh = locale === 'zh';
    const contentBlocks = (isZh && page.content_zh_json)
        ? page.content_zh_json
        : page.content_json;

    // Ensure data is in Puck format
    const puckData = contentBlocks && typeof contentBlocks === 'object' && 'content' in contentBlocks
        ? contentBlocks
        : { content: Array.isArray(contentBlocks) ? contentBlocks : [], root: {} };

    return (
        <div className="bg-white min-h-screen">
            <ClientPuckRender data={puckData as any} />

            {/* Fallback if JSON is empty but page exists */}
            {(!puckData.content || (puckData as any).content.length === 0) && (
                <div className="py-24 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tighter mb-6 text-slate-900 uppercase">
                        {isZh ? (page.title_zh || page.title) : page.title}
                    </h1>
                    <p className="text-slate-500 font-medium">This page has no content configured yet.</p>
                </div>
            )}
        </div>
    );
}
