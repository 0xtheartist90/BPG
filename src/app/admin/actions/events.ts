'use server';

import { db } from '@/db';
import { agendaEvents } from '@/db/schema';
import { eq, and, isNull, asc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addWeeks, addMonths, isBefore, isEqual } from 'date-fns';
import type { Locale } from '@/lib/i18n';

import { requireAuth } from '../lib/session';

/**
 * Create a Date for a given ISO date + HH:MM time in Europe/Amsterdam timezone.
 * Automatically handles CET (+01:00) vs CEST (+02:00).
 */
function toAmsterdamDate(isoDate: string, time: string): Date {
    const timeWithSeconds = time.length === 5 ? `${time}:00` : time;
    // Create a rough UTC date, then determine Amsterdam's UTC offset via Intl
    const rough = new Date(`${isoDate}T${timeWithSeconds}Z`);
    const amParts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Amsterdam',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).formatToParts(rough);
    const get = (t: string) => amParts.find(p => p.type === t)?.value ?? '0';
    // Build Amsterdam local time as UTC, then diff to find offset
    const amLocal = Date.UTC(
        parseInt(get('year')), parseInt(get('month')) - 1, parseInt(get('day')),
        parseInt(get('hour')), parseInt(get('minute')), parseInt(get('second'))
    );
    const offsetMs = amLocal - rough.getTime();
    const offsetHours = Math.round(offsetMs / 3_600_000);
    const offsetStr = `${offsetHours >= 0 ? '+' : '-'}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`;

    return new Date(`${isoDate}T${timeWithSeconds}${offsetStr}`);
}

function revalidateAll() {
    revalidatePath('/nl');
    revalidatePath('/en');
    revalidatePath('/ar');
    revalidatePath('/admin');
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam'
};

const localeDateFormatters: Record<Locale, Intl.DateTimeFormat> = {
    nl: new Intl.DateTimeFormat('nl-NL', dateFormatOptions),
    en: new Intl.DateTimeFormat('en-GB', dateFormatOptions),
    ar: new Intl.DateTimeFormat('ar-SA', dateFormatOptions)
};

function formatDateLabel(date: Date, locale: Locale): string {
    return localeDateFormatters[locale].format(date);
}

// ── List queries ──

export async function getEventGroups() {
    await requireAuth();
    try {
        // Get all top-level events (templates + one-offs) — NL locale as primary
        const nlEvents = await db
            .select()
            .from(agendaEvents)
            .where(and(isNull(agendaEvents.parentEventId), eq(agendaEvents.locale, 'nl')))
            .orderBy(asc(agendaEvents.startDatetime));

        // Get all top-level events for locale info
        const allTopLevel = await db
            .select({
                groupId: agendaEvents.groupId,
                locale: agendaEvents.locale
            })
            .from(agendaEvents)
            .where(isNull(agendaEvents.parentEventId));

        // Get instance counts per groupId
        const instanceCounts = await db
            .select({
                groupId: agendaEvents.groupId,
                count: sql<number>`count(*)::int`
            })
            .from(agendaEvents)
            .where(and(
                sql`${agendaEvents.parentEventId} IS NOT NULL`,
                eq(agendaEvents.locale, 'nl')
            ))
            .groupBy(agendaEvents.groupId);

        const countMap = new Map(instanceCounts.map((r) => [r.groupId, r.count]));

        // Build locale map
        const localeMap = new Map<string, Locale[]>();
        for (const row of allTopLevel) {
            const existing = localeMap.get(row.groupId) ?? [];
            existing.push(row.locale as Locale);
            localeMap.set(row.groupId, existing);
        }

        const data = nlEvents.map((event) => ({
            groupId: event.groupId,
            title: event.title,
            date: event.date,
            startDatetime: event.startDatetime,
            isRecurring: event.isRecurring,
            recurrencePattern: event.recurrencePattern,
            published: event.published,
            locales: localeMap.get(event.groupId) ?? ['nl'],
            instanceCount: countMap.get(event.groupId) ?? 0,
            version: event.version
        }));

        return { success: true as const, data };
    } catch (error) {
        console.error('Failed to load events:', error);

        return { success: false as const, error: 'Kan evenementen niet laden. Controleer de verbinding.' };
    }
}

