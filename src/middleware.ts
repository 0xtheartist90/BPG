import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { defaultLocale, locales } from './lib/i18n';

const PUBLIC_FILE = /\.(?:.*)$/;
const localeSet = new Set(locales);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

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
