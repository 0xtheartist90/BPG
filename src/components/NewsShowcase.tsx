'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { newsItems } from '@/data/newsItems';

const cardLayouts = [
    { mdCols: 'md:col-span-2', mdRows: 'md:row-span-2', variant: 'text', background: '#cabafe', textColor: '#1f1333', accent: '#ffffff' },
    { mdCols: 'md:col-span-4', mdRows: 'md:row-span-2', variant: 'image' },
    { mdCols: 'md:col-span-2', mdRows: 'md:row-span-2', variant: 'hybrid', background: '#f7935c', textColor: '#2a1204' },
    { mdCols: 'md:col-span-2', mdRows: 'md:row-span-2', variant: 'hybrid', background: '#bce1ff', textColor: '#052039' },
    { mdCols: 'md:col-span-2', mdRows: 'md:row-span-2', variant: 'hybrid', background: '#ffe0a3', textColor: '#3c1d00' },
    { mdCols: 'md:col-span-4', mdRows: 'md:row-span-2', variant: 'image' },
    { mdCols: 'md:col-span-2', mdRows: 'md:row-span-2', variant: 'text', background: '#f6ff7a', textColor: '#1b1b05', accent: '#ffffff' }
];

const NewsShowcase = () => {
    const ITEMS_PER_PAGE = 7;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [page, setPage] = useState(0);

    const activeArticle = useMemo(() => (activeIndex === null ? null : newsItems[activeIndex]), [activeIndex]);

    const openArticle = (index: number) => setActiveIndex(index);
    const closeArticle = () => setActiveIndex(null);

    const showPrevious = () => {
        if (activeIndex === null) return;

        setActiveIndex((prev) => {
            if (prev === null) return null;

            return prev === 0 ? newsItems.length - 1 : prev - 1;
        });
    };

    const showNext = () => {
        if (activeIndex === null) return;

        setActiveIndex((prev) => {
            if (prev === null) return null;

            return prev === newsItems.length - 1 ? 0 : prev + 1;
        });
    };

    const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
    const visibleItems = newsItems.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE);

    return (
        <div className='space-y-8'>
            <div className='grid gap-5 md:grid-cols-6 md:auto-rows-[165px]'>
                {visibleItems.map((item, index) => {
                    const globalIndex = page * ITEMS_PER_PAGE + index;
                    const layout = cardLayouts[index] ?? { mdCols: 'md:col-span-2', mdRows: 'md:row-span-1', variant: 'text', background: '#fff6eb', textColor: '#2b1506', accent: '#2b1506' };
                    const combinedClasses = ['col-span-1', 'rounded-[32px] overflow-hidden'].concat(layout.mdCols ?? '', layout.mdRows ?? '').join(' ');

                    if (layout.variant === 'image') {
                        return (
                            <article key={item.slug} className={`${combinedClasses} relative bg-white/10`}> 
                                <Image src={item.image} alt={item.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 60vw' />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />
                                <div className='absolute bottom-4 left-4 right-4 flex items-end justify-between text-white'>
                                    <div>
                                        <p className='text-xs font-bold uppercase tracking-[0.4em]'>{item.date ?? 'Gein'}</p>
                                        <h3 className='mt-2 text-xl font-semibold leading-tight'>{item.title}</h3>
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
                                <div className='basis-[45%] rounded-t-[32px] p-5' style={{ backgroundColor: layout.background, color: layout.textColor }}>
                                    <p className='text-xs font-black uppercase tracking-[0.4em]'>{item.date ?? 'Gein'}</p>
                                    <h3 className='mt-2 text-lg font-black leading-tight'>{item.title}</h3>
                                </div>
                                <div className='relative basis-[55%] overflow-hidden rounded-b-[32px]'>
                                    <Image src={item.image} alt={item.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 40vw' />
                                    <button
                                        type='button'
                                        onClick={() => openArticle(globalIndex)}
                                        className='absolute bottom-4 right-4 inline-flex size-11 items-center justify-center rounded-full border border-black/20 bg-white/80 text-[#d06129] shadow'>
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
                                <p className='text-xs font-black uppercase tracking-[0.5em]'>{item.date ?? 'Gein'}</p>
                                <h3 className={`mt-3 font-black ${index === 0 ? 'text-2xl' : 'text-xl'}`}>{item.title}</h3>
                                <p className='mt-3 text-sm leading-relaxed text-black/70' style={{ WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', display: '-webkit-box', overflow: 'hidden' }}>
                                    {item.excerpt}
                                </p>
                            </div>
                            <div className='mt-6 flex items-center justify-between'>
                                {item.tag && (
                                    <span className='text-xs font-semibold uppercase tracking-[0.4em]' style={{ color: layout.accent }}>
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
            <div className='mt-8 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-white/80'>
                <button
                    type='button'
                    onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
                    className='inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 transition hover:bg-white hover:text-[#d06129]'>
                    <ChevronLeft className='size-4' /> Vorige
                </button>
                <div className='flex items-center gap-2 text-xs uppercase tracking-[0.3em]'>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={`page-dot-${idx}`}
                            type='button'
                            onClick={() => setPage(idx)}
                            className={`h-2.5 w-8 rounded-full transition ${idx === page ? 'bg-white' : 'bg-white/30 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
                <button
                    type='button'
                    onClick={() => setPage((prev) => (prev + 1) % totalPages)}
                    className='inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 transition hover:bg-white hover:text-[#d06129]'>
                    Volgende <ChevronRight className='size-4' />
                </button>
            </div>

            {activeArticle && activeIndex !== null && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8'>
                    <div className='relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white text-[#43160c] shadow-2xl'>
                        <button
                            type='button'
                            onClick={closeArticle}
                            className='absolute right-4 top-4 z-20 rounded-full border border-[#d06129]/30 bg-white/80 p-1 text-[#d06129] backdrop-blur hover:bg-[#d06129]/10'>
                            <X className='size-5' />
                        </button>
                        <div className='relative h-64 w-full overflow-hidden bg-[#43160c]/5 sm:h-80'>
                            <Image src={activeArticle.image} alt={activeArticle.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 60vw' />
                        </div>
                        <div className='p-8'>
                            <div className='flex flex-wrap items-center justify-between text-xs uppercase tracking-[0.3em] text-[#d06129]'>
                                <span>{activeArticle.date ?? 'Gein'}</span>
                                <span>
                                    Bericht {activeIndex + 1} / {newsItems.length}
                                </span>
                            </div>
                            <h3 className='mt-3 text-3xl font-black text-[#43160c]'>{activeArticle.title}</h3>
                            <div className='mt-4 space-y-4 text-base text-[#43160c]/85'>
                                {activeArticle.content.map((paragraph, index) => (
                                    <p key={`${activeArticle.slug}-paragraph-${index}`}>{paragraph}</p>
                                ))}
                            </div>
                            <div className='mt-6 space-y-3'>
                                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[#d06129]'>Andere berichten</p>
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
                                                    <Image src={item.image} alt={item.title} fill className='object-cover' sizes='56px' />
                                                </div>
                                                <div>
                                                    <p className='text-xs uppercase tracking-[0.2em] text-[#d06129]'>{item.date ?? 'Gein'}</p>
                                                    <p className='text-sm font-semibold leading-snug'>{item.title}</p>
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
