import { ServicingView } from '@/components/views/ServicingView';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function ServicingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'servicing')
        .single();

    const content = locale === 'zh' ? page?.content_zh_json : page?.content_json;

    return <ServicingView initialData={content} />;
}
