
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enMessages = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages/en.json'), 'utf8'));
const zhMessages = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages/zh.json'), 'utf8'));

// Flatten messages for easier search
function flattenMessages(obj, prefix = '') {
    let flat = {};
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flat, flattenMessages(obj[key], prefix + key + '.'));
        } else {
            flat[obj[key]] = prefix + key;
        }
    }
    return flat;
}

const enToKey = flattenMessages(enMessages);

function getZhValue(keyPath) {
    const keys = keyPath.split('.');
    let current = zhMessages;
    for (const k of keys) {
        if (current[k] === undefined) return null;
        current = current[k];
    }
    return current;
}

function translateValue(val) {
    if (typeof val !== 'string') return val;

    // Exact match in EN messages
    const keyPath = enToKey[val];
    if (keyPath) {
        const zhVal = getZhValue(keyPath);
        if (zhVal) return zhVal;
    }

    // Handle common URL substitutions
    if (val.startsWith('/') && !val.startsWith('/zh')) {
        return '/zh' + val;
    }

    return val;
}

function processPuckData(data) {
    if (!data || !data.content) return data;

    const newData = JSON.parse(JSON.stringify(data));

    // Process Root Props
    if (newData.root && newData.root.props) {
        for (let key in newData.root.props) {
            newData.root.props[key] = translateValue(newData.root.props[key]);
        }
    }

    // Process Content Blocks
    newData.content.forEach(block => {
        // Update ID if it doesn't already end in -zh to avoid collisions if rendered in same context
        if (block.id && !block.id.endsWith('-zh')) {
            block.id = block.id + '-zh';
        }

        if (block.props) {
            for (let key in block.props) {
                const val = block.props[key];
                if (Array.isArray(val)) {
                    val.forEach(item => {
                        if (typeof item === 'object') {
                            for (let subKey in item) {
                                item[subKey] = translateValue(item[subKey]);
                            }
                        }
                    });
                } else if (typeof val === 'string') {
                    block.props[key] = translateValue(val);
                }
            }
        }
    });

    return newData;
}

async function syncAllPages() {
    const { data: pages, error } = await supabase
        .from('pages')
        .select('*');

    if (error) {
        console.error('Error fetching pages:', error);
        return;
    }

    for (const page of pages) {
        console.log(`Syncing page: ${page.slug}...`);
        const syncedData = processPuckData(page.content_json);

        const { error: updateError } = await supabase
            .from('pages')
            .update({ content_zh_json: syncedData })
            .eq('id', page.id);

        if (updateError) {
            console.error(`Error updating page ${page.slug}:`, updateError);
        } else {
            console.log(`Successfully synced ${page.slug}`);
        }
    }
}

syncAllPages();
