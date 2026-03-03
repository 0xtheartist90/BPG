'use client';

import { useState } from 'react';

import type { HighlightContentBlock, HighlightItem } from '@/types/content';

type HighlightsShowcaseProps = {
    highlights: HighlightItem[];
    modalEyebrow: string;
    closeLabel: string;
};

const renderContentBlock = (block: HighlightContentBlock, index: number) => {
    switch (block.type) {
        case 'paragraph':
            return (
                <p key={index} className='text-base text-[#43160c]/90'>
                    {block.text}
                </p>
            );
        case 'subheading':
            return (
                <h4 key={index} className='text-lg font-semibold text-[#43160c]'>
                    {block.text}
                </h4>
            );
        case 'list':
            return (
                <div key={index}>
                    {block.heading && <p className='mb-2 font-semibold text-[#43160c]'>{block.heading}</p>}
                    <ul className='list-disc space-y-2 pl-6 text-sm text-[#43160c]'>
                        {block.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            );
        default:
            return null;
    }
};

const HighlightsShowcase = ({ highlights, modalEyebrow, closeLabel }: HighlightsShowcaseProps) => {
    const [activeHighlight, setActiveHighlight] = useState<HighlightItem | null>(null);

    return (
        <>
            <div className='mt-8 grid gap-4 md:grid-cols-3'>
                {highlights.map((item) => (
                    <div
                        key={item.title}
                        className='flex h-full flex-col rounded-2xl border border-white/20 p-5 shadow-sm shadow-black/10'
                        style={{ backgroundColor: 'rgba(13, 94, 52, 0.65)' }}>
                        <h3 className='text-xl font-semibold text-white'>{item.title}</h3>
                        <p className='mt-2 text-sm text-white/85'>{item.description}</p>
                        <button
                            type='button'
                            onClick={() => setActiveHighlight(item)}
                            className='mt-4 inline-flex w-fit rounded-full bg-white/90 px-4 py-2 text-xs font-semibold tracking-wide text-[#0d5e34] uppercase transition hover:-translate-y-0.5'>
                            {item.actionLabel}
                        </button>
                    </div>
                ))}
            </div>

            {activeHighlight && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8'>
                    <div className='relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-8 text-[#43160c] shadow-2xl'>
                        <button
                            type='button'
                            onClick={() => setActiveHighlight(null)}
                            className='sticky top-0 z-10 mb-4 ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#d06129]/30 bg-white text-2xl text-[#d06129] shadow-md hover:bg-[#d06129]/10 md:absolute md:top-4 md:right-4 md:mb-0'>
                            <span className='sr-only'>{closeLabel}</span>×
                        </button>
                        <p className='text-xs font-semibold tracking-[0.3em] text-[#d06129] uppercase'>
                            {modalEyebrow}
                        </p>
                        <h3 className='mt-2 text-3xl font-black text-[#43160c]'>{activeHighlight.title}</h3>
                        <div className='mt-4 space-y-4'>{activeHighlight.content.map(renderContentBlock)}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HighlightsShowcase;
