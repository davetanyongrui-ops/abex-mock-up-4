const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sync() {
    console.log("Fetching pages...");
    const { data, error } = await supabase.from('pages').select('slug, content_json, content_zh_json').in('slug', ['index', 'about', 'servicing', 'projects']);
    if (error) {
        console.error(error);
        process.exit(1);
    }

    for (let page of data) {
        if (page.slug === 'index') {
            const modify = (content) => {
                for (let block of content) {
                    if (block.id === 'home-hero') {
                        block.props.bgImage = "/images/paragon_pump_home_1774951065340.png";
                        if (block.props.bg_image) block.props.bg_image = "/images/paragon_pump_home_1774951065340.png";
                    }
                    if (block.id === 'home-intro') {
                        block.props.image = "/images/paragon_pump_about_1774951084556.png";
                    }
                }
            };
            if (page.content_json?.content) modify(page.content_json.content);
            if (page.content_zh_json?.content) modify(page.content_zh_json.content);
            
            await supabase.from('pages').update({ content_json: page.content_json, content_zh_json: page.content_zh_json }).eq('slug', 'index');
        }

        if (page.slug === 'about') {
            const modify = (content, isZh) => {
                let newContent = [];
                for (let block of content) {
                    if (block.id === 'about-hero') {
                        block.props.bgImage = "/images/paragon_pump_about_1774951084556.png";
                        if (block.props.bg_image) block.props.bg_image = "/images/paragon_pump_about_1774951084556.png";
                    }
                    if (block.id === 'about-background') {
                        block.props.image = "/images/paragon_pump_home_1774951065340.png"; // User said "Company Background (below About Us) - Same issue as #1." so I'll use the same hero pump or about pump. Let's use the pump_home here to add variety.
                    }
                    newContent.push(block);
                    
                    if (block.id === 'about-background') {
                        // Insert team photo placeholder after about-background
                        newContent.push({
                            id: "about-team",
                            type: "ImageSplit",
                            props: {
                                id: "about-team",
                                image: "/images/team_placeholder_1774951147882.png",
                                label: isZh ? "我们的团队" : "Our People",
                                theme: "light",
                                title: isZh ? "管理层及员工" : "Management & Staff",
                                reverse: true,
                                description: isZh ? "我们专业的管理和员工团队。" : "Our team of dedicated professionals and management staff."
                            }
                        });
                    }
                }
                return newContent;
            };

            if (page.content_json?.content) page.content_json.content = modify(page.content_json.content, false);
            if (page.content_zh_json?.content) page.content_zh_json.content = modify(page.content_zh_json.content, true);

            await supabase.from('pages').update({ content_json: page.content_json, content_zh_json: page.content_zh_json }).eq('slug', 'about');
        }

        if (page.slug === 'servicing') {
            const modify = (content) => {
                for (let block of content) {
                    if (block.type === 'Hero') {
                         block.props.bgImage = "/images/pump_servicing_1774951102157.png";
                         if (block.props.bg_image) block.props.bg_image = "/images/pump_servicing_1774951102157.png";
                    }
                    if (block.type === 'ImageSplit') {
                        block.props.image_url = "/images/pump_servicing_1774951102157.png";
                        if (block.props.image) block.props.image = "/images/pump_servicing_1774951102157.png"; // just in case
                    }
                }
            };
            if (page.content_json?.content) modify(page.content_json.content);
            if (page.content_zh_json?.content) modify(page.content_zh_json.content);

            await supabase.from('pages').update({ content_json: page.content_json, content_zh_json: page.content_zh_json }).eq('slug', 'servicing');
        }

        if (page.slug === 'projects') {
            const modify = (content) => {
                for (let block of content) {
                    if (block.id === 'projects-hero') {
                        block.props.bgImage = "/images/project_mbs_1774951118844.png";
                        if (block.props.bg_image) block.props.bg_image = "/images/project_mbs_1774951118844.png";
                    }
                }
            };
            if (page.content_json?.content) modify(page.content_json.content);
            if (page.content_zh_json?.content) modify(page.content_zh_json.content);

            await supabase.from('pages').update({ content_json: page.content_json, content_zh_json: page.content_zh_json }).eq('slug', 'projects');
        }
    }
    console.log("Successfully updated all page blocks in the database!");
}

sync();
