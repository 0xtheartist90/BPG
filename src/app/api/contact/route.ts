import { NextRequest, NextResponse } from 'next/server';

import { buildContactFormEmail } from '@/emails/ContactFormEmail';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Buurtplatform Gein <no-reply@buurtplatformgein.nl>',
            to: ['theartist@0xlaboratory.xyz'],
            replyTo: email,
            subject: `Nieuw contactformulier bericht van ${name}`,
            html: buildContactFormEmail({ name, email, message })
        });

        if (error) {
            console.error('Resend error:', error);

            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: data?.id }, { status: 200 });
    } catch (error) {
        console.error('Contact form error:', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
