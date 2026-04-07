import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    // ── 1. Build a server Supabase client with the request cookies ────────────
    const cookieStore = await cookies();

    const supabase = createServerClient(
        (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
        (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    // ── 2. Verify session and check 'admin' role in profiles table ───────────
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Unauthorized: Session required' },
            { status: 401 }
        );
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Unauthorized: Admin role required' },
            { status: 401 }
        );
    }

    // ── 3. Parse the request body ─────────────────────────────────────────────
    const body = await request.json();
    console.log('2. API Route hit. Received body:', body);
    const { slug, locale, changes, fullData } = body as {
        slug: string;
        locale: string;
        changes?: Record<string, any>;
        fullData?: any;
    };

    if (!slug || !locale || (!changes && !fullData)) {
        return NextResponse.json(
            { error: 'Missing required fields: slug, locale, and either changes or fullData' },
            { status: 400 }
        );
    }

    // ── 3.1 Normalize Slug (Mapping frontend to DB slugs) ────────────────────
    const slugMap: Record<string, string> = {
        'home': 'index',
        '': 'index',
        'our-pumps': 'products',
        'our-pump': 'products'
    };

    const dbSlug = slugMap[slug] || slug;
    console.log(`Mapping slug: "${slug}" -> "${dbSlug}"`);

    // ── 4. Split changes into Page changes and Layout changes ────────────────
    const pageChanges: Record<string, any> = {};
    const layoutChanges: Record<string, Record<string, any>> = {};

    for (const [path, value] of Object.entries(changes || {})) {
        if (path.startsWith('layout:')) {
            const parts = path.split(':');
            if (parts.length >= 3) {
                const layoutKey = parts[1];
                const fieldKey = parts.slice(2).join(':'); // Handle nested if any
                if (!layoutChanges[layoutKey]) layoutChanges[layoutKey] = {};
                layoutChanges[layoutKey][fieldKey] = value;
            }
        } else {
            pageChanges[path] = value;
        }
    }

    // ── 5. Handle Layout Changes (Global Header/Footer) ───────────────────────
    if (Object.keys(layoutChanges).length > 0) {
        for (const [key, fields] of Object.entries(layoutChanges)) {
            // Fetch current layout data
            const contentColumn = locale === 'zh' ? 'content_zh_json' : 'content_json';
            const { data: layoutRow } = await supabase
                .from('layout_content')
                .select(contentColumn)
                .eq('key', key)
                .single();

            const currentContent = layoutRow ? (layoutRow as any)[contentColumn] : {};
            const newContent = { ...(currentContent || {}), ...fields };

            const { data: updatedLayout, error: layoutError } = await supabase
                .from('layout_content')
                .upsert({
                    key,
                    [contentColumn]: newContent
                }, { onConflict: 'key' })
                .select();

            if (layoutError) {
                console.error(`3. SUPABASE LAYOUT UPDATE ERROR for ${key}:`, JSON.stringify(layoutError));
                return NextResponse.json({ error: layoutError.message, hint: layoutError.hint, details: layoutError.details }, { status: 500 });
            }

            if (!updatedLayout || updatedLayout.length === 0) {
                console.error(`3. SUPABASE LAYOUT UPDATE FAILED: No rows modified for ${key}`);
                return NextResponse.json({ error: `Layout update failed for key ${key}` }, { status: 404 });
            }
        }
    }

    // ── 6. Handle Page Changes (Puck Content) ─────────────────────────────────
    if (fullData) {
        const contentColumn = locale === 'zh' ? 'content_zh_json' : 'content_json';

        // Use service role for database update to bypass RLS
        const { createClient } = await import('@supabase/supabase-js');
        const adminClient = createClient(
            (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
            (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
        );

        const { data: updatedData, error: updateError } = await adminClient
            .from('pages')
            .update({ [contentColumn]: fullData })
            .eq('slug', dbSlug)
            .select();

        if (updateError) {
            console.error('3. SUPABASE UPDATE ERROR (Full Data):', updateError);
            return NextResponse.json({ error: updateError.message, details: updateError }, { status: 500 });
        }

        if (!updatedData || updatedData.length === 0) {
            console.error(`3. SUPABASE UPDATE FAILED: No rows found for slug "${dbSlug}"`);
            return NextResponse.json({
                error: `No rows updated. Database slug "${dbSlug}" not found.`,
                receivedSlug: slug,
                mappedSlug: dbSlug
            }, { status: 404 });
        }
    } else if (changes && Object.keys(pageChanges).length > 0) {
        const contentColumn = locale === 'zh' ? 'content_zh_json' : 'content_json';

        const { data: page, error: fetchError } = await supabase
            .from('pages')
            .select(contentColumn)
            .eq('slug', dbSlug)
            .single();

        if (fetchError) {
            console.error(`3. SUPABASE FETCH ERROR (slug: ${dbSlug}):`, fetchError);
            return NextResponse.json({ error: `Failed to fetch page: ${fetchError.message}` }, { status: 500 });
        }

        if (!page) {
            console.error(`3. SUPABASE PAGE NOT FOUND (slug: ${dbSlug})`);
            return NextResponse.json({
                error: `Page not found in database. Slug "${dbSlug}" (original: "${slug}") matched zero rows.`,
                receivedSlug: slug,
                mappedSlug: dbSlug
            }, { status: 404 });
        }

        if (page) {
            const currentContent = (page as any)[contentColumn];
            // Ensure content is an object
            let content = JSON.parse(JSON.stringify(currentContent || {}));

            const specializedPages = ['ServicingPage', 'ContactPage'];

            // First, check for specialized direct root updates
            for (const [path, value] of Object.entries(pageChanges)) {
                const colonIdx = path.indexOf(':');
                if (colonIdx >= 0) {
                    const compId = path.slice(0, colonIdx);
                    const propName = path.slice(colonIdx + 1);

                    if (specializedPages.includes(compId)) {
                        // Perform deep merge for specialized fields to preserve styles/content
                        const existing = content[propName];
                        if (existing && typeof existing === 'object' && value && typeof value === 'object') {
                            content[propName] = { ...existing, ...value };
                        } else {
                            content[propName] = value;
                        }
                    }
                }
            }

            // Then, handle standard Puck traversal if content.content exists
            if (content.content && Array.isArray(content.content)) {
                const traverse = (items: any[]): void => {
                    for (const item of items) {
                        for (const [path, value] of Object.entries(pageChanges)) {
                            const colonIdx = path.indexOf(':');
                            if (colonIdx < 0) continue;
                            const compId = path.slice(0, colonIdx);
                            const propName = path.slice(colonIdx + 1);

                            if (item?.props?.id === compId) {
                                const keys = propName.split('.');
                                let current = item.props;
                                for (let i = 0; i < keys.length - 1; i++) {
                                    if (current[keys[i]] === undefined) current[keys[i]] = {};
                                    current = current[keys[i]];
                                }
                                current[keys[keys.length - 1]] = value;
                            }
                        }
                        if (item?.zones) {
                            for (const zoneKey in item.zones) {
                                traverse(item.zones[zoneKey]);
                            }
                        }
                    }
                };
                traverse(content.content);
            }

            // Use service role for database update to bypass RLS
            const { createClient } = await import('@supabase/supabase-js');
            const adminClient = createClient(
                (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
                (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
            );

            const { data: updatedData, error: updateError } = await adminClient
                .from('pages')
                .update({ [contentColumn]: content })
                .eq('slug', dbSlug)
                .select();

            if (updateError) {
                console.error('3. SUPABASE UPDATE ERROR (Partial Data):', updateError);
                return NextResponse.json({ error: updateError.message, details: updateError }, { status: 500 });
            }

            if (!updatedData || updatedData.length === 0) {
                console.error(`3. SUPABASE UPDATE FAILED: No rows found for slug "${dbSlug}"`);
                return NextResponse.json({
                    error: `No rows updated. Database slug "${dbSlug}" not found.`,
                    receivedSlug: slug,
                    mappedSlug: dbSlug
                }, { status: 404 });
            }
        }
    }

    // ── 7. Revalidate Paths ──────────────────────────────────────────────────
    try {
        const publicSlug = dbSlug === 'index' ? '' : dbSlug;

        // Targetted revalidation
        revalidatePath(`/${locale}/${publicSlug}`, 'page');
        revalidatePath(`/${publicSlug}`, 'page');

        // Nuclear option: Revalidate everything to ensure stale ISR/Layout data is cleared
        revalidatePath('/', 'layout');

        console.log(`Aggressively revalidated paths for dbSlug: ${dbSlug} (from ${slug}), locale: ${locale}`);
    } catch (revalidateError) {
        console.error("Revalidation error (non-fatal):", revalidateError);
    }

    return NextResponse.json({
        success: true,
        message: 'Successfully updated and revalidated.',
        slug: dbSlug,
        originalSlug: slug,
        locale: locale
    });
}
