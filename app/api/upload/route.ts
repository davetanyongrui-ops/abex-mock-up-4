import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        // Use service role key to bypass RLS
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${uuidv4()}.${fileExt}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { data, error } = await supabaseAdmin.storage
            .from("product-images")
            .upload(fileName, buffer, {
                contentType: file.type || "image/png",
                upsert: false
            });

        if (error) {
            console.error("Storage upload error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: publicUrlData } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrlData.publicUrl });

    } catch (error) {
        console.error("API upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
