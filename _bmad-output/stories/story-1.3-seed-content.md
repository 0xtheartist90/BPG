# Story 1.3: Seed Existing Content

**Epic**: [Epic 1: Database Foundation](../epics/epic-1-database-foundation.md)
**Depends on**: Story 1.2

**As a** developer
**I want** all existing hardcoded content migrated to the database
**So that** the public site can switch to DB-backed content without data loss

## Acceptance Criteria

- [ ] `src/db/seed.ts` script created, runnable via `npx tsx src/db/seed.ts`
- [ ] All 24 news articles from `src/data/newsItems.ts` inserted with locale `'nl'`, unique groupIds per article
- [ ] EN/AR translations from `src/data/newsTranslations.ts` inserted with matching groupIds (where available)
- [ ] Slugs preserved exactly as defined in `newsItems.ts`
- [ ] All 4 recurring agenda event templates inserted (Kunst in Gein, Kinderkledingpunt, Bewegingsexpressie, Repair Cafe) with instances expanded for all 3 locales
- [ ] Fixed events (Koningsdag, Iftar) inserted as one-off events for all 3 locales
- [ ] Date/time display strings formatted per locale using `Intl.DateTimeFormat` with `timeZone: 'Europe/Amsterdam'`
- [ ] Seed script is idempotent: clears tables before inserting (TRUNCATE with CASCADE)
- [ ] Data verified: row counts logged after seed completes

### Content Encoding
- [ ] Article `content` stored with `\n\n` (double newline) as paragraph separator
- [ ] Verified: `content.split('\n\n')` produces identical `string[]` as original `newsItems.ts` content array
- [ ] No data loss from encoding conversion (spot-check at least 3 articles)

### Data Integrity
- [ ] All slugs unique per locale
- [ ] No orphan translations (every EN/AR row has a matching NL row with same groupId)
- [ ] Recurring event instance counts match the date arrays in current codebase
- [ ] `startDatetime` values are correct UTC timestamps
- [ ] `version` column set to 1 for all rows

## Data Sources

### News Articles
- **Source**: `src/data/newsItems.ts` (24 items, Dutch)
- **Translations**: `src/data/newsTranslations.ts` (partial EN/AR, keyed by slug)
- **Fields to map**:
  - `title` → `title`
  - `slug` → `slug`
  - `excerpt` → `excerpt`
  - `content: string[]` → `content: string` (join with `\n\n`)
  - `image` → `image`
  - `tag?` → `tag`
  - `date?` → parse to `createdAt` where possible, else `new Date()`

### Agenda Events — Recurring
- **Source**: `src/lib/translations.ts` or `src/translations/shared/agenda.ts`
- **Templates**:
  - Kunst in Gein — Weekly, Wednesdays
  - Kinderkledingpunt — specific dates
  - Bewegingsexpressie — specific dates
  - Repair Cafe — Monthly, first Saturdays
- **For each**: create template row + instance rows per locale
- **Locale data**: title, description, location, time differ per locale (nl/en/ar)

### Agenda Events — Fixed
- Koningsdag (April 27, 2026) — all 3 locales
- Iftar — all 3 locales

## Technical Notes

### Seed Script Structure

```typescript
import { db } from './index'
import { articles, agendaEvents } from './schema'
import { newsItems } from '../data/newsItems'
import { newsTranslations } from '../data/newsTranslations'

async function seed() {
    console.log('Clearing existing data...')
    await db.delete(agendaEvents)  // children first (FK cascade handles it too)
    await db.delete(articles)

    console.log('Seeding articles...')
    let articleCount = 0
    for (const item of newsItems) {
        const groupId = crypto.randomUUID()

        // Insert NL
        await db.insert(articles).values({
            groupId, locale: 'nl', title: item.title, slug: item.slug,
            excerpt: item.excerpt, content: item.content.join('\n\n'),
            image: item.image, tag: item.tag, version: 1
        })
        articleCount++

        // Insert EN/AR if translation exists
        const trans = newsTranslations[item.slug]
        if (trans?.en) {
            await db.insert(articles).values({
                groupId, locale: 'en', ...mapTranslation(trans.en, item),
                version: 1
            })
            articleCount++
        }
        if (trans?.ar) {
            await db.insert(articles).values({
                groupId, locale: 'ar', ...mapTranslation(trans.ar, item),
                version: 1
            })
            articleCount++
        }
    }

    console.log(`Seeded ${articleCount} article rows`)

    console.log('Seeding agenda events...')
    // ... recurring + fixed event seeding
    // Log counts

    console.log('Seed complete!')
}

seed().catch(console.error).finally(() => process.exit())
```

### Content Encoding Verification

```typescript
// Spot-check during seed:
const original = newsItems[0].content  // string[]
const encoded = original.join('\n\n')
const decoded = encoded.split('\n\n')
assert.deepEqual(original, decoded, 'Content encoding roundtrip failed!')
```

## Definition of Done

- Seed script runs successfully, data visible in Neon console
- Row counts match expected totals (logged to console)
- Content encoding verified (roundtrip test passes)
- No orphaned translations
