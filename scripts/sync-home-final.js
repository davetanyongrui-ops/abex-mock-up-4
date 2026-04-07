const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const content_en = {
    "root": { "props": { "title": "Home" } },
    "content": [
        {
            "id": "home-hero",
            "type": "Hero",
            "props": {
                "title": "Reliable Water Pump Solutions",
                "bgImage": "/images/hero/home.webp",
                "ctaHref": "/products",
                "ctaText": "View Product Range",
                "subtitle": "Power. Precision. Performance. ABEX delivers trusted water pump systems built to move the world's most essential resource — water."
            }
        },
        {
            "id": "home-intro",
            "type": "ImageSplit",
            "props": {
                "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070",
                "label": "Company Introduction",
                "theme": "light",
                "title": "SPECIALIZING IN HIGH-QUALITY INDUSTRIAL PUMPS",
                "ctaHref": "/about",
                "ctaText": "About ABEX Engineering",
                "reverse": false,
                "description": "At ABEX Engineering, we specialize in high-quality water pumps, submersible pumps, and industrial pumping systems that power homes, factories, and infrastructures across the region. Our solutions combine efficiency, durability, and engineering excellence, ensuring smooth water flow and dependable performance in every application. One of our featured brands, Paragon Pump, represents our commitment to quality and innovation. From commercial buildings to heavy-duty industrial plants, Paragon Pump is engineered for durability and trusted for performance."
            }
        },
        {
            "id": "home-product-range",
            "type": "FeatureGrid",
            "props": {
                "ctaHref": "/products",
                "ctaText": "View All Products",
                "heading": "Our Product Range",
                "description": "ABEX offers a complete range of water pumping solutions designed to meet every need — from household water supply to complex industrial systems.\n\nEach product is carefully selected and tested to ensure consistent operation and long service life, even under demanding conditions.",
                "features": [
                    {
                        "icon": "Droplet",
                        "title": "Water Pumps",
                        "description": "For general water transfer, building systems, and agriculture."
                    },
                    {
                        "icon": "Settings",
                        "title": "Submersible Pumps",
                        "description": "For deep wells, drainage, and wastewater management."
                    },
                    {
                        "icon": "Factory",
                        "title": "Industrial Pumps",
                        "description": "For manufacturing, cooling systems, and heavy-duty fluid handling."
                    },
                    {
                        "icon": "Settings",
                        "title": "Accessories & Parts",
                        "description": "For system support and performance optimization."
                    }
                ]
            }
        },
        {
            "id": "home-features",
            "type": "FeatureGrid",
            "props": {
                "label": "Core Capabilities",
                "heading": "WHY PARTNER WITH ABEX?",
                "features": [
                    {
                        "icon": "Factory",
                        "title": "Authorized Distribution",
                        "description": "Primary distributor for Paragon Pump and American Marsh in the region."
                    },
                    {
                        "icon": "Zap",
                        "title": "Advanced Engineering",
                        "description": "Advanced fluid dynamics and hydraulic system design for complex industrial needs."
                    },
                    {
                        "icon": "Settings",
                        "title": "Lifecycle Support",
                        "description": "Full lifecycle maintenance, rapid spare parts, and 24/7 technical assistance."
                    },
                    {
                        "icon": "Droplet",
                        "title": "Certified Quality",
                        "description": "ISO 9001 certified quality control ensures every unit meets extreme durability standards."
                    }
                ]
            }
        },
        {
            "id": "home-brands",
            "type": "BrandsGrid",
            "props": {
                "title": "Authorized Engineering Brands",
                "description": "ABEX is the primary distributor for the world's most trusted pump manufacturers, ensuring peak performance for critical infrastructure.",
                "brands": [
                    {
                        "name": "Paragon Pump",
                        "logo": "/images/brands/paragon.png",
                        "description": "Highly efficient centrifugal and horizontal split-case pumps designed for municipal, industrial, and fire protection systems worldwide."
                    },
                    {
                        "name": "American Marsh",
                        "logo": "/images/brands/american-marsh.png",
                        "description": "Legacy American engineering providing robust vertical turbines and heavy-duty process pumps for volatile fluid management."
                    },
                    {
                        "name": "Weinman",
                        "logo": "/images/Weinman logo.jpg",
                        "description": "Premium American-made pumps with over 150 years of engineering heritage in HVAC and general industrial fluid handling."
                    }
                ]
            }
        },
        {
            "id": "home-projects-teaser",
            "type": "TextBlock",
            "props": {
                "heading": "Our Projects",
                "content": "ABEX has completed numerous projects across Singapore — from residential developments to large-scale industrial plants.\n\nOur portfolio includes installations for cooling systems, wastewater treatment, and commercial water distribution, all reflecting our dedication to efficiency, reliability, and long-term performance.\n\nWhether you need a custom water system, technical consultation, or product supply, ABEX is ready to help you build something that flows with confidence.",
                "ctaText": "View Our Projects",
                "ctaHref": "/projects",
                "backgroundColor": "#ffffff"
            }
        },
        {
            "id": "home-final-cta",
            "type": "ShortCTA",
            "props": {
                "title": "ABEX Engineering",
                "subtitle": "Reliable Water Pump Solutions for Every Industry.",
                "ctaText": "Contact Us Today",
                "ctaHref": "/contact",
                "bgImage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000"
            }
        }
    ]
};

