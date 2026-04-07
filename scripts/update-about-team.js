const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAboutTeam() {
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

    const teamSection = {
        type: "ImageSplit",
        props: {
            image: "/images/management_team.jpg",
            label: "Our People",
            theme: "light",
            title: "ABEX Staff and Management",
            reverse: false,
            description: "Our dedicated team of professionals drives the innovation and reliability you expect from ABEX Engineering. With decades of combined industry experience, our staff and management are committed to delivering the highest quality water pump solutions and outstanding customer service.",
            id: "about-management-team-" + Date.now()
        }
    };

    const teamSectionZh = {
        ...teamSection,
        props: {
            ...teamSection.props,
            label: "我们的团队",
            title: "ABEX 员工与管理层",
            description: "我们敬业的专业团队推动了您对 ABEX 工程公司所期望的创新和可靠性。凭借数十年的行业综合经验，我们的员工和管理层致力于提供最优质的水泵解决方案和卓越的客户服务。"
        }
    };

    let contentEn = page.content_json || { content: [], root: { props: { title: "About Us" } } };
    if (!Array.isArray(contentEn.content)) contentEn.content = [];

    // Find the right place to insert (maybe after the primary about-background ImageSplit)
    const bgIndex = contentEn.content.findIndex(c => c.props && c.props.title === 'Our Company Background');
    
    // Insert after it
    let insertIndexEn = bgIndex >= 0 ? bgIndex + 1 : 1;
    contentEn.content.splice(insertIndexEn, 0, teamSection);

    let contentZh = page.content_zh_json || { content: [], root: { props: { title: "关于我们" } } };
    if (!Array.isArray(contentZh.content)) contentZh.content = [];

    const bgIndexZh = contentZh.content.findIndex(c => c.props && (c.props.title === 'Our Company Background' || c.props.title === '我们的公司背景'));
    let insertIndexZh = bgIndexZh >= 0 ? bgIndexZh + 1 : 1;
    contentZh.content.splice(insertIndexZh, 0, teamSectionZh);

    console.log("Updating about page content...");
    const { error: updateError } = await supabase
        .from('pages')
        .update({
            content_json: contentEn,
            content_zh_json: contentZh
        })
        .eq('slug', 'about');

    if (updateError) {
        console.error("Update error:", updateError);
    } else {
        console.log("Successfully updated the Staff and Management section on the About page.");
    }
}

updateAboutTeam();
