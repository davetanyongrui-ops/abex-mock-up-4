import { ContactView } from '@/components/views/ContactView';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'contact')
        .single();

    const content = locale === 'zh' ? page?.content_zh_json : page?.content_json;

    return <ContactView initialData={content} />;
}
