import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

// Note: Stripe Webhooks require the raw body. 
// However, in Next.js App Router we can use text() combined with stripe library validation.
export const dynamic = 'force-dynamic';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-02-25.clover'
});

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature') as string;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: err.message }, { status: 400 });
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            // Extract details
            const customerEmail = session.customer_details?.email || 'N/A';
            const totalSgd = (session.amount_total || 0) / 100; // Convert cents to dollars
            const itemsJson = session.metadata?.cart_items ? JSON.parse(session.metadata.cart_items) : [];

            // Insert Order into Supabase securely
            // Because we are in API route context (Server environment), we can bypass RLS 
            // by using the Service Role Key, or we assume the webhook has rights if configured correctly.
            // Assuming `lib/supabase.ts` uses ANON key, we might need a dedicated Service Client here for secure inserts 
            // if RLS is strictly locking anon inserts.

            const supabaseAdmin = require('@supabase/supabase-js').createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || '',
                process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
            );

            const { error } = await supabaseAdmin.from('orders').insert({
                customer_email: customerEmail,
                total_sgd: totalSgd,
                items_json: itemsJson,
                stripe_session_id: session.id,
                status: 'paid'
            });

            if (error) {
                console.error("Supabase Order Insert Error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            console.log(`Order ${session.id} logged securely.`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Server implementation error." }, { status: 500 });
    }
}
