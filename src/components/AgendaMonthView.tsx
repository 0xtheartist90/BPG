'use client';

import { useMemo, useState } from 'react';

import type { AgendaEvent } from '@/types/agenda';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getEventDateKey = (event: AgendaEvent) => (event.start ? event.start.slice(0, 10) : null);

type AgendaMonthViewProps = {
    events: AgendaEvent[];
    onDayClick: (events: AgendaEvent[]) => void;
    monthDays: [string, string, string, string, string, string, string];
    previousMonth: string;
    nextMonth: string;
    locale: string;
};

const AgendaMonthView = ({ events, onDayClick, monthDays, previousMonth, nextMonth, locale }: AgendaMonthViewProps) => {
    const currentYear = new Date().getFullYear();
    const [currentMonthIndex, setCurrentMonthIndex] = useState(() => new Date().getMonth());
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

    const year = currentYear;
    const month = currentMonthIndex;
    const todayKey = formatDateKey(new Date());
    const isCurrentMonth = (() => {
        const today = new Date();

        return today.getFullYear() === year && today.getMonth() === month;
    })();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekdayOffset = (firstDayOfMonth.getDay() + 6) % 7; // Monday as first day

    const calendarDays = useMemo(() => {
        const days: Array<Date | null> = [];

        for (let i = 0; i < firstWeekdayOffset; i += 1) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            days.push(new Date(year, month, day));
        }

        while (days.length % 7 !== 0) {
            days.push(null);
        }

        return days;
    }, [firstWeekdayOffset, daysInMonth, month, year]);

    const monthLabel = new Date(year, month, 1).toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric'
    });

    const handleChangeMonth = (delta: number) => {
        setCurrentMonthIndex((prev) => {
            let next = prev + delta;

            if (next > 11) {
                next = 0;
            } else if (next < 0) {
                next = 11;
            }

            return next;
        });
        setSelectedDateKey(null);
    };

    const eventsByDate = useMemo(() => {
        const map = new Map<string, AgendaEvent[]>();

        events.forEach((event) => {
            const key = getEventDateKey(event);
            if (!key) {
                return;
            }

            const list = map.get(key) ?? [];
            list.push(event);
            map.set(key, list);
        });

        return map;
    }, [events]);

    const selectedEvents = useMemo(() => {
        if (!selectedDateKey) {
            return [];
        }

        return eventsByDate.get(selectedDateKey) ?? [];
    }, [selectedDateKey, eventsByDate]);

    return (
        <div className='rounded-3xl border border-[#f3d9ba] bg-white/90 p-6 text-[#43160c] shadow-inner shadow-[#f3d9ba]/30'>
            <div className='flex items-center justify-between text-sm font-semibold text-[#5c1d0c]'>
                <button
                    type='button'
                    onClick={() => handleChangeMonth(-1)}
                    className='inline-flex items-center gap-2 rounded-full border border-[#ff4d00]/30 px-4 py-2 text-[#ff4d00] transition hover:bg-[#ff4d00]/10'>
                    <ChevronLeft className='size-4' />
                    {previousMonth}
                </button>
                <div className='text-base tracking-[0.3em] uppercase'>{monthLabel}</div>
                <button
                    type='button'
                    onClick={() => handleChangeMonth(1)}
                    className='inline-flex items-center gap-2 rounded-full border border-[#ff4d00]/30 px-4 py-2 text-[#ff4d00] transition hover:bg-[#ff4d00]/10'>
                    {nextMonth}
                    <ChevronRight className='size-4' />
                </button>
            </div>

            <div className='mb-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[#b35321] uppercase'>
                {monthDays.map((label) => (
                    <div key={label}>{label}</div>
                ))}
            </div>

            <div className='mt-2 grid grid-cols-7 gap-2 text-xs text-[#5c1d0c]'>
                {calendarDays.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} className='min-h-[90px]' />;
                    }

                    const key = formatDateKey(date);
                    const dayEvents = eventsByDate.get(key) ?? [];
                    const isSelected = selectedDateKey === key;
                    const isToday = isCurrentMonth && key === todayKey;

                    return (
                        <button
                            key={key}
                            type='button'
                            onClick={() => {
                                setSelectedDateKey((prev) => (prev === key ? null : key));
                                if (dayEvents.length) {
                                    onDayClick(dayEvents);
                                }
                            }}
                            className={`min-h-[90px] rounded-xl border border-[#f3d9ba] bg-white/80 p-2 text-left transition hover:-translate-y-0.5 hover:shadow ${
                                isSelected ? 'ring-2 ring-[#ff4d00]' : isToday ? 'border-[#ff4d00] bg-[#ff4d00]/5' : ''
                            }`}>
                            <div className='text-xs font-semibold'>{date.getDate()}</div>
                            {dayEvents.map((event) => (
                                <div
                                    key={`${key}-${event.id}`}
                                    className='mt-1 rounded-md bg-[#ff4d00]/10 px-2 py-1 text-[10px] font-semibold text-[#5c1d0c]'>
                                    {event.title}
                                </div>
                            ))}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AgendaMonthView;
