# Story 4.2: Event Create/Edit Form

**Epic**: [Epic 4: Agenda Events Management](../epics/epic-4-events-admin.md)
**Depends on**: Story 4.1

**As a** site administrator
**I want** to create and edit events with optional recurrence
**So that** I can manage one-off and recurring events without manual date entry

## Acceptance Criteria

### Form Structure
- [ ] `/admin/agenda/new` shows create form
- [ ] `/admin/agenda/[groupId]` shows edit form pre-populated
- [ ] Three language tabs: "Nederlands", "English", "عربي"
- [ ] Per-locale fields (in tabs): Titel, Locatie, Omschrijving (textarea), Afbeelding pad
- [ ] Shared fields (outside tabs): Date picker, Start time, End time
- [ ] Arabic tab renders form in RTL direction (`dir="rtl"` on container); labels align right
- [ ] Tab switching preserves unsaved input

### Recurrence
- [ ] "Herhalend evenement" checkbox toggles recurrence section visibility
- [ ] Recurrence section: Pattern dropdown ("Wekelijks" / "Tweewekelijks" / "Maandelijks"), End date picker
- [ ] End date must be after start date — error: "Einddatum moet na de startdatum liggen"
- [ ] Live preview count: "X evenementen worden aangemaakt van [start] t/m [eind]"
- [ ] Maximum 200 instances per recurring event — error: "Maximaal 200 herhalingen. Kies een kortere periode."

### Save Behavior
- [ ] Save with recurrence OFF: creates single event per filled locale
- [ ] Save with recurrence ON: creates template row + expanded instance rows per filled locale
- [ ] **All rows created in a single transaction** — if any instance fails, entire operation rolls back
- [ ] Instance date/time display strings generated per locale using `Intl.DateTimeFormat`
- [ ] After save, redirect to event list with success message

### Timezone & Date Handling
- [ ] All `startDatetime`/`endDatetime` stored as UTC in database
- [ ] Admin sees times in Europe/Amsterdam timezone (hardcoded for this site)
- [ ] DST transitions handled correctly: recurring event at 13:30 local time stays at 13:30 local time after DST change
- [ ] Date expansion uses `date-fns` or similar library for reliable date math (not naive `setDate +7`)

### Optimistic Locking (Edit Only)
- [ ] Form loads current `version` from DB
- [ ] On save, version checked: mismatch → "Dit evenement is bewerkt door iemand anders. Vernieuw de pagina."
- [ ] Version incremented on successful save

### Edit Recurring Template
- [ ] When editing recurring template, show scope choice: "Alleen dit sjabloon wijzigen" / "Alle toekomstige evenementen bijwerken"
- [ ] "Alle toekomstige evenementen": update template, delete future instances, regenerate — preserve cancelled status of existing instances
- [ ] Scope choice wrapped in transaction

### Validation
- [ ] NL title: required, min 3 characters
- [ ] Date: required
- [ ] Start time: required, format HH:mm
- [ ] End time: optional, must be after start time if provided
- [ ] Image path: must start with `/images/` or be empty
- [ ] All validation errors shown inline in Dutch

### Error Handling
- [ ] DB save failure: "Opslaan mislukt. Probeer opnieuw."
- [ ] Transaction rollback on partial expansion: user sees "Opslaan mislukt" (not partial data)
- [ ] Network error: "Verbinding mislukt. Controleer je internetverbinding."
- [ ] Server Action returns `{ success: boolean, error?: string }`

### Accessibility
- [ ] All form fields have associated `<label>` elements with `htmlFor`
- [ ] Language tabs navigable via arrow keys
- [ ] Error messages linked to fields via `aria-describedby`
- [ ] Recurrence section announced to screen readers when toggled (aria-expanded)
- [ ] Date/time pickers keyboard accessible

## UI Design

