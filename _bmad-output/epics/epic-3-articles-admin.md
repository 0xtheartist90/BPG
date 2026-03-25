# Epic 3: Articles Management (Admin)

> CRUD interface for managing multilingual news articles.

## Context

The client currently has 24 Dutch news articles hardcoded in `src/data/newsItems.ts` with partial EN/AR translations in `newsTranslations.ts`. They need a simple admin interface to create, edit, and delete articles with multilingual support via language tabs.

## Technical Decisions

- **Admin UI language**: Dutch (client-facing)
- **Translation model**: `groupId` links locale variants; partial translations allowed; fallback to Dutch on public site
- **Content format**: Plain text with paragraph breaks (no rich text editor for v1)
- **Images**: Reference existing `/public/images/` paths (no file upload for v1)
- **Slug generation**: Auto-generated from Dutch title (kebab-case), editable

## Stories

1. [Story 3.1: Admin Dashboard & Layout](../stories/story-3.1-admin-layout.md)
2. [Story 3.2: Article List Page](../stories/story-3.2-article-list.md)
3. [Story 3.3: Article Create/Edit Form](../stories/story-3.3-article-form.md)

## Dependencies

- Epic 1 (database + schema)
- Epic 2 (admin auth)

## Definition of Done

- Client can log in, see all articles, create new ones with language tabs, edit existing ones, delete articles
- Published articles are visible on the public site (after Epic 5)
