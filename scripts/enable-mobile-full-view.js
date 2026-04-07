const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function enableMobileFullView() {
    const slugs = ['index', 'about'];

    for (const slug of slugs) {
        const { data: page, error } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) { console.error(`Error fetching ${slug}:`, error); continue; }

        const updateContent = (content) => {
            if (!content || !Array.isArray(content.content)) return;
            content.content.forEach(b => {
                if (b.type === 'Hero') {
                    b.props.fullImageMobile = true;
                    // For mobile full view to look best with landscape pump photos,
                    // we ensure it has a slight overlay but content is visible.
                    if (b.props.overlayOpacity === undefined) b.props.overlayOpacity = 60;
                }
            });
        };

        updateContent(page.content_json);
        updateContent(page.content_zh_json);

        const { error: updateError } = await supabase
            .from('pages')
            .update({
                content_json: page.content_json,
                content_zh_json: page.content_zh_json
            })
            .eq('slug', slug);

        if (updateError) {
            console.error(`Update error for ${slug}:`, updateError);
        } else {
            console.log(`Mobile Full View enabled for ${slug} Hero!`);
        }
    }
}

enableMobileFullView();
