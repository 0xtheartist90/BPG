'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import Image from 'next/image';

import { Building2, Instagram, Mail, MessageSquare, Users, MessageCircle, Megaphone, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NewsShowcase from '@/components/NewsShowcase';
import AgendaShowcase from '@/components/AgendaShowcase';
import HighlightsShowcase from '@/components/HighlightsShowcase';

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

type AgendaEvent = {
    date: string;
    time: string;
    title: string;
    location: string;
    description: string;
    image: string;
    start: string;
    end: string;
};

const pillars: CardItem[] = [
    {
        title: 'Samenwerking met partners',
        description:
            'Tweemaandelijks wijkoverleg met 30+ partners, kwartaalgesprekken met Gebiedsbeheer en structurele afstemming met gemeente, Democratisering en Stichting !WOON voor snelle opvolging.',
        icon: Users
    },
    {
        title: 'Buurthub De Ster',
        description:
            'Een locatie in Gein waar bewoners, organisaties en gemeente elkaar ontmoeten. Hier starten plannen, spreekuren en pilots.',
        icon: Building2
    },
    {
        title: 'Verbinden & activeren',
        description:
            'Website, nieuwsbrief, Instagram en de WhatsApp Community brengen buren met elkaar in gesprek en inspireren tot actie.',
        icon: MessageSquare
    },
    {
        title: 'Stem van de buurt',
        description: 'We signaleren zorgen, stimuleren inspraak en houden de overheid scherp voor wat inwoners van Gein nodig hebben.',
        icon: Megaphone
    }
];

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

const agendaEvents: AgendaEvent[] = [
    {
        date: '27 september 2026',
        time: '08:00 – 20:00',
        title: 'Gein 40 jaar jubileumdag',
        location: 'Veld bij Cornelis Aarnoutsstraat',
        description:
            'We vieren Burendag met een dagvullend programma: ochtendwandelingen, buurtpicknicks, live muziek en verhalen over 40 jaar Gein. Doe mee als vrijwilliger of kom gewoon genieten.',
        image: '/images/Infinite%20loop/bpgloop3.png',
        start: '2026-09-27T08:00:00+02:00',
        end: '2026-09-27T20:00:00+02:00'
    },
    {
        date: '24 augustus 2026',
        time: '13:00 – 17:00',
        title: 'Buurtfeest Gein – einde zomer editie',
        location: 'Wisseloord Winkelstraat 97, Amsterdam',
        description:
            'Een gratis buurtfeest vol muziek, kinderactiviteiten en lokale lekkernijen. Vier mee dat Gein 40 jaar bestaat en verbind met buren die het verschil maken.',
        image: '/images/Infinite%20loop/bpgloop4.png',
        start: '2026-08-24T13:00:00+02:00',
        end: '2026-08-24T17:00:00+02:00'
    }
];

const infiniteLoopImages = [
    '/images/Infinite%20loop/bpgloop1.png',
    '/images/Infinite%20loop/bpgloop2.png',
    '/images/Infinite%20loop/bpgloop3.png',
    '/images/Infinite%20loop/bpgloop4.png',
    '/images/Infinite%20loop/bpgloop5.png',
    '/images/Infinite%20loop/bpgloop6.png',
    '/images/Infinite%20loop/bpgloop7.png',
    '/images/Infinite%20loop/bpgloop8.png'
];

const navLinks = [
    { label: 'Missie', href: '#missie' },
    { label: 'Over Gein', href: '#over-gein' },
    { label: 'Initiatieven', href: '#initiatieven' },
    { label: 'Nieuws', href: '#nieuws' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Contact', href: '#newsletter' }
];

const contactChannels: { title: string; description: string; href: string; icon: LucideIcon }[] = [
    {
        title: 'Instagram',
        description: '@buurtplatformgein voor foto’s, verhalen en oproepen.',
        href: 'https://www.instagram.com/buurtplatformgein/',
        icon: Instagram
    },
    {
        title: 'WhatsApp',
        description: 'Direct in gesprek met buurtgenoten via onze groep.',
        href: 'https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA',
        icon: Phone
    }
];

const SectionWrapper = ({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) => (
    <section id={id} className={`px-4 py-16 sm:px-6 lg:px-10 ${className}`}>
        <div className='mx-auto max-w-6xl'>{children}</div>
    </section>
);

const Page = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.3 }
        );

        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    return (
        <main className='bg-background text-foreground'>
            <header className='sticky top-0 z-30 border-b border-[#c9832c]/40 bg-[#faeacd] backdrop-blur'>
                <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-[#43160c] sm:px-6 lg:px-10'>
                    <div className='flex items-center gap-3'>
                        <a href='#' className='flex items-center gap-3'>
                            <Image src='/images/logotopnav.png' alt='Buurtplatform Gein logo' width={140} height={60} className='h-10 w-auto object-contain' />
                        </a>
                    </div>
                    <nav className='hidden items-center gap-6 text-sm font-semibold uppercase tracking-wide md:flex'>
                        {navLinks.map((link) => (
                            <a 
                                key={link.href} 
                                href={link.href} 
                                className={`transition-colors duration-300 hover:text-primary ${
                                    activeSection && activeSection === link.href.slice(1) ? 'text-primary' : ''
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <a
                        href='#contact'
                        className='button-lift rounded-full bg-[#ff4d00] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow shadow-[#ff4d00]/30'>
                        Doe mee
                    </a>
                </div>
            </header>

            <section className='relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden bg-background'>
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
                    <Image src='/images/bpglogo.png' alt='Buurtplatform Gein logo' width={320} height={150} className='h-auto w-56 sm:w-72' />
                    <h1 className='text-4xl font-black leading-tight sm:text-5xl lg:text-6xl'>
                        <span className='block'>Bewoners in Gein</span>
                        <span className='block'>Voor elkaar met elkaar</span>
                    </h1>
                    <div className='flex flex-wrap gap-4'>
                        <a
                            href='#contact'
                            className='button-lift rounded-full bg-[#ff4d00] w-40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#ff4d00]/40'>
                            Doe mee
                        </a>
                        <a
                            href='#nieuws'
                            className='button-lift rounded-full bg-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition'>
                            Laatste nieuws
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
                        <h2 className='text-[clamp(3.25rem,6vw,5rem)] font-black uppercase tracking-tight text-[#5c1d0c]'>Onze missie</h2>
                        <p className='text-xl font-semibold text-[#ff4d00]'>Een actieve, inclusieve buurt met oog voor elkaar.</p>
                        <p className='max-w-3xl text-base leading-relaxed text-[#4a2c18]'>
                            We verbinden bewoners, ondersteunen initiatieven en blijven in gesprek met de gemeente zodat plannen voor Gein altijd beginnen bij wat bewoners belangrijk vinden. Onze grondhouding is actief verbinden: luisteren, initiëren en ruimte geven aan verschillende perspectieven.
                        </p>
                    </div>
                    <div className='mt-10 grid gap-5 lg:grid-cols-3 auto-rows-[minmax(220px,_1fr)]'>
                        {pillars.map((pillar, index) => {
                            const design = missionCardDesigns[index] ?? { variant: 'text' };
                            const accentIcon = pillar.icon ? (
                                <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d00] text-white'>
                                    <pillar.icon className='size-6' />
                                </div>
                            ) : null;

                            if (design.variant === 'hero') {
                                return (
                                    <article key={pillar.title} className={`relative overflow-hidden rounded-[32px] ${design.className ?? ''}`}>
                                        {design.image && (
                                            <Image
                                                src={design.image}
                                                alt={pillar.title}
                                                fill
                                                className='object-cover'
                                                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px'
                                            />
                                        )}
                                        <div className='absolute inset-0 bg-gradient-to-br from-[#3b1c0f]/85 via-[#7a3f21]/60 to-transparent' />
                                        <div className='relative z-10 flex h-full flex-col justify-end p-6 text-white'>
                                            {accentIcon}
                                            <div className='mt-4 max-w-[90%] space-y-3 md:max-w-[70%] lg:max-w-[66%]'>
                                                <h3 className='text-2xl font-semibold leading-snug'>{pillar.title}</h3>
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
                                        className={`flex flex-col gap-6 rounded-[32px] p-6 text-white shadow-lg shadow-[#1f2f27]/40 lg:flex-row lg:items-stretch ${design.className ?? ''}`}
                                        style={{ backgroundColor: design.background }}>
                                        <div className='flex-1 space-y-3 lg:max-w-[66%] lg:self-end'>
                                            {accentIcon}
                                            <h3 className='text-2xl font-semibold leading-snug'>{pillar.title}</h3>
                                            <p className='text-sm text-white/85'>{pillar.description}</p>
                                        </div>
                                        {design.image && (
                                            <div className='flex w-full items-end justify-center -mt-2 lg:-mt-4 lg:-mb-6 lg:max-w-[360px] lg:self-stretch'>
                                                <div className='relative h-full min-h-[300px] w-full'>
                                                    <Image
                                                        src={design.image}
                                                        alt='Buurtbewoner portret'
                                                        fill
                                                        className='object-contain object-bottom'
                                                        sizes='(max-width: 768px) 80vw, 320px'
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                );
                            }

                                return (
                                    <article
                                        key={pillar.title}
                                        className={`flex h-full flex-col justify-end rounded-[32px] border border-[#f3d9ba] p-6 text-[#4b2b18] shadow-inner shadow-white/20 ${design.className ?? ''}`}
                                        style={{ backgroundColor: design.background ?? '#fff8ef' }}>
                                        {accentIcon}
                                        <h3 className='mt-3 text-2xl font-semibold leading-snug text-[#5c2b14]'>{pillar.title}</h3>
                                        <p className='mt-3 text-sm leading-relaxed text-[#6c3d20]'>{pillar.description}</p>
                                    </article>
                                );
                            })}
                    </div>
                </SectionWrapper>
            </div>

            <section aria-label='Buurtbeelden' className='overflow-hidden bg-transparent py-0'>
                <div className='relative'>
                    <div className='marquee-track flex gap-0'>
                        {infiniteLoopImages.concat(infiniteLoopImages).map((src, index) => (
                            <div key={`${src}-${index}`} className='flex-none'>
                                <Image
                                    src={src}
                                    alt='Buurtplatform Gein foto collage'
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
                        <h2 className='text-[clamp(3rem,5.5vw,4.5rem)] font-black uppercase tracking-tight'>Over Gein</h2>
                        <p className='text-xl font-semibold text-[#ffe7c7]'>Cijfers, context en vooruitblik voor onze wijk.</p>
                        <div className='text-sm uppercase tracking-[0.35em] text-[#ffe7c7]/80'>Ad Grool · Amsterdam 2025</div>
                    </div>
                    <div className='mt-8 grid gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#43160c] sm:grid-cols-3'>
                            <div className='rounded-2xl bg-white/90 px-4 py-5'>
                                <p className='text-xs text-[#8c3d16]'>Inwoners</p>
                                <p className='mt-2 text-3xl font-black text-[#d06129]'>11.190</p>
                                <p className='text-xs text-[#8c3d16]'>stand 1 jan 2024</p>
                            </div>
                            <div className='rounded-2xl bg-white/90 px-4 py-5'>
                                <p className='text-xs text-[#8c3d16]'>Woningen</p>
                                <p className='mt-2 text-3xl font-black text-[#d06129]'>5.148</p>
                                <p className='text-xs text-[#8c3d16]'>45% huur</p>
                            </div>
                            <div className='rounded-2xl bg-white/90 px-4 py-5'>
                                <p className='text-xs text-[#8c3d16]'>Grootste buurt</p>
                                <p className='mt-2 text-2xl font-black text-[#d06129]'>Gein4</p>
                                <p className='text-xs text-[#8c3d16]'>Gein3 & 1 volgen</p>
                            </div>
                        </div>
                        <div className='mt-8 grid gap-8 text-[#fff8ef] lg:grid-cols-[2fr_1fr]'>
                            <div className='overflow-hidden rounded-3xl border border-white/30 shadow-lg shadow-black/10'>
                                <div className='relative aspect-square w-full'>
                                    <Image
                                        src='/images/over-gein-map.png'
                                        alt='Overzichtskaart met Gein1-4'
                                        fill
                                        className='object-cover'
                                        sizes='(max-width: 768px) 100vw, 75vw'
                                    />
                                </div>
                            </div>
                            <div className='space-y-6 text-sm text-white/90'>
                                <div>
                                    <h3 className='text-base font-semibold uppercase tracking-wide text-white'>Bewoonde buurten</h3>
                                    <ul className='mt-3 space-y-2 text-white/85'>
                                        <li>• Gein4 en Gein3 tellen de meeste bewoners; Gein2 is het kleinst.</li>
                                        <li>• Gein3 heeft vooral koopwoningen dankzij het voormalige Olympische woonplan.</li>
                                        <li>• In Gein1 wonen relatief weinig jongeren en 65-plussers.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className='text-base font-semibold uppercase tracking-wide text-white'>Leeftijdsopbouw</h3>
                                    <p className='mt-3 text-white/85'>De grootste groep is 25–45 jaar, behalve in Gein3 waar 45–65 jaar overheerst. Gein3 en Gein4 hebben veel gepensioneerden.</p>
                                </div>
                                <div className='rounded-3xl border border-white/30 bg-white/15 p-5 shadow-inner shadow-black/10 backdrop-blur'>
                                    <h3 className='text-base font-semibold uppercase tracking-wide text-white'>Vooruitblik</h3>
                                    <div className='mt-3 space-y-4 text-white/90'>
                                        <div>
                                            <p className='text-sm font-bold text-white'>1 · Groei door verdichting</p>
                                            <p className='text-xs text-white/80'>GeinS en nieuwe hoogbouw bij metro Gein laten het inwonertal weer stijgen.</p>
                                        </div>
                                        <div>
                                            <p className='text-sm font-bold text-white'>2 · Woningmix voor ouderen</p>
                                            <p className='text-xs text-white/80'>Meer compacte woningen met zorgvoorzieningen houden senioren in de wijk.</p>
                                        </div>
                                        <div>
                                            <p className='text-sm font-bold text-white'>3 · Verbonden buurt</p>
                                            <p className='text-xs text-white/80'>Buurtactiviteiten, De Ster en scholen blijven cruciaal voor sociale veiligheid.</p>
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
                        <h2 className='text-[clamp(3rem,5.5vw,4.5rem)] font-black uppercase tracking-tight text-[#5c1d0c]'>Initiatieven</h2>
                        <p className='text-xl font-semibold text-[#ff4d00]'>Buurt hoogtepunten die Gein vooruit helpen.</p>
                        <p className='max-w-3xl text-base leading-relaxed text-[#4a2c18]'>
                            Van buurtbudget tot advies – we geven goede ideeën een podium, koppelen mensen aan elkaar en zorgen dat partners aansluiten. Deel jouw plan en we denken direct mee over stappen, middelen en zichtbaarheid.
                        </p>
                    </div>
                    <div className='mt-8'>
                        <HighlightsShowcase />
                    </div>
                </SectionWrapper>
            </div>

            <div className='relative bg-[#d06129] text-white'>
                <SectionWrapper id='nieuws' className='text-white'>
                    <div className='space-y-4 text-left [&>*]:m-0'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#33c17d] sm:w-48' />
                        <h2 className='text-[clamp(3.25rem,6vw,5rem)] font-black uppercase leading-none text-[#faeacd]'>Nieuws</h2>
                        <p className='text-xl font-semibold text-[#33c17d]'>Actuele verhalen uit de buurt</p>
                        <p className='max-w-3xl text-base leading-relaxed text-white/90'>
                            Verhalen over bewoners, partners en initiatieven die Gein vooruit helpen. Lees de nieuwste updates of open de kaarten om het volledige bericht te bekijken.
                        </p>
                    </div>
                    <div className='mt-10'>
                        <NewsShowcase />
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
                        <h2 className='text-[clamp(3rem,5.5vw,4.5rem)] font-black uppercase tracking-tight text-[#5c1d0c]'>Agenda</h2>
                        <p className='text-xl font-semibold text-[#ff4d00]'>Activiteiten & ontmoetingen in Gein.</p>
                        <p className='max-w-3xl text-base leading-relaxed text-[#4a2c18]'>
                            We vullen de agenda continu met buurtfeesten, workshops, overlegmomenten en activiteiten van partners. Hieronder vind je de eerstvolgende hoogtepunten. Organiseer je iets? Meld het en we voegen het meteen toe.
                        </p>
                        <div className='flex flex-wrap gap-4'>
                            <a href='#contact' className='inline-flex items-center gap-3 rounded-full border border-[#ff4d00]/40 bg-white/80 px-5 py-2 text-sm font-semibold text-[#5c1d0c] shadow shadow-[#ff4d00]/20'>
                                <MessageSquare className='size-4 text-[#ff4d00]' /> Meld activiteit aan
                            </a>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <AgendaShowcase events={agendaEvents} />
                    </div>
                </SectionWrapper>
            </div>

            <div className='relative bg-[#d06129] text-white'>
                <SectionWrapper id='newsletter' className='text-white'>
                    <div className='space-y-3 text-left'>
                        <span className='inline-flex h-1 w-32 rounded-full bg-[#33c17d] sm:w-48' />
                        <h2 className='text-[clamp(2.75rem,5vw,4rem)] font-black uppercase leading-tight text-white'>Contact & meedoen</h2>
                        <p className='text-lg font-semibold text-[#33c17d]'>Laat van je horen via het formulier of onze kanalen.</p>
                    </div>
                    <div className='mt-8 grid gap-4 lg:grid-cols-2'>
                        <div className='space-y-4 rounded-3xl border border-white/25 bg-white/5 p-6 shadow-lg shadow-black/10'>
                            <div className='rounded-2xl border border-white/15 bg-white/5 p-4'>
                                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/70'>Contactformulier</p>
                                <h3 className='mt-2 text-3xl font-black leading-tight text-white sm:text-4xl'>Laat van je horen</h3>
                                <p className='mt-3 text-sm text-white/85'>Wil je samenwerken of zorgen delen? Vul het formulier in of kies een kanaal.</p>
                                <form className='mt-5 space-y-4'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <div>
                                            <label htmlFor='name' className='text-xs font-semibold text-white'>Naam</label>
                                            <input
                                                id='name'
                                                name='name'
                                                type='text'
                                                placeholder='Je naam'
                                                className='mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor='email' className='text-xs font-semibold text-white'>E-mail</label>
                                            <input
                                                id='email'
                                                name='email'
                                                type='email'
                                                placeholder='je@email.nl'
                                                className='mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor='message' className='text-xs font-semibold text-white'>Bericht</label>
                                        <textarea
                                            id='message'
                                            name='message'
                                            rows={3}
                                            placeholder='Waar kunnen we mee helpen?'
                                            className='mt-2 w-full rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                        />
                                    </div>
                                    <button type='button' className='w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#d06129] shadow-md shadow-[#d06129]/30'>
                                        Verstuur bericht
                                    </button>
                                </form>
                            </div>
                            <div className='rounded-2xl border border-white/15 bg-white/5 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4'>
                                <div>
                                    <p className='text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70'>Nieuwsbrief</p>
                                    <h3 className='mt-1 text-xl font-bold leading-tight text-white'>Blijf op de hoogte</h3>
                                    <p className='mt-2 text-sm text-white/80'>Nieuws, agenda en oproepen direct in je inbox.</p>
                                </div>
                                <div className='mt-4 flex w-full flex-col gap-3 sm:mt-0 sm:w-auto sm:flex-row'>
                                    <input
                                        type='email'
                                        placeholder='E-mailadres'
                                        className='flex-1 rounded-xl border border-white/30 bg-white/90 px-3 py-2.5 text-sm text-[#43160c] placeholder:text-[#43160c]/60'
                                    />
                                    <button className='rounded-xl bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#d06129] shadow shadow-[#d06129]/25'>
                                        Aanmelden
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-4 rounded-3xl border border-white/25 bg-white/5 p-6 text-white shadow-lg shadow-black/10'>
                            <div className='rounded-2xl border border-dashed border-white/25 p-4'>
                                <p className='text-[10px] font-semibold uppercase tracking-[0.4em] text-white/70'>Kanalen</p>
                                <div className='mt-3 grid gap-3 sm:grid-cols-2'>
                                    {contactChannels.map((channel) => (
                                        <a
                                            key={channel.title}
                                            href={channel.href}
                                            target={channel.href.startsWith('#') ? '_self' : '_blank'}
                                            rel={channel.href.startsWith('#') ? undefined : 'noreferrer'}
                                            className='flex flex-col items-center gap-2 rounded-2xl border border-white/30 px-4 py-3 text-white transition hover:-translate-y-0.5 hover:border-white/60'
                                        >
                                            <span className='inline-flex items-center justify-center rounded-full bg-white/10 p-2.5 text-white'>
                                                <channel.icon className='size-5' />
                                            </span>
                                            <div className='text-center'>
                                                <p className='text-sm font-semibold'>{channel.title}</p>
                                                <p className='text-xs text-white/80'>{channel.description}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className='rounded-2xl border border-white/25 p-4'>
                                <p className='text-[10px] font-semibold uppercase tracking-[0.4em] text-white/70'>Adres</p>
                                <h3 className='mt-2 text-xl font-bold leading-tight text-white'>Buurthub De Ster</h3>
                                <p className='text-sm text-white'>Woudrichemstraat 8, 1106 LG Amsterdam</p>
                                <p className='mt-2 text-xs text-white/80'>Kom langs tijdens activiteiten of maak vooraf een afspraak.</p>
                                <div className='mt-3 overflow-hidden rounded-2xl border border-white/25'>
                                    <iframe
                                        title='Google Maps - Buurthub De Ster'
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
                style={{ backgroundImage: "url('/images/onze-missie-bg.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className='mx-auto flex max-w-6xl flex-col gap-8 border-b border-[#43160c]/15 pb-6 sm:flex-row sm:items-end sm:justify-between'>
                    <div className='flex items-center gap-4'>
                        <Image src='/images/bpglogo.png' alt='Buurtplatform Gein logo' width={160} height={80} className='h-auto w-32 object-contain' />
                        <div>
                            <p className='text-xs font-semibold uppercase tracking-[0.45em] text-[#43160c]/70'>Buurtplatform Gein</p>
                            <h3 className='text-[clamp(2rem,4vw,2.75rem)] font-black leading-tight'>Voor elkaar. Met elkaar.</h3>
                            <p className='mt-3 text-base font-semibold text-[#ff4d00]'>Samen houden we de buurt warm, veilig en toekomstbestendig.</p>
                        </div>
                    </div>
                    <div className='flex flex-col items-start gap-4 sm:items-end'>
                        <div className='flex gap-3'>
                            <a href='https://www.instagram.com/buurtplatformgein/' target='_blank' rel='noreferrer' className='flex h-12 w-12 items-center justify-center rounded-full bg-[#43160c] text-white transition hover:-translate-y-0.5 hover:bg-[#d06129]'>
                                <Instagram className='size-5' />
                            </a>
                            <a href='https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA' target='_blank' rel='noreferrer' className='flex h-12 w-12 items-center justify-center rounded-full bg-[#43160c] text-white transition hover:-translate-y-0.5 hover:bg-[#d06129]'>
                                <Phone className='size-5' />
                            </a>
                        </div>
                    </div>
                </div>
                <div className='mx-auto mt-6 max-w-6xl text-sm text-[#43160c]/70'>
                    © {new Date().getFullYear()} Buurtplatform Gein
                </div>
            </footer>
        </main>
    );
};

export default Page;
