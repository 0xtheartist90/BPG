import type { ReactNode } from 'react';

import Image from 'next/image';

import {
    Building2,
    CalendarDays,
    Instagram,
    Mail,
    MessageSquare,
    Newspaper,
    Users,
    MessageCircle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type CardItem = {
    title: string;
    description: string;
    href?: string;
    actionLabel?: string;
    icon?: LucideIcon;
};

const pillars: CardItem[] = [
    {
        title: 'Verbinden & activeren',
        description:
            'Website, nieuwsbrief, Instagram en de WhatsApp Community brengen buren met elkaar in gesprek en inspireren tot actie.',
        icon: MessageSquare
    },
    {
        title: 'Buurthub De Ster',
        description:
            'Het voormalige schoolgebouw aan de Woudrichemstraat 8 is onze thuisbasis voor ontmoetingen, workshops en ondersteuning van bewonersinitiatieven.',
        icon: Building2
    },
    {
        title: 'Samenwerking met partners',
        description:
            'Elke twee maanden Wijkoverleg Stakeholders, kwartaalgesprekken met Gebiedsbeheer en nauwe afstemming met de gemeente en Stichting !WOON.',
        icon: Users
    },
    {
        title: 'Stem van de buurt',
        description: 'We signaleren zorgen, stimuleren inspraak en houden de overheid scherp voor wat inwoners van Gein nodig hebben.',
        icon: Mail
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
    { label: 'Initiatieven', href: '#initiatieven' },
    { label: 'Nieuws', href: '#nieuws' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Contact', href: '#newsletter' }
];

const highlights: CardItem[] = [
    {
        title: 'Buurtbudget 2024-2025',
        description:
            'Financiële ondersteuning voor ideeën die Gein mooier en socialer maken. Ontdek de criteria en plan een gesprek om hulp te krijgen bij je aanvraag.',
        href: 'https://www.buurtplatformgein.nl/buurtbudget-2024-2025/',
        actionLabel: 'Lees meer'
    },
    {
        title: 'ANBI-status',
        description:
            'Buurtplatform Gein is een erkende ANBI-stichting. Transparantie over inkomsten en bestedingen vind je in het jaarverslag.',
        href: 'https://www.buurtplatformgein.nl/anbi/',
        actionLabel: 'Bekijk details'
    },
    {
        title: 'Jaarverslag 2024',
        description:
            'Een overzicht van alle activiteiten, samenwerkingen en impact in de wijk. Download het verslag en lees wat we samen bereikten.',
        href: 'https://www.buurtplatformgein.nl/jaarverslag',
        actionLabel: 'Download PDF'
    }
];

const newsItems: CardItem[] = [
    {
        title: 'Levensloopbestendig wooncomplex in Gein?',
        description: 'Meedenken over nieuw woonaanbod dat past bij elke levensfase van bewoners.',
        href: 'https://www.buurtplatformgein.nl/levensloopbestendig-wooncomplex-in-gein/',
        actionLabel: 'Lees artikel'
    },
    {
        title: 'Geen hoogspanningsstation naast Gein',
        description: 'Laat je stem horen over plannen in de Gaasperzoom en bescherm onze leefomgeving.',
        href: 'https://www.buurtplatformgein.nl/reageer-geen-hoogspanningsstation-naast-gein-in-de-gaasperzoom/',
        actionLabel: 'Reageer mee'
    },
    {
        title: 'Maak Gein levensloopbestendig',
        description: 'Gezamenlijk plan om de wijk veilig, gezond en verbonden te houden.',
        href: 'https://www.buurtplatformgein.nl/maak-van-gein-een-levensloopbestendige-wijk/',
        actionLabel: 'Lees artikel'
    },
    {
        title: 'Activiteitenkalender voor bewoners',
        description: 'Welke ontmoetingen, sport en cultuur kun je binnenkort verwachten?',
        href: 'https://www.buurtplatformgein.nl/welke-activiteiten-zijn-er-in-gein-voor-de-bewoners/',
        actionLabel: 'Bekijk agenda'
    }
];

const upcomingMoments = [
    {
        title: 'Wijkoverleg Stakeholders',
        detail: 'Tweemaandelijks overleg met ruim 30 organisaties en bewoners om signalen te bundelen.'
    },
    {
        title: 'Kwartaalgesprek met Gebiedsbeheer',
        detail: 'Bespreking voortgang projecten, leefbaarheid en acties richting gemeente.'
    },
    {
        title: 'Bijeenkomst met Democratisering',
        detail: 'Structurele gesprekken voor snellere opvolging van knelpunten en bewonersinitiatieven.'
    }
];

const contactChannels: { title: string; description: string; href: string; icon: LucideIcon }[] = [
    {
        title: 'Nieuwsbrief',
        description: 'Ontvang updates en uitnodigingen rechtstreeks in je inbox.',
        href: '#newsletter',
        icon: Mail
    },
    {
        title: 'Instagram',
        description: '@buurtplatformgein voor foto’s, verhalen en oproepen.',
        href: 'https://www.instagram.com/buurtplatformgein/',
        icon: Instagram
    },
    {
        title: 'WhatsApp Community',
        description: 'Direct in gesprek met buurtgenoten via onze groep.',
        href: 'https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA',
        icon: MessageCircle
    }
];

const SectionWrapper = ({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) => (
    <section id={id} className={`px-4 py-16 sm:px-6 lg:px-10 ${className}`}>
        <div className='mx-auto max-w-6xl'>{children}</div>
    </section>
);

const Page = () => {
    return (
        <main className='bg-[#eaa854] text-foreground'>
            <header className='sticky top-0 z-30 border-b border-[#c9832c]/40 bg-white/95 backdrop-blur'>
                <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-[#43160c] sm:px-6 lg:px-10'>
                    <div className='flex items-center gap-3'>
                        <Image src='/images/bpglogo.png' alt='Buurtplatform Gein logo' width={120} height={60} className='h-10 w-auto object-contain' />
                    </div>
                    <nav className='hidden items-center gap-6 text-sm font-semibold uppercase tracking-wide md:flex'>
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} className='transition hover:text-primary'>
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <a
                        href='#contact'
                        className='rounded-full bg-[#d06129] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow shadow-[#d06129]/30'>
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
                <div className='absolute inset-0 bg-gradient-to-b from-[#1a0801]/85 via-[#d06129]/65 to-[#eaa854]/60' />
                <div className='relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center text-white sm:px-6 lg:px-10'>
                    <Image src='/images/bpglogo.png' alt='Buurtplatform Gein logo' width={320} height={150} className='h-auto w-56 sm:w-72' />
                    <h1 className='text-4xl font-black leading-tight sm:text-5xl lg:text-6xl'>
                        <span className='block'>Bewoners in Gein</span>
                        <span className='block'>Voor elkaar met elkaar</span>
                    </h1>
                    <div className='flex flex-wrap gap-4'>
                        <a
                            href='#contact'
                            className='rounded-full bg-[#d06129] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[#d06129]/40 transition hover:-translate-y-0.5'>
                            Doe mee
                        </a>
                        <a
                            href='https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA'
                            target='_blank'
                            rel='noreferrer'
                            className='rounded-full bg-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/30'>
                            WhatsApp Community
                        </a>
                        <a
                            href='#newsletter'
                            className='rounded-full border border-white/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/10'>
                            Nieuwsbrief
                        </a>
                    </div>
                </div>
            </section>

            <SectionWrapper id='missie'>
                <div className='relative overflow-hidden rounded-3xl bg-card/80 p-8 shadow-xl shadow-[#d06129]/10 backdrop-blur'>
                    <Image
                        src='/images/onze%20missie%20card.png'
                        alt='Sfeerbeeld Buurtplatform Gein'
                        fill
                        className='object-cover opacity-20'
                        sizes='(max-width: 768px) 100vw, 75vw'
                        priority={false}
                    />
                    <div className='relative z-10'>
                        <p className='text-base font-black uppercase tracking-[0.4em] text-primary'>Onze missie</p>
                        <h2 className='mt-3 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl'>Een actieve, inclusieve buurt met oog voor elkaar.</h2>
                        <p className='mt-4 text-lg text-foreground/80'>
                            We verbinden bewoners, ondersteunen initiatieven en blijven in gesprek met de gemeente zodat plannen voor Gein altijd beginnen bij wat bewoners belangrijk vinden. Onze grondhouding is actief verbinden: luisteren, initiëren en ruimte geven aan verschillende perspectieven.
                        </p>
                        <div className='mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
                            {pillars.map((pillar) => (
                                <div
                                    key={pillar.title}
                                    className='flex h-full flex-col rounded-2xl border border-border/60 p-5 shadow-sm shadow-green-600/5 backdrop-blur'
                                    style={{ backgroundColor: 'rgba(13, 94, 52, 0.65)' }}>
                                    {pillar.icon && (
                                        <div className='mb-4 inline-flex h-12 w-12 items-center justify-center self-center rounded-2xl bg-white/15'>
                                            <pillar.icon className='size-6 text-white' />
                                        </div>
                                    )}
                                    <h3 className='text-xl font-semibold text-white'>{pillar.title}</h3>
                                    <p className='mt-3 text-sm text-white/85'>{pillar.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionWrapper>

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

            <SectionWrapper id='over-gein' className='bg-[#d06129]'>
                <div className='rounded-3xl bg-white/10 p-8 text-[#fff8ef] shadow-xl shadow-black/10 backdrop-blur'>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                        <div>
                            <p className='text-sm font-semibold uppercase tracking-[0.4em] text-white/70'>Over Gein</p>
                            <h2 className='mt-3 text-4xl font-black leading-tight'>Gein in cijfers</h2>
                        </div>
                        <div className='text-right text-sm uppercase tracking-[0.3em] text-white/70'>Ad Grool · Amsterdam 2025</div>
                    </div>
                    <div className='mt-6 grid gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#43160c] sm:grid-cols-3'>
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
                    <div className='mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
                        <div className='space-y-6 text-base text-white/90'>
                            <div>
                                <h3 className='text-xl font-semibold uppercase tracking-wide text-white'>Bewoonde buurten</h3>
                                <ul className='mt-3 space-y-2 text-sm text-white/85'>
                                    <li>• Gein4 en Gein3 tellen de meeste bewoners; Gein2 is het kleinst.</li>
                                    <li>• Gein3 heeft vooral koopwoningen dankzij het voormalige Olympische woonplan.</li>
                                    <li>• In Gein1 wonen relatief weinig jongeren en 65-plussers.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className='text-xl font-semibold uppercase tracking-wide text-white'>Leeftijdsopbouw</h3>
                                <p className='mt-3 text-sm text-white/85'>
                                    De grootste groep is 25–45 jaar, behalve in Gein3 waar 45–65 jaar overheerst. Gein3 en Gein4 hebben veel gepensioneerden.
                                </p>
                            </div>
                        </div>
                        <div className='space-y-4 rounded-3xl border border-white/30 bg-white/10 p-6 text-sm text-white/90 shadow-inner shadow-black/10'>
                            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/70'>Vooruitblik</p>
                            <div className='space-y-5'>
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

            <SectionWrapper id='initiatieven'>
                <div className='grid gap-6 md:grid-cols-[1.2fr_0.8fr]'>
                    <div className='relative overflow-hidden rounded-3xl bg-card/80 p-8 text-white shadow-xl shadow-[#d06129]/10 backdrop-blur'>
                        <Image
                            src='/images/onze%20missie%20card.png'
                            alt='Community highlights collage'
                            fill
                            className='object-cover opacity-25'
                            sizes='(max-width: 768px) 100vw, 60vw'
                        />
                        <div className='relative z-10'>
                            <p className='text-sm uppercase tracking-[0.4em] text-white/70'>Community highlights</p>
                            <h2 className='mt-4 text-4xl font-black leading-tight sm:text-5xl'>Initiatieven waarmee we Gein vooruit helpen</h2>
                            <p className='mt-4 text-base/relaxed text-white/85'>
                                Van buurtbudget tot advies – we zorgen dat goede ideeën een podium en de juiste steun krijgen. Heb je een plan of vraag? Meld het en we denken direct mee.
                            </p>
                            <div className='mt-8 grid gap-4 md:grid-cols-2'>
                                {highlights.map((item) => (
                                    <div
                                        key={item.title}
                                        className='flex h-full flex-col rounded-2xl border border-white/20 p-5 shadow-sm shadow-black/10'
                                        style={{ backgroundColor: 'rgba(13, 94, 52, 0.65)' }}>
                                        <h3 className='text-xl font-semibold text-white'>{item.title}</h3>
                                        <p className='mt-2 text-sm text-white/85'>{item.description}</p>
                                        {item.href && (
                                            <a
                                                href={item.href}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='mt-4 inline-flex w-fit rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0d5e34]'>
                                                {item.actionLabel}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='relative overflow-hidden rounded-3xl bg-card/80 p-8 text-white shadow-xl shadow-[#d06129]/10 backdrop-blur'>
                        <Image
                            src='/images/onze%20missie%20card.png'
                            alt='In gesprek collage'
                            fill
                            className='object-cover opacity-25'
                            sizes='(max-width: 768px) 100vw, 40vw'
                        />
                        <div className='relative z-10'>
                            <p className='text-sm font-semibold uppercase tracking-wide text-white/70'>In gesprek</p>
                            <h3 className='mt-3 text-3xl font-black leading-tight text-white'>Agenda van overlegmomenten</h3>
                            <p className='mt-2 text-white/85'>
                                Continu contact met partners zorgt dat signalen snel worden opgepakt.
                            </p>
                            <ul className='mt-6 space-y-5'>
                                {upcomingMoments.map((moment) => (
                                    <li
                                        key={moment.title}
                                        className='rounded-2xl border border-white/20 p-4 shadow-sm shadow-black/10'
                                        style={{ backgroundColor: 'rgba(13, 94, 52, 0.65)' }}>
                                        <p className='text-lg font-semibold text-white'>{moment.title}</p>
                                        <p className='text-sm text-white/80'>{moment.detail}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper id='nieuws' className='bg-[#d06129]'>
                <div className='rounded-3xl bg-white/10 p-8 text-[#fff8ef] shadow-xl shadow-black/10 backdrop-blur'>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                        <div>
                            <p className='text-sm font-semibold uppercase tracking-wide text-white/70'>Actuele verhalen</p>
                            <h2 className='text-4xl font-black leading-tight text-white sm:text-5xl'>Nieuws uit de buurt</h2>
                        </div>
                        <a
                            href='https://www.buurtplatformgein.nl/nieuws/'
                            target='_blank'
                            rel='noreferrer'
                            className='flex items-center gap-2 rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-[#d06129]'>
                            <Newspaper className='size-4' /> Alle berichten
                        </a>
                    </div>
                    <div className='mt-8 grid gap-6 md:grid-cols-2'>
                        {newsItems.map((item) => (
                            <article key={item.title} className='rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-sm shadow-black/10'>
                                <h3 className='text-xl font-semibold'>{item.title}</h3>
                                <p className='mt-2 text-white/85'>{item.description}</p>
                                {item.href && (
                                    <a
                                        href={item.href}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline'>
                                        {item.actionLabel}
                                        <span aria-hidden>→</span>
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper id='agenda'>
                <div className='rounded-3xl bg-accent/80 p-8 text-accent-foreground shadow-xl shadow-black/20'>
                    <p className='text-sm font-semibold uppercase tracking-[0.3em]'>Agenda</p>
                    <h2 className='mt-3 text-4xl font-black leading-tight sm:text-5xl'>Activiteiten & ontmoetingen</h2>
                    <p className='mt-4 max-w-3xl text-accent-foreground/90'>
                        We vullen de agenda continu met buurtfeesten, workshops, overlegmomenten en activiteiten uit partnerorganisaties. Heb jij iets voor de kalender? Meld het hieronder.
                    </p>
                    <div className='mt-6 flex flex-wrap gap-4'>
                        <a
                            href='https://www.buurtplatformgein.nl/agenda'
                            target='_blank'
                            rel='noreferrer'
                            className='inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-[#d06129]/30'>
                            <CalendarDays className='size-4' /> Bekijk agenda
                        </a>
                        <a href='#contact' className='inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white'>
                            <MessageSquare className='size-4' /> Meld activiteit aan
                        </a>
                    </div>
                </div>
            </SectionWrapper>

            <SectionWrapper id='newsletter' className='bg-[#d06129]'>
                <div className='rounded-3xl bg-white/10 p-8 text-[#fff8ef] shadow-xl shadow-black/10 backdrop-blur'>
                    <div className='grid gap-6 lg:grid-cols-2'>
                        <div className='rounded-3xl border border-white/30 bg-white/10 p-8 shadow-lg shadow-black/10'>
                            <p className='text-sm font-semibold uppercase tracking-wide text-white/70'>Contact & meedoen</p>
                            <h2 className='mt-3 text-4xl font-black leading-tight text-white sm:text-5xl'>Laat van je horen</h2>
                            <p className='mt-4 text-white/85'>
                                Wil je samenwerken, vrijwilliger worden of zorgen delen? Vul het formulier in of kies een kanaal hieronder. We reageren zo snel mogelijk.
                            </p>
                            <form className='mt-6 space-y-4'>
                                <div>
                                    <label htmlFor='name' className='text-sm font-semibold text-white'>Naam</label>
                                    <input
                                        id='name'
                                        name='name'
                                        type='text'
                                        placeholder='Je naam'
                                        className='mt-2 w-full rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-base text-[#43160c] placeholder:text-[#43160c]/60'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='email' className='text-sm font-semibold text-white'>E-mail</label>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        placeholder='je@email.nl'
                                        className='mt-2 w-full rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-base text-[#43160c] placeholder:text-[#43160c]/60'
                                    />
                                </div>
                                <div>
                                    <label htmlFor='message' className='text-sm font-semibold text-white'>Bericht</label>
                                    <textarea
                                        id='message'
                                        name='message'
                                        rows={4}
                                        placeholder='Waar kunnen we mee helpen?'
                                        className='mt-2 w-full rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-base text-[#43160c] placeholder:text-[#43160c]/60'
                                    />
                                </div>
                                <button type='button' className='w-full rounded-2xl bg-white px-5 py-3 text-base font-semibold text-[#d06129] shadow-md shadow-[#d06129]/30'>
                                    Verstuur bericht
                                </button>
                            </form>
                        </div>

                        <div className='space-y-6 rounded-3xl border border-white/25 bg-white/10 p-8 text-white shadow-lg shadow-black/10'>
                            <div className='rounded-2xl border border-white/20 p-5'>
                                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/70'>Nieuwsbrief</p>
                                <h3 className='mt-2 text-3xl font-bold leading-tight text-white'>Blijf op de hoogte</h3>
                                <p className='mt-3 text-white/85'>
                                    Schrijf je in en ontvang maandelijks het laatste nieuws, agenda-items en oproepen uit Gein.
                                </p>
                                <div className='mt-4 flex flex-col gap-3 sm:flex-row'>
                                    <input
                                        type='email'
                                        placeholder='E-mailadres'
                                        className='flex-1 rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-base text-[#43160c] placeholder:text-[#43160c]/60'
                                    />
                                    <button className='rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#d06129] shadow-lg shadow-[#d06129]/30'>
                                        Aanmelden
                                    </button>
                                </div>
                            </div>
                            <div className='rounded-2xl border border-dashed border-white/30 p-5'>
                                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/70'>Kanalen</p>
                                <div className='mt-4 space-y-4'>
                                    {contactChannels.map((channel) => (
                                        <a
                                            key={channel.title}
                                            href={channel.href}
                                            target={channel.href.startsWith('#') ? '_self' : '_blank'}
                                            rel={channel.href.startsWith('#') ? undefined : 'noreferrer'}
                                            className='flex items-center gap-3 rounded-2xl border border-white/30 px-4 py-3 text-white transition hover:-translate-y-0.5 hover:border-white/60'>
                                            <channel.icon className='size-5 text-white' />
                                            <div>
                                                <p className='text-base font-semibold'>{channel.title}</p>
                                                <p className='text-sm text-white/80'>{channel.description}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div className='rounded-2xl border border-white/30 p-5'>
                                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/70'>Adres</p>
                                <h3 className='mt-3 text-2xl font-bold leading-tight text-white'>Buurthub De Ster</h3>
                                <p className='text-white'>Woudrichemstraat 8, 1106 LG Amsterdam</p>
                                <p className='mt-3 text-sm text-white/80'>
                                    Kom langs tijdens activiteiten of neem vooraf contact op om een afspraak te plannen.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            <footer id='contact' className='bg-[#43160c] px-4 py-12 text-white sm:px-6 lg:px-10'>
                <div className='mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='text-sm uppercase tracking-[0.3em] text-white/70'>Buurtplatform Gein</p>
                        <h3 className='text-3xl font-semibold'>Voor elkaar. Met elkaar.</h3>
                        <p className='mt-3 text-white/80'>Samen houden we de buurt warm, veilig en toekomstbestendig.</p>
                    </div>
                    <div className='flex flex-wrap gap-4 text-sm font-medium uppercase tracking-wide'>
                        <a href='#missie' className='rounded-full border border-white/30 px-4 py-2 hover:bg-white/10'>Missie</a>
                        <a href='#nieuws' className='rounded-full border border-white/30 px-4 py-2 hover:bg-white/10'>Nieuws</a>
                        <a href='#agenda' className='rounded-full border border-white/30 px-4 py-2 hover:bg-white/10'>Agenda</a>
                        <a href='#newsletter' className='rounded-full border border-white/30 px-4 py-2 hover:bg-white/10'>Contact</a>
                    </div>
                </div>
                <div className='mx-auto mt-6 max-w-6xl border-t border-white/20 pt-4 text-sm text-white/70'>
                    © {new Date().getFullYear()} Buurtplatform Gein • ANBI-stichting • Site gebouwd met Next.js
                </div>
            </footer>
        </main>
    );
};

export default Page;
