import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
import { SharedLiveEditor } from "../SharedLiveEditor";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function ProjectsEditorPage() {
    const slug = "projects";
    const { data: page } = await supabase
        .from("pages")
        .select("content_json, content_zh_json")
        .eq("slug", slug)
        .single();

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
