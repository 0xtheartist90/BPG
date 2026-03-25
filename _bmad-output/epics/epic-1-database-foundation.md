# Epic 1: Database Foundation

> Set up Neon Postgres with Drizzle ORM, define schema, establish connection, and migrate existing content.

## Context

The BPG website currently stores all content (news articles, agenda events, UI copy) in hardcoded TypeScript files. To enable client self-management, we need a persistent external database that survives builds and deployments.

## Technical Decisions

- **Database**: Neon Postgres 17 (AWS Frankfurt, connection pooling enabled)
- **ORM**: Drizzle ORM with `@neondatabase/serverless` driver
- **Schema pattern**: `groupId` (UUID) links translations across locales; `locale` column differentiates languages
- **Migration tool**: `drizzle-kit` (generate + push)

## Pre-requisite

- [Story 0: Environment Setup](../stories/story-0-environment-setup.md) — must be done first

## Stories

1. [Story 1.1: Project Setup & Database Connection](../stories/story-1.1-db-connection.md)
2. [Story 1.2: Database Schema](../stories/story-1.2-db-schema.md)
3. [Story 1.3: Seed Existing Content](../stories/story-1.3-seed-content.md)

## Dependencies

- Neon account + DATABASE_URL connection string (done)
- Story 0 (environment setup)
- No other epics depend on this; all other epics depend on this

## Definition of Done

- Drizzle connected to Neon, tables created, existing content migrated
- Verified via Neon console: correct row counts, data integrity
