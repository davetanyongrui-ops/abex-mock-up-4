"use client";

import { InlineLiveEditor } from "../InlineLiveEditor";
import { NextIntlClientProvider } from "next-intl";
import { ContactView } from "@/components/views/ContactView";

export function ContactEditorClient({ slug, initialData, initialZhData, messages }: any) {
    return (
        <InlineLiveEditor
            pageSlug={slug}
            initialData={initialData}
            initialZhData={initialZhData}
            renderView={(isZh: boolean, data: any) => (
                <NextIntlClientProvider messages={messages} locale={isZh ? 'zh' : 'en'}>
                    <ContactView isEditable={true} initialData={data} />
                </NextIntlClientProvider>
            )}
        />
    );
}
