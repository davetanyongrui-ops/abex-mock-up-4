"use client";

import { InlineLiveEditor } from "../InlineLiveEditor";
import { NextIntlClientProvider } from "next-intl";
import { ServicingView } from "@/components/views/ServicingView";

export function ServicingEditorClient({ slug, initialData, initialZhData, messages }: any) {
    return (
        <InlineLiveEditor
            pageSlug={slug}
            initialData={initialData}
            initialZhData={initialZhData}
            renderView={(isZh: boolean, data: any) => (
                <NextIntlClientProvider messages={messages} locale={isZh ? 'zh' : 'en'}>
                    <ServicingView isEditable={true} initialData={data} />
                </NextIntlClientProvider>
            )}
        />
    );
}
