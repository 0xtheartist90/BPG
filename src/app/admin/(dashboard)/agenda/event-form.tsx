'use client';

import { useState, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { addWeeks, addMonths, isBefore, isEqual } from 'date-fns';

import { createEvent, updateEvent } from '../../actions/events';
import { ImageUpload } from '../../components/image-upload';

type LocaleFields = {
    title: string;
    location: string;
    description: string;
    image: string;
};

type EventData = {
    groupId: string;
    version: number;
    published: boolean;
    startDatetime: Date;
    endDatetime: Date | null;
    isRecurring: boolean;
    recurrencePattern: string | null;
    recurrenceEndDate: string | null;
    locales: Record<
        string,
        {
            id: number;
            title: string;
            location: string | null;
            description: string | null;
            image: string | null;
        }
    >;
};

const LOCALES = [
    { key: 'nl', label: '🇳🇱 Nederlands' },
    { key: 'en', label: '🇬🇧 English' },
    { key: 'ar', label: '🇸🇦 عربي' }
] as const;

const emptyFields = (): LocaleFields => ({
    title: '',
    location: '',
    description: '',
    image: ''
});

function isLocaleEmpty(fields: LocaleFields): boolean {
    return !fields.title.trim();
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' });
}

function formatDate(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Amsterdam',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date); // en-CA outputs YYYY-MM-DD

    return parts;
}

function countRecurrences(startDate: string, pattern: string, endDate: string): number {
    if (!startDate || !pattern || !endDate) return 0;
    const start = new Date(`${startDate}T12:00:00`);
    const end = new Date(`${endDate}T23:59:59`);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 0;

    let count = 1;
    let current = start;

    while (count <= 200) {
        if (pattern === 'weekly') current = addWeeks(current, 1);
        else if (pattern === 'biweekly') current = addWeeks(current, 2);
        else if (pattern === 'monthly') current = addMonths(current, 1);
        else break;

        if (isBefore(current, end) || isEqual(current, end)) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

export function EventForm({ event }: { event?: EventData }) {
    const router = useRouter();
    const isEdit = !!event;

    const [activeTab, setActiveTab] = useState<string>('nl');
    const [published, setPublished] = useState(event?.published ?? true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [startDate, setStartDate] = useState(event ? formatDate(new Date(event.startDatetime)) : '');
    const [startTime, setStartTime] = useState(event ? formatTime(new Date(event.startDatetime)) : '');
    const [endTime, setEndTime] = useState(event?.endDatetime ? formatTime(new Date(event.endDatetime)) : '');

    const [isRecurring, setIsRecurring] = useState(event?.isRecurring ?? false);
    const [recurrencePattern, setRecurrencePattern] = useState(event?.recurrencePattern ?? 'weekly');
    const [recurrenceEndDate, setRecurrenceEndDate] = useState(event?.recurrenceEndDate ?? '');

    const [localeData, setLocaleData] = useState<Record<string, LocaleFields>>(() => {
        const data: Record<string, LocaleFields> = {};
        for (const { key } of LOCALES) {
            const existing = event?.locales[key];
            data[key] = existing
                ? {
                      title: existing.title,
                      location: existing.location ?? '',
                      description: existing.description ?? '',
                      image: existing.image ?? ''
                  }
                : emptyFields();
        }

        return data;
    });

    const recurrenceCount = useMemo(
        () => (isRecurring ? countRecurrences(startDate, recurrencePattern, recurrenceEndDate) : 0),
        [isRecurring, startDate, recurrencePattern, recurrenceEndDate]
    );

    function updateField(locale: string, field: keyof LocaleFields, value: string) {
        setLocaleData((prev) => ({
            ...prev,
            [locale]: { ...prev[locale], [field]: value }
        }));
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[`${locale}.${field}`];

            return next;
        });
    }

    function validate(): boolean {
        const errors: Record<string, string> = {};
        const nl = localeData.nl;

        if (!nl.title.trim() || nl.title.trim().length < 3) {
            errors['nl.title'] = 'Nederlandse titel is verplicht (min. 3 tekens)';
        }
        if (!startDate) errors['startDate'] = 'Datum is verplicht';
        if (!startTime) errors['startTime'] = 'Starttijd is verplicht';
        if (endTime && startTime && endTime <= startTime) {
            errors['endTime'] = 'Eindtijd moet na starttijd liggen';
        }

        if (isRecurring) {
            if (!recurrenceEndDate) errors['recurrenceEndDate'] = 'Einddatum is verplicht';
            if (recurrenceEndDate && startDate && recurrenceEndDate <= startDate) {
                errors['recurrenceEndDate'] = 'Einddatum moet na de startdatum liggen';
            }
            if (recurrenceCount > 200) {
                errors['recurrenceEndDate'] = 'Maximaal 200 herhalingen. Kies een kortere periode.';
            }
        }

        for (const { key } of LOCALES) {
            const fields = localeData[key];
            if (isLocaleEmpty(fields)) continue;
            if (fields.image && !fields.image.startsWith('/images/') && !fields.image.startsWith('http')) {
                errors[`${key}.image`] = 'Upload een afbeelding of gebruik een pad dat begint met /images/';
            }
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    async function handleSave() {
        if (!validate()) return;

        setSaving(true);
        setError(null);

        const locales: Record<string, LocaleFields | null> = {};
        for (const { key } of LOCALES) {
            locales[key] = isLocaleEmpty(localeData[key]) ? null : localeData[key];
        }

        let result: { success: boolean; error?: string };

        if (isEdit && event) {
            result = await updateEvent(event.groupId, event.version, {
                published,
                startDate,
                startTime,
                endTime,
                locales
            });
        } else {
            result = await createEvent({
                published,
                startDate,
                startTime,
                endTime,
                isRecurring,
                recurrencePattern: isRecurring ? recurrencePattern : undefined,
                recurrenceEndDate: isRecurring ? recurrenceEndDate : undefined,
                locales
            });
        }

        if (result.success) {
            router.push('/admin/agenda');
        } else {
            setError(result.error ?? 'Opslaan mislukt. Probeer opnieuw.');
            setSaving(false);
        }
    }

    const current = localeData[activeTab];
    const isRtl = activeTab === 'ar';

    return (
        <div>
            <h1 className='mb-6 text-2xl font-bold text-[#43160c]'>{isEdit ? 'Evenement bewerken' : 'Nieuw evenement'}</h1>

            {error && (
                <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                    <p role='alert' className='text-sm text-red-700'>
                        {error}
                    </p>
                </div>
            )}

            {/* Language tabs */}
            <div className='mb-6 flex gap-1 rounded-xl bg-[#faeacd]/60 p-1'>
                {LOCALES.map(({ key, label }) => {
                    const hasContent = !isLocaleEmpty(localeData[key]);

                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                activeTab === key
                                    ? 'bg-white text-[#43160c] shadow-sm'
                                    : 'text-[#6c3d20] hover:bg-white/50'
                            }`}>
                            {label}
                            {hasContent && <span className='ml-1.5 text-[#33c17d]'>●</span>}
                        </button>
                    );
                })}
            </div>

            {/* Locale-specific fields */}
            <div className='space-y-5 rounded-2xl border border-[#f3d9ba] bg-white p-6 shadow-sm' dir={isRtl ? 'rtl' : 'ltr'}>
                <div>
                    <label htmlFor='event-title' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Titel *
                    </label>
                    <input
                        id='event-title'
                        type='text'
                        value={current.title}
                        onChange={(e) => updateField(activeTab, 'title', e.target.value)}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                        aria-describedby={fieldErrors[`${activeTab}.title`] ? 'event-title-error' : undefined}
                    />
                    {fieldErrors[`${activeTab}.title`] && (
                        <p id='event-title-error' className='mt-1 text-xs text-red-600'>
                            {fieldErrors[`${activeTab}.title`]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor='event-location' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Locatie
                    </label>
                    <input
                        id='event-location'
                        type='text'
                        value={current.location}
                        onChange={(e) => updateField(activeTab, 'location', e.target.value)}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                    />
                </div>

                <div>
                    <label htmlFor='event-desc' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Omschrijving
                    </label>
                    <textarea
                        id='event-desc'
                        rows={4}
                        value={current.description}
                        onChange={(e) => updateField(activeTab, 'description', e.target.value)}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                    />
                </div>

                <ImageUpload
                    value={current.image}
                    onChange={(url) => updateField(activeTab, 'image', url)}
                    error={fieldErrors[`${activeTab}.image`]}
                />
            </div>

            {/* Date/Time (shared) */}
            <div className='mt-6 rounded-2xl border border-[#f3d9ba] bg-white p-6 shadow-sm'>
                <h2 className='mb-4 text-sm font-semibold text-[#43160c]'>Datum en tijd</h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                    <div>
                        <label htmlFor='start-date' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                            Datum *
                        </label>
                        <input
                            id='start-date'
                            type='date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                            aria-describedby={fieldErrors['startDate'] ? 'start-date-error' : undefined}
                        />
                        {fieldErrors['startDate'] && (
                            <p id='start-date-error' className='mt-1 text-xs text-red-600'>
                                {fieldErrors['startDate']}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='start-time' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                            Start *
                        </label>
                        <input
                            id='start-time'
                            type='time'
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                            aria-describedby={fieldErrors['startTime'] ? 'start-time-error' : undefined}
                        />
                        {fieldErrors['startTime'] && (
                            <p id='start-time-error' className='mt-1 text-xs text-red-600'>
                                {fieldErrors['startTime']}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor='end-time' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                            Eind
                        </label>
                        <input
                            id='end-time'
                            type='time'
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                            aria-describedby={fieldErrors['endTime'] ? 'end-time-error' : undefined}
                        />
                        {fieldErrors['endTime'] && (
                            <p id='end-time-error' className='mt-1 text-xs text-red-600'>
                                {fieldErrors['endTime']}
                            </p>
                        )}
                    </div>
                </div>

                {/* Recurrence (create only) */}
                {!isEdit && (
                    <div className='mt-4'>
                        <label className='flex cursor-pointer items-center gap-2'>
                            <input
                                type='checkbox'
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className='h-4 w-4 rounded border-[#f3d9ba] text-[#ff4d00] focus:ring-[#ff4d00]'
                                aria-expanded={isRecurring}
                            />
                            <span className='text-sm font-medium text-[#43160c]'>Herhalend evenement</span>
                        </label>

                        {isRecurring && (
                            <div className='mt-3 rounded-xl border border-[#33c17d]/30 bg-[#33c17d]/5 p-4'>
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    <div>
                                        <label htmlFor='rec-pattern' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                                            Patroon
                                        </label>
                                        <select
                                            id='rec-pattern'
                                            value={recurrencePattern}
                                            onChange={(e) => setRecurrencePattern(e.target.value)}
                                            className='w-full rounded-xl border border-[#f3d9ba] bg-white px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'>
                                            <option value='weekly'>Wekelijks</option>
                                            <option value='biweekly'>Tweewekelijks</option>
                                            <option value='monthly'>Maandelijks</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor='rec-end' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                                            Tot en met
                                        </label>
                                        <input
                                            id='rec-end'
                                            type='date'
                                            value={recurrenceEndDate}
                                            onChange={(e) => setRecurrenceEndDate(e.target.value)}
                                            className='w-full rounded-xl border border-[#f3d9ba] bg-white px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                                            aria-describedby={
                                                fieldErrors['recurrenceEndDate'] ? 'rec-end-error' : undefined
                                            }
                                        />
                                        {fieldErrors['recurrenceEndDate'] && (
                                            <p id='rec-end-error' className='mt-1 text-xs text-red-600'>
                                                {fieldErrors['recurrenceEndDate']}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {recurrenceCount > 0 && (
                                    <p className='mt-3 text-sm text-[#33c17d]'>
                                        ℹ {recurrenceCount} evenementen worden aangemaakt
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom controls */}
            <div className='mt-6 flex items-center justify-between'>
                <label className='flex cursor-pointer items-center gap-2'>
                    <input
                        type='checkbox'
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className='h-4 w-4 rounded border-[#f3d9ba] text-[#ff4d00] focus:ring-[#ff4d00]'
                    />
                    <span className='text-sm text-[#43160c]'>Gepubliceerd</span>
                </label>

                <div className='flex gap-2'>
                    <button
                        onClick={() => router.push('/admin/agenda')}
                        className='rounded-xl border border-[#f3d9ba] bg-[#faeacd]/50 px-5 py-2.5 text-sm font-medium text-[#43160c] hover:bg-[#faeacd]'>
                        Annuleren
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className='rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e04400] disabled:opacity-50'>
                        {saving ? 'Bezig...' : 'Opslaan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