```
┌───────────────────────────────────────────────────┐
│  Nieuw evenement                                  │
│                                                   │
│  [🇳🇱 Nederlands] [🇬🇧 English] [🇸🇦 عربي]          │
│  ─────────────────────────────────────────────    │
│                                                   │
│  Titel *         [Kunst in Gein              ]    │
│  Locatie         [Buurthuis Gein             ]    │
│  Omschrijving    [__________________________ ]    │
│  Afbeelding pad  [/images/kunst.png          ]    │
│                                                   │
│  ─── Datum en tijd ───────────────────────────    │
│                                                   │
│  Datum *         Start *        Eind              │
│  [2026-03-11 📅] [13:30]        [16:00]           │
│                                                   │
│  ☑ Herhalend evenement                            │
│  ┌─────────────────────────────────────────┐      │
│  │ Patroon:    [Wekelijks           ▾]     │      │
│  │ Tot en met: [2026-12-31          📅]    │      │
│  │                                         │      │
│  │ ℹ 42 evenementen worden aangemaakt      │      │
│  │   van 11 mrt 2026 t/m 30 dec 2026      │      │
│  └─────────────────────────────────────────┘      │
│                                                   │
│  ☑ Gepubliceerd                                   │
│                                                   │
│  [Opslaan]  [Annuleren]                           │
└───────────────────────────────────────────────────┘
```

### Edit Recurring — Scope Choice

```
┌─────────────────────────────────────────────┐
│ ⚠ Dit is een herhalend evenement met 38     │
│   toekomstige afspraken.                    │
│                                             │
│   Wijzigingen toepassen op:                 │
│   ○ Alleen dit sjabloon                     │
│   ● Alle toekomstige evenementen            │
└─────────────────────────────────────────────┘
```

## Technical Notes

### Recurrence Expansion

```typescript
import { addWeeks, addMonths, isBefore, isEqual } from 'date-fns'

function expandRecurrence(
    startDate: Date,
    pattern: 'weekly' | 'biweekly' | 'monthly',
    endDate: Date
): Date[] {
    const dates: Date[] = [startDate]
    let current = startDate

    while (true) {
        if (pattern === 'weekly') current = addWeeks(current, 1)
        else if (pattern === 'biweekly') current = addWeeks(current, 2)
        else if (pattern === 'monthly') current = addMonths(current, 1)

        if (isBefore(current, endDate) || isEqual(current, endDate)) {
            dates.push(current)
        } else break

        if (dates.length > 200) break  // safety limit
    }
    return dates
}
```

Using `date-fns` ensures DST-safe date math (e.g., `addWeeks` preserves local time).

### Date Display String Generation

```typescript
const formatters = {
    nl: new Intl.DateTimeFormat('nl-NL', {
        weekday: 'short', day: 'numeric', month: 'short',
        timeZone: 'Europe/Amsterdam'
    }),
    en: new Intl.DateTimeFormat('en-GB', {
        weekday: 'short', day: 'numeric', month: 'short',
        timeZone: 'Europe/Amsterdam'
    }),
    ar: new Intl.DateTimeFormat('ar-SA', {
        weekday: 'short', day: 'numeric', month: 'short',
        timeZone: 'Europe/Amsterdam'
    })
}
```

### Edit "All Future" Logic

```typescript
await db.transaction(async (tx) => {
    // 1. Get cancelled instance dates
    const cancelled = await tx.select({ startDatetime: agendaEvents.startDatetime })
        .from(agendaEvents)
        .where(and(
            eq(agendaEvents.parentEventId, templateId),
            eq(agendaEvents.published, false)
        ))
    const cancelledDates = new Set(cancelled.map(c => c.startDatetime.toISOString()))

    // 2. Delete future instances
    await tx.delete(agendaEvents).where(and(
        eq(agendaEvents.parentEventId, templateId),
        gte(agendaEvents.startDatetime, new Date())
    ))

    // 3. Update template
    await tx.update(agendaEvents).set({ ...newData, version: sql`version + 1` })
        .where(eq(agendaEvents.id, templateId))

    // 4. Regenerate future instances, re-apply cancelled status
    for (const date of expandedDates) {
        const wasCancelled = cancelledDates.has(date.toISOString())
        await tx.insert(agendaEvents).values({
            ...instanceData, startDatetime: date, published: !wasCancelled
        })
    }
})
```

## Definition of Done

- Can create one-off events with language tabs
- Can create recurring events with auto-expansion in single transaction
- Preview count updates live
- Edit recurring template with scope choice works
- Cancelled instances preserved when regenerating
- DST-safe date math
- All errors handled in Dutch
- Accessible forms
