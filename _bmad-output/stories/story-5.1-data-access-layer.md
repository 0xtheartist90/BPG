# Story 5.1: Public Data Access Layer

**Epic**: [Epic 5: Public Site Migration](../epics/epic-5-public-migration.md)
**Depends on**: Epic 1 (database seeded)

**As a** developer
**I want** optimized query functions for public content
**So that** page components can fetch from the database with fast response times and proper locale handling

## Acceptance Criteria

### Query Functions
- [ ] `src/db/queries.ts` created with all public-facing query functions
- [ ] `getPublishedArticles(locale, limit?)` — returns articles for locale with Dutch fallback, sorted by createdAt desc
- [ ] `getArticleBySlug(slug, locale)` — returns single article, falls back to NL if locale not found
- [ ] `getUpcomingEvents(locale, limit?)` — returns future published event instances, sorted by startDatetime asc
- [ ] `getAllPublishedEvents(locale)` — returns all published event instances (for calendar views)

### Query Optimization
- [ ] **Single-query locale fallback** for articles: use SQL `DISTINCT ON (groupId)` with locale preference ordering — avoids 2 separate queries
- [ ] **Single-query locale fallback** for events: same pattern
- [ ] All queries leverage indexes: `(slug, locale)`, `startDatetime`, `parentEventId`
- [ ] No N+1 patterns — no per-item sub-queries
- [ ] Article list query returns max `limit` rows (default 50, configurable)
- [ ] Event queries use `startDatetime >= NOW()` server-side (not client-side filter)
- [ ] Admin list queries (articles grouped by groupId with locale badges) use a single aggregation query

### Security
- [ ] All query parameters passed via Drizzle ORM typed query builders — NO string interpolation
- [ ] Locale parameter validated against `['nl', 'en', 'ar']` before query — invalid locale defaults to `'nl'`

### Type Mapping
- [ ] Article results mapped to `NewsItem` shape:
  ```typescript
  { title, slug, excerpt, content: string[], image, tag?, date? }
  ```
- [ ] DB `content` (single string) split on `\n\n` to produce `string[]`
- [ ] DB `createdAt` formatted to display date string for `date` field
- [ ] Event results mapped to `AgendaEvent` shape:
  ```typescript
  { id, date, time, title, location, description, image, start?, end? }
  ```
- [ ] DB `startDatetime` → `start` (ISO string), DB `endDatetime` → `end` (ISO string or undefined)
- [ ] DB `id` (number) → `id` (string) for AgendaEvent

### Error Handling
- [ ] All query functions wrapped in try/catch
- [ ] On DB error: return empty array (public site degrades gracefully, does not crash)
- [ ] Errors logged to `console.error` for debugging

## Technical Notes

### Optimized Single-Query Locale Fallback

Instead of running 2 queries (one for locale, one for NL fallback), use a single query with window function or UNION approach:

```sql
-- Option A: DISTINCT ON with locale priority (Postgres-specific, very fast)
SELECT DISTINCT ON (a."groupId")
    a.*
FROM articles a
WHERE a.published = true
    AND a.locale IN ($locale, 'nl')
ORDER BY a."groupId",
    CASE WHEN a.locale = $locale THEN 0 ELSE 1 END,  -- prefer requested locale
    a."createdAt" DESC
```

This returns one row per `groupId` — the requested locale if it exists, otherwise Dutch. Single query, single pass.

```typescript
// Drizzle implementation
export async function getPublishedArticles(locale: Locale, limit = 50) {
    try {
        const validLocale = locales.includes(locale) ? locale : 'nl'

        if (validLocale === 'nl') {
            // Simple case: no fallback needed
            const rows = await db.select().from(articles)
                .where(and(eq(articles.locale, 'nl'), eq(articles.published, true)))
                .orderBy(desc(articles.createdAt))
                .limit(limit)
            return rows.map(mapToNewsItem)
        }

        // Single query with locale preference via raw SQL for DISTINCT ON
        const rows = await db.execute(sql`
            SELECT DISTINCT ON (a."group_id") a.*
            FROM articles a
            WHERE a.published = true
                AND a.locale IN (${validLocale}, 'nl')
            ORDER BY a."group_id",
                CASE WHEN a.locale = ${validLocale} THEN 0 ELSE 1 END,
                a."created_at" DESC
        `)

        return rows
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limit)
            .map(mapToNewsItem)
    } catch (error) {
        console.error('getPublishedArticles failed:', error)
        return []
    }
}
```

### Optimized Article By Slug

```typescript
export async function getArticleBySlug(slug: string, locale: Locale) {
    try {
        const validLocale = locales.includes(locale) ? locale : 'nl'

        // Try requested locale first, fallback to NL — single query with COALESCE-like pattern
        const rows = await db.select().from(articles)
            .where(and(
                eq(articles.slug, slug),
                eq(articles.published, true),
                inArray(articles.locale, [validLocale, 'nl'])
            ))
            .orderBy(sql`CASE WHEN locale = ${validLocale} THEN 0 ELSE 1 END`)
            .limit(1)

        return rows[0] ? mapToNewsItem(rows[0]) : null
    } catch (error) {
        console.error('getArticleBySlug failed:', error)
        return null
    }
}
```

### Optimized Upcoming Events

