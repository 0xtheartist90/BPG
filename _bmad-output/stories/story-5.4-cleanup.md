# Story 5.4: Cleanup Hardcoded Data

**Epic**: [Epic 5: Public Site Migration](../epics/epic-5-public-migration.md)
**Depends on**: Stories 5.2, 5.3 (public site fully on database)

**As a** developer
**I want** to remove hardcoded content data from the codebase
**So that** there is a single source of truth (the database) and no confusion about where content lives

## Acceptance Criteria

### File Removals
- [ ] `src/translations/shared/agenda.ts` — removed entirely (replaced by database)
- [ ] `src/data/newsTranslations.ts` — removed (was already unused, now fully superseded)
- [ ] `src/types/news.ts` — removed (duplicate type, unused)
- [ ] `src/types/content.ts` — remove duplicate `AgendaEvent` type (keep `HighlightContentBlock`, `HighlightItem`)

### File Modifications
- [ ] `src/lib/translations.ts`: remove news items data, remove agenda events data, remove `buildRecurringEventsForLocale()` and related date arrays; retain all UI copy (hero, mission, nav, footer, contact, etc.)
- [ ] `Dictionary` type updated: remove `news` section and `agenda.events` array
- [ ] `src/data/newsItems.ts`: moved to `src/db/seed-data/newsItems.ts` (kept for seed script only, not imported by app code)

### Type Consolidation
- [ ] Single `AgendaEvent` type in `src/types/agenda.ts` — used everywhere
- [ ] `NewsItem` type either in `src/types/` or re-exported from `src/db/queries.ts`
- [ ] No duplicate type definitions remaining

### Import Updates
- [ ] All imports across codebase updated — no broken references
- [ ] No app code imports from `src/db/seed-data/` (seed data is for seeding only)

### Verification
- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run type-check` passes
- [ ] Application runs correctly — all pages render in all 3 locales
- [ ] Seed script (`src/db/seed.ts`) still works — updated to import from `src/db/seed-data/`
- [ ] Content rendered on public site is identical before and after cleanup (visual regression check)

### Documentation Update
- [ ] `CLAUDE.md` updated to reflect new architecture (DB-backed content, admin panel)
- [ ] `docs/CODEBASE_MAP.md` updated with new directories (`src/db/`, `src/app/admin/`, `src/emails/`)

## What Stays in `translations.ts`

UI copy NOT managed in admin panel:
- `meta` (page titles, descriptions)
- `media` (WhatsApp text)
- `nav` (navigation labels)
- `hero` (hero section copy)
- `mission` / `marquee` / `overGein` / `initiatives`
- `highlights` (could move to DB later, not in this epic)
- `newsControls` (UI labels: "Lees meer", pagination text)
- `agenda` section labels (header, empty state text — but NOT `agenda.events`)
- `contact` (form labels, channels)
- `footer`
- `ui` (generic UI strings)
- `annualReport2025`

## Technical Notes

### Seed Data Relocation

```
BEFORE:
  src/data/newsItems.ts         (imported by app + seed)
  src/data/newsTranslations.ts  (unused)

AFTER:
  src/db/seed-data/newsItems.ts     (imported by seed only)
  src/db/seed-data/agendaEvents.ts  (extracted event data for seed)
  src/data/                         (directory removed or empty)
```

### Migration Safety

- Run this story LAST in Epic 5
- Verify public site works with DB before removing any hardcoded data
- Compare rendered output before/after cleanup to catch regressions

## Definition of Done

- No hardcoded article or agenda data in application code
- UI copy remains in `translations.ts`
- Single source of truth for types (no duplicates)
- Clean build, clean types, clean runtime
- Seed script still functional
- Documentation updated
