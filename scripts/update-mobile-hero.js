const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateHomeMobileHero() {
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'index')
        .single();

    if (error) { console.error(error); return; }

    const updateContent = (content) => {
        if (!content || !Array.isArray(content.content)) return;
        content.content.forEach(b => {
            if (b.type === 'Hero') {
                b.props.mobileBgImage = '/images/home_hero_square.jpg';
                b.props.fullImageMobile = false; // Disable the contain hack in favor of the square image
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
        .eq('slug', 'index');

    if (updateError) {
        console.error('Update error:', updateError);
    } else {
        console.log('Home mobile hero updated to square image!');
    }
}

updateHomeMobileHero();
