# Epic 2: Admin Authentication

> Simple password-based admin gate protecting all `/admin` routes.

## Context

The client (a small neighborhood team, not developers) needs access to manage content. A simple shared password is sufficient — no user accounts, roles, or OAuth needed for v1.

## Technical Decisions

- **Auth method**: Single shared password via `ADMIN_PASSWORD` env var
- **Session**: Secure httpOnly cookie (`admin-session`, 24h expiry)
- **Scope**: Only `/admin/*` routes are protected; `/api` routes remain open

## Stories

1. [Story 2.1: Admin Login & Session](../stories/story-2.1-admin-auth.md)

## Dependencies

- Epic 1 (database connection must work for admin to be useful)

## Definition of Done

- `/admin/login` page accepts password, sets session cookie
- All `/admin/*` routes redirect to login if unauthenticated
- Logout clears session
