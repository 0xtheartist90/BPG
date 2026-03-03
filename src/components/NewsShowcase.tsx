'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { newsItems } from '@/data/newsItems';
import type { NewsItem } from '@/data/newsItems';
import { newsTranslations } from '@/data/newsTranslations';
import type { Locale } from '@/lib/i18n';

import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

type NewsControls = {
    previous: string;
    next: string;
    articleCount: string;
    otherArticles: string;
    closeLabel: string;
};

type NewsShowcaseProps = {
    locale: Locale;
    newsControls: NewsControls;
};

const getTranslatedNews = (item: NewsItem, locale: Locale) => {
    const translation = newsTranslations[item.slug]?.[locale];

    return {
        title: translation?.title || item.title,
        excerpt: translation?.excerpt || item.excerpt,
        content: translation?.content || item.content
    };
};

const formatDate = (dateString: string | undefined, locale: Locale): string => {
    if (!dateString) {
        return 'Gein';
    }

    const months: Record<Locale, string[]> = {
        nl: [
            'januari',
            'februari',
            'maart',
            'april',
            'mei',
            'juni',
            'juli',
            'augustus',
            'september',
            'oktober',
            'november',
            'december'
        ],
        en: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        ar: [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر'
        ]
    };

    const parts = dateString.toLowerCase().split(' ');
    if (parts.length >= 2) {
        const day = parts[0];
        const monthName = parts[1];
        const year = parts[2];

        const nlMonths = [
            'januari',
            'februari',
            'maart',
            'april',
            'mei',
            'juni',
            'juli',
            'augustus',
            'september',
            'oktober',
            'november',
            'december'
        ];
        const monthIndex = nlMonths.indexOf(monthName);

        if (monthIndex !== -1) {
            const translatedMonth = months[locale][monthIndex];

            return year ? `${day} ${translatedMonth} ${year}` : `${day} ${translatedMonth}`;
        }
    }

    return dateString;
};

const cardLayouts = [
    { mdCols: 'md:col-span-4', mdRows: 'md:row-span-2', variant: 'image' },
    {
        mdCols: 'md:col-span-2',
        mdRows: 'md:row-span-2',
        variant: 'text',
        background: '#cabafe',
        textColor: '#1f1333',
        accent: '#ffffff'
    },
    {
        mdCols: 'md:col-span-2',
        mdRows: 'md:row-span-2',
        variant: 'text',
        background: '#ffe7c7',
        textColor: '#2b1506',
        accent: '#2b1506'
    },
    { mdCols: 'md:col-span-4', mdRows: 'md:row-span-2', variant: 'image' },
    {
        mdCols: 'md:col-span-2',
        mdRows: 'md:row-span-2',
        variant: 'text',
        background: '#f6ff7a',
        textColor: '#1b1b05',
        accent: '#ffffff'
    }
];

const activeLayouts = [cardLayouts[0], cardLayouts[1], cardLayouts[2], cardLayouts[3]];

