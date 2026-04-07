import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
import { ContactEditorClient } from "./ContactEditorClient";
import { getMessages } from "next-intl/server";

export default async function ContactEditorPage() {
    const slug = "contact";
    const { data: page } = await supabase
        .from("pages")
        .select("content_json, content_zh_json")
        .eq("slug", slug)
        .single();

    const messages = await getMessages();

    return (
        <ContactEditorClient
            slug={slug}
            initialData={page?.content_json ?? {}}
            initialZhData={page?.content_zh_json ?? {}}
            messages={messages}
        />
    );
}
