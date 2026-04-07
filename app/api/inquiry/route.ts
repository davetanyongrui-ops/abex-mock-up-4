import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, company, message, type } = body;

        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.error("RESEND_API_KEY is missing in environment variables.");
            // We return success to the client anyway to not block the UI, 
            // but log the error for the developer.
            return NextResponse.json({ success: true, message: "Logged (Email skipped - missing API key)" });
        }

        // Using Resend API via fetch to avoid extra dependencies
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'ABEX Website <website@abex-engrg.com>',
                to: ['sales@abex-engrg.com'],
                cc: ['rickytan@abex-engrg.com'],
                subject: `New ${type === 'quote' ? 'Quotation Request' : 'Contact Inquiry'} from ${name}`,
                html: `
                    <h2>New Inquiry Received</h2>
                    <p><strong>Type:</strong> ${type}</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Company:</strong> ${company}</p>
                    <p><strong>Message:</strong></p>
                    <div style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 5px;">
                        ${message}
                    </div>
                `
            })
        });

        const result = await res.json();

        if (!res.ok) {
            console.error("Resend API Error:", result);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: result });

    } catch (error: any) {
        console.error("Inquiry API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
