import { NextRequest, NextResponse } from 'next/server';

import { buildContactConfirmationEmail, buildContactFormEmail } from '@/emails/ContactFormEmail';

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const contactToEmail = process.env.CONTACT_TO_EMAIL ?? 'info@buurtplatformgein.nl';
const budgetContactToEmail = process.env.BUDGET_CONTACT_TO_EMAIL ?? 'budget@buurtplatformgein.nl';
const contactFromEmail = process.env.CONTACT_FROM_EMAIL ?? 'Buurtplatform Gein <no-reply@buurtplatformgein.nl>';

export async function POST(request: NextRequest) {
    try {
        if (!resend) {
            console.error('Missing RESEND_API_KEY');

            return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 });
        }

        const body = await request.json();
        const { name, email, subject, subjectLabel, message } = body as {
            name?: string;
            email?: string;
            subject?: string;
            subjectLabel?: string;
            message?: string;
        };

        // Validate required fields
        if (!name || !email || !message || !subject || !subjectLabel) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const destinationEmail = subject === 'budget' ? budgetContactToEmail : contactToEmail;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: contactFromEmail,
            to: [destinationEmail],
            replyTo: email,
            subject: `[${subjectLabel}] Nieuw contactformulier bericht van ${name}`,
            html: buildContactFormEmail({ name, email, subjectLabel, message })
        });

        if (error) {
            console.error('Resend error:', error);

            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        const { error: confirmationError } = await resend.emails.send({
            from: contactFromEmail,
            to: [email],
            subject: `We hebben je bericht ontvangen | Buurtplatform Gein`,
            html: buildContactConfirmationEmail({ name, subjectLabel })
        });

        if (confirmationError) {
            console.error('Resend confirmation error:', confirmationError);
        }

        return NextResponse.json({ success: true, messageId: data?.id }, { status: 200 });
    } catch (error) {
        console.error('Contact form error:', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
