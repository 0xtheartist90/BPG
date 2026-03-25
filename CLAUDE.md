# BPGwebsite

Community website for **Buurtplatform Gein** (neighborhood platform in Amsterdam-Zuidoost). A multilingual (Dutch/English/Arabic) single-page site built on Next.js 15 with shadcn/ui.

**Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui New York v4, Radix UI, Recharts, next-themes, Docker

**Structure**:
- `src/app/[lang]/page.tsx` — Main page (monolithic `'use client'` component with all sections)
- `src/lib/translations.ts` — All content: UI copy + agenda events for 3 locales
- `src/components/` — 6 BPG site components (Agenda, News, Highlights, EventModal) + ~55 shadcn demos
- `src/registry/new-york-v4/` — Standard shadcn/ui component library (46 UI + 70 charts + 82 blocks)
- `src/data/` — Static news articles (Dutch, 24 items)
- `_bmad/` — BMAD Method project management framework (not runtime code)

For detailed architecture, see [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md).
