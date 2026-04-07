const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function dump() {
    console.log("Fetching pages...");
    const { data, error } = await supabase.from('pages').select('slug, content_json, content_zh_json').in('slug', ['index', 'about', 'servicing', 'projects']);
    if (error) {
        console.error(error);
        process.exit(1);
    }
    
    fs.writeFileSync('/tmp/pages_dump.json', JSON.stringify(data, null, 2));
    console.log("Dumped to /tmp/pages_dump.json");
}

dump();
