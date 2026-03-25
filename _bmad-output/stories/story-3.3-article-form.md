# Story 3.3: Article Create/Edit Form

**Epic**: [Epic 3: Articles Management](../epics/epic-3-articles-admin.md)
**Depends on**: Story 3.2

**As a** site administrator
**I want** to create and edit articles with language tabs
**So that** I can manage multilingual content in one place

## Acceptance Criteria

### Form Structure
- [ ] `/admin/nieuws/new` shows create form
- [ ] `/admin/nieuws/[groupId]` shows edit form pre-populated with existing data
- [ ] Three language tabs: "Nederlands", "English", "عربي"
- [ ] Each tab has fields: Titel, Slug, Samenvatting (excerpt), Inhoud (content textarea), Afbeelding (image path), Tag
- [ ] Arabic tab renders form fields in RTL direction (`dir="rtl"` on form container)
- [ ] Arabic tab labels also display in RTL alignment
- [ ] Switching tabs preserves unsaved input in React state (no data loss)
- [ ] Empty/untouched tab shows placeholder: "Nog niet vertaald" / "Not yet translated" / "لم تتم الترجمة بعد"

### Slug
- [ ] Slug auto-generated from NL title on create (kebab-case, lowercase, no special chars)
- [ ] Slug editable by admin after auto-generation
- [ ] Slug validation: only `[a-z0-9-]` allowed, min 3 chars, max 200 chars
- [ ] Slug uniqueness checked per locale before save — error: "Deze slug bestaat al"

### Publishing
- [ ] "Gepubliceerd" checkbox applies to all locales for the group
- [ ] NL locale must have at least title and content to publish — error: "Nederlandse titel en inhoud zijn verplicht"

### Save Behavior
- [ ] Save button submits all non-empty locale data in one Server Action call
- [ ] Create: generates new UUID for `groupId`, inserts rows for each filled locale
- [ ] Edit: upserts per locale — creates new row if translation is new, updates if existing
- [ ] After save, redirect to `/admin/nieuws` with success message: "Artikel opgeslagen"
- [ ] All locale rows created/updated in a single transaction

### Optimistic Locking (Edit Only)
- [ ] Form loads current `version` from DB
- [ ] On save, Server Action checks version matches: `UPDATE ... WHERE groupId = ? AND version = ?`
- [ ] If version mismatch: "Dit artikel is bewerkt door iemand anders. Vernieuw de pagina en probeer opnieuw."
- [ ] Version incremented on successful save

### Validation
- [ ] NL title: required, min 3 characters
- [ ] Slug: required, unique per locale, URL-safe characters only
- [ ] Image path: must start with `/images/` or be empty — error: "Ongeldig pad. Gebruik een pad dat begint met /images/"
- [ ] All validation errors shown inline per field in Dutch
- [ ] Form does not submit while validation errors exist

### Error Handling
- [ ] DB save failure: "Opslaan mislukt. Probeer opnieuw."
- [ ] Unique constraint violation (slug): "Deze slug bestaat al. Kies een andere."
- [ ] Network/connection error: "Verbinding mislukt. Controleer je internetverbinding."
- [ ] Server Action returns `{ success: boolean, error?: string }`

### Accessibility
- [ ] All form fields have associated `<label>` elements with `htmlFor`
- [ ] Tab navigation between language tabs via arrow keys
- [ ] Error messages linked to fields via `aria-describedby`
- [ ] Focus moves to first error field after failed validation
- [ ] Save/Cancel buttons keyboard accessible

## UI Design

