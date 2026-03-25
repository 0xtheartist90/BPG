# Story 4.3: Recurring Event Instance Management

**Epic**: [Epic 4: Agenda Events Management](../epics/epic-4-events-admin.md)
**Depends on**: Story 4.2

**As a** site administrator
**I want** to cancel or restore individual dates of a recurring event
**So that** I can handle holidays and exceptions without deleting the whole series

## Acceptance Criteria

### Display
- [ ] `/admin/agenda/[groupId]/dates` shows list of all instances for a recurring template
- [ ] Table columns: Datum, Tijd, Status (Actief / Geannuleerd), Actie
- [ ] Header shows template title and summary: "38 evenementen | 36 actief | 2 geannuleerd"
- [ ] Cancelled instances visually distinct (greyed out with strikethrough or red "Geannuleerd" badge)
- [ ] Past instances shown but greyed out with no action buttons
- [ ] Back link to event list (`/admin/agenda`)

### Actions
- [ ] "Annuleren" button sets `published = false` for that instance across ALL locales
- [ ] "Herstellen" button sets `published = true` for that instance across ALL locales
- [ ] Toggle is instant (no confirmation needed — low risk, easily reversible)
- [ ] After toggle, counts in header update

### Error Handling
- [ ] Toggle failure: "Wijziging mislukt. Probeer opnieuw."
- [ ] DB connection failure: "Kan data niet laden. Controleer de verbinding."
- [ ] If template has no instances: "Geen afspraken gevonden"
- [ ] If all instances cancelled: warning banner "Alle afspraken zijn geannuleerd"
- [ ] Server Actions return `{ success: boolean, error?: string }`

### Cache Invalidation
- [ ] After toggle: `revalidatePath('/nl')`, `revalidatePath('/en')`, `revalidatePath('/ar')`

### Accessibility
- [ ] Table has proper semantic structure
- [ ] Action buttons have `aria-label`: "Annuleer [datum]" / "Herstel [datum]"
- [ ] Status conveyed via text, not color alone
- [ ] Focus remains on the toggled row after action (no jump to top)

## UI Design

```
┌──────────────────────────────────────────────────────────┐
│  ← Terug naar agenda                                    │
│                                                          │
│  Kunst in Gein — Data beheren                           │
│  38 evenementen | 36 actief | 2 geannuleerd             │
│                                                          │
│  ┌──────────────────┬──────────────┬───────────┬───────┐ │
│  │ Datum            │ Tijd         │ Status    │ Actie │ │
│  ├──────────────────┼──────────────┼───────────┼───────┤ │
│  │ wo 11 mrt 2026   │ 13:30-16:00 │ ✅ Actief │ [Ann.]│ │
│  │ wo 18 mrt 2026   │ 13:30-16:00 │ ✅ Actief │ [Ann.]│ │
│  │ wo 25 mrt 2026   │ 13:30-16:00 │ ❌ Geann. │[Herst]│ │
│  │ wo 1 apr 2026    │ 13:30-16:00 │ ✅ Actief │ [Ann.]│ │
│  └──────────────────┴──────────────┴───────────┴───────┘ │
└──────────────────────────────────────────────────────────┘
```

## Technical Notes

### Query

```typescript
const instances = await db.select()
    .from(agendaEvents)
    .where(and(
        eq(agendaEvents.parentEventId, templateId),
        eq(agendaEvents.locale, 'nl')
    ))
    .orderBy(asc(agendaEvents.startDatetime))
```

### Server Action

```typescript
async function toggleEventInstance(
    groupId: string,
    startDatetime: Date,
    published: boolean
) {
    try {
        await db.update(agendaEvents)
            .set({ published, updatedAt: new Date() })
            .where(and(
                eq(agendaEvents.groupId, groupId),
                eq(agendaEvents.startDatetime, startDatetime)
            ))
        // This updates ALL locale rows for this specific instance
        revalidatePath('/nl'); revalidatePath('/en'); revalidatePath('/ar')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Wijziging mislukt. Probeer opnieuw.' }
    }
}
```

Toggle by `groupId + startDatetime` ensures all locale variants toggled together.

## Definition of Done

- Instance list shows all dates for a recurring template
- Can cancel/restore individual dates (all locales toggled)
- Status counts update correctly
- Past dates shown but not actionable
- All errors handled in Dutch
- Focus management preserves position after toggle
