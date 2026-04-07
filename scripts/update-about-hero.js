const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateAboutHero() {
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about')
        .single();

    if (error) { console.error(error); return; }

    [page.content_json, page.content_zh_json].forEach(content => {
        if (!content || !Array.isArray(content.content)) return;
        content.content.forEach(c => {
            if (c.type === 'Hero') {
                c.props.bgImage = '/images/paragon-pumps.jpeg';
                c.props.bgFit = 'cover';
                c.props.overlayOpacity = 55;
            }
        });
    });

    const { error: updateError } = await supabase
        .from('pages')
        .update({ content_json: page.content_json, content_zh_json: page.content_zh_json })
        .eq('slug', 'about');

    if (updateError) {
        console.error('Update error:', updateError);
    } else {
        console.log('About hero updated to Paragon pumps.jpeg!');
    }
}

updateAboutHero();
