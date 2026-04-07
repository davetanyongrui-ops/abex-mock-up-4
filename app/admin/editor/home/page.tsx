import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
import { SharedLiveEditor } from "../SharedLiveEditor";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function HomeEditorPage() {
    const slug = "index";
    const { data: page } = await supabase
        .from("pages")
        .select("content_json, content_zh_json")
        .eq("slug", slug)
        .single();

    // Fetch internationalization messages for components rendered inside Puck
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale="en">
            <SharedLiveEditor
                pageSlug={slug}
                initialData={page?.content_json ?? null}
                initialZhData={page?.content_zh_json ?? null}
            />
        </NextIntlClientProvider>
    );
}
