const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setHomeHeroToCover() {
    console.log("Fetching home page...");
    const { data: page, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'index')
        .single();

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    if (page.content_json && Array.isArray(page.content_json.content)) {
        page.content_json.content.forEach(c => {
            if (c.type === 'Hero') {
                c.props.bgFit = "cover";
            }
        });
    }

    if (page.content_zh_json && Array.isArray(page.content_zh_json.content)) {
        page.content_zh_json.content.forEach(c => {
            if (c.type === 'Hero') {
                c.props.bgFit = "cover";
            }
        });
    }

    console.log("Updating home page hero to 'cover'...");
    const { error: updateError } = await supabase
        .from('pages')
        .update({
            content_json: page.content_json,
            content_zh_json: page.content_zh_json
        })
        .eq('slug', 'index');

    if (updateError) {
        console.error("Update error:", updateError);
    } else {
        console.log("Successfully updated home hero styles to COVER!");
    }
}

setHomeHeroToCover();
