const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function restoreHomeHero() {
    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'index')
        .single();

    [page.content_json, page.content_zh_json].forEach(content => {
        if (!content || !Array.isArray(content.content)) return;
        content.content.forEach(c => {
            if (c.type === 'Hero' && (c.id === 'home-hero' || (c.props && c.props.id === 'home-hero'))) {
                c.props.bgImage = '/images/home_hero_landscape.jpg';
                c.props.bgFit = 'cover';
                c.props.overlayOpacity = 30;
                c.props.title = 'Reliable Water Pump Solutions for Every Industry';
                c.props.subtitle = 'Power. Precision. Performance. ABEX delivers trusted water pump systems built to move the world\'s most essential resource — water.';
                c.props.ctaText = 'Explore Products';
                c.props.ctaHref = '/products';
                c.props.brandLogo = '';
                c.props.variant = 'home';
            }
        });
    });

    const { error } = await supabase
        .from('pages')
        .update({
            content_json: page.content_json,
            content_zh_json: page.content_zh_json
        })
        .eq('slug', 'index');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Home hero fully restored!');
    }
}

restoreHomeHero();
