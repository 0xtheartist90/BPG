import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { defaultLocale, locales } from './lib/i18n';

const PUBLIC_FILE = /\.(?:.*)$/;
const localeSet = new Set(locales);

// Simple hash for Edge Runtime (no Node.js crypto needed)
// Token validation: compare token against a hash we compute using Web Crypto
let cachedToken: string | null = null;

async function getExpectedToken(): Promise<string> {
    if (cachedToken) return cachedToken;
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return '';
    const secret = password + '__bpg_session_salt';
    const data = new TextEncoder().encode(secret);
    const hash = await crypto.subtle.digest('SHA-256', data);
    cachedToken = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return cachedToken;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Admin routes first — before PUBLIC_FILE check to prevent bypass
    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }
        const token = request.cookies.get('admin-session')?.value;
        const expected = await getExpectedToken();
        // Note: Edge Runtime lacks crypto.timingSafeEqual; server actions use it.
        // Middleware is a convenience redirect, not the auth boundary.
        if (!token || !expected || token !== expected) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        return NextResponse.next();
    }

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname === '/favicon.ico' ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    if (pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}`;

        return NextResponse.redirect(url);
    }

    const hasLocale = Array.from(localeSet).some((locale) => pathname.startsWith(`/${locale}`));

    if (!hasLocale) {
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}${pathname}`;

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
