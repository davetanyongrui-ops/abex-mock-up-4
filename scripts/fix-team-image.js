const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLayoutToSquare() {
    console.log("Fetching about page...");
    const { data: page, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about')
        .single();

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    if (page.content_json && Array.isArray(page.content_json.content)) {
        page.content_json.content.forEach(c => {
            if (c.props && c.props.id && c.props.id.includes('about-management-team')) {
                c.props.imageAspect = "square";
                c.props.imageFit = "contain"; 
            }
        });
    }

    if (page.content_zh_json && Array.isArray(page.content_zh_json.content)) {
        page.content_zh_json.content.forEach(c => {
            if (c.props && c.props.id && c.props.id.includes('about-management-team')) {
                c.props.imageAspect = "square";
                c.props.imageFit = "contain"; 
            }
        });
    }

    console.log("Updating about page layout to strictly square...");
    const { error: updateError } = await supabase
        .from('pages')
        .update({
            content_json: page.content_json,
            content_zh_json: page.content_zh_json
        })
        .eq('slug', 'about');

    if (updateError) {
        console.error("Update error:", updateError);
    } else {
        console.log("Successfully fixed the image aspect ratio to SQUARE in DB.");
    }
}

updateLayoutToSquare();