export async function deleteEvent(groupId: string): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        await db.delete(agendaEvents).where(eq(agendaEvents.groupId, groupId));
        revalidateAll();

        return { success: true };
    } catch (error) {
        console.error('Delete event failed:', error);

        return { success: false, error: 'Verwijderen mislukt. Probeer opnieuw.' };
    }
}

export async function toggleEventPublish(groupId: string, published: boolean): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        await db
            .update(agendaEvents)
            .set({ published, updatedAt: new Date() })
            .where(eq(agendaEvents.groupId, groupId));
        revalidateAll();

        return { success: true };
    } catch (error) {
        console.error('Toggle event publish failed:', error);

        return { success: false, error: 'Wijziging mislukt. Probeer opnieuw.' };
    }
}

// ── Instance management ──

export async function getEventInstances(groupId: string) {
    await requireAuth();
    try {
        // Get the template (NL)
        const [template] = await db
            .select()
            .from(agendaEvents)
            .where(and(
                eq(agendaEvents.groupId, groupId),
                eq(agendaEvents.locale, 'nl'),
                isNull(agendaEvents.parentEventId)
            ))
            .limit(1);

        if (!template) {
            return { success: false as const, error: 'Evenement niet gevonden.' };
        }

        // Get NL instances
        const instances = await db
            .select()
            .from(agendaEvents)
            .where(and(
                eq(agendaEvents.groupId, groupId),
                eq(agendaEvents.locale, 'nl'),
                sql`${agendaEvents.parentEventId} IS NOT NULL`
            ))
            .orderBy(asc(agendaEvents.startDatetime));

        return {
            success: true as const,
            data: {
                template: {
                    title: template.title,
                    groupId: template.groupId,
                    time: template.time
                },
                instances: instances.map((i) => ({
                    id: i.id,
                    groupId: i.groupId,
                    date: i.date,
                    time: i.time,
                    startDatetime: i.startDatetime,
                    published: i.published
                }))
            }
        };
    } catch (error) {
        console.error('Failed to load instances:', error);

        return { success: false as const, error: 'Kan data niet laden. Controleer de verbinding.' };
    }
}

export async function toggleEventInstance(
    groupId: string,
    startDatetime: Date,
    published: boolean
): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        await db
            .update(agendaEvents)
            .set({ published, updatedAt: new Date() })
            .where(and(
                eq(agendaEvents.groupId, groupId),
                eq(agendaEvents.startDatetime, startDatetime)
            ));
        revalidateAll();

        return { success: true };
    } catch (error) {
        console.error('Toggle instance failed:', error);

        return { success: false, error: 'Wijziging mislukt. Probeer opnieuw.' };
    }
}

// ── Create/Edit ──

type EventLocaleData = {
    title: string;
    location: string;
    description: string;
    image: string;
} | null;

export async function getEventByGroupId(groupId: string) {
    await requireAuth();
    try {
        const rows = await db
            .select()
            .from(agendaEvents)
            .where(and(
                eq(agendaEvents.groupId, groupId),
                isNull(agendaEvents.parentEventId)
            ));

        if (rows.length === 0) {
            return { success: false as const, error: 'Evenement niet gevonden.' };
        }

        const locales: Record<string, {
            id: number;
            title: string;
            location: string | null;
            description: string | null;
            image: string | null;
        }> = {};

        // Prefer NL row for shared fields; fall back to first row
        const primary = rows.find(r => r.locale === 'nl') ?? rows[0];
        const version = primary.version;
        const published = primary.published;
        const startDatetime = primary.startDatetime;
        const endDatetime = primary.endDatetime;
        const isRecurring = primary.isRecurring;
        const recurrencePattern = primary.recurrencePattern;
        const recurrenceEndDate = primary.recurrenceEndDate;

        for (const row of rows) {
            locales[row.locale] = {
                id: row.id,
                title: row.title,
                location: row.location,
                description: row.description,
                image: row.image
            };
        }

        return {
            success: true as const,
            data: {
                groupId,
                version,
                published,
                startDatetime,
                endDatetime,
                isRecurring,
                recurrencePattern,
                recurrenceEndDate,
                locales
            }
        };
    } catch (error) {
        console.error('Failed to load event:', error);

        return { success: false as const, error: 'Kan evenement niet laden.' };
    }
}

