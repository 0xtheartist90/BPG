'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSessionToken } from '../lib/session';

const COOKIE_NAME = 'admin-session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// Global rate limiting: 5 attempts/minute across all users (resets on deploy)
// Shared password means per-IP limiting adds little value; global limit prevents brute force.
const loginAttempts = { count: 0, resetAt: 0 };

function checkRateLimit(): boolean {
    const now = Date.now();
    if (loginAttempts.resetAt <= now) {
        loginAttempts.count = 1;
        loginAttempts.resetAt = now + 60_000;

        return true;
    }
    if (loginAttempts.count >= 5) return false;
    loginAttempts.count++;

    return true;
}

export async function login(formData: FormData): Promise<{ success: boolean; error?: string }> {
    if (!process.env.ADMIN_PASSWORD) {
        return { success: false, error: 'Admin niet geconfigureerd. Neem contact op met de beheerder.' };
    }

    const password = formData.get('password') as string | null;

    if (!password || password.trim() === '') {
        return { success: false, error: 'Vul een wachtwoord in' };
    }

    if (!checkRateLimit()) {
        return { success: false, error: 'Te veel pogingen. Probeer over 1 minuut opnieuw.' };
    }

    if (password !== process.env.ADMIN_PASSWORD) {
        return { success: false, error: 'Wachtwoord onjuist' };
    }

    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIE_MAX_AGE,
        path: '/'
    });

    return { success: true };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    redirect('/admin/login');
}
