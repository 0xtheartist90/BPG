# Epic 5: Public Site Migration

> Switch the public-facing website from hardcoded data to database queries.

## Context

The public site currently imports content from static TypeScript files (`newsItems.ts`, `translations.ts`). After Epics 1-4, the database contains all content. This epic swaps the data source while keeping the existing components and UX unchanged.

## Technical Decisions

- **Data shape**: Query results mapped to match existing `NewsItem` and `AgendaEvent` types so components need zero changes
- **Locale fallback**: If no content exists for requested locale, fall back to Dutch (per-item granularity)
- **Static UI copy**: Remains in `translations.ts` (hero, mission, footer, nav labels, etc.)
- **Cache**: Use `revalidatePath` after admin writes to bust cache
- **Migration safety**: Can develop behind `USE_DATABASE=true` env flag until verified
- **Routing fix**: Move `nieuws/[slug]` under `[lang]` (fixes existing bug)

## Stories

1. [Story 5.1: Public Data Access Layer](../stories/story-5.1-data-access-layer.md)
2. [Story 5.2: Main Page Database Integration](../stories/story-5.2-main-page-integration.md)
3. [Story 5.3: News Article Page Migration](../stories/story-5.3-article-page-migration.md)
4. [Story 5.4: Cleanup Hardcoded Data](../stories/story-5.4-cleanup.md)

## Dependencies

- Epics 1-4 (database populated, admin functional)

## Definition of Done

- Public site renders all content from database
- All 3 locales work correctly with fallback
- `nieuws/[slug]` routing bug fixed
- Hardcoded content data removed
- Clean build with no broken imports
- Documentation (CLAUDE.md, CODEBASE_MAP.md) updated
