'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import type { AgendaEvent } from '@/types/agenda';

import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';

type AgendaShowcaseProps = {
    events: AgendaEvent[];
    onEventClick: (event: AgendaEvent) => void;
    moreInfo: string;
};

const AgendaShowcase = ({ events, onEventClick, moreInfo }: AgendaShowcaseProps) => {
    const getTimestamp = useCallback((event: AgendaEvent) => {
        if (event.start) {
            const ts = Date.parse(event.start);

            if (!Number.isNaN(ts)) {
                return ts;
            }
        }

        const fallback = Date.parse(event.date);

        return Number.isNaN(fallback) ? Number.MAX_SAFE_INTEGER : fallback;
    }, []);

    const sortedEvents = useMemo(() => {
        return [...events].sort((a, b) => getTimestamp(a) - getTimestamp(b));
    }, [events, getTimestamp]);

    const visibleEvents = useMemo(() => {
        const now = Date.now();
        const upcoming = sortedEvents.filter((event) => getTimestamp(event) >= now);

        if (upcoming.length >= 6) {
            return upcoming.slice(0, 6);
        }

        if (upcoming.length > 0) {
            return upcoming;
        }

        return sortedEvents.slice(0, 6);
    }, [sortedEvents, getTimestamp]);

    const mobileSlides = useMemo(() => {
        const slides: AgendaEvent[][] = [];
        for (let i = 0; i < visibleEvents.length; i += 2) {
            slides.push(visibleEvents.slice(i, i + 2));
        }

        return slides;
    }, [visibleEvents]);

    const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
    const mobileSliderRef = useRef<HTMLDivElement | null>(null);

    const scrollMobileSliderTo = useCallback(
        (index: number) => {
            const slider = mobileSliderRef.current;
            if (!slider) {
                return;
            }
            const clamped = Math.max(0, Math.min(index, mobileSlides.length - 1));
            const targetSlide = slider.children[clamped] as HTMLElement | undefined;
            if (!targetSlide) {
                return;
            }
            slider.scrollTo({ left: targetSlide.offsetLeft, behavior: 'smooth' });
        },
        [mobileSlides.length]
    );

    useEffect(() => {
        const slider = mobileSliderRef.current;
        if (!slider) {
            return undefined;
        }

        const handleScroll = () => {
            const slides = Array.from(slider.children) as HTMLElement[];
            if (!slides.length) {
                setMobileSlideIndex(0);

                return;
            }

            let closestIndex = 0;
            let smallestDistance = Number.POSITIVE_INFINITY;

            slides.forEach((slide, idx) => {
                const distance = Math.abs(slider.scrollLeft - slide.offsetLeft);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closestIndex = idx;
                }
            });

            setMobileSlideIndex(closestIndex);
        };

        slider.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => slider.removeEventListener('scroll', handleScroll);
    }, [mobileSlides.length]);

    useEffect(() => {
        const handleResize = () => {
            scrollMobileSliderTo(mobileSlideIndex);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [mobileSlideIndex, scrollMobileSliderTo]);

    const renderCard = (event: AgendaEvent, size: 'desktop' | 'mobile') => {
        const imageHeight = size === 'desktop' ? 'h-40' : 'h-32';
        const titleClass = size === 'desktop' ? 'text-2xl' : 'text-xl';

        return (
            <article
                className='rounded-2xl border border-white/20 p-5 text-white shadow-sm shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-white/30'
                style={{ backgroundColor: 'rgba(13, 94, 52, 0.65)' }}
                onClick={() => onEventClick(event)}>
                <div className={`relative mb-4 overflow-hidden rounded-xl border border-white/10 ${imageHeight}`}>
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes='(max-width: 768px) 100vw, 50vw'
                        className='object-cover'
                    />
                </div>
                <div className='text-xs font-semibold tracking-[0.3em] text-white/70 uppercase'>
                    {event.date} • {event.time}
                </div>
                <h3 className={`mt-2 font-bold ${titleClass}`}>{event.title}</h3>
                <p className='text-sm text-white/80'>{event.location}</p>
                <button
                    type='button'
                    className='mt-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase'
                    onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                    }}>
                    <CalendarPlus className='size-4' /> {moreInfo}
                </button>
            </article>
        );
    };

    return (
        <div className='mt-8 space-y-8'>
            <div className='md:hidden'>
                <div
                    ref={mobileSliderRef}
                    className='agenda-mobile-slider -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6'
                    style={{ scrollbarWidth: 'none', scrollPadding: '0 1.5rem' }}>
                    <style jsx>{`
                        .agenda-mobile-slider {
                            scroll-behavior: smooth;
                        }
                        .agenda-mobile-slider::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {mobileSlides.map((slide, index) => (
                        <div key={`agenda-slide-${index}`} className='w-full flex-shrink-0 snap-center px-2'>
                            <div className='grid gap-4'>
                                {slide.map((event) => (
                                    <div key={event.id} className='w-full'>
                                        {renderCard(event, 'mobile')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {mobileSlides.length > 1 && (
                    <div className='mt-3 flex items-center justify-center gap-2 px-4'>
                        {mobileSlides.map((_, index) => (
                            <button
                                key={`agenda-dot-${index}`}
                                type='button'
                                onClick={() => scrollMobileSliderTo(index)}
                                className={`h-2 rounded-full transition-all ${
                                    mobileSlideIndex === index ? 'w-6 bg-[#33c17d]' : 'w-2 bg-white/40'
                                }`}
                                aria-label={`Ga naar agenda slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className='hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
                {visibleEvents.map((event) => (
                    <div key={event.id}>{renderCard(event, 'desktop')}</div>
                ))}
            </div>
        </div>
    );
};

export default AgendaShowcase;
