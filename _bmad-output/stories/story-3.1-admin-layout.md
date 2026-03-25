# Story 3.1: Admin Dashboard & Layout

**Epic**: [Epic 3: Articles Management](../epics/epic-3-articles-admin.md)
**Depends on**: Story 2.1

**As a** site administrator
**I want** a clean admin navigation layout
**So that** I can easily navigate between content sections

## Acceptance Criteria

### Dashboard
- [ ] `/admin` page shows dashboard with card links to "Nieuwsartikelen" and "Agenda"
- [ ] Dashboard shows basic stats: article count, event count (queried from DB)
- [ ] Stats gracefully handle DB errors: show "—" if query fails

### Navigation
- [ ] Admin layout has top nav bar with: "BPG Admin" branding, "Nieuws" link, "Agenda" link, "Uitloggen" button
- [ ] Active nav link is visually highlighted
- [ ] All admin UI labels in Dutch

### Design
- [ ] Layout is responsive (works on tablet/phone — client may use mobile)
- [ ] Uses existing shadcn/ui components: Card, Button, navigation primitives
- [ ] Clean, minimal design — no unnecessary decoration

### Loading & Error States
- [ ] Dashboard shows skeleton/spinner while stats load
- [ ] If DB connection fails, dashboard shows: "Kan gegevens niet laden. Controleer de verbinding."

### Accessibility
- [ ] Nav links have clear focus indicators
- [ ] Keyboard navigable (Tab between nav items)
- [ ] Current page announced to screen readers via `aria-current="page"`

## UI Design

### Admin Nav Bar

```
┌──────────────────────────────────────────────┐
│  BPG Admin     [Nieuws]  [Agenda]  [Uitloggen]│
└──────────────────────────────────────────────┘
```

### Dashboard (`/admin`)

```
┌──────────────────────────────────────────────┐
│                                              │
│  Welkom bij BPG Beheer                       │
│                                              │
│  ┌─────────────────┐  ┌─────────────────┐   │
│  │ Nieuwsartikelen │  │ Agenda          │   │
│  │                 │  │                 │   │
│  │  24 artikelen   │  │  45 evenementen │   │
│  │                 │  │                 │   │
│  │  [Beheren →]    │  │  [Beheren →]    │   │
│  └─────────────────┘  └─────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

## Technical Notes

### File Structure

```
src/app/admin/
    layout.tsx          -- auth check + nav bar (extends Story 2.1)
    page.tsx            -- dashboard with stats cards
```

### Layout Enhancement

Extend the minimal `layout.tsx` from Story 2.1:
- Add nav bar with links using `next/link`
- Use `usePathname()` for active link highlighting (client component for nav only)
- Keep auth check from Story 2.1

## Definition of Done

- `/admin` shows dashboard with article and event counts
- Nav bar visible on all admin pages
- Responsive on mobile
- All text in Dutch
- Graceful error handling for DB failures
