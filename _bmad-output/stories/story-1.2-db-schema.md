# Story 1.2: Database Schema

**Epic**: [Epic 1: Database Foundation](../epics/epic-1-database-foundation.md)
**Depends on**: Story 1.1

**As a** developer
**I want** articles and agenda_events tables defined in Drizzle
**So that** content can be stored persistently with multilingual support

## Acceptance Criteria

- [ ] `src/db/schema.ts` defines `articles` table (see schema below)
- [ ] `src/db/schema.ts` defines `agendaEvents` table (see schema below)
- [ ] Unique constraint on `(groupId, locale)` for articles
- [ ] Unique constraint on `(slug, locale)` for articles — prevents duplicate slugs per language
- [ ] Unique constraint on `(groupId, locale, startDatetime)` for agendaEvents
- [ ] Index on `articles.slug` for fast lookups
- [ ] Index on `agendaEvents.startDatetime` for date-range queries
- [ ] Index on `agendaEvents.parentEventId` for instance lookups
- [ ] `parentEventId` FK references `agendaEvents.id` with `ON DELETE CASCADE`
- [ ] All multi-row mutations (delete group, expand recurrence) wrapped in transactions
- [ ] All timestamps stored as UTC — timezone conversion handled at render time
- [ ] Drizzle migration generated via `npx drizzle-kit generate`
- [ ] Migration applied to Neon via `npx drizzle-kit push`
- [ ] Tables verified in Neon console — correct columns and constraints

## Schema: `articles`

| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| groupId | uuid | NOT NULL |
| locale | varchar(5) | NOT NULL — `'nl'` / `'en'` / `'ar'` |
| title | text | NOT NULL |
| slug | varchar(255) | NOT NULL |
| excerpt | text | nullable |
| content | text | nullable — plain text, paragraphs separated by `\n\n` (double newline) |
| image | text | nullable — path like `/images/Infinite%20loop/bpgloop1.png` |
| tag | varchar(100) | nullable |
| published | boolean | NOT NULL, default `true` |
| version | integer | NOT NULL, default `1` — for optimistic locking |
| createdAt | timestamp | NOT NULL, default `now()` |
| updatedAt | timestamp | NOT NULL, default `now()` |

**Unique constraints**:
- `(groupId, locale)` — one translation per locale per group
- `(slug, locale)` — slugs unique per language (prevents routing conflicts)

## Schema: `agendaEvents`

| Column | Type | Constraints |
|--------|------|-------------|
| id | serial | PK |
| groupId | uuid | NOT NULL |
| locale | varchar(5) | NOT NULL — `'nl'` / `'en'` / `'ar'` |
| title | text | NOT NULL |
| date | varchar(20) | NOT NULL — locale-formatted display date (e.g., "wo 11 mrt") |
| time | varchar(20) | NOT NULL — display time (e.g., "13:30 - 16:00") |
| startDatetime | timestamp | NOT NULL — canonical sortable UTC datetime |
| endDatetime | timestamp | nullable |
| location | text | nullable |
| description | text | nullable |
| image | text | nullable |
| published | boolean | NOT NULL, default `true` |
| isRecurring | boolean | NOT NULL, default `false` |
| recurrencePattern | varchar(20) | nullable — `'weekly'` / `'biweekly'` / `'monthly'` |
| recurrenceEndDate | date | nullable |
| parentEventId | integer | nullable — FK to `agendaEvents.id` ON DELETE CASCADE |
| version | integer | NOT NULL, default `1` — for optimistic locking |
| createdAt | timestamp | NOT NULL, default `now()` |
| updatedAt | timestamp | NOT NULL, default `now()` |

**Unique**: `(groupId, locale, startDatetime)`

## Technical Notes

### groupId Pattern
- `groupId` is a UUID that links all locale variants of the same logical content item
- For recurring events: the template row has `parentEventId = null` and `isRecurring = true`; instance rows have `parentEventId` pointing to the template's `id`
- Deleting via `groupId` removes ALL translations; deleting a template cascades to instances via FK

### Display vs Canonical Fields
- `date` and `time` columns store pre-formatted display strings per locale (e.g., Dutch: "wo 11 mrt", English: "Wed 11 Mar", Arabic: "الأربعاء ١١ مارس")
- `startDatetime` is the canonical UTC timestamp used for sorting and filtering
- All timestamps stored in UTC; display timezone handled by `Intl.DateTimeFormat` at render time

### Optimistic Locking
- `version` column increments on each update
- Server Actions check version matches before writing: `UPDATE ... WHERE id = ? AND version = ?`
- If version mismatch: return error "Inhoud is gewijzigd door iemand anders. Vernieuw de pagina."

### Transaction Requirements
- Delete article group: `BEGIN; DELETE FROM articles WHERE groupId = ?; COMMIT;`
- Create recurring event: `BEGIN; INSERT template; INSERT all instances; COMMIT;` — if any instance fails, entire transaction rolls back
- Edit recurring "all future": `BEGIN; UPDATE template; DELETE future instances; INSERT new instances; COMMIT;`

### Content Encoding
- Article `content` stored as single text string
- Paragraphs separated by `\n\n` (double newline)
- On read for public site: `content.split('\n\n')` produces `string[]` matching existing `NewsItem` shape
- On write from admin: `paragraphs.join('\n\n')` before DB insert

## Definition of Done

- Both tables exist in Neon with correct columns, types, constraints, and indexes
- Migration files committed in `drizzle/` folder
- FK cascade verified: deleting template deletes all instances
