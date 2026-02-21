'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { newsItems } from '@/data/newsItems';

const NewsShowcase = () => {
    const ITEMS_PER_PAGE = 3;
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
        <div className='rounded-3xl bg-white/10 p-8 text-[#fff8ef] shadow-xl shadow-black/10 backdrop-blur'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
                <div>
                    <p className='text-sm font-semibold uppercase tracking-wide text-white/70'>Actuele verhalen</p>
                    <h2 className='text-4xl font-black leading-tight text-white sm:text-5xl'>Nieuws uit de buurt</h2>
                </div>
            </div>
            <div className='mt-8 grid gap-6 md:grid-cols-3'>
                {visibleItems.map((item, index) => {
                    const globalIndex = page * ITEMS_PER_PAGE + index;

                    return (
                        <article key={item.slug} className='flex h-full min-h-[30rem] max-h-[30rem] flex-col rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-sm shadow-black/10'>
                        <div className='relative mb-4 h-40 w-full overflow-hidden rounded-2xl bg-white/10'>
                            <Image src={item.image} alt={item.title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 50vw' />
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.3em] text-white/60'>{item.date ?? 'Nieuw'}</p>
                                <h3 className='text-xl font-semibold'>{item.title}</h3>
                            </div>
                            <span className='rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70'>Gein</span>
                        </div>
                        <p
                            className='mt-3 flex-1 text-white/85'
                            style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.excerpt}
                        </p>
                        <div className='mt-5 flex flex-wrap gap-3'>
                            <button
                                type='button'
                                onClick={() => openArticle(globalIndex)}
                                className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#d06129] shadow shadow-[#d06129]/30'>
                                Bekijk volledig bericht <ArrowRight className='size-3.5 text-[#d06129]' />
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
