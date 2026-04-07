const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const { data } = await supabase.from('products').select('slug, name, specs_json');
    fs.writeFileSync('/tmp/products_dump.json', JSON.stringify(data, null, 2));
    console.log("Done");
}

check();
