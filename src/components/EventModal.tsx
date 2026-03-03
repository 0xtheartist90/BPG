'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import type { AgendaEvent } from '@/types/agenda';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type EventModalProps = {
    events: AgendaEvent[];
    activeIndex: number;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
    eventModal: {
        addToCalendar: string;
        openLink: string;
    };
};

const formatICSDate = (isoString: string) => {
    const date = new Date(isoString);

    return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}Z$/, 'Z');
};

const buildICalendarFile = (event: AgendaEvent) => {
    if (!event.start || !event.end) {
        return '';
    }

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
    if (!event.start || !event.end) {
        return '';
    }

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
    if (!event.start || !event.end) {
        return '';
    }

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

const EventModal = ({ events, activeIndex, onNext, onPrev, onClose, eventModal }: EventModalProps) => {
    const [selectedCalendar, setSelectedCalendar] = useState('google');

    const activeEvent = useMemo(() => events[activeIndex], [events, activeIndex]);

    useEffect(() => {
        setSelectedCalendar('google');
    }, [activeEvent]);

    if (!activeEvent) {
        return null;
    }

    const outlookLiveUrl = useMemo(
        () => buildOutlookUrl(activeEvent, 'https://outlook.live.com/calendar/0/deeplink/compose'),
        [activeEvent]
    );
    const outlook365Url = useMemo(
        () => buildOutlookUrl(activeEvent, 'https://outlook.office.com/calendar/0/deeplink/compose'),
        [activeEvent]
    );

    const handleCalendarAction = useCallback(() => {
        if (!activeEvent.start || !activeEvent.end) {
            return;
        }

        switch (selectedCalendar) {
            case 'google': {
                const url = buildGoogleCalUrl(activeEvent);
                if (url) {
                    window.open(url, '_blank');
                }
                break;
            }
            case 'ical': {
                const icsContent = buildICalendarFile(activeEvent);
                if (!icsContent) {
                    break;
                }
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
                if (outlook365Url) {
                    window.open(outlook365Url, '_blank');
                }
                break;
            case 'outlooklive':
                if (outlookLiveUrl) {
                    window.open(outlookLiveUrl, '_blank');
                }
                break;
            default:
                break;
        }
    }, [activeEvent, outlook365Url, outlookLiveUrl, selectedCalendar]);

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8'>
            <div className='relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white text-[#43160c] shadow-2xl'>
                <button
                    type='button'
                    onClick={onClose}
                    className='absolute top-4 right-4 z-20 rounded-full border border-[#d06129]/30 bg-white/80 p-1 text-[#d06129] backdrop-blur hover:bg-[#d06129]/10'>
                    <X className='size-5' />
                </button>
                {events.length > 1 && (
                    <div className='absolute top-1/2 left-4 z-20 -translate-y-1/2'>
                        <button
                            type='button'
                            onClick={onPrev}
                            className='rounded-full bg-white/80 p-2 text-[#d06129] shadow hover:bg-white'>
                            <ChevronLeft className='size-5' />
                        </button>
                    </div>
                )}
                {events.length > 1 && (
                    <div className='absolute top-1/2 right-4 z-20 -translate-y-1/2'>
                        <button
                            type='button'
                            onClick={onNext}
                            className='rounded-full bg-white/80 p-2 text-[#d06129] shadow hover:bg-white'>
                            <ChevronRight className='size-5' />
                        </button>
                    </div>
                )}
                <div className='relative h-64 w-full overflow-hidden bg-[#43160c]/5 sm:h-80'>
                    <Image
                        src={activeEvent.image}
                        alt={activeEvent.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, 60vw'
                    />
                </div>
                <div className='space-y-4 p-8'>
                    <div className='text-xs font-semibold tracking-[0.3em] text-[#d06129] uppercase'>
                        {activeEvent.date} • {activeEvent.time}
                    </div>
                    <h3 className='text-3xl font-black'>{activeEvent.title}</h3>
                    <p className='text-sm font-semibold tracking-[0.2em] text-[#d06129] uppercase'>
                        {activeEvent.location}
                    </p>
                    <p className='text-base text-[#43160c]/90'>{activeEvent.description}</p>
                    <div className='mt-6 space-y-3'>
                        <p className='text-xs font-semibold tracking-[0.3em] text-[#d06129] uppercase'>
                            {eventModal.addToCalendar}
                        </p>
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
                                {eventModal.openLink}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
