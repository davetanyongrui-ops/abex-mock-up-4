const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function shortenAboutCTA() {
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about')
        .single();

    if (error) { console.error(error); return; }

    const updateContent = (content) => {
        if (!content || !Array.isArray(content.content)) return;
        const index = content.content.findIndex(b => 
            b.id === 'about-cta' || 
            (b.type === 'Hero' && b.props?.title?.includes('Ready to Learn More'))
        );
        if (index !== -1) {
            const oldProps = content.content[index].props;
            content.content[index] = {
                type: 'ShortCTA',
                props: {
                    id: 'about-cta-short',
                    title: oldProps.title,
                    subtitle: oldProps.subtitle,
                    ctaText: oldProps.ctaText,
                    ctaHref: oldProps.ctaHref || '/contact',
                    bgImage: '',
                    bgSize: 'cover'
                }
            };
        }
    };

    updateContent(page.content_json);
    updateContent(page.content_zh_json);

    const { error: updateError } = await supabase
        .from('pages')
        .update({
            content_json: page.content_json,
            content_zh_json: page.content_zh_json
        })
        .eq('slug', 'about');

    if (updateError) {
        console.error('Update error:', updateError);
    } else {
        console.log('About page CTA shortened and background removed successfully!');
    }
}

shortenAboutCTA();
