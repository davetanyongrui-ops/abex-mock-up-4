import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import { Render } from "@measured/puck";
import { config } from "@/lib/puck/config";
import { AdminEditProvider } from "@/components/admin/AdminEditProvider";
import { AdminControlBar } from "@/components/admin/AdminControlBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getPuckConfig } from "@/lib/puck/get-config";
import { ServicingView } from "@/components/views/ServicingView";
import { ContactView } from "@/components/views/ContactView";

export const revalidate = 0; // Disable cache for the admin editor

export default async function AdminPageEditor({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const paramsData = await params;
    const locale = paramsData.locale;
    const slug = paramsData.slug === 'home' ? 'index' : paramsData.slug;

    const messages = await getMessages();

    // Fetch page data from Supabase
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

    // Ensure data is in Puck format but PRESERVE all other keys (for specialized views)
    const puckData = contentBlocks && typeof contentBlocks === 'object'
        ? {
            ...contentBlocks,
            content: (contentBlocks as any).content && Array.isArray((contentBlocks as any).content)
                ? (contentBlocks as any).content
                : []
        }
        : { content: [], root: {} };

    const activeConfig = getPuckConfig(slug);

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <div className="bg-white min-h-screen">
                <AdminEditProvider initialData={puckData} slug={slug}>
                    <Header />

                    <main className="relative pt-[80px]">
                        {/* Specialized View Overrides for 1:1 Design Sync */}
                        {slug === 'servicing' ? (
                            <ServicingView isEditable={true} initialData={puckData} />
                        ) : slug === 'contact' ? (
                            <ContactView isEditable={true} initialData={puckData} />
                        ) : (
                            <>
                                <Render config={activeConfig as any} data={puckData as any} />
                                {(!puckData.content || (puckData as any).content.length === 0) && (
                                    <div className="py-24 text-center">
                                        <h1 className="text-4xl font-extrabold tracking-tighter mb-6 text-slate-900 uppercase">
                                            {isZh ? (page.title_zh || page.title) : page.title}
                                        </h1>
                                        <p className="text-slate-500 font-medium">This page has no content configured yet.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </main>

                    <Footer />

                    {/* The floating save bar */}
                    <AdminControlBar />
                </AdminEditProvider>
            </div>
        </NextIntlClientProvider>
    );
}
