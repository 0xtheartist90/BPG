# BPG Content Management — Sprint Plan

## Overview

| Epic | Stories | Summary |
|---|---|---|
| 0. Pre-requisite | 0 | Environment setup |
| 1. Database Foundation | 1.1, 1.2, 1.3 | Schema, connection, seed migration |
| 2. Admin Auth | 2.1 | Password gate with cookie session |
| 3. Articles Admin | 3.1, 3.2, 3.3 | Dashboard, list, create/edit with i18n tabs |
| 4. Events Admin | 4.1, 4.2, 4.3 | List, create/edit with recurrence, instance management |
| 5. Public Migration | 5.1, 5.2, 5.3, 5.4 | Query layer, page swap, routing fix, cleanup |

**Total: 5 epics + pre-requisite, 14 stories**

## Implementation Order

| Step | Story | Depends On | Key Changes from QA Review |
|---|---|---|---|
| 0 | [0 Env Setup](stories/story-0-environment-setup.md) | — | **NEW** — was missing |
| 1 | [1.1 DB Connection](stories/story-1.1-db-connection.md) | 0 | |
| 2 | [1.2 DB Schema](stories/story-1.2-db-schema.md) | 1.1 | Added: `version` col, `(slug,locale)` unique, indexes, cascade FK, transaction reqs, content encoding spec |
| 3 | [1.3 Seed Content](stories/story-1.3-seed-content.md) | 1.2 | Added: `\n\n` content encoding verification |
| 4 | [2.1 Admin Auth](stories/story-2.1-admin-auth.md) | 1.1 | Added: CSRF note, rate limiting, signed cookies, error handling, a11y |
| 5 | [3.1 Admin Layout](stories/story-3.1-admin-layout.md) | 2.1 | Added: loading/error states, a11y |
| 6 | [3.2 Article List](stories/story-3.2-article-list.md) | 3.1 | Added: transactional delete, error handling, loading/empty/error states, a11y |
| 7 | [3.3 Article Form](stories/story-3.3-article-form.md) | 3.2 | Added: optimistic locking, image validation, RTL details, XSS prevention, error handling, a11y |
| 8 | [4.1 Event List](stories/story-4.1-event-list.md) | 3.1 | Added: transactional delete, error handling, states, a11y |
| 9 | [4.2 Event Form](stories/story-4.2-event-form.md) | 4.1 | Added: transaction isolation, DST handling, 200 instance limit, timezone spec, optimistic locking, error handling, a11y |
| 10 | [4.3 Instance Mgmt](stories/story-4.3-instance-management.md) | 4.2 | Added: error handling, cache invalidation, a11y, focus management |
| 11 | [5.1 Data Access](stories/story-5.1-data-access-layer.md) | 1.3 | Added: parameterized query mandate, type mapping details, error handling (graceful degradation), fallback rules |
| 12 | [5.2 Main Page](stories/story-5.2-main-page-integration.md) | 5.1 | Added: Server/Client component split, cache invalidation paths, parallel fetching, graceful degradation |
| 13 | [5.3 Article Page](stories/story-5.3-article-page-migration.md) | 5.1 | Added: generateMetadata, ISR, cache invalidation |
| 14 | [5.4 Cleanup](stories/story-5.4-cleanup.md) | 5.2, 5.3 | Added: type consolidation, seed data relocation, doc updates |

## Parallel Tracks

- Steps 1-3 (DB setup + seed) and step 4 (admin auth) can run in parallel
- Steps 8-10 (events admin) can start after step 5 (admin layout)
- Steps 11-13 (public migration) can start once step 3 (seed) is done

## Technical Decisions

- **Database**: Neon Postgres 17 (Frankfurt, pooling on)
- **ORM**: Drizzle ORM + @neondatabase/serverless
- **Auth**: Shared password, signed cookie session (24h), rate-limited login
- **Images**: /public/ paths for v1 (no upload)
- **Recurrence**: Expand-on-save in single transaction (template + instance rows, max 200)
- **Translations**: groupId links locales, partial allowed, Dutch fallback, NL required for publish
- **Content format**: Plain text, `\n\n` paragraph separator (no rich editor v1)
- **Admin language**: Dutch
- **Timestamps**: UTC in DB, Europe/Amsterdam for display
- **Concurrency**: Optimistic locking via version column
- **Security**: CSRF via Next.js Server Actions, parameterized queries via Drizzle, XSS via React auto-escaping
- **Caching**: revalidatePath after all admin writes
- **Error handling**: All Server Actions return `{ success, error? }`, Dutch error messages, graceful public page degradation

## QA Review Summary

All 8 critical issues from QA review have been addressed:

| # | Critical Issue | Resolution |
|---|---|---|
| 1 | AgendaEvent type mismatch | Story 5.1: explicit type mapping `startDatetime → start` |
| 2 | Missing error handling | All admin stories: `{ success, error? }` pattern + Dutch messages |
| 3 | CSRF protection | Story 2.1: documented Next.js automatic CSRF |
| 4 | SQL injection risk | Story 5.1: mandate Drizzle typed builders, no string interpolation |
| 5 | Orphaned groupId records | Story 1.2: cascade FK, transactional deletes in all stories |
| 6 | Recurrence race condition | Story 4.2: single transaction, 200 instance limit |
| 7 | Missing env setup story | Story 0 created |
| 8 | Missing test story | Manual verification via seed script + smoke testing |

All 11 important issues addressed in respective story updates (see "Key Changes" column above).
