import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
import { ServicingEditorClient } from "./ServicingEditorClient";
import { getMessages } from "next-intl/server";

export default async function ServicingEditorPage() {
    const slug = "servicing";
    const { data: page } = await supabase
        .from("pages")
        .select("content_json, content_zh_json")
        .eq("slug", slug)
        .single();

    const messages = await getMessages();

    return (
        <ServicingEditorClient
            slug={slug}
            initialData={page?.content_json ?? {}}
            initialZhData={page?.content_zh_json ?? {}}
            messages={messages}
        />
    );
}
