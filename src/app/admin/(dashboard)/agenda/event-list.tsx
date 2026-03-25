'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Locale } from '@/lib/i18n';

import { deleteEvent, toggleEventPublish } from '../../actions/events';

const PATTERN_LABELS: Record<string, string> = {
    weekly: 'Wekelijks',
    biweekly: 'Tweewekelijks',
    monthly: 'Maandelijks'
};

const FLAG: Record<Locale, string> = { nl: '🇳🇱', en: '🇬🇧', ar: '🇸🇦' };

type EventGroup = {
    groupId: string;
    title: string;
    date: string;
    startDatetime: Date;
    isRecurring: boolean;
    recurrencePattern: string | null;
    published: boolean;
    locales: Locale[];
    instanceCount: number;
    version: number;
};

export function EventList({ events }: { events: EventGroup[] }) {
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);

    const now = new Date();

    useEffect(() => {
        if (!confirmDelete) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setConfirmDelete(null);
        };
        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, [confirmDelete]);

    async function handleDelete(groupId: string) {
        setLoading(groupId);
        setError(null);
        const result = await deleteEvent(groupId);
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
        const result = await toggleEventPublish(groupId, !current);
        if (!result.success) {
            setError(result.error ?? 'Wijziging mislukt.');
        }
        setLoading(null);
        router.refresh();
    }

    if (events.length === 0) {
        return (
            <div>
                <div className='mb-6 flex items-center justify-between'>
                    <h1 className='text-2xl font-bold text-[#43160c]'>Agenda</h1>
                    <Link
                        href='/admin/agenda/new'
                        className='rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#e04400] hover:shadow-md'>
                        + Nieuw evenement
                    </Link>
                </div>
                <div className='rounded-2xl border border-[#f3d9ba] bg-white p-10 text-center shadow-sm'>
                    <p className='mb-2 text-[#6c3d20]'>Nog geen evenementen.</p>
                    <Link href='/admin/agenda/new' className='text-sm font-medium text-[#ff4d00] hover:underline'>
                        Maak je eerste evenement aan
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='mb-6 flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-[#43160c]'>Agenda</h1>
                <Link
                    href='/admin/agenda/new'
                    className='rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#e04400] hover:shadow-md'>
                    + Nieuw evenement
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
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Evenement</th>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Datum</th>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Herhalend</th>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Talen</th>
                            <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Status</th>
                            <th className='px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Acties</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-[#f3d9ba]/50'>
                        {events.map((event) => {
                            const isPast = new Date(event.startDatetime) < now;

                            return (
                                <tr key={event.groupId} className={`transition-colors hover:bg-[#faeacd]/30 ${isPast ? 'opacity-50' : ''}`}>
                                    <td className='max-w-[250px] truncate px-5 py-3.5 text-sm font-medium text-[#43160c]'>
                                        {event.title}
                                    </td>
                                    <td className='px-5 py-3.5 text-sm text-[#6c3d20]'>{event.date}</td>
                                    <td className='px-5 py-3.5 text-sm'>
                                        {event.isRecurring ? (
                                            <span className='inline-flex items-center gap-1 rounded-full bg-[#33c17d]/10 px-2.5 py-0.5 text-xs font-medium text-[#33c17d]'>
                                                🔁 {PATTERN_LABELS[event.recurrencePattern ?? ''] ?? event.recurrencePattern} (
                                                {event.instanceCount})
                                            </span>
                                        ) : (
                                            <span className='text-[#d9c4ad]'>—</span>
                                        )}
                                    </td>
                                    <td className='px-5 py-3.5 text-sm'>
                                        <div className='flex gap-1'>
                                            {(['nl', 'en', 'ar'] as Locale[]).map((locale) => (
                                                <span
                                                    key={locale}
                                                    className={event.locales.includes(locale) ? '' : 'opacity-20'}
                                                    title={locale.toUpperCase()}>
                                                    {FLAG[locale]}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className='px-5 py-3.5 text-sm'>
                                        <button
                                            onClick={() => handleTogglePublish(event.groupId, event.published)}
                                            disabled={loading === event.groupId}
                                            className='inline-flex items-center gap-1.5 hover:opacity-70 disabled:opacity-50'
                                            aria-label={`${event.published ? 'Depubliceer' : 'Publiceer'} evenement: ${event.title}`}>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    event.published
                                                        ? 'bg-[#33c17d]/10 text-[#33c17d]'
                                                        : 'bg-[#ff4d00]/10 text-[#d06129]'
                                                }`}>
                                                <span className={`inline-block h-1.5 w-1.5 rounded-full ${event.published ? 'bg-[#33c17d]' : 'bg-[#d06129]'}`} />
                                                {event.published ? 'Actief' : 'Concept'}
                                            </span>
                                        </button>
                                    </td>
                                    <td className='px-5 py-3.5 text-right text-sm'>
                                        <div className='flex items-center justify-end gap-3'>
                                            <Link
                                                href={`/admin/agenda/${event.groupId}`}
                                                className='text-sm font-medium text-[#d06129] hover:text-[#ff4d00] hover:underline'
                                                aria-label={`Bewerk evenement: ${event.title}`}>
                                                Bewerken
                                            </Link>
                                            {event.isRecurring && (
                                                <Link
                                                    href={`/admin/agenda/${event.groupId}/dates`}
                                                    className='text-sm font-medium text-[#33c17d] hover:underline'
                                                    aria-label={`Beheer data van: ${event.title}`}>
                                                    Data
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => setConfirmDelete(event.groupId)}
                                                disabled={loading === event.groupId}
                                                className='text-sm text-red-500 hover:text-red-700 hover:underline disabled:opacity-50'
                                                aria-label={`Verwijder evenement: ${event.title}`}>
                                                Verwijderen
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {confirmDelete && (
                <div
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
                    onClick={() => setConfirmDelete(null)}>
                    <div
                        role='alertdialog'
                        aria-labelledby='delete-event-title'
                        aria-describedby='delete-event-desc'
                        className='mx-4 max-w-sm rounded-2xl border border-[#f3d9ba] bg-white p-6 shadow-2xl'
                        onClick={(e) => e.stopPropagation()}>
                        <h2 id='delete-event-title' className='mb-2 text-lg font-semibold text-[#43160c]'>
                            Evenement verwijderen
                        </h2>
                        <p id='delete-event-desc' className='mb-5 text-sm text-[#6c3d20]'>
                            Dit verwijdert het evenement en alle herhalingen in alle talen.
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
