const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateHomeBrands() {
    console.log("Fetching home page...");
    const { data: page, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'index')
        .single();

    if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
    }

    const brandSection = {
        type: "BrandsGrid",
        props: {
            title: "Our Trusted Brands",
            description: "We partner with world-class manufacturers to provide the highest quality liquid handling solutions.",
            brands: [
                {
                    name: "Paragon Pump",
                    logo: "https://www.paragonpumpasia.com/image/catalog/Navigation_Logo.png",
                    description: "High-performance centrifugal pumps for industrial, fire protection, and municipal applications."
                },
                {
                    name: "Weinman",
                    logo: "/images/Weinman logo.jpg",
                    description: "Renowned for versatility and efficiency in commercial heating, air conditioning, and industrial services."
                }
            ],
            id: "brands-section-" + Date.now()
        }
    };

    // Update English content
    let contentEn = page.content_json;
    if (contentEn && Array.isArray(contentEn.content)) {
        const brandsIndexEn = contentEn.content.findIndex(c => c.type === 'BrandsGrid');
        if (brandsIndexEn >= 0) {
            contentEn.content[brandsIndexEn] = brandSection;
        }
    }

    // Update Chinese content
    const brandSectionZh = {
        ...brandSection,
        props: {
            ...brandSection.props,
            title: "我们的品牌",
            description: "我们与世界一流的制造商合作，提供最高质量的液体处理解决方案。",
            brands: [
                {
                    name: "Paragon Pump",
                    logo: "https://www.paragonpumpasia.com/image/catalog/Navigation_Logo.png",
                    description: "适用于工业、消防和市政应用的高性能离心泵。"
                },
                {
                    name: "Weinman",
                    logo: "/images/Weinman logo.jpg",
                    description: "以商业供暖、空调和工业服务的通用性和效率而闻名。"
                }
            ]
        }
    };

    let contentZh = page.content_zh_json;
    if (contentZh && Array.isArray(contentZh.content)) {
        const brandsIndexZh = contentZh.content.findIndex(c => c.type === 'BrandsGrid');
        if (brandsIndexZh >= 0) {
            contentZh.content[brandsIndexZh] = brandSectionZh;
        }
    }

    console.log("Updating home page content with actual logos...");
    const { error: updateError } = await supabase
        .from('pages')
        .update({
            content_json: contentEn,
            content_zh_json: contentZh
        })
        .eq('slug', 'index');

    if (updateError) {
        console.error("Update error:", updateError);
    } else {
        console.log("Successfully updated brands logos on Home page.");
    }
}

updateHomeBrands();
