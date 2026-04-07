const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicateTeam() {
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

    // Function to filter out the duplicate block
    const filterBlocks = (contentArray) => {
        if (!Array.isArray(contentArray)) return contentArray;
        return contentArray.filter(c => {
            if (c.props && c.props.title === "Management & Staff" && c.props.label === "Our People") {
                // If it's the old one without a specific picture or different title
                return false;
            }
            if (c.props && c.props.title === "Management & Staff" && (!c.props.image || c.props.image.trim() === "")) {
                return false;
            }
            if (c.props && c.props.title === "ABEX Staff and Management" && (!c.props.image || c.props.image.trim() === "")) {
                return false;
            }
            if(c.props && c.props.heading === "Management & Staff") {
                 return false;
            }
            return true;
        });
    };

    if (page.content_json) {
        page.content_json.content = filterBlocks(page.content_json.content);
    }

    if (page.content_zh_json) {
        page.content_zh_json.content = filterBlocks(page.content_zh_json.content);
        // Also remove the Chinese translation of it just in case
        page.content_zh_json.content = page.content_zh_json.content.filter(c => {
            if (c.props && c.props.title === "管理与员工") return false;
            if (c.props && c.props.heading === "管理与员工") return false;
            if (c.props && c.props.title === "Management & Staff") return false;
            return true;
        });
    }

    console.log("Updating about page layout to remove duplicate...");
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
        console.log("Successfully removed the duplicate Management & Staff section.");
    }
}

removeDuplicateTeam();
