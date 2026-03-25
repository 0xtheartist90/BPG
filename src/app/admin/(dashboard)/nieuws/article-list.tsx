'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Locale } from '@/lib/i18n';

import { deleteArticle, togglePublish } from '../../actions/articles';

type ArticleGroup = {
    groupId: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: Date;
    locales: Locale[];
    version: number;
};

const FLAG: Record<Locale, string> = { nl: '🇳🇱', en: '🇬🇧', ar: '🇸🇦' };

export function ArticleList({ articles }: { articles: ArticleGroup[] }) {
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    async function handleDelete(groupId: string) {
        setLoading(groupId);
        setError(null);
        const result = await deleteArticle(groupId);
        if (!result.success) {
            setError(result.error ?? 'Verwijderen mislukt.');
        }
        setConfirmDelete(null);
        setLoading(null);
        router.refresh();
    }

    async function handleTogglePublish(groupId: string, current: boolean) {
        setLoading(groupId);
        setError(null);
        const result = await togglePublish(groupId, !current);
        if (!result.success) {
            setError(result.error ?? 'Wijziging mislukt.');
        }
        setLoading(null);
        router.refresh();
    }

    useEffect(() => {
        if (!confirmDelete) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setConfirmDelete(null);
        };
        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, [confirmDelete]);

    if (articles.length === 0) {
        return (
            <div>
                <div className='mb-6 flex items-center justify-between'>
                    <h1 className='text-2xl font-bold text-[#43160c]'>Nieuwsartikelen</h1>
                    <Link
                        href='/admin/nieuws/new'
                        className='rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#e04400] hover:shadow-md'>
                        + Nieuw artikel
                    </Link>
                </div>
                <div className='rounded-2xl border border-[#f3d9ba] bg-white p-10 text-center shadow-sm'>
                    <p className='mb-2 text-[#6c3d20]'>Nog geen artikelen.</p>
                    <Link href='/admin/nieuws/new' className='text-sm font-medium text-[#ff4d00] hover:underline'>
                        Maak je eerste artikel aan
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='mb-6 flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-[#43160c]'>Nieuwsartikelen</h1>
                <Link
                    href='/admin/nieuws/new'
                    className='rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#e04400] hover:shadow-md'>
                    + Nieuw artikel
                </Link>
            </div>

            {error && (
                <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                    <p role='alert' className='text-sm text-red-700'>
                        {error}
                    </p>
                </div>
            )}

            <div className='overflow-hidden rounded-2xl border border-[#f3d9ba] bg-white shadow-sm'>
                <table className='w-full'>
                    <thead className='border-b border-[#f3d9ba] bg-[#faeacd]/50'>
                        <tr>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Titel</th>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Talen</th>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Status</th>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Datum</th>
                            <th className='px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Acties</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-[#f3d9ba]/50'>
                        {articles.map((article) => (
                            <tr key={article.groupId} className='transition-colors hover:bg-[#faeacd]/30'>
                                <td className='max-w-[300px] truncate px-5 py-3.5 text-sm font-medium text-[#43160c]'>
                                    {article.title}
                                </td>
                                <td className='px-5 py-3.5 text-sm'>
                                    <div className='flex gap-1'>
                                        {(['nl', 'en', 'ar'] as Locale[]).map((locale) => (
                                            <span
                                                key={locale}
                                                className={article.locales.includes(locale) ? '' : 'opacity-20'}
                                                title={locale.toUpperCase()}>
                                                {FLAG[locale]}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className='px-5 py-3.5 text-sm'>
                                    <button
                                        onClick={() => handleTogglePublish(article.groupId, article.published)}
                                        disabled={loading === article.groupId}
                                        className='inline-flex items-center gap-1.5 hover:opacity-70 disabled:opacity-50'
                                        aria-label={`${article.published ? 'Depubliceer' : 'Publiceer'} artikel: ${article.title}`}>
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                article.published
                                                    ? 'bg-[#33c17d]/10 text-[#33c17d]'
                                                    : 'bg-[#ff4d00]/10 text-[#d06129]'
                                            }`}>
                                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${article.published ? 'bg-[#33c17d]' : 'bg-[#d06129]'}`} />
                                            {article.published ? 'Gepubliceerd' : 'Concept'}
                                        </span>
                                    </button>
                                </td>
                                <td className='px-5 py-3.5 text-sm text-[#6c3d20]'>
                                    {new Date(article.createdAt).toLocaleDateString('nl-NL', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        timeZone: 'Europe/Amsterdam'
                                    })}
                                </td>
                                <td className='px-5 py-3.5 text-right text-sm'>
                                    <div className='flex items-center justify-end gap-3'>
                                        <Link
                                            href={`/admin/nieuws/${article.groupId}`}
                                            className='text-sm font-medium text-[#d06129] hover:text-[#ff4d00] hover:underline'
                                            aria-label={`Bewerk artikel: ${article.title}`}>
                                            Bewerken
                                        </Link>
                                        <a
                                            href={`/nl/nieuws/${article.slug}`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-sm text-[#6c3d20] hover:text-[#43160c] hover:underline'
                                            aria-label={`Bekijk artikel: ${article.title}`}>
                                            Bekijken
                                        </a>
                                        <button
                                            onClick={() => setConfirmDelete(article.groupId)}
                                            disabled={loading === article.groupId}
                                            className='text-sm text-red-500 hover:text-red-700 hover:underline disabled:opacity-50'
                                            aria-label={`Verwijder artikel: ${article.title}`}>
                                            Verwijderen
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete confirmation dialog */}
            {confirmDelete && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
                    onClick={() => setConfirmDelete(null)}>
                    <div
                        role='alertdialog'
                        aria-labelledby='delete-title'
                        aria-describedby='delete-desc'
                        className='mx-4 max-w-sm rounded-2xl border border-[#f3d9ba] bg-white p-6 shadow-2xl'
                        onClick={(e) => e.stopPropagation()}>
                        <h2 id='delete-title' className='mb-2 text-lg font-semibold text-[#43160c]'>
                            Artikel verwijderen
                        </h2>
                        <p id='delete-desc' className='mb-5 text-sm text-[#6c3d20]'>
                            Weet je het zeker? Dit verwijdert het artikel in alle talen.
                        </p>
                        <div className='flex justify-end gap-2'>
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className='rounded-xl border border-[#f3d9ba] bg-[#faeacd]/50 px-4 py-2 text-sm font-medium text-[#43160c] hover:bg-[#faeacd]'>
                                Annuleren
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                disabled={loading === confirmDelete}
                                className='rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50'>
                                {loading === confirmDelete ? 'Bezig...' : 'Verwijderen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
