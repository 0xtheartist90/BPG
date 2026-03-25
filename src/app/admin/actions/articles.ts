'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { articles } from '@/db/schema';
import type { Locale } from '@/lib/i18n';

import { and, desc, eq } from 'drizzle-orm';

import { requireAuth } from '../lib/session';

function revalidateAll() {
    revalidatePath('/nl');
    revalidatePath('/en');
    revalidatePath('/ar');
    revalidatePath('/nl/nieuws', 'page');
    revalidatePath('/en/nieuws', 'page');
    revalidatePath('/ar/nieuws', 'page');
    revalidatePath('/admin');
}

export async function getArticleGroups() {
    await requireAuth();
    try {
        const rows = await db.select().from(articles).orderBy(desc(articles.createdAt));

        const groups = new Map<
            string,
            {
                groupId: string;
                title: string;
                slug: string;
                published: boolean;
                createdAt: Date;
                locales: Locale[];
                version: number;
            }
        >();

        for (const row of rows) {
            const existing = groups.get(row.groupId);
            if (existing) {
                existing.locales.push(row.locale as Locale);
            } else {
                groups.set(row.groupId, {
                    groupId: row.groupId,
                    title: row.title,
                    slug: row.slug,
                    published: row.published,
                    createdAt: row.createdAt,
                    locales: [row.locale as Locale],
                    version: row.version
                });
            }
        }

        // Ensure NL title is used as primary
        for (const row of rows) {
            if (row.locale === 'nl') {
                const group = groups.get(row.groupId);
                if (group) {
                    group.title = row.title;
                    group.slug = row.slug;
                }
            }
        }

        return { success: true as const, data: Array.from(groups.values()) };
    } catch (error) {
        console.error('Failed to load articles:', error);

        return { success: false as const, error: 'Kan artikelen niet laden. Controleer de verbinding.' };
    }
}

export async function deleteArticle(groupId: string): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        await db.delete(articles).where(eq(articles.groupId, groupId));
        revalidateAll();

        return { success: true };
    } catch (error) {
        console.error('Delete article failed:', error);

        return { success: false, error: 'Verwijderen mislukt. Probeer opnieuw.' };
    }
}

export async function togglePublish(
    groupId: string,
    published: boolean
): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        await db.update(articles).set({ published, updatedAt: new Date() }).where(eq(articles.groupId, groupId));
        revalidateAll();

        return { success: true };
    } catch (error) {
        console.error('Toggle publish failed:', error);

        return { success: false, error: 'Wijziging mislukt. Probeer opnieuw.' };
    }
}

type ArticleLocaleData = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    tag: string;
} | null;

export async function createArticle(data: {
    published: boolean;
    locales: Record<string, ArticleLocaleData>;
}): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        const groupId = crypto.randomUUID();
        const entries = Object.entries(data.locales).filter(([, v]) => v !== null) as [
            string,
            NonNullable<ArticleLocaleData>
        ][];

        if (entries.length === 0) {
            return { success: false, error: 'Voeg minstens één taal toe.' };
        }

        for (const [locale, fields] of entries) {
            await db.insert(articles).values({
                groupId,
                locale,
                published: data.published,
                title: fields.title,
                slug: fields.slug,
                excerpt: fields.excerpt || null,
                content: fields.content || null,
                image: fields.image || null,
                tag: fields.tag || null,
                version: 1
            });
        }

        revalidateAll();

        return { success: true };
    } catch (error: unknown) {
        console.error('Create article failed:', error);
        if (error instanceof Error && error.message.includes('unique')) {
            return { success: false, error: 'Deze slug bestaat al. Kies een andere.' };
        }

        return { success: false, error: 'Opslaan mislukt. Probeer opnieuw.' };
    }
}

export async function getArticleByGroupId(groupId: string) {
    await requireAuth();
    try {
        const rows = await db.select().from(articles).where(eq(articles.groupId, groupId));

        if (rows.length === 0) return { success: false as const, error: 'Artikel niet gevonden.' };

        const locales: Record<
            string,
            {
                id: number;
                title: string;
                slug: string;
                excerpt: string | null;
                content: string | null;
                image: string | null;
                tag: string | null;
            }
        > = {};

        const primary = rows.find(r => r.locale === 'nl') ?? rows[0];
        const version = primary.version;
        const published = primary.published;

        for (const row of rows) {
            locales[row.locale] = {
                id: row.id,
                title: row.title,
                slug: row.slug,
                excerpt: row.excerpt,
                content: row.content,
                image: row.image,
                tag: row.tag
            };
        }

        return { success: true as const, data: { groupId, version, published, locales } };
    } catch (error) {
        console.error('Failed to load article:', error);

        return { success: false as const, error: 'Kan artikel niet laden.' };
    }
}

export async function updateArticle(
    groupId: string,
    expectedVersion: number,
    data: {
        published: boolean;
        locales: Record<string, ArticleLocaleData>;
    }
): Promise<{ success: boolean; error?: string }> {
    await requireAuth();
    try {
        // Check version
        const current = await db
            .select({ version: articles.version })
            .from(articles)
            .where(eq(articles.groupId, groupId))
            .limit(1);

        if (current.length === 0) {
            return { success: false, error: 'Artikel niet gevonden.' };
        }

        if (current[0].version !== expectedVersion) {
            return {
                success: false,
                error: 'Dit artikel is bewerkt door iemand anders. Vernieuw de pagina en probeer opnieuw.'
            };
        }

        const newVersion = expectedVersion + 1;
        const entries = Object.entries(data.locales);

        for (const [locale, fields] of entries) {
            if (!fields) {
                // Remove locale if it was cleared
                await db.delete(articles).where(and(eq(articles.groupId, groupId), eq(articles.locale, locale)));
                continue;
            }

            // Try update first, then insert if no rows affected
            const updated = await db
                .update(articles)
                .set({
                    title: fields.title,
                    slug: fields.slug,
                    excerpt: fields.excerpt || null,
                    content: fields.content || null,
                    image: fields.image || null,
                    tag: fields.tag || null,
                    published: data.published,
                    version: newVersion,
                    updatedAt: new Date()
                })
                .where(and(eq(articles.groupId, groupId), eq(articles.locale, locale)))
                .returning({ id: articles.id });

            if (updated.length === 0) {
                // New locale translation
                await db.insert(articles).values({
                    groupId,
                    locale,
                    title: fields.title,
                    slug: fields.slug,
                    excerpt: fields.excerpt || null,
                    content: fields.content || null,
                    image: fields.image || null,
                    tag: fields.tag || null,
                    published: data.published,
                    version: newVersion
                });
            }
        }

        // Update version on all remaining rows
        await db
            .update(articles)
            .set({ version: newVersion, updatedAt: new Date() })
            .where(eq(articles.groupId, groupId));

        revalidateAll();

        return { success: true };
    } catch (error: unknown) {
        console.error('Update article failed:', error);
        if (error instanceof Error && error.message.includes('unique')) {
            return { success: false, error: 'Deze slug bestaat al. Kies een andere.' };
        }

        return { success: false, error: 'Opslaan mislukt. Probeer opnieuw.' };
    }
}