function expandRecurrence(
    startDate: Date,
    pattern: string,
    endDate: Date
): Date[] {
    const dates: Date[] = [startDate];
    let current = startDate;

    while (dates.length <= 200) {
        if (pattern === 'weekly') current = addWeeks(current, 1);
        else if (pattern === 'biweekly') current = addWeeks(current, 2);
        else if (pattern === 'monthly') current = addMonths(current, 1);
        else break;

        if (isBefore(current, endDate) || isEqual(current, endDate)) {
            dates.push(current);
        } else {
            break;
        }
    }

    return dates;
}

export async function createEvent(data: {
    published: boolean;
    startDate: string;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    recurrencePattern?: string;
    recurrenceEndDate?: string;
    locales: Record<string, EventLocaleData>;
}): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        const groupId = crypto.randomUUID();
        const localeEntries = Object.entries(data.locales).filter(([, v]) => v !== null) as [string, NonNullable<EventLocaleData>][];

        if (localeEntries.length === 0) {
            return { success: false, error: 'Voeg minstens één taal toe.' };
        }

        const startDt = toAmsterdamDate(data.startDate, data.startTime);
        const endDt = data.endTime ? toAmsterdamDate(data.startDate, data.endTime) : null;

        if (data.isRecurring && data.recurrencePattern && data.recurrenceEndDate) {
            const recEndDate = toAmsterdamDate(data.recurrenceEndDate, '23:59');
            const dates = expandRecurrence(startDt, data.recurrencePattern, recEndDate);

            if (dates.length > 200) {
                return { success: false, error: 'Maximaal 200 herhalingen. Kies een kortere periode.' };
            }

            // Insert template rows
            const templateIds: Record<string, number> = {};
            for (const [locale, fields] of localeEntries) {
                const [result] = await db.insert(agendaEvents).values({
                    groupId,
                    locale,
                    title: fields.title,
                    date: formatDateLabel(startDt, locale as Locale),
                    time: `${data.startTime}${data.endTime ? ` - ${data.endTime}` : ''}`,
                    startDatetime: startDt,
                    endDatetime: endDt,
                    location: fields.location || null,
                    description: fields.description || null,
                    image: fields.image || null,
                    published: data.published,
                    isRecurring: true,
                    recurrencePattern: data.recurrencePattern!,
                    recurrenceEndDate: data.recurrenceEndDate!,
                    parentEventId: null,
                    version: 1
                }).returning({ id: agendaEvents.id });
                templateIds[locale] = result.id;
            }

            // Insert instance rows in batch (skip first date — it's the template)
            const instanceRows = dates.slice(1).flatMap((instanceDate) => {
                const instanceEnd = endDt
                    ? new Date(instanceDate.getTime() + (endDt.getTime() - startDt.getTime()))
                    : null;

                return localeEntries.map(([locale, fields]) => ({
                    groupId,
                    locale,
                    title: fields.title,
                    date: formatDateLabel(instanceDate, locale as Locale),
                    time: `${data.startTime}${data.endTime ? ` - ${data.endTime}` : ''}`,
                    startDatetime: instanceDate,
                    endDatetime: instanceEnd,
                    location: fields.location || null,
                    description: fields.description || null,
                    image: fields.image || null,
                    published: data.published,
                    isRecurring: false,
                    parentEventId: templateIds[locale],
                    version: 1
                }));
            });

            if (instanceRows.length > 0) {
                await db.insert(agendaEvents).values(instanceRows);
            }
        } else {
            // One-off event
            for (const [locale, fields] of localeEntries) {
                await db.insert(agendaEvents).values({
                    groupId,
                    locale,
                    title: fields.title,
                    date: formatDateLabel(startDt, locale as Locale),
                    time: `${data.startTime}${data.endTime ? ` - ${data.endTime}` : ''}`,
                    startDatetime: startDt,
                    endDatetime: endDt,
                    location: fields.location || null,
                    description: fields.description || null,
                    image: fields.image || null,
                    published: data.published,
                    isRecurring: false,
                    parentEventId: null,
                    version: 1
                });
            }
        }

        revalidateAll();

        return { success: true };
    } catch (error) {
        console.error('Create event failed:', error);

        return { success: false, error: 'Opslaan mislukt. Probeer opnieuw.' };
    }
}