```typescript
export async function getUpcomingEvents(locale: Locale, limit = 100) {
    try {
        const validLocale = locales.includes(locale) ? locale : 'nl'

        if (validLocale === 'nl') {
            const rows = await db.select().from(agendaEvents)
                .where(and(
                    eq(agendaEvents.locale, 'nl'),
                    eq(agendaEvents.published, true),
                    isNotNull(agendaEvents.parentEventId),  // instances only
                    gte(agendaEvents.startDatetime, new Date())
                ))
                .orderBy(asc(agendaEvents.startDatetime))
                .limit(limit)
            return rows.map(mapToAgendaEvent)
        }

        // Single query with locale fallback
        const rows = await db.execute(sql`
            SELECT DISTINCT ON (a."group_id", a."start_datetime") a.*
            FROM agenda_events a
            WHERE a.published = true
                AND a."parent_event_id" IS NOT NULL
                AND a."start_datetime" >= NOW()
                AND a.locale IN (${validLocale}, 'nl')
            ORDER BY a."group_id", a."start_datetime",
                CASE WHEN a.locale = ${validLocale} THEN 0 ELSE 1 END
        `)

        return rows
            .sort((a, b) => a.startDatetime.getTime() - b.startDatetime.getTime())
            .slice(0, limit)
            .map(mapToAgendaEvent)
    } catch (error) {
        console.error('getUpcomingEvents failed:', error)
        return []
    }
}
```

### Optimized Admin List Query (Articles with Locale Badges)

```typescript
// Single query: get all articles grouped by groupId with locale info
export async function getArticlesForAdmin() {
    try {
        const rows = await db.execute(sql`
            SELECT
                a."group_id",
                MAX(CASE WHEN a.locale = 'nl' THEN a.title END) as title,
                MAX(CASE WHEN a.locale = 'nl' THEN a.slug END) as slug,
                BOOL_AND(a.published) as published,
                MAX(a."created_at") as created_at,
                ARRAY_AGG(DISTINCT a.locale) as locales
            FROM articles a
            GROUP BY a."group_id"
            ORDER BY MAX(a."created_at") DESC
        `)
        return rows
    } catch (error) {
        console.error('getArticlesForAdmin failed:', error)
        return []
    }
}
```

This returns one row per article group with: Dutch title, slug, publish status, and array of available locales — all in a single query.

### Optimized Admin Event List (with Instance Counts)

```typescript
export async function getEventsForAdmin() {
    try {
        const rows = await db.execute(sql`
            SELECT
                e."group_id",
                e.title,
                e."start_datetime",
                e."is_recurring",
                e."recurrence_pattern",
                ARRAY_AGG(DISTINCT e2.locale) as locales,
                COUNT(DISTINCT i.id) as instance_count,
                BOOL_AND(e.published) as published
            FROM agenda_events e
            LEFT JOIN agenda_events e2 ON e2."group_id" = e."group_id" AND e2."parent_event_id" IS NULL
            LEFT JOIN agenda_events i ON i."parent_event_id" = e.id AND i.locale = 'nl'
            WHERE e."parent_event_id" IS NULL AND e.locale = 'nl'
            GROUP BY e.id
            ORDER BY e."start_datetime" ASC
        `)
        return rows
    } catch (error) {
        console.error('getEventsForAdmin failed:', error)
        return []
    }
}
```

### Type Mapping Functions

```typescript
function mapToNewsItem(row: typeof articles.$inferSelect): NewsItem {
    return {
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt ?? '',
        content: row.content ? row.content.split('\n\n') : [],
        image: row.image ?? '',
        tag: row.tag ?? undefined,
        date: row.createdAt ? formatDisplayDate(row.createdAt) : undefined
    }
}

function mapToAgendaEvent(row: typeof agendaEvents.$inferSelect): AgendaEvent {
    return {
        id: String(row.id),
        date: row.date,
        time: row.time,
        title: row.title,
        location: row.location ?? '',
        description: row.description ?? '',
        image: row.image ?? '',
        start: row.startDatetime?.toISOString(),
        end: row.endDatetime?.toISOString()
    }
}

function formatDisplayDate(date: Date): string {
    return new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric', month: 'long', year: 'numeric',
        timeZone: 'Europe/Amsterdam'
    }).format(date)
}
```

### Index Usage Summary

| Query | Index Used |
|---|---|
| Articles by locale + published | `(locale)` + `published` filter |
| Article by slug + locale | `(slug, locale)` unique index |
| Events by startDatetime | `(startDatetime)` index |
| Events by parentEventId | `(parentEventId)` index |
| All queries | Drizzle parameterizes automatically |

### Performance Expectations

- Article list (50 items): <10ms with index
- Article by slug: <5ms with unique index
- Upcoming events (100 items): <15ms with startDatetime index + parentEventId index
- Admin article list with aggregation: <20ms for <100 articles
- Admin event list with counts: <20ms for <200 events

## Definition of Done

- All query functions return correct data from seeded database
- Locale fallback resolved in single query (not 2 separate queries)
- Return shapes match existing component props — zero component changes needed
- All queries parameterized (SQL injection safe)
- Graceful degradation on DB errors (empty arrays, not crashes)
- Admin queries return aggregated data in single queries (no N+1)
