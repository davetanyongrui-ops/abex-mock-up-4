const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const content_zh = [
    {
        "id": "about-hero",
        "type": "Hero",
        "props": {
            "title": "适用于各行业的可靠水泵解决方案",
            "bgImage": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070",
            "ctaHref": "/products",
            "ctaText": "我们的解决方案",
            "subtitle": "动力、精准、性能。ABEX 提供值得信赖的水泵系统，致力于输送世界上最本质的资源——水。"
        }
    },
    {
        "id": "about-background",
        "type": "ImageSplit",
        "props": {
            "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070",
            "label": "ABEX 水泵解决方案",
            "theme": "light",
            "title": "公司背景",
            "reverse": false,
            "description": "在 ABEX，我们专注于高品质水泵、潜水泵和工业泵送系统，为该地区的住宅、工厂和基础设施提供动力。我们的解决方案将效率、耐用性和卓越工程相结合，确保在各种应用中都能实现流畅的水流和可靠的性能。"
        }
    },
    {
        "id": "about-paragon",
        "type": "ImageSplit",
        "props": {
            "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070",
            "label": "对质量的承诺",
            "theme": "dark",
            "title": "特色品牌：Paragon Pump",
            "reverse": true,
            "description": "我们的特色品牌之一 Paragon Pump，代表了我们对质量和创新的承诺。从商业建筑到重型工业工厂，Paragon Pump 因其耐用性而设计，并因其性能而深受信赖。\n\nABEX 水泵解决方案"
        }
    },
    {
        "id": "about-mission-text",
        "type": "TextBlock",
        "props": {
            "heading": "我们的使命",
            "content": "ABEX 是一家领先的水泵系统和流体处理解决方案供应商，服务于商业、工业和住宅客户。凭借多年的经验和技术专长，我们提供端到端的水处理系统——从咨询和产品供应到售后支持。\n\n我们的使命是提供可靠、节能的泵送解决方案，帮助企业和社区充满信心并以可持续的方式管理水资源。"
        }
    },
    {
        "id": "about-beliefs",
        "type": "FeatureGrid",
        "props": {
            "label": "核心价值观",
            "heading": "我们相信：",
            "features": [
                {
                    "icon": "Droplet",
                    "title": "全球品牌",
                    "description": "Paragon、American Marsh 及其他领先品牌的授权经销商。"
                },
                {
                    "icon": "Zap",
                    "title": "技术专家",
                    "description": "内部工程团队提供复杂的液压计算和系统设计。"
                },
                {
                    "icon": "Settings",
                    "title": "售后支持",
                    "description": "全面的维护计划和快速的备件供应。"
                }
            ]
        }
    },
    {
        "id": "about-products",
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
        "id": "about-projects",
        "type": "ImageSplit",
        "props": {
            "image": "https://images.unsplash.com/photo-1541888941295-1e8fbc3d6221?q=80&w=2070",
            "label": "良好的业绩记录",
            "theme": "light",
            "title": "我们的项目",
            "ctaHref": "/projects",
            "ctaText": "查看我们的项目",
            "reverse": false,
            "description": "ABEX 已在新加坡、马来西亚和印度尼西亚完成了众多项目——从住宅开发到大型工业工厂。\n\n我们的项目组合包括冷却系统、废水处理和商业配水的安装，这些都体现了我们对效率、可靠性和长期性能的奉献。\n\n无论您需要定制水系统、技术咨询还是产品供应，ABEX 都随时准备帮助您建立一个充满信心的流动系统。"
        }
    },
    {
        "id": "about-certs",
        "type": "CompanyCertifications",
        "props": {}
    },
    {
        "id": "about-cta",
        "type": "Hero",
        "props": {
            "title": "准备好了解更多关于我们的解决方案了吗？",
            "bgImage": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070",
            "ctaHref": "/contact",
            "ctaText": "联系我们",
            "subtitle": "立即联系我们，讨论 ABEX 泵如何支持您的水资源管理需求。"
        }
    }
];

async function syncAboutZh() {
    try {
        const { data, error } = await supabase
            .from('pages')
            .update({ content_zh_json: { content: content_zh, root: { props: { title: "关于我们" } } } })
            .eq('slug', 'about');

        if (error) {
            console.error(error);
            process.exit(1);
        }

        console.log("Successfully updated Simplified Chinese about content in Supabase");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

syncAboutZh();
