const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateHomeSubHeroImg() {
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'index')
        .single();

    if (error) { console.error(error); return; }

    const targetImg = 'https://abex-engi.vercel.app/_next/image?url=%2Fassets%2Fproducts%2Fps-series.png&w=3840&q=75';

    const updateContent = (content) => {
        if (!content || !Array.isArray(content.content)) return;
        
        // Find the first ImageSplit block after the Hero
        const heroIdx = content.content.findIndex(c => c.type === 'Hero');
        const nextBlock = content.content[heroIdx + 1];

        if (nextBlock && nextBlock.type === 'ImageSplit') {
            nextBlock.props.image = targetImg;
            nextBlock.props.imageFit = 'contain'; // Often products look better contained
        } else {
            // If not found, look for any ImageSplit in the first few blocks
            const firstImageSplit = content.content.find((c, i) => c.type === 'ImageSplit' && i < 3);
            if (firstImageSplit) {
                firstImageSplit.props.image = targetImg;
                firstImageSplit.props.imageFit = 'contain';
            }
        }
    };

    updateContent(page.content_json);
    updateContent(page.content_zh_json);

    const { error: updateError } = await supabase
        .from('pages')
        .update({ content_json: page.content_json, content_zh_json: page.content_zh_json })
        .eq('slug', 'index');

    if (updateError) {
        console.error('Update error:', updateError);
    } else {
        console.log('Home page sub-hero image updated successfully!');
    }
}

updateHomeSubHeroImg();
