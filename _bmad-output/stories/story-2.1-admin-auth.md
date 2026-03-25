# Story 2.1: Admin Login & Session

**Epic**: [Epic 2: Admin Authentication](../epics/epic-2-admin-auth.md)
**Depends on**: Epic 1 (Story 1.1)

**As a** site administrator
**I want** to log in with a password to access the admin panel
**So that** only authorized people can manage content

## Acceptance Criteria

### Authentication
- [ ] `ADMIN_PASSWORD` env var used for authentication (no user accounts, no database)
- [ ] `/admin/login` page with password field and submit button
- [ ] Server Action compares input to `ADMIN_PASSWORD`, sets secure httpOnly cookie on success
- [ ] Cookie: name `admin-session`, 24h expiry, secure, httpOnly, sameSite strict
- [ ] Cookie value is a signed hash (NOT the raw password) — validated by regenerating and comparing
- [ ] Invalid password shows error: "Wachtwoord onjuist"
- [ ] Empty password shows error: "Vul een wachtwoord in"

### Route Protection
- [ ] `src/app/admin/layout.tsx` checks for valid session cookie on every request
- [ ] Unauthenticated requests to any `/admin/*` route (except `/admin/login`) redirect to `/admin/login`
- [ ] Logout button in admin nav clears cookie and redirects to `/admin/login`
- [ ] `/api/*` routes remain unaffected (no auth check)

### Security
- [ ] CSRF: Server Actions in Next.js 15 automatically include CSRF protection — verify this is not disabled
- [ ] Rate limiting: after 5 failed login attempts within 1 minute, show: "Te veel pogingen. Probeer over 1 minuut opnieuw."
- [ ] Password not logged or exposed in error messages
- [ ] Changing password requires updating `ADMIN_PASSWORD` env var and redeploying (documented limitation)

### Error Handling
- [ ] If `ADMIN_PASSWORD` env var is missing, `/admin/login` shows: "Admin niet geconfigureerd. Neem contact op met de beheerder."
- [ ] Server Action catches unexpected errors and returns generic Dutch error: "Er ging iets mis. Probeer opnieuw."

### Accessibility
- [ ] Password field has associated `<label>` with `htmlFor`
- [ ] Form submittable via Enter key
- [ ] Error messages announced to screen readers (role="alert")
- [ ] Focus returns to password field after error

## Technical Notes

### Auth Flow

```
1. GET /admin/* → layout.tsx checks cookies
2. No valid cookie → redirect to /admin/login
3. POST /admin/login (Server Action) → compare password
4. Match → set cookie, redirect to /admin
5. No match → return error message
6. Logout → delete cookie, redirect to /admin/login
```

### Session Cookie Signing

```typescript
import { createHash } from 'crypto'

const SESSION_SECRET = process.env.ADMIN_PASSWORD! + '__bpg_session_salt'

function createSessionToken(): string {
    return createHash('sha256').update(SESSION_SECRET).digest('hex')
}

function validateSessionToken(token: string): boolean {
    return token === createSessionToken()
}
```

### Rate Limiting (Simple In-Memory)

```typescript
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
    const now = Date.now()
    const record = loginAttempts.get(ip)
    if (record && record.resetAt > now && record.count >= 5) return false
    // ... increment or reset
    return true
}
```

Note: In-memory rate limiting resets on deploy. Acceptable for v1 — a neighborhood site won't be targeted by brute force.

### File Structure

```
src/app/admin/
    layout.tsx          -- auth check wrapper
    login/
        page.tsx        -- login form ('use client' for form state)
    actions/
        auth.ts         -- login/logout server actions
```

### Future Improvements (Not in Scope)
- Multi-user auth with individual passwords/accounts
- OAuth / SSO integration
- Persistent rate limiting (Redis/DB-backed)

## Definition of Done

- Can log in with correct password, see admin content
- Wrong password shows Dutch error
- Direct URL access to `/admin/nieuws` etc. redirects to login if not authenticated
- Logout works, subsequent access requires re-login
- Cookie is signed and tamper-proof