```
┌───────────────────────────────────────────────────┐
│  Nieuw artikel                                    │
│                                                   │
│  [🇳🇱 Nederlands] [🇬🇧 English] [🇸🇦 عربي]          │
│  ─────────────────────────────────────────────    │
│                                                   │
│  Titel *                                          │
│  ┌─────────────────────────────────────────┐      │
│  │ Muurschildering in Gein                 │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  Slug *                                           │
│  ┌─────────────────────────────────────────┐      │
│  │ muurschildering-in-gein                 │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  Samenvatting                                     │
│  ┌─────────────────────────────────────────┐      │
│  │ Korte beschrijving van het artikel...   │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  Afbeelding pad                                   │
│  ┌─────────────────────────────────────────┐      │
│  │ /images/Infinite%20loop/bpgloop1.png    │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  Tag (optioneel)                                  │
│  ┌─────────────────────────────────────────┐      │
│  │                                         │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  Inhoud *                                         │
│  ┌─────────────────────────────────────────┐      │
│  │ Artikel tekst hier...                   │      │
│  │                                         │      │
│  │ Elk alinea op een nieuwe regel.         │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  ☑ Gepubliceerd                                   │
│                                                   │
│  [Opslaan]  [Annuleren]                           │
└───────────────────────────────────────────────────┘
```

## Technical Notes

### Client Component Structure

```typescript
'use client'
// State: { nl: ArticleFields, en: ArticleFields, ar: ArticleFields }
// Active tab state
// Version number (for edit mode)
// On tab switch: store current tab data in state, show new tab data
// On save: collect all non-empty locales, call Server Action with version
```

### Server Action (`src/app/admin/actions/articles.ts`)

```typescript
async function createArticle(data: {
    published: boolean
    locales: Record<Locale, {
        title: string
        slug: string
        excerpt: string
        content: string   // paragraphs joined with \n\n
        image: string
        tag: string
    } | null>  // null = tab was empty/untouched
}) {
    try {
        const groupId = crypto.randomUUID()
        await db.transaction(async (tx) => {
            for (const [locale, fields] of Object.entries(data.locales)) {
                if (!fields) continue
                await tx.insert(articles).values({
                    groupId, locale, published: data.published,
                    ...fields, version: 1
                })
            }
        })
        revalidatePath('/nl'); revalidatePath('/en'); revalidatePath('/ar')
        return { success: true }
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            return { success: false, error: 'Deze slug bestaat al. Kies een andere.' }
        }
        return { success: false, error: 'Opslaan mislukt. Probeer opnieuw.' }
    }
}

async function updateArticle(groupId: string, expectedVersion: number, data: same) {
    try {
        await db.transaction(async (tx) => {
            // Check version first
            const current = await tx.select({ version: articles.version })
                .from(articles).where(eq(articles.groupId, groupId)).limit(1)
            if (current[0]?.version !== expectedVersion) {
                throw new Error('VERSION_MISMATCH')
            }
            // Upsert per locale...
        })
        revalidatePath('/nl'); revalidatePath('/en'); revalidatePath('/ar')
        return { success: true }
    } catch (error) {
        if (error.message === 'VERSION_MISMATCH') {
            return { success: false, error: 'Dit artikel is bewerkt door iemand anders. Vernieuw de pagina.' }
        }
        // ... other error handling
    }
}
```

### Slug Generation

```typescript
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove diacritics
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')  // trim leading/trailing hyphens
}
```

### Content Encoding

- Admin textarea: user types paragraphs separated by blank lines
- On save: store as-is (newlines preserved in text column)
- Paragraph separator convention: `\n\n` (double newline)
- On read for public display: `content.split('\n\n')` → `string[]`

### XSS Prevention

- All user input stored as plain text in DB
- Rendered via React JSX (auto-escapes HTML)
- No `dangerouslySetInnerHTML` used
- Image paths validated to start with `/images/`

## Definition of Done

- Can create a new article with Dutch content, see it in the list
- Can add English and Arabic translations via tabs
- Can edit existing articles, add new translations
- Slug auto-generates and is editable
- Arabic tab shows RTL layout
- Validation prevents empty/duplicate saves
- Optimistic locking prevents overwrite conflicts
- All errors shown in Dutch
