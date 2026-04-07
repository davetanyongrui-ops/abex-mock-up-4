const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCompanyName() {
    console.log("Fetching all pages...");
    const { data: pages, error: fetchError } = await supabase
        .from('pages')
        .select('*');

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    for (const page of pages) {
        let updated = false;
        let contentEn = JSON.stringify(page.content_json || {});
        let contentZh = JSON.stringify(page.content_zh_json || {});

        const oldNames = [/ABEX Pumps/g, /Abex Pump/g, /ABEX Pump/g];
        const newName = "Abex Engineering";

        for (const pattern of oldNames) {
            if (pattern.test(contentEn)) {
                contentEn = contentEn.replace(pattern, newName);
                updated = true;
            }
            if (pattern.test(contentZh)) {
                contentZh = contentZh.replace(pattern, newName);
                updated = true;
            }
        }

        if (updated) {
            console.log(`Updating page: ${page.slug}`);
            const { error: updateError } = await supabase
                .from('pages')
                .update({
                    content_json: JSON.parse(contentEn),
                    content_zh_json: JSON.parse(contentZh)
                })
                .eq('id', page.id);
            if (updateError) console.error(`Error updating ${page.slug}:`, updateError);
        }
    }

    console.log("Company name update completed.");
}

updateCompanyName();
