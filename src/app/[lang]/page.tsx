'use client';

import { use, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import Image from 'next/image';

import AgendaMonthView from '@/components/AgendaMonthView';
import AgendaShowcase from '@/components/AgendaShowcase';
import AgendaWeekView from '@/components/AgendaWeekView';
import EventModal from '@/components/EventModal';
import HighlightsShowcase from '@/components/HighlightsShowcase';
import NewsShowcase from '@/components/NewsShowcase';
import { getDictionary } from '@/lib/getDictionary';
import { type Locale, locales } from '@/lib/i18n';
import type { AgendaEvent } from '@/types/agenda';

import {
    Building2,
    ChevronDown,
    Instagram,
    Mail,
    Megaphone,
    Menu,
    MessageCircle,
    MessageSquare,
    Phone,
    Users,
    X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type CardItem = {
    title: string;
    description: string;
    href?: string;
    actionLabel?: string;
    icon?: LucideIcon;
};

type MissionCardDesign = {
    variant: 'hero' | 'text' | 'imageSplit';
    className?: string;
    image?: string;
    background?: string;
    footer?: string;
};

const pillarIcons: LucideIcon[] = [Users, Building2, MessageSquare, Megaphone];

const missionCardDesigns: MissionCardDesign[] = [
    {
        variant: 'hero',
        className: 'lg:col-span-2 min-h-[280px]',
        image: '/images/verbinden%20en%20activeren.png',
        footer: 'WhatsApp • Nieuwsbrief • Instagram'
    },
    {
        variant: 'text',
        className: 'lg:col-span-1',
        background: '#fdf2e3'
    },
    {
        variant: 'text',
        className: 'lg:col-span-1',
        background: '#f4dfcc'
    },
    {
        variant: 'imageSplit',
        className: 'lg:col-span-2',
        background: 'rgba(13, 94, 52, 0.65)',
        image: '/images/stemvandebuurt.png'
    }
];

const infiniteLoopImages = [
    '/images/Infinite%20loop/bpgloop1.png',
    '/images/Infinite%20loop/bpgloop2.png',
    '/images/Infinite%20loop/bpgloop2.5.png',
    '/images/Infinite%20loop/bpgloop3.png',
    '/images/Infinite%20loop/bpgloop4.png',
    '/images/Infinite%20loop/bpgloop4.5.png',
    '/images/Infinite%20loop/bpgloop5.png',
    '/images/Infinite%20loop/bpgloop6.png',
    '/images/Infinite%20loop/bpgloop7.png',
    '/images/Infinite%20loop/bpgloop8.png'
];

const contactChannelIconMap: Record<'instagram' | 'whatsapp', LucideIcon> = {
    instagram: Instagram,
    whatsapp: Phone
};

const SectionWrapper = ({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) => (
    <section id={id} className={`px-4 py-16 sm:px-6 lg:px-10 ${className}`}>
        <div className='mx-auto max-w-6xl'>{children}</div>
    </section>
);

type PageProps = {
    params: Promise<{ lang?: string }>;
};

const Page = ({ params }: PageProps) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [agendaView, setAgendaView] = useState<'cards' | 'month'>('cards');
    const [missionSlideIndex, setMissionSlideIndex] = useState(0);
    const [overGeinSlideIndex, setOverGeinSlideIndex] = useState(0);
    const [selectedEvents, setSelectedEvents] = useState<AgendaEvent[]>([]);
    const [activeEventIndex, setActiveEventIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastActiveSection = useRef<string | null>(null);
    const langMenuRef = useRef<HTMLDivElement | null>(null);
    const missionSliderRef = useRef<HTMLDivElement | null>(null);
    const overGeinSliderRef = useRef<HTMLDivElement | null>(null);

    const resolvedParams = use(params);
    const locale = (resolvedParams?.lang as Locale) || 'nl';
    const dict = getDictionary(locale);
    const navLinks = [
        { label: dict.nav.missie, href: `/${locale}#missie` },
        { label: dict.nav.overGein, href: `/${locale}#over-gein` },
        { label: dict.nav.initiatieven, href: `/${locale}#initiatieven` },
        { label: dict.nav.nieuws, href: `/${locale}#nieuws` },
        { label: dict.nav.agenda, href: `/${locale}#agenda` },
        { label: dict.nav.contact, href: `/${locale}#contact` }
    ];
    const neighborhoodStats: {
        name: string;
        inwoners: string;
        woningen: string;
        huur: string;
    }[] = [
        {
            name: 'Gein 1',
            inwoners: '2.960',
            woningen: '1.585',
            huur: '79%'
        },
        {
            name: 'Gein 2',
            inwoners: '1.645',
            woningen: '746',
            huur: '77%'
        },
        {
            name: 'Gein 3',
            inwoners: '3.200',
            woningen: '1.260',
            huur: '5%'
        },
        {
            name: 'Gein 4',
            inwoners: '3.385',
            woningen: '1.557',
            huur: '74%'
        }
    ];
    const missionPillars = dict.mission.pillars.map((pillar, index) => ({
        ...pillar,
        icon: pillarIcons[index]
    }));
    const missionSlidesCount = missionPillars.length;

    const renderMissionCard = (pillar: (typeof missionPillars)[number], index: number) => {
        const design = missionCardDesigns[index] ?? { variant: 'text' };
        const accentIcon = pillar.icon ? (
            <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d00] text-white'>
                <pillar.icon className='size-6' />
            </div>
        ) : null;

        if (design.variant === 'hero') {
            return (
                <article
                    key={pillar.title}
                    className={`relative h-full min-h-[320px] overflow-hidden rounded-[32px] ${design.className ?? ''}`}>
                    {design.image && (
                        <Image
                            src={design.image}
                            alt={dict.media.missionImageAlt}
                            fill
                            className='object-cover'
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
                        />
                    )}
                    <div className='absolute inset-0 bg-gradient-to-br from-[#3b1c0f]/85 via-[#7a3f21]/60 to-transparent' />
                    <div className='relative z-10 flex h-full flex-col justify-end p-6 text-white'>
                        {accentIcon}
                        <div className='mt-4 max-w-[90%] space-y-3 md:max-w-[70%] lg:max-w-[66%]'>
                            <h3 className='text-2xl leading-snug font-semibold'>{pillar.title}</h3>
                            <p className='text-sm text-white/85'>{pillar.description}</p>
                        </div>
                    </div>
                </article>
            );
        }

        if (design.variant === 'imageSplit') {
            return (
                <article
                    key={pillar.title}
                    className={`flex h-full min-h-[320px] flex-col gap-6 rounded-[32px] p-6 text-white shadow-lg shadow-[#1f2f27]/40 lg:flex-row lg:items-stretch ${design.className ?? ''}`}
                    style={{ backgroundColor: design.background }}>
                    <div className='flex-1 space-y-3 lg:max-w-[66%] lg:self-end'>
                        {accentIcon}
                        <h3 className='text-2xl leading-snug font-semibold'>{pillar.title}</h3>
                        <p className='text-sm text-white/85'>{pillar.description}</p>
                    </div>
                    {design.image && (
                        <div className='relative h-36 w-full overflow-hidden rounded-2xl sm:h-44 lg:-mt-4 lg:-mb-6 lg:flex lg:h-auto lg:max-w-[360px] lg:self-stretch'>
                            <Image
                                src={design.image}
                                alt='Buurtbewoner portret'
                                fill
                                className='object-contain object-bottom'
                                sizes='(max-width: 768px) 90vw, 320px'
                            />
                        </div>
                    )}
                </article>
            );
        }

        return (
            <article
                key={pillar.title}
                className={`flex h-full min-h-[320px] flex-col justify-end rounded-[32px] border border-[#f3d9ba] p-6 text-[#4b2b18] shadow-inner shadow-white/20 ${design.className ?? ''}`}
                style={{ backgroundColor: design.background ?? '#fff8ef' }}>
                {accentIcon}
                <h3 className='mt-3 text-2xl leading-snug font-semibold text-[#5c2b14]'>{pillar.title}</h3>
                <p className='mt-3 text-sm leading-relaxed text-[#6c3d20]'>{pillar.description}</p>
            </article>
        );
    };
    const scrollMissionSliderTo = (index: number) => {
        const slider = missionSliderRef.current;
        if (!slider) {
            return;
        }
        const clamped = Math.max(0, Math.min(index, missionSlidesCount - 1));
        const targetSlide = slider.children[clamped] as HTMLElement | undefined;
        if (!targetSlide) {
            return;
        }
        slider.scrollTo({ left: targetSlide.offsetLeft, behavior: 'smooth' });
    };
    const scrollOverGeinSliderTo = (index: number) => {
        const slider = overGeinSliderRef.current;
        if (!slider) {
            return;
        }
        const clamped = Math.max(0, Math.min(index, slider.children.length - 1));
        const targetSlide = slider.children[clamped] as HTMLElement | undefined;
        if (!targetSlide) {
            return;
        }
        const offset = targetSlide.offsetLeft - Math.max(0, (slider.clientWidth - targetSlide.clientWidth) / 2);
        slider.scrollTo({ left: offset, behavior: 'smooth' });
    };
    const agendaEvents = dict.agenda.events;
    const contactChannels = dict.contact.channels;
    const openEventModal = (events: AgendaEvent[], index = 0) => {
        if (!events.length) {
            return;
        }
        setSelectedEvents(events);
        setActiveEventIndex(index);
        setIsModalOpen(true);
    };
    const closeEventModal = () => {
        setIsModalOpen(false);
    };
    const formatLangLabel = (lang: Locale) => {
        const fullLabel = dict.nav.languages[lang];
        const [flag, ...rest] = fullLabel.split(' ');
        const code = lang.toUpperCase();

        if (flag && rest.length) {
            return `${flag} ${code}`;
        }

        return code;
    };

    useEffect(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
        if (!sections.length) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const bestEntry = entries.reduce<IntersectionObserverEntry | null>((prev, entry) => {
                    if (!entry.isIntersecting) {
                        return prev;
                    }

                    if (!prev || entry.intersectionRatio > prev.intersectionRatio) {
                        return entry;
                    }

                    return prev;
                }, null);

                if (bestEntry) {
                    const nextSection = bestEntry.target.id;

                    if (lastActiveSection.current !== nextSection) {
                        lastActiveSection.current = nextSection;
                        setActiveSection(nextSection);
                    }
                }
            },
            { threshold: 0.3 }
        );

        sections.forEach((section) => observer.observe(section));
        observerRef.current = observer;

        return () => {
            sections.forEach((section) => observer.unobserve(section));
            observer.disconnect();
            observerRef.current = null;
        };
    }, []);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        const slider = missionSliderRef.current;
        if (!slider) {
            return undefined;
        }

        const handleScroll = () => {
            const slides = Array.from(slider.children) as HTMLElement[];
            if (!slides.length) {
                setMissionSlideIndex(0);

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

            setMissionSlideIndex(closestIndex);
        };

        slider.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => slider.removeEventListener('scroll', handleScroll);
    }, [missionSlidesCount]);

    useEffect(() => {
        const handleResize = () => {
            scrollMissionSliderTo(missionSlideIndex);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [missionSlideIndex]);

    useEffect(() => {
        const slider = overGeinSliderRef.current;
        if (!slider) {
            return undefined;
        }

        const handleScroll = () => {
            const slides = Array.from(slider.children) as HTMLElement[];
            if (!slides.length) {
                setOverGeinSlideIndex(0);

                return;
            }

            const sliderCenter = slider.scrollLeft + slider.clientWidth / 2;
            let closestIndex = 0;
            let smallestDistance = Number.POSITIVE_INFINITY;

            slides.forEach((slide, idx) => {
                const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
                const distance = Math.abs(slideCenter - sliderCenter);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    closestIndex = idx;
                }
            });

            setOverGeinSlideIndex(closestIndex);
        };

        slider.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => slider.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            scrollOverGeinSliderTo(overGeinSlideIndex);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [overGeinSlideIndex]);

    return (
        <main className='bg-background text-foreground'>
            <header className='sticky top-0 z-30 border-b border-[#c9832c]/40 bg-[#faeacd] backdrop-blur'>
                <div className='relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-[#43160c] sm:px-6 lg:px-10'>
                    <button
                        type='button'
                        onClick={() => setMobileNavOpen(true)}
                        className='absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-[#43160c]/20 bg-white/70 p-2 text-[#43160c] shadow-sm transition hover:bg-white md:hidden'>
                        <Menu className='size-5' />
                        <span className='sr-only'>Open menu</span>
                    </button>
                    <div className='flex flex-1 items-center justify-center md:justify-start'>
                        <a href={`/${locale}`} className='mx-auto flex items-center gap-3 md:mx-0'>
                            <Image
                                src='/images/bpglogo.png'
                                alt={dict.media.logoAlt}
                                width={180}
                                height={80}
                                className='h-10 w-auto object-contain md:hidden'
                            />
                            <Image
                                src='/images/logotopnav.png'
                                alt={dict.media.logoAlt}
                                width={140}
                                height={60}
                                className='hidden h-10 w-auto object-contain md:block'
                            />
                        </a>
                    </div>
                    <nav className='hidden items-center gap-6 text-sm font-semibold tracking-wide uppercase md:flex'>
                        {navLinks.map((link) => {
                            const sectionId = link.href.split('#')[1];

                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`hover:text-primary transition-colors duration-300 ${
                                        activeSection && sectionId && activeSection === sectionId ? 'text-primary' : ''
                                    }`}>
                                    {link.label}
                                </a>
                            );
                        })}
                    </nav>
                    <div className='flex items-center gap-2 md:static md:ml-auto'>
                        <div ref={langMenuRef} className='relative text-xs font-semibold uppercase'>
                            <button
                                type='button'
                                onClick={() => setLangMenuOpen((prev) => !prev)}
                                aria-expanded={langMenuOpen}
                                className='flex items-center gap-2 rounded-full border border-[#43160c]/20 bg-white/70 px-3 py-1 text-[#43160c] shadow-sm focus:outline-none'>
                                <span>{formatLangLabel(locale as Locale)}</span>
                                <ChevronDown className='size-3 text-[#43160c]' />
                            </button>
                            <div
                                className={`absolute right-0 mt-2 w-28 transform rounded-xl border border-[#43160c]/10 bg-white p-2 text-[#43160c] shadow-lg transition duration-200 ${
                                    langMenuOpen
                                        ? 'visible translate-y-0 opacity-100'
                                        : 'invisible -translate-y-1 opacity-0'
                                }`}>
                                {locales.map((lang) => (
                                    <a
                                        key={lang}
                                        href={`/${lang}`}
                                        onClick={() => setLangMenuOpen(false)}
                                        className={`block rounded-lg px-2 py-1 text-xs transition ${
                                            lang === locale ? 'bg-[#43160c] text-white' : 'hover:bg-[#43160c]/10'
                                        }`}>
                                        {formatLangLabel(lang)}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <a
                            href={`/${locale}#contact`}
                            className='button-lift rounded-full bg-[#ff4d00] px-5 py-2 text-xs font-semibold tracking-widest text-white uppercase shadow shadow-[#ff4d00]/30'>
                            {dict.nav.doeMee}
                        </a>
                    </div>
                </div>
            </header>

            {mobileNavOpen && (
                <div className='fixed inset-x-0 top-0 z-40 bg-[#faeacd] shadow-lg md:hidden'>
                    <div className='flex items-center justify-between px-4 py-3 text-[#43160c]'>
                        <span className='text-sm font-semibold tracking-[0.3em] uppercase'>Menu</span>
                        <button
                            type='button'
                            onClick={() => setMobileNavOpen(false)}
                            className='rounded-full bg-white p-2 text-[#43160c] shadow'>
                            <X className='size-5' />
                            <span className='sr-only'>Sluit menu</span>
                        </button>
                    </div>
                    <nav className='flex flex-col gap-2 border-t border-[#c9832c]/20 px-4 py-4 text-sm font-semibold text-[#43160c] uppercase'>
                        {navLinks.map((link) => (
                            <a
                                key={`mobile-${link.href}`}
                                href={link.href}
                                onClick={() => setMobileNavOpen(false)}
                                className='rounded-2xl border border-[#43160c]/10 bg-white/70 px-4 py-3 shadow-sm'>
                                {link.label}
                            </a>
                        ))}
                        <div className='flex flex-wrap gap-2 pt-2'>
                            {locales.map((lang) => (
                                <a
                                    key={`mobile-lang-${lang}`}
                                    href={`/${lang}`}
                                    onClick={() => setMobileNavOpen(false)}
                                    className={`flex-1 rounded-full border border-[#43160c]/10 px-3 py-2 text-center text-xs ${
                                        lang === locale ? 'bg-[#43160c] text-white' : 'bg-white/80'
                                    }`}>
                                    {formatLangLabel(lang)}
                                </a>
                            ))}
                        </div>
                    </nav>
                </div>
            )}

            <section className='bg-background relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden'>
                <video
                    className='absolute inset-0 h-full w-full object-cover'
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster='/images/screenshot1.png'>
                    <source src='/images/bpghero.mp4' type='video/mp4' />
                </video>
                <div className='absolute inset-0 bg-gradient-to-b from-[#1a0801]/55 via-[#d06129]/40 to-[#eaa854]/35' />
                <div className='relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center text-white sm:px-6 lg:px-10'>
                    <Image
                        src='/images/bpglogo.png'
                        alt={dict.media.heroLogoAlt}
                        width={320}
                        height={150}
                        className='h-auto w-56 sm:w-72'
                    />
                    <h1 className='text-4xl leading-tight font-black sm:text-5xl lg:text-6xl'>
                        <span className='block'>{dict.hero.titleLine1}</span>
                        <span className='block'>{dict.hero.titleLine2}</span>
                    </h1>
                    <div className='flex flex-wrap gap-4'>
                        <a
                            href={`/${locale}#contact`}
                            className='button-lift w-40 rounded-full bg-[#ff4d00] px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase shadow-lg shadow-[#ff4d00]/40'>
                            {dict.hero.primaryCta}
                        </a>
                        <a
                            href={`/${locale}#nieuws`}
                            className='button-lift rounded-full bg-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-white uppercase backdrop-blur transition'>
                            {dict.hero.secondaryCta}
                        </a>
                    </div>
                </div>
            </section>

            <div
                className='relative'
                style={{
                    backgroundImage: "url('/images/onze-missie-bg.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <SectionWrapper id='missie'>
                    <div className='space-y-4 text-[#5c220f]'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#ff4d00] sm:w-48' />
                        <h2 className='text-[clamp(3.25rem,6vw,5rem)] font-black tracking-tight text-[#5c1d0c] uppercase'>
                            {dict.mission.title}
                        </h2>
                        <p className='text-xl font-semibold text-[#ff4d00]'>{dict.mission.subtitle}</p>
                        <p className='max-w-3xl text-base leading-relaxed text-[#4a2c18]'>{dict.mission.description}</p>
                    </div>
                    <div className='mt-10 md:hidden'>
                        <div
                            ref={missionSliderRef}
                            className='mission-slider -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6'
                            style={{ scrollbarWidth: 'none', scrollPadding: '0 1.5rem' }}>
                            <style jsx>{`
                                .mission-slider {
                                    scroll-behavior: smooth;
                                }
                                .mission-slider::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            {missionPillars.map((pillar, index) => (
                                <div key={`${pillar.title}-mobile`} className='w-full flex-shrink-0 snap-center px-2'>
                                    <div className='mx-auto h-full max-w-md'>{renderMissionCard(pillar, index)}</div>
                                </div>
                            ))}
                        </div>
                        <div className='mt-3 flex items-center justify-center gap-2 px-4'>
                            {missionPillars.map((_, index) => (
                                <button
                                    key={`mission-dot-${index}`}
                                    type='button'
                                    onClick={() => scrollMissionSliderTo(index)}
                                    className={`h-2 rounded-full transition-all ${
                                        missionSlideIndex === index ? 'w-6 bg-[#ff4d00]' : 'w-2 bg-[#d9c4ad]'
                                    }`}
                                    aria-label={`Ga naar missie slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='mt-10 hidden auto-rows-[minmax(220px,_1fr)] gap-5 md:grid md:grid-cols-2 lg:grid-cols-3'>
                        {missionPillars.map((pillar, index) => renderMissionCard(pillar, index))}
                    </div>
                </SectionWrapper>
            </div>

            <section aria-label={dict.marquee.ariaLabel} className='overflow-hidden bg-transparent py-0'>
                <div className='relative'>
                    <div className='marquee-track flex gap-0'>
                        {infiniteLoopImages.concat(infiniteLoopImages).map((src, index) => (
                            <div key={`${src}-${index}`} className='flex-none'>
                                <Image
                                    src={src}
                                    alt={dict.media.marqueeAlt}
                                    width={600}
                                    height={320}
                                    className='h-48 w-auto object-cover sm:h-56'
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className='relative bg-[#d06129]'>
                <SectionWrapper id='over-gein'>
                    <div className='space-y-4 text-[#fff8ef]'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#33c17d] sm:w-48' />
                        <h2 className='text-[clamp(3rem,5.5vw,4.5rem)] font-black tracking-tight uppercase'>
                            {dict.overGein.title}
                        </h2>
                        <div className='hidden rounded-3xl border border-white/15 bg-white/5 p-6 text-sm text-white/85 shadow-inner shadow-black/10 backdrop-blur lg:block'>
                            <p className='text-xs font-semibold tracking-[0.3em] text-[#ffe7c7] uppercase'>
                                {dict.overGein.subtitle}
                            </p>
                            <div className='mt-4 grid gap-6 text-white/90 lg:grid-cols-2'>
                                <div>
                                    <p className='text-xs font-semibold tracking-[0.2em] text-white/70 uppercase'>
                                        {dict.overGein.neighborhoodsTitle}
                                    </p>
                                    <ul className='mt-2 list-disc space-y-1 pl-5 text-base'>
                                        {dict.overGein.neighborhoodsList.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className='text-xs font-semibold tracking-[0.2em] text-white/70 uppercase'>
                                        {dict.overGein.ageTitle}
                                    </p>
                                    <p className='mt-2 text-base leading-relaxed'>{dict.overGein.ageDescription}</p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-8 lg:hidden'>
                            <div
                                ref={overGeinSliderRef}
                                className='over-gein-slider -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6'
                                style={{ scrollbarWidth: 'none', scrollPadding: '0 1.5rem' }}>
                                <style jsx>{`
                                    .over-gein-slider {
                                        scroll-behavior: smooth;
                                    }
                                    .over-gein-slider::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                                <div className='w-full flex-shrink-0 snap-center px-2'>
                                    <div className='space-y-4'>
                                        <div className='rounded-3xl border border-white/20 bg-white/10 p-5 text-sm text-white/85 shadow-inner shadow-black/10 backdrop-blur'>
                                            <div className='mt-1 space-y-3'>
                                                <div>
                                                    <p className='text-xs font-semibold tracking-[0.2em] text-white/70 uppercase'>
                                                        {dict.overGein.neighborhoodsTitle}
                                                    </p>
                                                    <ul className='mt-1 list-disc space-y-1 pl-5 text-[0.8rem] text-white/85'>
                                                        {dict.overGein.neighborhoodsList.map((item, idx) => (
                                                            <li key={idx}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className='text-xs font-semibold tracking-[0.2em] text-white/70 uppercase'>
                                                        {dict.overGein.ageTitle}
                                                    </p>
                                                    <p className='text-[0.8rem] leading-relaxed text-white/85'>
                                                        {dict.overGein.ageDescription}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='grid gap-4 text-sm font-semibold tracking-[0.2em] text-[#43160c] uppercase sm:grid-cols-3'>
                                            {dict.overGein.stats.map((stat) => (
                                                <div
                                                    key={`${stat.label}-mobile`}
                                                    className='rounded-2xl bg-white/90 px-4 py-5'>
                                                    <p className='text-xs text-[#8c3d16]'>{stat.label}</p>
                                                    <p className='mt-2 text-3xl font-black text-[#d06129]'>
                                                        {stat.value}
                                                    </p>
                                                    <p className='text-xs text-[#8c3d16]'>{stat.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex-shrink-0 snap-center px-2'>
                                    <div className='space-y-4'>
                                        <div className='overflow-hidden rounded-3xl border border-white/30 shadow-lg shadow-black/10'>
                                            <Image
                                                src='/images/over-gein-map.png'
                                                alt={dict.media.mapAlt}
                                                width={900}
                                                height={900}
                                                className='block h-auto w-full object-cover'
                                                sizes='100vw'
                                            />
                                        </div>
                                        <div className='rounded-3xl border border-white/30 bg-white/15 p-5 text-white shadow-inner shadow-black/10 backdrop-blur'>
                                            <h3 className='text-base font-semibold tracking-wide uppercase'>
                                                {dict.overGein.outlookTitle}
                                            </h3>
                                            <div className='mt-3 space-y-4 text-white/90'>
                                                {dict.overGein.outlookPoints.map((point) => (
                                                    <div key={point.title}>
                                                        <p className='text-sm font-bold text-white'>{point.title}</p>
                                                        <p className='text-xs text-white/80'>{point.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex-shrink-0 snap-center px-2'>
                                    <div className='min-h-[380px] rounded-3xl border border-white/20 bg-white/5 p-6 text-white/90 shadow-inner shadow-black/5 backdrop-blur'>
                                        <div className='flex items-center justify-between text-xs font-semibold tracking-[0.25em] text-white uppercase'>
                                            <span>{dict.overGein.neighborhoodStatsTitle}</span>
                                            <span className='text-white/60'>2026</span>
                                        </div>
                                        <div className='mt-4 flex flex-col gap-4 text-sm'>
                                            {neighborhoodStats.map((stat) => (
                                                <div
                                                    key={stat.name}
                                                    className='rounded-2xl border border-white/15 bg-white/5 p-3'>
                                                    <p className='text-base font-bold text-white'>{stat.name}</p>
                                                    <div className='mt-2 grid grid-cols-3 gap-2 text-center text-white/85'>
                                                        <div>
                                                            <p className='text-lg font-extrabold text-white'>
                                                                {stat.inwoners}
                                                            </p>
                                                            <p className='text-[0.55rem] tracking-[0.3em] uppercase'>
                                                                {dict.overGein.statsLabels.residents}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-lg font-extrabold text-white'>
                                                                {stat.woningen}
                                                            </p>
                                                            <p className='text-[0.55rem] tracking-[0.3em] uppercase'>
                                                                {dict.overGein.statsLabels.homes}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className='text-lg font-extrabold text-white'>
                                                                {stat.huur}
                                                            </p>
                                                            <p className='text-[0.55rem] tracking-[0.3em] uppercase'>
                                                                {dict.overGein.statsLabels.rental}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-3 flex items-center justify-center gap-2 px-4'>
                                {[0, 1, 2].map((index) => (
                                    <button
                                        key={`over-gein-dot-${index}`}
                                        type='button'
                                        onClick={() => scrollOverGeinSliderTo(index)}
                                        className={`h-2 rounded-full transition-all ${
                                            overGeinSlideIndex === index ? 'w-6 bg-[#33c17d]' : 'w-2 bg-[#ffe7c7]/50'
                                        }`}
                                        aria-label={`Ga naar Over Gein slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className='mt-8 hidden items-start gap-8 text-[#fff8ef] lg:grid lg:grid-cols-[2fr_1fr]'>
                            <div className='overflow-hidden rounded-3xl border border-white/30 shadow-lg shadow-black/10'>
                                <Image
                                    src='/images/over-gein-map.png'
                                    alt={dict.media.mapAlt}
                                    width={900}
                                    height={900}
                                    className='block h-auto w-full object-cover'
                                    sizes='(max-width: 768px) 100vw, 75vw'
                                />
                            </div>
                            <div className='space-y-6 text-sm text-white/90'>
                                <div className='rounded-3xl border border-white/30 bg-white/15 p-5 shadow-inner shadow-black/10 backdrop-blur'>
                                    <h3 className='text-base font-semibold tracking-wide text-white uppercase'>
                                        {dict.overGein.outlookTitle}
                                    </h3>
                                    <div className='mt-3 space-y-4 text-white/90'>
                                        {dict.overGein.outlookPoints.map((point) => (
                                            <div key={point.title}>
                                                <p className='text-sm font-bold text-white'>{point.title}</p>
                                                <p className='text-xs text-white/80'>{point.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='rounded-3xl border border-white/20 bg-white/5 p-4 text-white/80 shadow-inner shadow-black/5 backdrop-blur'>
                                    <div className='flex items-center justify-between text-xs font-semibold tracking-[0.25em] text-white uppercase'>
                                        <span>{dict.overGein.neighborhoodStatsTitle}</span>
                                        <span className='text-white/60'>2026</span>
                                    </div>
                                    <div className='mt-3 flex flex-col gap-4 text-[0.65rem]'>
                                        {neighborhoodStats.map((stat) => (
                                            <div
                                                key={stat.name}
                                                className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                                                <p className='text-sm font-bold text-white'>{stat.name}</p>
                                                <div className='mt-2 grid grid-cols-3 gap-2 text-center text-white/80'>
                                                    <div>
                                                        <p className='text-base font-bold text-white'>
                                                            {stat.inwoners}
                                                        </p>
                                                        <p className='mt-1 text-[0.55rem] tracking-[0.3em] uppercase'>
                                                            {dict.overGein.statsLabels.residents}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='text-base font-bold text-white'>
                                                            {stat.woningen}
                                                        </p>
                                                        <p className='mt-1 text-[0.55rem] tracking-[0.3em] uppercase'>
                                                            {dict.overGein.statsLabels.homes}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='text-base font-bold text-white'>{stat.huur}</p>
                                                        <p className='mt-1 text-[0.55rem] tracking-[0.3em] uppercase'>
                                                            {dict.overGein.statsLabels.rental}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            </div>

            <div
                className='relative'
                style={{
                    backgroundImage: "url('/images/onze-missie-bg.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <SectionWrapper id='initiatieven'>
                    <div className='space-y-4 text-[#5c220f]'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#ff4d00] sm:w-48' />
                        <h2 className='text-[clamp(3rem,5.5vw,4.5rem)] font-black tracking-tight text-[#5c1d0c] uppercase'>
                            {dict.initiatives.title}
                        </h2>
                        <p className='text-xl font-semibold text-[#ff4d00]'>{dict.initiatives.subtitle}</p>
                        <p className='max-w-3xl text-base leading-relaxed text-[#4a2c18]'>
                            {dict.initiatives.description}
                        </p>
                    </div>
                    <div className='mt-8'>
                        <HighlightsShowcase
                            highlights={dict.highlights.items}
                            modalEyebrow={dict.ui.modalEyebrow}
                            closeLabel={dict.ui.closeLabel}
                        />
                    </div>
                </SectionWrapper>
            </div>

            <div className='relative bg-[#d06129] text-white'>
                <SectionWrapper id='nieuws' className='text-white'>
                    <div className='space-y-4 text-left [&>*]:m-0'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#33c17d] sm:w-48' />
                        <h2 className='text-[clamp(3.25rem,6vw,5rem)] leading-none font-black text-[#faeacd] uppercase'>
                            {dict.news.title}
                        </h2>
                        <p className='text-xl font-semibold text-[#33c17d]'>{dict.news.subtitle}</p>
                        <p className='max-w-3xl text-base leading-relaxed text-white/90'>{dict.news.description}</p>
                    </div>
                    <div className='mt-10'>
                        <NewsShowcase locale={locale} newsControls={dict.newsControls} />
                    </div>
                </SectionWrapper>
            </div>

            <div
                className='relative'
                style={{
                    backgroundImage: "url('/images/onze-missie-bg.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <SectionWrapper id='agenda'>
                    <div className='space-y-4 text-[#5c220f]'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#ff4d00] sm:w-48' />
                        <h2 className='text-[clamp(3rem,5.5vw,4.5rem)] font-black tracking-tight text-[#5c1d0c] uppercase'>
                            {dict.agenda.title}
                        </h2>
                        <p className='text-xl font-semibold text-[#ff4d00]'>{dict.agenda.subtitle}</p>
                        <p className='max-w-3xl text-base leading-relaxed text-[#4a2c18]'>{dict.agenda.description}</p>
                        <div className='flex flex-wrap gap-4'>
                            <a
                                href={`/${locale}#contact`}
                                className='inline-flex items-center gap-3 rounded-full border border-[#ff4d00]/40 bg-white/80 px-5 py-2 text-sm font-semibold text-[#5c1d0c] shadow shadow-[#ff4d00]/20'>
                                <MessageSquare className='size-4 text-[#ff4d00]' /> {dict.agenda.ctaLabel}
                            </a>
                        </div>
                    </div>
                    <div className='mt-8 space-y-6'>
                        <div className='flex justify-end'>
                            <div className='inline-flex rounded-full border border-[#ff4d00]/40 bg-white/80 p-1 shadow shadow-[#ff4d00]/20'>
                                <button
                                    type='button'
                                    onClick={() => setAgendaView('cards')}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition ${
                                        agendaView === 'cards' ? 'bg-[#ff4d00] text-white' : 'text-[#5c1d0c]'
                                    }`}>
                                    {dict.agenda.viewToggle.cards}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setAgendaView('month')}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition ${
                                        agendaView === 'month' ? 'bg-[#ff4d00] text-white' : 'text-[#5c1d0c]'
                                    }`}>
                                    {dict.agenda.viewToggle.calendar}
                                </button>
                            </div>
                        </div>

                        <div className='transition-all duration-300 ease-in-out'>
                            {agendaView === 'cards' ? (
                                <AgendaShowcase
                                    events={agendaEvents}
                                    onEventClick={(event) => openEventModal([event], 0)}
                                    moreInfo={dict.agenda.moreInfo}
                                />
                            ) : (
                                <div className='space-y-4'>
                                    <div className='md:hidden'>
                                        <AgendaWeekView
                                            events={agendaEvents}
                                            onDayClick={(eventsForDay: AgendaEvent[]) =>
                                                openEventModal(eventsForDay, 0)
                                            }
                                            calendarLabels={{
                                                weekDays: dict.agenda.calendar.weekDays,
                                                previousWeek: dict.agenda.calendar.previousWeek,
                                                nextWeek: dict.agenda.calendar.nextWeek,
                                                noEvents: dict.agenda.calendar.noEvents
                                            }}
                                            locale={locale}
                                        />
                                    </div>
                                    <div className='hidden md:block'>
                                        <AgendaMonthView
                                            events={agendaEvents}
                                            onDayClick={(eventsForDay: AgendaEvent[]) =>
                                                openEventModal(eventsForDay, 0)
                                            }
                                            monthDays={dict.agenda.calendar.monthDays}
                                            previousMonth={dict.agenda.calendar.previousMonth}
                                            nextMonth={dict.agenda.calendar.nextMonth}
                                            locale={locale}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </SectionWrapper>
            </div>

            <div className='relative bg-[#d06129] text-white'>
                <SectionWrapper id='newsletter' className='text-white'>
                    <div className='space-y-3 text-left'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#33c17d] sm:w-48' />
                        <h2 className='text-[clamp(2.75rem,5vw,4rem)] leading-tight font-black text-white uppercase'>
                            {dict.contact.title}
                        </h2>
                        <p className='text-lg font-semibold text-[#33c17d]'>{dict.contact.subtitle}</p>
                    </div>
                    <div className='mt-8 grid gap-4 lg:grid-cols-2'>
                        <div className='space-y-4 rounded-3xl border border-white/25 bg-white/5 p-6 shadow-lg shadow-black/10'>
                            <div className='rounded-2xl border border-white/15 bg-white/5 p-4'>
                                <p className='text-xs font-semibold tracking-[0.3em] text-white/70 uppercase'>
                                    {dict.contact.formEyebrow}
                                </p>
                                <h3 className='mt-2 text-3xl leading-tight font-black text-white sm:text-4xl'>
                                    {dict.contact.formTitle}
                                </h3>
                                <p className='mt-3 text-sm text-white/85'>{dict.contact.formDescription}</p>
                                <form className='mt-5 space-y-4'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <div>
                                            <label htmlFor='name' className='text-xs font-semibold text-white'>
                                                {dict.contact.fields.nameLabel}
                                            </label>
                                            <input
                                                id='name'
                                                name='name'
                                                type='text'
                                                placeholder={dict.contact.fields.namePlaceholder}
                                                className='mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor='email' className='text-xs font-semibold text-white'>
                                                {dict.contact.fields.emailLabel}
                                            </label>
                                            <input
                                                id='email'
                                                name='email'
                                                type='email'
                                                placeholder={dict.contact.fields.emailPlaceholder}
                                                className='mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor='message' className='text-xs font-semibold text-white'>
                                            {dict.contact.fields.messageLabel}
                                        </label>
                                        <textarea
                                            id='message'
                                            name='message'
                                            rows={3}
                                            placeholder={dict.contact.fields.messagePlaceholder}
                                            className='mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                        />
                                    </div>
                                    <button
                                        type='button'
                                        className='w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#d06129] shadow-md shadow-[#d06129]/30'>
                                        {dict.contact.formButton}
                                    </button>
                                </form>
                            </div>
                            <div className='rounded-2xl border border-white/15 bg-white/5 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4'>
                                <div>
                                    <p className='text-[10px] font-semibold tracking-[0.35em] text-white/70 uppercase'>
                                        {dict.contact.newsletterEyebrow}
                                    </p>
                                    <h3 className='mt-1 text-xl leading-tight font-bold text-white'>
                                        {dict.contact.newsletterTitle}
                                    </h3>
                                    <p className='mt-2 text-sm text-white/80'>{dict.contact.newsletterDescription}</p>
                                </div>
                                <div className='mt-4 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto sm:flex-row'>
                                    <input
                                        type='email'
                                        placeholder={dict.contact.newsletterPlaceholder}
                                        className='flex-1 rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                    />
                                    <button className='rounded-xl bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#d06129] uppercase shadow shadow-[#d06129]/25'>
                                        {dict.contact.newsletterButton}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-4 rounded-3xl border border-white/25 bg-white/5 p-6 text-white shadow-lg shadow-black/10'>
                            <div className='rounded-2xl border border-dashed border-white/25 p-4'>
                                <p className='text-[10px] font-semibold tracking-[0.4em] text-white/70 uppercase'>
                                    {dict.contact.channelsEyebrow}
                                </p>
                                <div className='mt-3 grid gap-3 sm:grid-cols-2'>
                                    {contactChannels.map((channel) => {
                                        const Icon = contactChannelIconMap[channel.type];

                                        return (
                                            <a
                                                key={channel.title}
                                                href={channel.href}
                                                target={channel.href.startsWith('#') ? '_self' : '_blank'}
                                                rel={channel.href.startsWith('#') ? undefined : 'noreferrer'}
                                                className='flex flex-col items-center gap-2 rounded-2xl border border-white/30 px-4 py-3 text-white transition hover:-translate-y-0.5 hover:border-white/60'>
                                                <span className='inline-flex items-center justify-center rounded-full bg-white/10 p-2.5 text-white'>
                                                    {Icon ? <Icon className='size-5' /> : <Mail className='size-5' />}
                                                </span>
                                                <div className='text-center'>
                                                    <p className='text-sm font-semibold'>{channel.title}</p>
                                                    <p className='text-xs text-white/80'>{channel.description}</p>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className='rounded-2xl border border-white/25 p-4'>
                                <p className='text-[10px] font-semibold tracking-[0.4em] text-white/70 uppercase'>
                                    {dict.contact.addressEyebrow}
                                </p>
                                <h3 className='mt-2 text-xl leading-tight font-bold text-white'>
                                    {dict.contact.addressTitle}
                                </h3>
                                <p className='text-sm text-white'>{dict.contact.addressLine}</p>
                                <p className='mt-2 text-xs text-white/80'>{dict.contact.addressNote}</p>
                                <div className='mt-3 overflow-hidden rounded-2xl border border-white/25'>
                                    <iframe
                                        title={dict.contact.addressMapTitle}
                                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2434.770649091407!2d4.987295676800463!3d52.28737507207966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c60b1cfdcfe28b%3A0x60f18d98ad18c05e!2sWoudrichemstraat%208%2C%201106%20LG%20Amsterdam!5e0!3m2!1snl!2snl!4v1708461230000!5m2!1snl!2snl'
                                        className='h-52 w-full border-0'
                                        loading='lazy'
                                        referrerPolicy='no-referrer-when-downgrade'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            </div>

            <footer
                id='contact'
                className='bg-[#faeacd] px-4 py-10 text-[#43160c] sm:px-6 lg:px-10'
                style={{
                    backgroundImage: "url('/images/onze-missie-bg.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>
                <div className='mx-auto max-w-6xl'>
                    <div className='flex flex-col gap-8 border-b border-[#43160c]/15 pb-6 text-center md:flex-row md:items-end md:justify-between md:text-left'>
                        <div className='flex flex-col items-center gap-4 md:flex-row md:items-center'>
                            <Image
                                src='/images/bpglogo.png'
                                alt={dict.media.logoAlt}
                                width={160}
                                height={80}
                                className='h-auto w-24 object-contain md:mx-0 md:w-32'
                            />
                            <div className='space-y-3 md:space-y-2'>
                                <p className='text-xs font-semibold tracking-[0.45em] text-[#43160c]/70 uppercase'>
                                    {dict.footer.orgName}
                                </p>
                                <h3 className='text-[clamp(2rem,4vw,2.75rem)] leading-tight font-black'>
                                    {dict.footer.tagline}
                                </h3>
                                <p className='text-base font-semibold text-[#ff4d00]'>{dict.footer.highlight}</p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-center gap-3 md:justify-end'>
                                <a
                                    href='https://www.instagram.com/buurtplatformgein/'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='flex h-12 w-12 items-center justify-center rounded-full bg-[#43160c] text-white transition hover:-translate-y-0.5 hover:bg-[#d06129]'>
                                    <Instagram className='size-5' />
                                </a>
                                <a
                                    href='https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='flex h-12 w-12 items-center justify-center rounded-full bg-[#43160c] text-white transition hover:-translate-y-0.5 hover:bg-[#d06129]'>
                                    <Phone className='size-5' />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='my-8 border-t border-[#43160c]/20' />
                    <div className='flex flex-col items-center text-center text-sm leading-tight text-[#43160c]/80 md:flex md:flex-row md:flex-wrap md:items-center md:justify-between md:text-left'>
                        <span className='block text-sm md:text-xs'>
                            {' '}
                            {new Date().getFullYear()} {dict.footer.orgName}
                        </span>
                        <span className='block text-xs md:ml-6 md:inline'>{dict.footer.legal.foundation}</span>
                        <span className='block text-xs md:ml-6 md:inline'>{dict.footer.legal.registration}</span>
                        <span className='block text-xs md:ml-6 md:inline'>{dict.footer.legal.status}</span>
                        <a
                            href='mailto:bewonersplatformgein@gmail.com'
                            className='block text-xs underline md:ml-6 md:inline'>
                            bewonersplatformgein@gmail.com
                        </a>
                    </div>
                </div>
            </footer>
            {isModalOpen && selectedEvents.length > 0 && (
                <EventModal
                    events={selectedEvents}
                    activeIndex={activeEventIndex}
                    onClose={closeEventModal}
                    onNext={() =>
                        setActiveEventIndex((prev) =>
                            selectedEvents.length ? (prev + 1) % selectedEvents.length : prev
                        )
                    }
                    onPrev={() =>
                        setActiveEventIndex((prev) =>
                            selectedEvents.length ? (prev - 1 + selectedEvents.length) % selectedEvents.length : prev
                        )
                    }
                    eventModal={dict.ui.eventModal}
                />
            )}
        </main>
    );
};

export default Page;
