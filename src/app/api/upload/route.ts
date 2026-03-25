import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { validateSessionToken } from '@/app/admin/lib/session';

export async function POST(request: NextRequest) {
    // Auth check
    const token = request.cookies.get('admin-session')?.value;
    if (!token || !validateSessionToken(token)) {
        return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return NextResponse.json({ error: 'Geen bestand geselecteerd' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Alleen afbeeldingen (JPG, PNG, WebP, GIF, SVG)' }, { status: 400 });
    }

    // Max 4 MB
    if (file.size > 4 * 1024 * 1024) {
        return NextResponse.json({ error: 'Maximaal 4 MB' }, { status: 400 });
    }

    try {
        const blob = await put(`images/${file.name}`, file, {
            access: 'public',
            addRandomSuffix: true
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error('Upload failed:', error);
        const message = error instanceof Error ? error.message : 'Onbekende fout';

        return NextResponse.json({ error: `Upload mislukt: ${message}` }, { status: 500 });
    }
}
