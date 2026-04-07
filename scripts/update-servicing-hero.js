const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateServicingHero() {
    const { data: page, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'servicing')
        .single();

    if (fetchError) {
        console.error('Fetch error:', fetchError);
        return;
    }

    [page.content_json, page.content_zh_json].forEach(content => {
        if (!content || !Array.isArray(content.content)) return;
        content.content.forEach(c => {
            if (c.type === 'Hero') {
                c.props.bgImage = '/images/abex-servicing.jpeg';
                c.props.bgFit = 'cover';
                c.props.overlayOpacity = 50;
            }
        });
    });

    const { error } = await supabase
        .from('pages')
        .update({
            content_json: page.content_json,
            content_zh_json: page.content_zh_json
        })
        .eq('slug', 'servicing');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Servicing hero updated to Abex Servicing pic!');
    }
}

updateServicingHero();
