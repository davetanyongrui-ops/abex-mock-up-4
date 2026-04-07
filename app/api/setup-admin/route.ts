import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Prevent this edge-case setup script from running openly in production
export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return NextResponse.json({ success: false, error: "Missing Supabase URL or Service Role Key" });
    }

    // Use Service Role to bypass RLS and create users directly
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const email = 'admin@gmail.com';
    const password = '@AbexAdmin2026!';

    try {
        // 1. First, search for any existing user with this email and delete them to refresh
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (!listError && users) {
            const existingUser = users.find((u: any) => u.email === email);
            if (existingUser) {
                await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
                console.log("Deleted old potentially broken SQL user:", existingUser.id);
            }
        }
    } catch (e) {
        console.warn("Could not list/delete user beforehand, continuing with creation...");
    }

    // 2. Attempt to create the user with GoTrue Admin API
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirm email
        user_metadata: { role: 'admin' },
        app_metadata: { provider: 'email', providers: ['email'] }
    });

    if (createError) {
        return NextResponse.json({ success: false, error: createError.message });
    }

    return NextResponse.json({
        success: true,
        message: "Admin successfully generated via GoTrue API!",
        user_id: user.user.id
    });
}
