# Story 1.1: Project Setup & Database Connection

**Epic**: [Epic 1: Database Foundation](../epics/epic-1-database-foundation.md)

**As a** developer
**I want** Drizzle ORM connected to Neon Postgres
**So that** the application can read/write persistent data

## Acceptance Criteria

- [ ] `drizzle-orm` and `@neondatabase/serverless` installed as dependencies
- [ ] `drizzle-kit` installed as dev dependency
- [ ] `drizzle.config.ts` created at project root pointing to `src/db/schema.ts`
- [ ] `src/db/index.ts` exports configured Drizzle client using Neon serverless driver
- [ ] `.env.local` contains `DATABASE_URL` (must be in `.gitignore`)
- [ ] `.env.example` created with placeholders for `DATABASE_URL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`
- [ ] Connection verified — a simple test query (`SELECT 1`) succeeds against Neon

## Technical Notes

### Dependencies to Install

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

### File: `src/db/index.ts`

```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

### File: `drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
})
```

### Environment

- Neon region: AWS Europe Central 1 (Frankfurt)
- Postgres version: 17
- Connection pooling: enabled (use pooler URL)
- Connection string format: `postgresql://neondb_owner:***@ep-dark-silence-al8tojg6-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require`

## Definition of Done

- `npm run build` succeeds with new dependencies
- DB client can execute queries against Neon
