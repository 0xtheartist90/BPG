# Story 5.3: News Article Page Migration

**Epic**: [Epic 5: Public Site Migration](../epics/epic-5-public-migration.md)
**Depends on**: Story 5.1, Story 5.2

**As a** user
**I want** to read individual news articles served from the database
**So that** admin-published articles are accessible via direct URL in my language

## Acceptance Criteria

### Route Fix
- [ ] Route moved: `src/app/nieuws/[slug]/page.tsx` → `src/app/[lang]/nieuws/[slug]/page.tsx`
- [ ] Old `src/app/nieuws/` directory deleted entirely
- [ ] This fixes the existing routing bug where middleware redirected `/nieuws/slug` → `/nl/nieuws/slug` → 404

### Data Fetching
- [ ] Page queries `getArticleBySlug(slug, locale)` from database
- [ ] Falls back to Dutch if article doesn't exist in requested locale
- [ ] 404 page shown for non-existent slugs (via `notFound()`)

### Rendering
- [ ] Article renders correctly in all 3 locales where translation exists
- [ ] Content paragraphs (`string[]`) rendered as `<p>` elements
- [ ] Page uses `Promise<params>` pattern (Next.js 15) for both `lang` and `slug`
- [ ] Metadata (title, description) set from article data via `generateMetadata`

### Navigation
- [ ] Back link uses `/${locale}#nieuws` (locale-aware, not hardcoded `/#nieuws`)
- [ ] Any existing links in other components updated to use `/${locale}/nieuws/[slug]`

### Dynamic Rendering
- [ ] `generateStaticParams` removed — articles are dynamic (managed via admin)
- [ ] Use `export const dynamicParams = true` for on-demand rendering
- [ ] Optionally: `export const revalidate = 60` for ISR (revalidate every 60s)

### Error Handling
- [ ] DB query failure: show generic error page, not crash
- [ ] Non-existent slug: proper 404 (via `notFound()`)
- [ ] Non-existent locale: fall back to Dutch article

### Cache Invalidation
- [ ] Admin article saves call `revalidatePath('/[lang]/nieuws', 'page')` to refresh article pages

## Technical Notes

### Page Implementation

```typescript
// src/app/[lang]/nieuws/[slug]/page.tsx
import { getArticleBySlug } from '@/db/queries'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

export const dynamicParams = true
export const revalidate = 60

export async function generateMetadata({ params }: Props) {
    const { lang, slug } = await params
    const article = await getArticleBySlug(slug, lang as Locale)
    if (!article) return { title: 'Niet gevonden' }
    return { title: article.title, description: article.excerpt }
}

export default async function ArticlePage({ params }: Props) {
    const { lang, slug } = await params
    const locale = locales.includes(lang as Locale) ? (lang as Locale) : 'nl'

    const article = await getArticleBySlug(slug, locale)
    if (!article) notFound()

    return (
        <article>
            <a href={`/${locale}#nieuws`}>← Terug</a>
            <h1>{article.title}</h1>
            {article.content.map((p, i) => <p key={i}>{p}</p>)}
        </article>
    )
}
```

## Definition of Done

- Articles accessible at `/{locale}/nieuws/{slug}` for all 3 locales
- Old `/nieuws/[slug]` route removed
- Back link is locale-aware
- Dutch fallback works when translation missing
- Non-existent slugs show 404
- Metadata set from article data
