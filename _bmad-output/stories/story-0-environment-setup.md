# Story 0: Environment Setup

**Epic**: Pre-requisite (all epics)

**As a** developer
**I want** the local development environment fully configured
**So that** all subsequent stories can be implemented without setup issues

## Acceptance Criteria

- [ ] `.env.example` created at project root with all required variables and documentation comments:
  ```env
  # Neon Postgres (required) — get from https://console.neon.tech
  DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require

  # Admin panel password (required)
  ADMIN_PASSWORD=choose-a-strong-password

  # Resend email API key (required for contact form)
  RESEND_API_KEY=re_xxxxxxxxxxxx

  # Optional: Bundle analyzer
  BUNDLE_ANALYZER_ENABLED=false
  ```
- [ ] `.env.local` created locally (NOT committed) with actual values
- [ ] `.env.local` listed in `.gitignore` (verify — should already be there)
- [ ] `DATABASE_URL` connects successfully to Neon (verified via test query)
- [ ] `ADMIN_PASSWORD` set to a strong value (min 12 chars recommended)
- [ ] `RESEND_API_KEY` carried over from existing setup (contact form still works)
- [ ] Application starts with `npm run dev` — no missing env var errors
- [ ] Existing functionality unaffected (public site renders, contact form sends email)

## Technical Notes

### Neon Connection String Format

```
postgresql://neondb_owner:<password>@ep-<endpoint>-pooler.<region>.aws.neon.tech/neondb?sslmode=require
```

- Use the **pooler** URL (connection pooling enabled)
- Region: `c-3.eu-central-1` (Frankfurt)
- SSL required

### Verification Steps

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Verify env vars are loaded
npx tsx -e "console.log('DB:', !!process.env.DATABASE_URL, 'ADMIN:', !!process.env.ADMIN_PASSWORD)"

# 3. Test Neon connection (after Story 1.1 deps are installed)
npx tsx -e "
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL);
  sql('SELECT 1 as ok').then(r => console.log('Connected:', r));
"
```

### Environment Differences

| Variable | Development | Production (Vercel) |
|---|---|---|
| `DATABASE_URL` | `.env.local` | Vercel env vars |
| `ADMIN_PASSWORD` | `.env.local` | Vercel env vars |
| `RESEND_API_KEY` | `.env.local` | Vercel env vars |

## Definition of Done

- Developer can clone repo, copy `.env.example` → `.env.local`, fill in values, and run the app
- No hardcoded secrets anywhere in committed code
