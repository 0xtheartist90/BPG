'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { toggleEventInstance } from '../../../../actions/events';

type Instance = {
    id: number;
    groupId: string;
    date: string;
    time: string;
    startDatetime: Date;
    published: boolean;
};

type Template = {
    title: string;
    groupId: string;
    time: string;
};

export function InstanceList({ template, instances }: { template: Template; instances: Instance[] }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<number | null>(null);

    const now = new Date();
    const activeCount = instances.filter((i) => i.published).length;
    const cancelledCount = instances.length - activeCount;

    async function handleToggle(instance: Instance) {
        setLoading(instance.id);
        setError(null);
        const result = await toggleEventInstance(instance.groupId, new Date(instance.startDatetime), !instance.published);
        if (!result.success) {
            setError(result.error ?? 'Wijziging mislukt.');
        }
        setLoading(null);
        router.refresh();
    }

    return (
        <div>
            <Link href='/admin/agenda' className='mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#d06129] hover:text-[#ff4d00] hover:underline'>
                ← Terug naar agenda
            </Link>

            <h1 className='mb-1 text-2xl font-bold text-[#43160c]'>{template.title} — Data beheren</h1>
            <p className='mb-6 text-sm text-[#6c3d20]'>
                {instances.length} evenementen | {activeCount} actief | {cancelledCount} geannuleerd
            </p>

            {cancelledCount === instances.length && instances.length > 0 && (
                <div className='mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3'>
                    <p className='text-sm text-yellow-700'>Alle afspraken zijn geannuleerd</p>
                </div>
            )}

            {error && (
                <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                    <p role='alert' className='text-sm text-red-700'>
                        {error}
                    </p>
                </div>
            )}

            {instances.length === 0 ? (
                <div className='rounded-2xl border border-[#f3d9ba] bg-white p-10 text-center shadow-sm'>
                    <p className='text-[#6c3d20]'>Geen afspraken gevonden</p>
                </div>
            ) : (
                <div className='overflow-hidden rounded-2xl border border-[#f3d9ba] bg-white shadow-sm'>
                    <table className='w-full'>
                        <thead className='border-b border-[#f3d9ba] bg-[#faeacd]/50'>
                            <tr>
                                <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Datum</th>
                                <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Tijd</th>
                                <th className='px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Status</th>
                                <th className='px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#6c3d20]'>Actie</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-[#f3d9ba]/50'>
                            {instances.map((instance) => {
                                const isPast = new Date(instance.startDatetime) < now;

                                return (
                                    <tr
                                        key={instance.id}
                                        className={`${isPast ? 'opacity-40' : 'transition-colors hover:bg-[#faeacd]/30'} ${!instance.published ? 'bg-red-50/30' : ''}`}>
                                        <td
                                            className={`px-5 py-3.5 text-sm font-medium text-[#43160c] ${!instance.published ? 'line-through' : ''}`}>
                                            {instance.date}
                                        </td>
                                        <td className='px-5 py-3.5 text-sm text-[#6c3d20]'>{instance.time}</td>
                                        <td className='px-5 py-3.5 text-sm'>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    instance.published
                                                        ? 'bg-[#33c17d]/10 text-[#33c17d]'
                                                        : 'bg-red-100 text-red-600'
                                                }`}>
                                                <span className={`inline-block h-1.5 w-1.5 rounded-full ${instance.published ? 'bg-[#33c17d]' : 'bg-red-500'}`} />
                                                {instance.published ? 'Actief' : 'Geannuleerd'}
                                            </span>
                                        </td>
                                        <td className='px-5 py-3.5 text-right text-sm'>
                                            {!isPast && (
                                                <button
                                                    onClick={() => handleToggle(instance)}
                                                    disabled={loading === instance.id}
                                                    className={`text-sm font-medium hover:underline disabled:opacity-50 ${
                                                        instance.published ? 'text-red-500 hover:text-red-700' : 'text-[#33c17d] hover:text-[#2aa36a]'
                                                    }`}
                                                    aria-label={`${instance.published ? 'Annuleer' : 'Herstel'} ${instance.date}`}>
                                                    {loading === instance.id
                                                        ? 'Bezig...'
                                                        : instance.published
                                                          ? 'Annuleren'
                                                          : 'Herstellen'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