export async function updateEvent(
    groupId: string,
    expectedVersion: number,
    data: {
        published: boolean;
        startDate: string;
        startTime: string;
        endTime: string;
        locales: Record<string, EventLocaleData>;
    }
): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        const current = await db
            .select({ version: agendaEvents.version })
            .from(agendaEvents)
            .where(eq(agendaEvents.groupId, groupId))
            .limit(1);

        if (current.length === 0) {
            return { success: false, error: 'Evenement niet gevonden.' };
        }

        if (current[0].version !== expectedVersion) {
            return { success: false, error: 'Dit evenement is bewerkt door iemand anders. Vernieuw de pagina.' };
        }

        const newVersion = expectedVersion + 1;
        const startDt = toAmsterdamDate(data.startDate, data.startTime);
        const endDt = data.endTime ? toAmsterdamDate(data.startDate, data.endTime) : null;

        for (const [locale, fields] of Object.entries(data.locales)) {
            if (!fields) {
                await db.delete(agendaEvents).where(
                    and(eq(agendaEvents.groupId, groupId), eq(agendaEvents.locale, locale), isNull(agendaEvents.parentEventId))
                );
                continue;
            }

            const updated = await db
                .update(agendaEvents)
                .set({
                    title: fields.title,
                    date: formatDateLabel(startDt, locale as Locale),
                    time: `${data.startTime}${data.endTime ? ` - ${data.endTime}` : ''}`,
                    startDatetime: startDt,
                    endDatetime: endDt,
                    location: fields.location || null,
                    description: fields.description || null,
                    image: fields.image || null,
                    published: data.published,
                    version: newVersion,
                    updatedAt: new Date()
                })
                .where(and(
                    eq(agendaEvents.groupId, groupId),
                    eq(agendaEvents.locale, locale),
                    isNull(agendaEvents.parentEventId)
                ))
                .returning({ id: agendaEvents.id });

            if (updated.length === 0) {
                // New locale
                await db.insert(agendaEvents).values({
                    groupId,
                    locale,
                    title: fields.title,
                    date: formatDateLabel(startDt, locale as Locale),
                    time: `${data.startTime}${data.endTime ? ` - ${data.endTime}` : ''}`,
                    startDatetime: startDt,
                    endDatetime: endDt,
                    location: fields.location || null,
                    description: fields.description || null,
                    image: fields.image || null,
                    published: data.published,
                    isRecurring: false,
                    parentEventId: null,
                    version: newVersion
                });
            }
        }

        // Update version on all rows for this group
        await db
            .update(agendaEvents)
            .set({ version: newVersion, updatedAt: new Date() })
            .where(eq(agendaEvents.groupId, groupId));

        revalidateAll();

        return { success: true };
    } catch (error) {
        console.error('Update event failed:', error);

        return { success: false, error: 'Opslaan mislukt. Probeer opnieuw.' };
    }
}
