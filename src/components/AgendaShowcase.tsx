'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarPlus, X } from 'lucide-react';

type AgendaEvent = {
    date: string;
    time: string;
    title: string;
    location: string;
    description: string;
    image: string;
    start: string; // ISO string with timezone
    end: string; // ISO string with timezone
};

const formatICSDate = (isoString: string) => {
    const date = new Date(isoString);

    return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}Z$/, 'Z');
};

const buildICalendarFile = (event: AgendaEvent) => {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Buurtplatform Gein//Agenda//NL',
        'BEGIN:VEVENT',
        `SUMMARY:${event.title}`,
        `DTSTART:${formatICSDate(event.start)}`,
        `DTEND:${formatICSDate(event.end)}`,
        `LOCATION:${event.location}`,
        `DESCRIPTION:${event.description}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ];


    return lines.join('\n');
};

const buildGoogleCalUrl = (event: AgendaEvent) => {
    const base = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        details: event.description,
        location: event.location,
        dates: `${formatICSDate(event.start)}/${formatICSDate(event.end)}`
    });

    return `${base}?${params.toString()}`;
};

const buildOutlookUrl = (event: AgendaEvent, host: string) => {
    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        startdt: event.start,
        enddt: event.end,
        subject: event.title,
        body: event.description,
        location: event.location
    });

    return `${host}?${params.toString()}`;
};

const AgendaShowcase = ({ events }: { events: AgendaEvent[] }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [selectedCalendar, setSelectedCalendar] = useState('google');
    const activeEvent = useMemo(() => (activeIndex === null ? null : events[activeIndex]), [activeIndex, events]);

    useEffect(() => {
        setSelectedCalendar('google');
    }, [activeEvent]);

    const outlookLiveUrl = activeEvent ? buildOutlookUrl(activeEvent, 'https://outlook.live.com/calendar/0/deeplink/compose') : '';
    const outlook365Url = activeEvent ? buildOutlookUrl(activeEvent, 'https://outlook.office.com/calendar/0/deeplink/compose') : '';

    const handleCalendarAction = () => {
        if (!activeEvent) return;

        switch (selectedCalendar) {
            case 'google':
                window.open(buildGoogleCalUrl(activeEvent), '_blank');
                break;
            case 'ical': {
                const icsContent = buildICalendarFile(activeEvent);
                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${activeEvent.title}.ics`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 500);
                break;
            }
            case 'outlook365':
                window.open(outlook365Url, '_blank');
                break;
            case 'outlooklive':
                window.open(outlookLiveUrl, '_blank');
                break;
            default:
                break;
        }
    };

    return (
        <div className='mt-8 grid gap-4 lg:grid-cols-2'>
            {events.map((event, index) => (
                <article
                    key={event.title}
                    className='rounded-2xl border border-white/20 p-5 text-white shadow-sm shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-white/30'
                    style={{ backgroundColor: 'rgba(13, 94, 52, 0.65)' }}
                    onClick={() => setActiveIndex(index)}>
                    <div className='text-xs font-semibold uppercase tracking-[0.3em] text-white/70'>
                        {event.date} • {event.time}
                    </div>
                    <h3 className='mt-2 text-2xl font-bold'>{event.title}</h3>
                    <p className='text-sm text-white/80'>{event.location}</p>
                    <p className='mt-3 text-white/90'>{event.description}</p>
                    <button
                        type='button'
                        className='mt-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white'
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveIndex(index);
                        }}>
                        <CalendarPlus className='size-4' /> Meer info
                    </button>
                </article>
            ))}

            {activeEvent && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8'>
                    <div className='relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white text-[#43160c] shadow-2xl'>
                        <button
                            type='button'
                            onClick={() => setActiveIndex(null)}
                            className='absolute right-4 top-4 z-20 rounded-full border border-[#d06129]/30 bg-white/80 p-1 text-[#d06129] backdrop-blur hover:bg-[#d06129]/10'>
                            <X className='size-5' />
                        </button>
                        <div className='relative h-64 w-full overflow-hidden bg-[#43160c]/5 sm:h-80'>
                            <Image src={activeEvent.image} alt={activeEvent.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 60vw' />
                        </div>
                        <div className='space-y-4 p-8'>
                            <div className='text-xs font-semibold uppercase tracking-[0.3em] text-[#d06129]'>
                                {activeEvent.date} • {activeEvent.time}
                            </div>
                            <h3 className='text-3xl font-black'>{activeEvent.title}</h3>
                            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-[#d06129]'>{activeEvent.location}</p>
                            <p className='text-base text-[#43160c]/90'>{activeEvent.description}</p>
                            <div className='mt-6 space-y-3'>
                                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[#d06129]'>Voeg toe aan kalender</p>
                                <div className='flex flex-wrap gap-3 text-sm font-semibold'>
                                    <select
                                        value={selectedCalendar}
                                        onChange={(e) => setSelectedCalendar(e.target.value)}
                                        className='rounded-full border border-[#d06129] bg-transparent px-4 py-2 text-[#d06129] focus:border-[#43160c] focus:outline-none'>
                                        <option value='google'>Google Calendar</option>
                                        <option value='ical'>iCal (.ics download)</option>
                                        <option value='outlook365'>Outlook 365</option>
                                        <option value='outlooklive'>Outlook Live</option>
                                    </select>
                                    <button
                                        type='button'
                                        onClick={handleCalendarAction}
                                        className='rounded-full border border-[#d06129] px-4 py-2 text-[#d06129] transition hover:bg-[#d06129] hover:text-white'>
                                        Open link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaShowcase;
