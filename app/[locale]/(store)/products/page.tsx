import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ClientPuckRender } from "@/components/ClientPuckRender";

export const revalidate = 60;

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'products')
        .single();

    if (error || !page) {
        notFound();
    }

    const isZh = locale === 'zh';
    const contentBlocks = (isZh && page.content_zh_json)
        ? page.content_zh_json
        : page.content_json;

    const puckData = contentBlocks && typeof contentBlocks === 'object' && 'content' in contentBlocks
        ? {
            ...contentBlocks,
            content: (contentBlocks as any).content.map((block: any) =>
                block.type === 'Hero' ? { ...block, props: { ...block.props, variant: 'inner' } } : block
            )
        }
        : { content: [], root: {} };

    return (
        <main className="bg-white">
            <ClientPuckRender data={puckData as any} />
        </main>
    );
}
