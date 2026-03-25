import Image from 'next/image';
import Link from 'next/link';

import { db } from '@/db';
import { agendaEvents, articles } from '@/db/schema';

import { sql } from 'drizzle-orm';

async function getStats() {
    try {
        const [articleResult] = await db
            .select({ count: sql<number>`count(distinct ${articles.groupId})` })
            .from(articles);
        const [eventResult] = await db
            .select({ count: sql<number>`count(distinct ${agendaEvents.groupId})` })
            .from(agendaEvents);

        return {
            articles: Number(articleResult.count),
            events: Number(eventResult.count)
        };
    } catch {
        return null;
    }
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    return (
        <div>
            <div className='mb-8 flex items-center gap-4'>
                <Image
                    src='/images/bpglogo.png'
                    alt='BPG Logo'
                    width={56}
                    height={56}
                    className='rounded-full shadow-md'
                />
                <div>
                    <h1 className='text-2xl font-bold text-[#43160c]'>Welkom bij BPG Beheer</h1>
                    <p className='text-sm text-[#6c3d20]'>Buurt Platform Gein — Beheerpaneel</p>
                </div>
            </div>

            {stats === null && (
                <div className='mb-6 rounded-xl border border-red-200 bg-red-50 p-4'>
                    <p className='text-red-700'>Kan gegevens niet laden. Controleer de verbinding.</p>
                </div>
            )}

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <Link
                    href='/admin/nieuws'
                    className='group relative overflow-hidden rounded-2xl border border-[#f3d9ba] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg'>
                    <div className='absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-[#ff4d00]/10' />
                    <div className='relative'>
                        <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff4d00]/10 text-2xl'>
                            📰
                        </div>
                        <h2 className='mb-1 text-lg font-semibold text-[#43160c]'>Nieuwsartikelen</h2>
                        <p className='mb-4 text-4xl font-bold text-[#ff4d00]'>{stats?.articles ?? '—'}</p>
                        <span className='inline-flex items-center gap-1 text-sm font-medium text-[#d06129] transition-colors group-hover:text-[#ff4d00]'>
                            Beheren <span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
                        </span>
                    </div>
                </Link>
                <Link
                    href='/admin/agenda'
                    className='group relative overflow-hidden rounded-2xl border border-[#f3d9ba] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg'>
                    <div className='absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-[#33c17d]/10' />
                    <div className='relative'>
                        <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#33c17d]/10 text-2xl'>
                            📅
                        </div>
                        <h2 className='mb-1 text-lg font-semibold text-[#43160c]'>Agenda</h2>
                        <p className='mb-4 text-4xl font-bold text-[#33c17d]'>{stats?.events ?? '—'}</p>
                        <span className='inline-flex items-center gap-1 text-sm font-medium text-[#d06129] transition-colors group-hover:text-[#ff4d00]'>
                            Beheren <span className='transition-transform group-hover:translate-x-1'>&rarr;</span>
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
