
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkStructure() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'products' });

    if (error) {
        // Fallback if RPC doesn't exist: just fetch one row and look at keys
        const { data: row } = await supabase.from('products').select('*').limit(1).single();
        console.log('Columns found in single row:', Object.keys(row || {}));
    } else {
        console.log('Table columns:', data);
    }
}

checkStructure();