const NewsShowcase = ({ locale, newsControls }: NewsShowcaseProps) => {
    const ITEMS_PER_PAGE = activeLayouts.length;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [newsSlideIndex, setNewsSlideIndex] = useState(0);
    const newsSliderRef = useRef<HTMLDivElement | null>(null);

    const activeArticle = useMemo(() => (activeIndex === null ? null : newsItems[activeIndex]), [activeIndex]);

    const openArticle = useCallback((index: number) => setActiveIndex(index), []);

    const closeArticle = useCallback(() => setActiveIndex(null), []);

    const scrollNewsSliderTo = useCallback((index: number) => {
        const slider = newsSliderRef.current;
        if (!slider) {
            return;
        }
        const clamped = Math.max(0, Math.min(index, newsItems.length - 1));
        const targetSlide = slider.children[clamped] as HTMLElement | undefined;
        if (!targetSlide) {
            return;
        }
        slider.scrollTo({ left: targetSlide.offsetLeft, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const slider = newsSliderRef.current;
        if (!slider) {
            return undefined;
        }

        const handleScroll = () => {
            const slides = Array.from(slider.children) as HTMLElement[];
            if (!slides.length) {
                setNewsSlideIndex(0);

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

            setNewsSlideIndex(closestIndex);
        };

        slider.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => slider.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            scrollNewsSliderTo(newsSlideIndex);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [newsSlideIndex, scrollNewsSliderTo]);

    const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
    const visibleItems = newsItems.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

    return (
        <div className='space-y-8'>
            <div className='md:hidden'>
                <div
                    ref={newsSliderRef}
                    className='news-slider -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6'
                    style={{ scrollbarWidth: 'none', scrollPadding: '0 1.5rem' }}>
                    <style jsx>{`
                        .news-slider {
                            scroll-behavior: smooth;
                        }
                        .news-slider::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {newsItems.map((item, index) => (
                        <div key={item.slug} className='w-full flex-shrink-0 snap-center px-2'>
                            <article className='relative mx-auto h-80 max-w-md overflow-hidden rounded-[32px] bg-white/10'>
                                <Image src={item.image} alt={item.title} fill className='object-cover' sizes='100vw' />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                                <div className='absolute right-4 bottom-4 left-4 flex items-end justify-between text-white'>
                                    <div>
                                        <p className='text-xs font-bold tracking-[0.4em] uppercase'>
                                            {formatDate(item.date, locale)}
                                        </p>
                                        <h3 className='mt-2 text-xl leading-tight font-semibold'>
                                            {getTranslatedNews(item, locale).title}
                                        </h3>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => openArticle(index)}
                                        className='inline-flex size-12 items-center justify-center rounded-full bg-white/90 text-[#d06129] shadow-lg shadow-black/20'>
                                        <ArrowRight className='size-5' />
                                    </button>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
                <div className='mt-3 flex items-center justify-center gap-2 px-4'>
                    {newsItems.map((_, index) => (
                        <button
                            key={`news-dot-${index}`}
                            type='button'
                            onClick={() => scrollNewsSliderTo(index)}
                            className={`h-2 rounded-full transition-all ${
                                newsSlideIndex === index ? 'w-6 bg-[#ff4d00]' : 'w-2 bg-white/50'
                            }`}
                            aria-label={`Ga naar nieuws slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            <div className='hidden gap-5 md:grid md:auto-rows-[165px] md:grid-cols-6'>
                {visibleItems.map((item, index) => {
                    const globalIndex = page * ITEMS_PER_PAGE + index;
                    const layout = activeLayouts[index % activeLayouts.length] ?? {
                        mdCols: 'md:col-span-2',
                        mdRows: 'md:row-span-1',
                        variant: 'text',
                        background: '#fff6eb',
                        textColor: '#2b1506',
                        accent: '#2b1506'
                    };
                    const combinedClasses = ['col-span-1', 'rounded-[32px] overflow-hidden']
                        .concat(layout.mdCols ?? '', layout.mdRows ?? '')
                        .join(' ');

                    if (layout.variant === 'image') {
                        return (
                            <article key={item.slug} className={`${combinedClasses} relative bg-white/10`}>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className='object-cover'
                                    sizes='(max-width: 768px) 100vw, 60vw'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />
                                <div className='absolute right-4 bottom-4 left-4 flex items-end justify-between text-white'>
                                    <div>
                                        <p className='text-xs font-bold tracking-[0.4em] uppercase'>
                                            {formatDate(item.date, locale)}
                                        </p>
                                        <h3 className='mt-2 text-xl leading-tight font-semibold'>
                                            {getTranslatedNews(item, locale).title}
                                        </h3>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => openArticle(globalIndex)}
                                        className='inline-flex size-12 items-center justify-center rounded-full bg-white/90 text-[#d06129] shadow-lg shadow-black/20'>
                                        <ArrowRight className='size-5' />
                                    </button>
                                </div>
                            </article>
                        );
                    }

                    if (layout.variant === 'hybrid') {
                        return (
                            <article
                                key={item.slug}
                                className={`${combinedClasses} flex h-full flex-col overflow-hidden rounded-[32px] shadow-lg shadow-black/15`}>
                                <div
                                    className='basis-[45%] rounded-t-[32px] p-5'
                                    style={{ backgroundColor: layout.background, color: layout.textColor }}>
                                    <p className='text-xs font-black tracking-[0.4em] uppercase'>
                                        {formatDate(item.date, locale)}
                                    </p>
                                    <h3 className='mt-2 text-lg leading-tight font-black'>
                                        {getTranslatedNews(item, locale).title}
                                    </h3>
                                </div>
                                <div className='relative basis-[55%] overflow-hidden rounded-b-[32px]'>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className='object-cover'
                                        sizes='(max-width: 768px) 100vw, 40vw'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => openArticle(globalIndex)}
                                        className='absolute right-4 bottom-4 inline-flex size-11 items-center justify-center rounded-full border border-black/20 bg-white/80 text-[#d06129] shadow'>
                                        <ArrowRight className='size-4' />
                                    </button>
                                </div>
                            </article>
                        );
                    }

                    return (
                        <article
                            key={item.slug}
                            className={`${combinedClasses} flex h-full flex-col justify-between p-6`}
                            style={{ backgroundColor: layout.background, color: layout.textColor }}>
                            <div>
                                <p className='text-xs font-black tracking-[0.5em] uppercase'>
                                    {formatDate(item.date, locale)}
                                </p>
                                <h3 className={`mt-3 font-black ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                                    {getTranslatedNews(item, locale).title}
                                </h3>
                                <p
                                    className='mt-3 text-sm leading-relaxed text-black/70'
                                    style={{
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        display: '-webkit-box',
                                        overflow: 'hidden'
                                    }}>
                                    {getTranslatedNews(item, locale).excerpt}
                                </p>
                            </div>
                            <div className='mt-6 flex items-center justify-between'>
                                {item.tag && (
                                    <span
                                        className='text-xs font-semibold tracking-[0.4em] uppercase'
                                        style={{ color: layout.accent }}>
                                        {item.tag}
                                    </span>
                                )}
                                <button
                                    type='button'
                                    onClick={() => openArticle(globalIndex)}
                                    className='inline-flex size-11 items-center justify-center rounded-full border border-black/20 bg-white/80 text-[#d06129] shadow'>
                                    <ArrowRight className='size-4' />
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className='mt-8 hidden items-center justify-center gap-6 md:flex'>
                    <button
                        type='button'
                        onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
                        className='inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold tracking-[0.3em] text-white/90 transition hover:bg-white/10'>
                        <ChevronLeft className='size-4' />
                        {newsControls.previous}
                    </button>
                    <div className='flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-white/80 uppercase'>
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={`page-dot-${idx}`}
                                type='button'
                                onClick={() => setPage(idx)}
                                className={`h-2.5 w-10 rounded-full transition ${
                                    idx === page ? 'bg-white' : 'bg-white/30 hover:bg-white/60'
                                }`}
                                aria-label={`Ga naar nieuws pagina ${idx + 1}`}
                            />
                        ))}
                    </div>
                    <button
                        type='button'
                        onClick={() => setPage((prev) => (prev + 1) % totalPages)}
                        className='inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs font-semibold tracking-[0.3em] text-white/90 transition hover:bg-white/10'>
                        {newsControls.next}
                        <ChevronRight className='size-4' />
                    </button>
                </div>
            )}

            {activeArticle && activeIndex !== null && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8'>
                    <div className='relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white text-[#43160c] shadow-2xl'>
                        <button
                            type='button'
                            onClick={closeArticle}
                            className='absolute top-4 right-4 z-20 rounded-full border border-[#d06129]/30 bg-white/80 p-1 text-[#d06129] backdrop-blur hover:bg-[#d06129]/10'>
                            <X className='size-5' />
                        </button>
                        <div className='relative h-56 w-full flex-shrink-0 overflow-hidden bg-[#43160c]/5 sm:h-72 lg:h-80'>
                            <Image
                                src={activeArticle.image}
                                alt={activeArticle.title}
                                fill
                                className='object-cover'
                                sizes='(max-width: 768px) 100vw, 60vw'
                            />
                        </div>
                        <div className='flex-1 overflow-y-auto p-8'>
                            <div className='flex flex-wrap items-center justify-between text-xs tracking-[0.3em] text-[#d06129] uppercase'>
                                <span>{formatDate(activeArticle.date, locale)}</span>
                                <span>
                                    {newsControls.articleCount
                                        .replace('{current}', String(activeIndex + 1))
                                        .replace('{total}', String(newsItems.length))}
                                </span>
                            </div>
                            <h3 className='mt-3 text-3xl font-black text-[#43160c]'>
                                {getTranslatedNews(activeArticle, locale).title}
                            </h3>
                            <div className='mt-4 space-y-4 text-base text-[#43160c]/85'>
                                {getTranslatedNews(activeArticle, locale).content.map((paragraph, index) => (
                                    <p key={`${activeArticle.slug}-paragraph-${index}`}>{paragraph}</p>
                                ))}
                            </div>
                            <div className='mt-6 space-y-3'>
                                <p className='text-xs font-semibold tracking-[0.3em] text-[#d06129] uppercase'>
                                    {newsControls.otherArticles}
                                </p>
                                <div className='grid gap-3 sm:grid-cols-2'>
                                    {newsItems
                                        .map((item, index) => ({ item, index }))
                                        .filter(({ index }) => index !== activeIndex)
                                        .slice(0, 4)
                                        .map(({ item, index }) => (
                                            <button
                                                key={item.slug}
                                                type='button'
                                                onClick={() => setActiveIndex(index)}
                                                className='flex items-center gap-3 rounded-2xl border border-[#d06129]/20 bg-[#fef5ee] p-3 text-left text-[#43160c] transition hover:-translate-y-0.5 hover:shadow'>
                                                <div className='relative h-14 w-14 overflow-hidden rounded-xl bg-[#43160c]/5'>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className='object-cover'
                                                        sizes='56px'
                                                    />
                                                </div>
                                                <div>
                                                    <p className='text-xs tracking-[0.2em] text-[#d06129] uppercase'>
                                                        {formatDate(item.date, locale)}
                                                    </p>
                                                    <p className='text-sm leading-snug font-semibold'>
                                                        {getTranslatedNews(item, locale).title}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsShowcase;
