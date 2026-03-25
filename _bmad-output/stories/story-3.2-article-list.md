# Story 3.2: Article List Page

**Epic**: [Epic 3: Articles Management](../epics/epic-3-articles-admin.md)
**Depends on**: Story 3.1

**As a** site administrator
**I want** to see all articles in a table
**So that** I can manage existing content

## Acceptance Criteria

### Display
- [ ] `/admin/nieuws` displays all articles grouped by `groupId`
- [ ] Table columns: Titel, Talen (language badges), Gepubliceerd, Datum, Acties
- [ ] Language badges: 🇳🇱 🇬🇧 🇸🇦 flags showing which translations exist per group
- [ ] Sorted by `createdAt` descending (newest first)
- [ ] Published status shown as visual indicator (green check / red cross) AND text label for accessibility

### Actions
- [ ] "Nieuw artikel" button at top navigates to `/admin/nieuws/new`
- [ ] "Bewerken" action navigates to `/admin/nieuws/[groupId]`
- [ ] "Verwijderen" action shows confirmation dialog ("Weet je het zeker? Dit verwijdert het artikel in alle talen."), then deletes all translations for that groupId
- [ ] Delete executes atomically in a transaction — no orphaned rows possible
- [ ] "Bekijken" link opens the public article page (`/nl/nieuws/[slug]`) in new tab
- [ ] Publish/unpublish toggle available directly in the list (updates all locales for that group)

### Error Handling
- [ ] Delete failure shows: "Verwijderen mislukt. Probeer opnieuw."
- [ ] Toggle publish failure shows: "Wijziging mislukt. Probeer opnieuw."
- [ ] DB connection failure shows: "Kan artikelen niet laden. Controleer de verbinding."
- [ ] All Server Actions return `{ success: boolean, error?: string }` — errors displayed as toast/banner

### States
- [ ] Loading: skeleton rows while data loads
- [ ] Empty: "Nog geen artikelen. Maak je eerste artikel aan." with link to create form
- [ ] Error: "Kan artikelen niet laden." with retry button

### Accessibility
- [ ] Table has proper `<thead>` / `<tbody>` structure
- [ ] Action buttons have `aria-label` describing the action (e.g., "Verwijder artikel: [titel]")
- [ ] Confirmation dialog uses `role="alertdialog"` and traps focus
- [ ] Status indicators conveyed via text, not color alone

## UI Design

```
┌──────────────────────────────────────────────────────────────┐
│  Nieuwsartikelen                        [+ Nieuw artikel]    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Titel              │ Talen      │ Status │ Datum │     │  │
│  ├────────────────────┼────────────┼────────┼───────┼─────┤  │
│  │ Muurschildering... │ 🇳🇱 🇬🇧 🇸🇦  │  ✅    │ 15/02 │ ⋮  │  │
│  │ Windmolens debat   │ 🇳🇱 🇬🇧     │  ✅    │ 20/01 │ ⋮  │  │
│  │ Buurtbudget 2026   │ 🇳🇱        │  ❌    │ 10/01 │ ⋮  │  │
│  └────────────────────┴────────────┴────────┴───────┴─────┘  │
│                                                              │
│  ⋮ menu = Bewerken | Bekijken | Verwijderen                 │
└──────────────────────────────────────────────────────────────┘
```

## Technical Notes

### Query

```typescript
// Get all articles grouped by groupId, showing Dutch title as primary
SELECT groupId, locale, title, slug, published, createdAt
FROM articles
ORDER BY createdAt DESC
```

Group results by `groupId` in the server component, display Dutch title, collect locale badges.

### Server Actions (`src/app/admin/actions/articles.ts`)

```typescript
async function deleteArticle(groupId: string) {
    try {
        await db.transaction(async (tx) => {
            await tx.delete(articles).where(eq(articles.groupId, groupId))
        })
        revalidatePath('/nl'); revalidatePath('/en'); revalidatePath('/ar')
        return { success: true }
    } catch (error) {
        console.error('Delete article failed:', error)
        return { success: false, error: 'Verwijderen mislukt. Probeer opnieuw.' }
    }
}

async function togglePublish(groupId: string, published: boolean) {
    try {
        await db.update(articles)
            .set({ published, updatedAt: new Date() })
            .where(eq(articles.groupId, groupId))
        revalidatePath('/nl'); revalidatePath('/en'); revalidatePath('/ar')
        return { success: true }
    } catch (error) {
        console.error('Toggle publish failed:', error)
        return { success: false, error: 'Wijziging mislukt. Probeer opnieuw.' }
    }
}
```

### Cache Invalidation

After every write action, revalidate all locale paths:
```typescript
revalidatePath('/nl')
revalidatePath('/en')
revalidatePath('/ar')
```

## Definition of Done

- Article list displays all articles with correct language badges
- Delete removes all translations atomically after confirmation
- Publish toggle works from the list
- All error states handled with Dutch messages
- Accessible table and dialog structure
