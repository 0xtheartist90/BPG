import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export function createSessionToken(): string {
    const secret = process.env.ADMIN_PASSWORD! + '__bpg_session_salt';

    return createHash('sha256').update(secret).digest('hex');
}

export function validateSessionToken(token: string): boolean {
    if (!process.env.ADMIN_PASSWORD) return false;
    const expected = createSessionToken();
    if (token.length !== expected.length) return false;

    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function requireAuth(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-session')?.value;
    if (!token || !validateSessionToken(token)) {
        throw new Error('UNAUTHORIZED');
    }
}
