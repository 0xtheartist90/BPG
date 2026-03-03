'use client';

import { useMemo, useState } from 'react';

import type { AgendaEvent } from '@/types/agenda';

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

const AgendaWeekView = ({
    events,
    onDayClick,
    calendarLabels,
    locale
}: {
    events: AgendaEvent[];
    onDayClick: (events: AgendaEvent[]) => void;
    calendarLabels: {
        weekDays: [string, string, string, string, string, string, string];
        previousWeek: string;
        nextWeek: string;
        noEvents: string;
    };
    locale: string;
}) => {
    const [weekOffset, setWeekOffset] = useState(0);

    const currentWeekStart = useMemo(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = day === 0 ? -6 : 1 - day; // Monday-first
        const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + diff);
        monday.setHours(0, 0, 0, 0);

        return monday;
    }, []);

    const startOfWeek = useMemo(() => {
        const start = new Date(currentWeekStart);
        start.setDate(currentWeekStart.getDate() + weekOffset * 7);

        return start;
    }, [currentWeekStart, weekOffset]);

    const todayKey = useMemo(() => formatDateKey(new Date()), []);

    const weekDays = useMemo(() => {
        return calendarLabels.weekDays.map((label, idx) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + idx);

            return { label, date };
        });
    }, [startOfWeek, calendarLabels.weekDays]);

    const weekRangeLabel = useMemo(() => {
        const end = new Date(startOfWeek);
        end.setDate(startOfWeek.getDate() + 6);
        const formatter: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };

        return `${startOfWeek.toLocaleDateString(locale, formatter)} – ${end.toLocaleDateString(locale, formatter)}`;
    }, [startOfWeek, locale]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, AgendaEvent[]>();
        events.forEach((event) => {
            if (!event.start) {
                return;
            }
            const key = event.start.slice(0, 10);
            const list = map.get(key) ?? [];
            list.push(event);
            map.set(key, list);
        });

        return map;
    }, [events]);

    const splitTitleSegments = (title: string) => {
        if (title.includes(' ')) {
            return title.split(/\s+/).slice(0, 3);
        }

        const lower = title.toLowerCase();
        const breakPoints = ['expressie', 'beweging', 'activiteiten'];
        for (const fragment of breakPoints) {
            const idx = lower.indexOf(fragment);
            if (idx > 0) {
                return [title.slice(0, idx), title.slice(idx)];
            }
        }

        if (title.length > 12) {
            const midpoint = Math.ceil(title.length / 2);

            return [title.slice(0, midpoint), title.slice(midpoint)];
        }

        return [title];
    };

    return (
        <div className='rounded-3xl border border-[#f3d9ba] bg-white/95 p-4 text-[#43160c] shadow-inner shadow-[#f3d9ba]/30'>
            <div className='mb-4 flex items-center justify-between text-xs font-semibold text-[#5c1d0c] uppercase'>
                <button
                    type='button'
                    onClick={() => setWeekOffset((prev) => prev - 1)}
                    className='rounded-full border border-[#f3d9ba] px-3 py-1 text-[#b35321] shadow-sm'>
                    {calendarLabels.previousWeek}
                </button>
                <span className='text-sm font-black tracking-wide text-[#43160c]'>{weekRangeLabel}</span>
                <button
                    type='button'
                    onClick={() => setWeekOffset((prev) => prev + 1)}
                    className='rounded-full border border-[#f3d9ba] px-3 py-1 text-[#b35321] shadow-sm'>
                    {calendarLabels.nextWeek}
                </button>
            </div>
            <div className='grid grid-cols-3 gap-3'>
                {weekDays.map(({ label, date }, idx) => {
                    const key = formatDateKey(date);
                    const dayEvents = eventsByDate.get(key) ?? [];
                    const isSunday = idx === 6;
                    const isToday = key === todayKey;
                    return (
                        <button
                            key={key}
                            type='button'
                            onClick={() => dayEvents.length && onDayClick(dayEvents)}
                            className={`flex min-h-[130px] flex-col justify-between rounded-2xl border border-[#f3d9ba] p-3 text-left shadow-sm transition ${
                                dayEvents.length ? 'bg-[#fff3e6]' : 'bg-white/80'
                            } ${isSunday ? 'col-span-3' : ''} ${isToday ? 'ring-2 ring-[#ff4d00]' : ''}`}
                            aria-disabled={!dayEvents.length}>
                            <div>
                                <div className='text-xs font-semibold tracking-[0.35em] text-[#b35321] uppercase'>
                                    {label}
                                </div>
                                <div className={`text-2xl font-bold ${isToday ? 'text-[#ff4d00]' : 'text-[#5c1d0c]'}`}>
                                    {String(date.getDate()).padStart(2, '0')}
                                </div>
                                <div className='text-xs text-[#5c1d0c]/70'>
                                    {date.toLocaleDateString(locale, { month: 'short' })}
                                </div>
                            </div>
                            <div className='mt-2 space-y-1 text-[11px] font-semibold text-[#5c1d0c] uppercase'>
                                {dayEvents.length ? (
                                    dayEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className='rounded-md bg-[#ff4d00]/15 px-2 py-1 text-[10px] text-[#5c1d0c]'>
                                            {splitTitleSegments(event.title).map((segment, segmentIdx) => (
                                                <span key={`${event.id}-${segmentIdx}`} className='block leading-tight'>
                                                    {segment}
                                                </span>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-[10px] font-medium text-[#5c1d0c]/60 uppercase'>
                                        {calendarLabels.noEvents}
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AgendaWeekView;
