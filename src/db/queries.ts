import { db } from '@/db';
import { articles, agendaEvents } from '@/db/schema';
import { eq, and, asc, desc, sql, gte, inArray } from 'drizzle-orm';
import type { Locale } from '@/lib/i18n';
import { locales } from '@/lib/i18n';
import type { AgendaEvent } from '@/types/agenda';

// ── Types ──

export type NewsItem = {
    slug: string;
    title: string;
    excerpt: string;
    content: string[];
    tag?: string;
    date?: string;
    image: string;
};

// ── Mapping helpers ──

const dateFormatter = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam'
});

function mapToNewsItem(row: typeof articles.$inferSelect): NewsItem {
    return {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt ?? '',
        content: row.content ? row.content.split('\n\n') : [],
        image: row.image ?? '',
        tag: row.tag ?? undefined,
        date: dateFormatter.format(row.createdAt)
    };
}

function mapToAgendaEvent(row: typeof agendaEvents.$inferSelect): AgendaEvent {
    return {
        id: String(row.id),
        date: row.date,
        time: row.time,
        title: row.title,
        location: row.location ?? '',
        description: row.description ?? '',
        image: row.image ?? '',
        start: row.startDatetime?.toISOString(),
        end: row.endDatetime?.toISOString()
    };
}

// ── Locale validation ──

function validLocale(locale: string): Locale {
    return locales.includes(locale as Locale) ? (locale as Locale) : 'nl';
}

// ── Public article queries ──

export async function getPublishedArticles(locale: Locale, limit = 50): Promise<NewsItem[]> {
    try {
        const safeLocale = validLocale(locale);

        if (safeLocale === 'nl') {
            const rows = await db
                .select()
                .from(articles)
                .where(and(eq(articles.locale, 'nl'), eq(articles.published, true)))
                .orderBy(desc(articles.createdAt))
                .limit(limit);

            return rows.map(mapToNewsItem);
        }

        // Single query with locale fallback via DISTINCT ON
        const rows = await db.execute(sql`
            SELECT DISTINCT ON (a."group_id") a.*
            FROM articles a
            WHERE a.published = true
                AND a.locale IN (${safeLocale}, 'nl')
            ORDER BY a."group_id",
                CASE WHEN a.locale = ${safeLocale} THEN 0 ELSE 1 END,
                a."created_at" DESC
        `);

        return (rows as unknown as (typeof articles.$inferSelect)[])
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit)
            .map(mapToNewsItem);
    } catch (error) {
        console.error('getPublishedArticles failed:', error);

        return [];
    }
}

export async function getArticleBySlug(slug: string, locale: Locale): Promise<NewsItem | null> {
    try {
        const safeLocale = validLocale(locale);

        const rows = await db
            .select()
            .from(articles)
            .where(and(
                eq(articles.slug, slug),
                eq(articles.published, true),
                inArray(articles.locale, [safeLocale, 'nl'])
            ))
            .orderBy(sql`CASE WHEN ${articles.locale} = ${safeLocale} THEN 0 ELSE 1 END`)
            .limit(1);

        return rows[0] ? mapToNewsItem(rows[0]) : null;
    } catch (error) {
        console.error('getArticleBySlug failed:', error);

        return null;
    }
}

// ── Public event queries ──

export async function getUpcomingEvents(locale: Locale, limit = 100): Promise<AgendaEvent[]> {
    try {
        const safeLocale = validLocale(locale);
        const now = new Date();

        if (safeLocale === 'nl') {
            const rows = await db
                .select()
                .from(agendaEvents)
                .where(and(
                    eq(agendaEvents.locale, 'nl'),
                    eq(agendaEvents.published, true),
                    gte(agendaEvents.startDatetime, now)
                ))
                .orderBy(asc(agendaEvents.startDatetime))
                .limit(limit);

            return rows.map(mapToAgendaEvent);
        }

        // Single query with locale fallback
        const rows = await db.execute(sql`
            SELECT DISTINCT ON (a."group_id", a."start_datetime") a.*
            FROM agenda_events a
            WHERE a.published = true
                AND a."start_datetime" >= NOW()
                AND a.locale IN (${safeLocale}, 'nl')
            ORDER BY a."group_id", a."start_datetime",
                CASE WHEN a.locale = ${safeLocale} THEN 0 ELSE 1 END
        `);

        return (rows as unknown as (typeof agendaEvents.$inferSelect)[])
            .sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime())
            .slice(0, limit)
            .map(mapToAgendaEvent);
    } catch (error) {
        console.error('getUpcomingEvents failed:', error);

        return [];
    }
}

export async function getAllPublishedEvents(locale: Locale): Promise<AgendaEvent[]> {
    try {
        const safeLocale = validLocale(locale);

        if (safeLocale === 'nl') {
            const rows = await db
                .select()
                .from(agendaEvents)
                .where(and(
                    eq(agendaEvents.locale, 'nl'),
                    eq(agendaEvents.published, true)
                ))
                .orderBy(asc(agendaEvents.startDatetime));

            return rows.map(mapToAgendaEvent);
        }

        const rows = await db.execute(sql`
            SELECT DISTINCT ON (a."group_id", a."start_datetime") a.*
            FROM agenda_events a
            WHERE a.published = true
                AND a.locale IN (${safeLocale}, 'nl')
            ORDER BY a."group_id", a."start_datetime",
                CASE WHEN a.locale = ${safeLocale} THEN 0 ELSE 1 END
        `);

        return (rows as unknown as (typeof agendaEvents.$inferSelect)[])
            .sort((a, b) => new Date(a.startDatetime).getTime() - new Date(b.startDatetime).getTime())
            .map(mapToAgendaEvent);
    } catch (error) {
        console.error('getAllPublishedEvents failed:', error);

        return [];
    }
}