const content_zh = {
    "root": { "props": { "title": "首页" } },
    "content": [
        {
            "id": "home-hero",
            "type": "Hero",
            "props": {
                "title": "可靠的水泵解决方案",
                "bgImage": "/images/hero/home.webp",
                "ctaHref": "/products",
                "ctaText": "查看产品系列",
                "subtitle": "动力、精准、性能。ABEX 提供值得信赖的水泵系统，致力于输送世界上最本质的资源——水。"
            }
        },
        {
            "id": "home-intro",
            "type": "ImageSplit",
            "props": {
                "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070",
                "label": "公司介绍",
                "theme": "light",
                "title": "专注于高品质工业泵送系统",
                "ctaHref": "/about",
                "ctaText": "了解 ABEX 工业工程",
                "reverse": false,
                "description": "在 ABEX 工业工程，我们专注于高品质水泵、潜水泵和工业泵送系统，为该地区的住宅、工厂和基础设施提供动力。我们的解决方案将效率、耐用性和卓越工程相结合，确保在各种应用中都能实现流畅的水流和可靠的性能。我们的特色品牌之一 Paragon Pump 代表了我们对质量和创新的承诺。从商业建筑到重型工业工厂，Paragon Pump 均采用耐用设计，其性能深受信赖。"
            }
        },
        {
            "id": "home-product-range",
            "type": "FeatureGrid",
            "props": {
                "ctaHref": "/products",
                "ctaText": "查看所有产品",
                "heading": "我们的产品系列",
                "description": "ABEX 提供齐全的水泵解决方案，旨在满足从家庭供水到复杂工业系统的各种需求。\n\n每件产品都经过精心挑选和测试，确保即使在严苛条件下也能实现持续运行和长久的使用寿命。",
                "features": [
                    {
                        "icon": "Droplet",
                        "title": "水泵",
                        "description": "适用于常规输水、建筑系统和农业。"
                    },
                    {
                        "icon": "Settings",
                        "title": "潜水泵",
                        "description": "适用于深井、排水和废水管理。"
                    },
                    {
                        "icon": "Factory",
                        "title": "工业泵",
                        "description": "适用于制造业、冷却系统和重型流体处理。"
                    },
                    {
                        "icon": "Settings",
                        "title": "配件与零件",
                        "description": "提供系统支持和性能优化。"
                    }
                ]
            }
        },
        {
            "id": "home-features",
            "type": "FeatureGrid",
            "props": {
                "label": "核心能力",
                "heading": "为什么选择与 ABEX 合作？",
                "features": [
                    {
                        "icon": "Factory",
                        "title": "授权分销",
                        "description": "该地区 Paragon Pump 和 American Marsh 的主要分销商。"
                    },
                    {
                        "icon": "Zap",
                        "title": "先进工程",
                        "description": "针对复杂工业需求的先进流体动力学和水力系统设计。"
                    },
                    {
                        "icon": "Settings",
                        "title": "全生命周期支持",
                        "description": "全生命周期维护、快速备品备件供应和 24/7 技术援助。"
                    },
                    {
                        "icon": "Droplet",
                        "title": "认证质量",
                        "description": "ISO 9001 质量管理体系认证确保每个单元都符合严苛的耐用性标准。"
                    }
                ]
            }
        },
        {
            "id": "home-brands",
            "type": "BrandsGrid",
            "props": {
                "title": "授权工程品牌",
                "description": "ABEX 是全球最受信赖的水泵制造商的主要分销商，确保关键基础设施的峰值性能。",
                "brands": [
                    {
                        "name": "Paragon Pump",
                        "logo": "/images/brands/paragon.png",
                        "description": "高效离心泵和水平中开泵，专为全球市政、工业和消防系统设计。"
                    },
                    {
                        "name": "American Marsh",
                        "logo": "/images/brands/american-marsh.png",
                        "description": "传承美国工程技术，为挥发性流体管理提供坚固的立式涡轮泵和重型流程泵。"
                    },
                    {
                        "name": "Weinman",
                        "logo": "/images/Weinman logo.jpg",
                        "description": "拥有 150 多年工程传承的优质美国制造水泵，广泛应用于暖通空调和通用工业流体处理。"
                    }
                ]
            }
        },
        {
            "id": "home-projects-teaser",
            "type": "TextBlock",
            "props": {
                "heading": "我们的项目",
                "content": "ABEX 已在新加坡完成了众多项目——从住宅开发到大型工业工厂。\n\n我们的项目组合包括冷却系统、废水处理和商业配水的安装，这些都体现了我们对效率、可靠性和长期性能的奉献。\n\n无论您需要定制水系统、技术咨询还是产品供应，ABEX 都随时准备帮助您建立一个充满信心的流动系统。",
                "ctaText": "查看我们的项目",
                "ctaHref": "/projects",
                "backgroundColor": "#ffffff"
            }
        },
        {
            "id": "home-final-cta",
            "type": "ShortCTA",
            "props": {
                "title": "ABEX 工业工程",
                "subtitle": "为各行各业提供可靠的水泵解决方案。",
                "ctaText": "立即联系我们",
                "ctaHref": "/contact",
                "bgImage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000"
            }
        }
    ]
};

async function sync() {
    console.log("Syncing homepage...");
    const { error: err1 } = await supabase.from('pages').update({ content_json: content_en }).eq('slug', 'index');
    if (err1) { console.error("Error EN:", err1); process.exit(1); }
    const { error: err2 } = await supabase.from('pages').update({ content_zh_json: content_zh }).eq('slug', 'index');
    if (err2) { console.error("Error ZH:", err2); process.exit(1); }
    console.log("Success");
}

sync();
