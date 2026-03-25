# Story 4.1: Event List Page

**Epic**: [Epic 4: Agenda Events Management](../epics/epic-4-events-admin.md)
**Depends on**: Story 3.1 (admin layout)

**As a** site administrator
**I want** to see all events in a table
**So that** I can manage the agenda

## Acceptance Criteria

### Display
- [ ] `/admin/agenda` displays events — only templates and one-offs (NOT individual recurring instances)
- [ ] Query filter: `WHERE parentEventId IS NULL` (top-level events only)
- [ ] Table columns: Evenement, Datum, Herhalend, Talen, Gepubliceerd, Acties
- [ ] Recurring column shows: 🔁 pattern + instance count (e.g., "🔁 Wekelijks (38)") or "—" for one-offs
- [ ] Language badges: 🇳🇱 🇬🇧 🇸🇦 showing which translations exist
- [ ] Sorted by `startDatetime` ascending (upcoming first)
- [ ] Past events shown with visual distinction (greyed out or separate section)

### Actions
- [ ] "Nieuw evenement" button navigates to `/admin/agenda/new`
- [ ] "Bewerken" action navigates to `/admin/agenda/[groupId]`
- [ ] "Data beheren" action (recurring only) navigates to `/admin/agenda/[groupId]/dates`
- [ ] "Verwijderen" shows confirmation ("Dit verwijdert het evenement en alle herhalingen in alle talen."), then deletes template + all instances + all locales
- [ ] Delete executes atomically in a transaction
- [ ] Publish toggle available directly in list (updates all locales + all instances)

### Error Handling
- [ ] Delete failure: "Verwijderen mislukt. Probeer opnieuw."
- [ ] Toggle failure: "Wijziging mislukt. Probeer opnieuw."
- [ ] DB connection failure: "Kan evenementen niet laden. Controleer de verbinding."
- [ ] All Server Actions return `{ success: boolean, error?: string }`

### States
- [ ] Loading: skeleton rows while data loads
- [ ] Empty: "Nog geen evenementen. Maak je eerste evenement aan."
- [ ] Error: "Kan evenementen niet laden." with retry button

### Accessibility
- [ ] Table has proper `<thead>` / `<tbody>` structure
- [ ] Action buttons have descriptive `aria-label` (e.g., "Verwijder evenement: [titel]")
- [ ] "Data beheren" only visible for recurring events (hidden, not just disabled)
- [ ] Confirmation dialog uses `role="alertdialog"` and traps focus
- [ ] Status conveyed via text + icon, not color alone

## Technical Notes

### Query

```typescript
// Get top-level events (templates + one-offs) with instance counts
const events = await db.select().from(agendaEvents)
    .where(and(isNull(agendaEvents.parentEventId), eq(agendaEvents.locale, 'nl')))
    .orderBy(asc(agendaEvents.startDatetime))

// For each event, get instance count and locale list
```

### Server Actions (`src/app/admin/actions/events.ts`)

```typescript
async function deleteEvent(groupId: string) {
    try {
        await db.transaction(async (tx) => {
            await tx.delete(agendaEvents).where(eq(agendaEvents.groupId, groupId))
        })
        revalidatePath('/nl'); revalidatePath('/en'); revalidatePath('/ar')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Verwijderen mislukt. Probeer opnieuw.' }
    }
}
```

### Cache Invalidation

After every write: `revalidatePath('/nl')`, `revalidatePath('/en')`, `revalidatePath('/ar')`

## Definition of Done

- Event list shows templates and one-offs with correct instance counts
- Recurring events show pattern badge
- Delete removes everything atomically
- "Data beheren" only visible for recurring events
- All errors handled with Dutch messages
- Accessible and keyboard navigable
