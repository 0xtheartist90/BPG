# Story 5.2: Main Page Database Integration

**Epic**: [Epic 5: Public Site Migration](../epics/epic-5-public-migration.md)
**Depends on**: Story 5.1

**As a** user
**I want** the homepage to show database-backed content
**So that** admin-managed content appears on the live site

## Acceptance Criteria

### Data Fetching
- [ ] `src/app/[lang]/page.tsx` fetches news from `getPublishedArticles(locale)` instead of `dict.news`
- [ ] `src/app/[lang]/page.tsx` fetches events from `getUpcomingEvents(locale)` instead of `dict.agenda.events`
- [ ] Data passed to `NewsShowcase`, `AgendaShowcase`, `AgendaMonthView`, `AgendaWeekView`, `EventModal` with same prop shapes — **zero changes** to these components
- [ ] Static UI copy (hero, mission, nav labels, footer, etc.) remains from `translations.ts` dictionary

### Architecture Refactor
- [ ] `[lang]/page.tsx` converted to Server Component (data fetching happens server-side)
- [ ] Client-side interactivity moved to child component `BPGPage.tsx` (receives data as props)
- [ ] Structure: `page.tsx` (Server) → `BPGPage.tsx` ('use client', receives articles + events + dict as props)

### Rendering
- [ ] Page renders correctly with database content in all 3 locales (nl, en, ar)
- [ ] Empty states handled: if no articles/events in DB, sections render gracefully (no crash, show empty section)

### Error Handling / Graceful Degradation
- [ ] If `getPublishedArticles()` fails (DB down), page still renders — static sections work, news section empty
- [ ] If `getUpcomingEvents()` fails, page still renders — agenda section empty
- [ ] Errors logged to server console, not shown to user

### Cache Invalidation
- [ ] Admin write actions call `revalidatePath` for all 3 locales:
  ```typescript
  revalidatePath('/nl')
  revalidatePath('/en')
  revalidatePath('/ar')
  ```
- [ ] Also revalidate article pages: `revalidatePath('/[lang]/nieuws', 'page')`
- [ ] After admin save, public pages reflect changes within seconds (not stale cache)

### Performance
- [ ] Page load time comparable to current static version
- [ ] DB queries execute in parallel where possible (articles + events fetched concurrently)

## Technical Notes

### Before (current)

```typescript
// [lang]/page.tsx ('use client')
const dict = getDictionary(locale)
// News from dict.news, events from dict.agenda.events
```

### After (new)

```typescript
// [lang]/page.tsx (Server Component)
import { getPublishedArticles, getUpcomingEvents } from '@/db/queries'

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const locale = validLocale(lang)
    const dict = getDictionary(locale)

    // Parallel data fetching
    const [articles, events] = await Promise.all([
        getPublishedArticles(locale, 6),
        getUpcomingEvents(locale)
    ])

    return <BPGPage dict={dict} articles={articles} events={events} locale={locale} />
}

// BPGPage.tsx ('use client')
// All existing client-side logic (IntersectionObserver, scroll, modals, etc.)
// Receives data as props instead of reading from dict
```

### Revalidation in Admin Actions

```typescript
// In every admin Server Action (articles.ts, events.ts):
import { revalidatePath } from 'next/cache'

function revalidatePublicPages() {
    revalidatePath('/nl')
    revalidatePath('/en')
    revalidatePath('/ar')
    revalidatePath('/nl/nieuws', 'page')
    revalidatePath('/en/nieuws', 'page')
    revalidatePath('/ar/nieuws', 'page')
}
```

## Definition of Done

- Homepage shows database-backed articles and events
- All 3 locales render correctly
- Existing components unchanged (zero prop changes)
- UI copy still comes from translations.ts
- Admin changes reflected on public site within seconds
- DB failures don't crash the page
