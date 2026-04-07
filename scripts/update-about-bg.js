const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateCompanyBackgroundImg() {
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about')
        .single();

    if (error) { console.error(error); return; }

    const updateContent = (content) => {
        if (!content || !Array.isArray(content.content)) return;
        content.content.forEach(c => {
            // Update the block if it's the Company Background section
            if (c.type === 'ImageSplit' && (c.props.title === 'Our Company Background' || c.props.title === '我们的公司背景')) {
                c.props.imageAspect = 'auto'; // Show full height/original aspect
                c.props.imageFit = 'contain'; // Ensure no cropping at all
            }
        });
    };

    updateContent(page.content_json);
    updateContent(page.content_zh_json);

    const { error: updateError } = await supabase
        .from('pages')
        .update({ content_json: page.content_json, content_zh_json: page.content_zh_json })
        .eq('slug', 'about');

    if (updateError) {
        console.error('Update error:', updateError);
    } else {
        console.log('Our Company Background image updated to AUTO/CONTAIN for full visibility!');
    }
}

updateCompanyBackgroundImg();
