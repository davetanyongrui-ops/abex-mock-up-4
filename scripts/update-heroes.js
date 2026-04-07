const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateHeroes() {
    console.log("Fetching home and servicing pages...");
    const { data: pages, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .in('slug', ['index', 'servicing']);

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    const homePage = pages.find(p => p.slug === 'index');
    const servicingPage = pages.find(p => p.slug === 'servicing');

    // Update Home Page
    if (homePage && homePage.content_json?.content) {
        let contentEn = homePage.content_json;
        let cIdx = contentEn.content.findIndex(c => c.type === 'Hero');
        if (cIdx >= 0) {
            contentEn.content[cIdx].props.brandLogo = "/images/brands/Paragon Pump Logo_White.png";
        }
        
        let contentZh = homePage.content_zh_json || contentEn;
        if (contentZh && contentZh.content) {
            let zIdx = contentZh.content.findIndex(c => c.type === 'Hero');
            if (zIdx >= 0) {
                contentZh.content[zIdx].props.brandLogo = "/images/brands/Paragon Pump Logo_White.png";
            }
        }
        
        await supabase.from('pages').update({ content_json: contentEn, content_zh_json: contentZh }).eq('slug', 'index');
        console.log("Updated Home Page Hero with Paragon Logo.");
    }

    // Update Servicing Page
    if (servicingPage && servicingPage.content_json?.content) {
        let contentEn = servicingPage.content_json;
        let cIdx = contentEn.content.findIndex(c => c.type === 'Hero');
        if (cIdx >= 0) {
            contentEn.content[cIdx].props.bgImage = "/images/hero/servicing_paragon.png";
        } else {
             // In case there is no Hero defined, let's just make one at the top.
             contentEn.content.unshift({
                "type": "Hero",
                 "props": {
                    "title": "Professional Pump Servicing",
                    "bgImage": "/images/hero/servicing_paragon.png",
                    "subtitle": "Precision repair for industrial applications."
                 }
             })
        }
        
        let contentZh = servicingPage.content_zh_json || contentEn;
        if (contentZh && contentZh.content) {
            let zIdx = contentZh.content.findIndex(c => c.type === 'Hero');
            if (zIdx >= 0) {
                contentZh.content[zIdx].props.bgImage = "/images/hero/servicing_paragon.png";
            }
        }
        
        await supabase.from('pages').update({ content_json: contentEn, content_zh_json: contentZh }).eq('slug', 'servicing');
        console.log("Updated Servicing Page Hero with engineer photo.");
    }
}

updateHeroes();
