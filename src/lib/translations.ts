import type { AgendaEvent } from '@/types/agenda';
import type { HighlightContentBlock } from '@/types/content';

import type { Locale } from './i18n';

type Pillar = {
    title: string;
    description: string;
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
};

const localeDateFormatters: Record<Locale, Intl.DateTimeFormat> = {
    nl: new Intl.DateTimeFormat('nl-NL', dateFormatOptions),
    en: new Intl.DateTimeFormat('en-GB', dateFormatOptions),
    ar: new Intl.DateTimeFormat('ar-SA', dateFormatOptions)
};

const formatDateLabel = (isoDate: string, locale: Locale) =>
    localeDateFormatters[locale].format(new Date(`${isoDate}T00:00:00`));

type RecurringEventKey = 'kunstInGein' | 'kinderkledingRuilpunt' | 'bewegingsexpressie' | 'repairCafe';

type RecurringEventTemplate = {
    idPrefix: string;
    image: string;
    startTime: string;
    endTime: string;
    timeLabel: Record<Locale, string>;
    title: Record<Locale, string>;
    location: Record<Locale, string>;
    description: Record<Locale, string>;
};

const KUNST_IN_GEIN_DATES = [
    '2026-01-06',
    '2026-01-13',
    '2026-01-20',
    '2026-01-27',
    '2026-02-03',
    '2026-02-10',
    '2026-02-17',
    '2026-02-24',
    '2026-03-03',
    '2026-03-10',
    '2026-03-17',
    '2026-03-24',
    '2026-03-31',
    '2026-04-07',
    '2026-04-14',
    '2026-04-21',
    '2026-04-28',
    '2026-05-05',
    '2026-05-12',
    '2026-05-19',
    '2026-05-26',
    '2026-06-02',
    '2026-06-09',
    '2026-06-16',
    '2026-06-23',
    '2026-06-30',
    '2026-07-07',
    '2026-07-14',
    '2026-07-21',
    '2026-07-28',
    '2026-08-04',
    '2026-08-11',
    '2026-08-18',
    '2026-08-25',
    '2026-09-01',
    '2026-09-08',
    '2026-09-15',
    '2026-09-22',
    '2026-09-29',
    '2026-10-06',
    '2026-10-13',
    '2026-10-20',
    '2026-10-27',
    '2026-11-03',
    '2026-11-10',
    '2026-11-17',
    '2026-11-24',
    '2026-12-01',
    '2026-12-08',
    '2026-12-15',
    '2026-12-22',
    '2026-12-29'
];

const KINDERKLEDING_DATES = [
    '2026-01-21',
    '2026-02-04',
    '2026-02-18',
    '2026-03-04',
    '2026-03-18',
    '2026-04-01',
    '2026-04-15',
    '2026-04-29',
    '2026-05-13',
    '2026-05-27',
    '2026-06-10',
    '2026-06-24',
    '2026-07-08',
    '2026-07-22',
    '2026-08-05',
    '2026-08-19',
    '2026-09-02',
    '2026-09-16',
    '2026-09-30',
    '2026-10-14',
    '2026-10-28',
    '2026-11-11',
    '2026-11-25',
    '2026-12-09',
    '2026-12-23',
    '2027-01-06'
];

const BEWEGINGSEXPRESSIE_DATES = [
    '2026-01-07',
    '2026-01-14',
    '2026-01-21',
    '2026-01-28',
    '2026-02-04',
    '2026-02-11',
    '2026-02-18',
    '2026-02-25',
    '2026-03-04',
    '2026-03-11',
    '2026-03-18',
    '2026-03-25',
    '2026-04-01',
    '2026-04-08',
    '2026-04-15',
    '2026-04-22',
    '2026-04-29',
    '2026-05-06',
    '2026-05-13',
    '2026-05-20',
    '2026-05-27',
    '2026-06-03',
    '2026-06-10',
    '2026-06-17',
    '2026-06-24',
    '2026-07-01',
    '2026-07-08',
    '2026-07-15',
    '2026-07-22',
    '2026-07-29',
    '2026-08-05',
    '2026-08-12',
    '2026-08-19',
    '2026-08-26',
    '2026-09-02',
    '2026-09-09',
    '2026-09-16',
    '2026-09-23',
    '2026-09-30',
    '2026-10-07',
    '2026-10-14',
    '2026-10-21',
    '2026-10-28',
    '2026-11-04',
    '2026-11-11',
    '2026-11-18',
    '2026-11-25',
    '2026-12-02',
    '2026-12-09',
    '2026-12-16',
    '2026-12-23',
    '2026-12-30'
];

const REPAIR_CAFE_DATES = [
    '2026-01-09',
    '2026-02-13',
    '2026-03-13',
    '2026-04-10',
    '2026-05-08',
    '2026-06-12',
    '2026-07-10',
    '2026-08-14',
    '2026-09-11',
    '2026-10-09',
    '2026-11-13',
    '2026-12-11'
];

const recurringEventDates: Record<RecurringEventKey, string[]> = {
    kunstInGein: KUNST_IN_GEIN_DATES,
    kinderkledingRuilpunt: KINDERKLEDING_DATES,
    bewegingsexpressie: BEWEGINGSEXPRESSIE_DATES,
    repairCafe: REPAIR_CAFE_DATES
};

const recurringEventTemplates: Record<RecurringEventKey, RecurringEventTemplate> = {
    kunstInGein: {
        idPrefix: 'kunst-in-gein',
        image: '/images/Agenda/Kunst%20in%20gein.png',
        startTime: '20:00:00',
        endTime: '22:00:00',
        timeLabel: {
            nl: '20:00 - 22:00',
            en: '20:00 – 22:00',
            ar: '٢٠:٠٠ – ٢٢:٠٠'
        },
        title: {
            nl: 'Kunst in Gein',
            en: 'Art in Gein',
            ar: 'الفن في خيـن'
        },
        location: {
            nl: 'De Ster, Woudrichemstraat 8',
            en: 'De Ster, Woudrichemstraat 8',
            ar: 'دي ستر، شارع وودريخم ٨'
        },
        description: {
            nl: 'Gratis open atelier voor iedereen, van beginner tot gevorderde.',
            en: 'Free open studio for everyone—from beginners to advanced makers.',
            ar: 'مرسم مفتوح مجاني للجميع من المبتدئين إلى المتقدمين.'
        }
    },
    kinderkledingRuilpunt: {
        idPrefix: 'kinderkleding-ruilpunt',
        image: '/images/Agenda/Kinderkleding%20Ruilpunt.png',
        startTime: '10:00:00',
        endTime: '12:00:00',
        timeLabel: {
            nl: '10:00 - 12:00',
            en: '10:00 – 12:00',
            ar: '١٠:٠٠ – ١٢:٠٠'
        },
        title: {
            nl: 'Kinderkleding Ruilpunt',
            en: 'Kids Clothing Swap',
            ar: 'نقطة تبادل ملابس الأطفال'
        },
        location: {
            nl: 'Buurthub De Ster, Woudrichemstraat 8',
            en: 'Buurthub De Ster, Woudrichemstraat 8',
            ar: 'مركز الحي دي ستر، شارع وودريخم ٨'
        },
        description: {
            nl: 'Ruil schone en onbeschadigde kinderkleding. Alle kindermaten welkom. Zaterdag 1x per maand.',
            en: 'Swap clean, undamaged children’s clothes. All sizes welcome. Saturdays once per month.',
            ar: 'بدّل ملابس أطفال نظيفة وسليمة. جميع المقاسات مرحب بها. السبت مرة كل شهر.'
        }
    },
    bewegingsexpressie: {
        idPrefix: 'bewegingsexpressie',
        image: '/images/Agenda/Bewegingsexpressie.png',
        startTime: '19:00:00',
        endTime: '20:30:00',
        timeLabel: {
            nl: '19:00 - 20:30',
            en: '19:00 – 20:30',
            ar: '١٩:٠٠ – ٢٠:٣٠'
        },
        title: {
            nl: 'Bewegingsexpressie',
            en: 'Movement Expression Class',
            ar: 'تعبير حركي'
        },
        location: {
            nl: 'De Ster, Woudrichemstraat 8',
            en: 'De Ster, Woudrichemstraat 8',
            ar: 'دي ستر، شارع وودريخم ٨'
        },
        description: {
            nl: 'Movement Expression Class door Inger van den Berg. Contact: bewegingsexpressie@outlook.com',
            en: 'Movement Expression (Bewegingsexpressie) with Inger van den Berg. Contact: bewegingsexpressie@outlook.com',
            ar: 'حصة تعبير حركي مع إنخر فان دن بيرخ. للتواصل: bewegingsexpressie@outlook.com'
        }
    },
    repairCafe: {
        idPrefix: 'repair-cafe',
        image: '/images/Agenda/Repair%20Cafe.png',
        startTime: '15:00:00',
        endTime: '18:00:00',
        timeLabel: {
            nl: '15:00 - 18:00',
            en: '15:00 – 18:00',
            ar: '١٥:٠٠ – ١٨:٠٠'
        },
        title: {
            nl: 'Repair Café',
            en: 'Repair Café',
            ar: 'مقهى الإصلاح'
        },
        location: {
            nl: 'De Ster (zij ingang), Woudrichemstraat 8',
            en: 'De Ster (side entrance), Woudrichemstraat 8',
            ar: 'دي ستر (المدخل الجانبي)، شارع وودريخم ٨'
        },
        description: {
            nl: 'Geef je kapotte apparaat een tweede leven. Weggooien? Mooi niet!',
            en: 'Give your broken device a second life. “Throw it away? No way!”',
            ar: 'امنح جهازك المعطّل حياة جديدة. "ترميه؟ مستحيل!"'
        }
    }
};

const buildRecurringEventsForLocale = (locale: Locale): AgendaEvent[] =>
    (Object.keys(recurringEventTemplates) as RecurringEventKey[]).flatMap((key) => {
        const template = recurringEventTemplates[key];

        return recurringEventDates[key].map((isoDate) => ({
            id: `${template.idPrefix}-${isoDate}`,
            date: formatDateLabel(isoDate, locale),
            time: template.timeLabel[locale],
            title: template.title[locale],
            location: template.location[locale],
            description: template.description[locale],
            image: template.image,
            start: `${isoDate}T${template.startTime}`,
            end: `${isoDate}T${template.endTime}`
        }));
    });

const fixedEventsByLocale: Record<Locale, AgendaEvent[]> = {
    nl: [
        {
            id: 'koningsdag-2026-04-27',
            date: formatDateLabel('2026-04-27', 'nl'),
            time: '10:00 - 16:00',
            title: 'Koningsdag in de Wijk',
            location: 'Buitenlocatie in de wijk (Gein)',
            description:
                'Vier Koningsdag samen met de buurt! Trek iets oranjes aan en geniet van muziek, gezelligheid en activiteiten voor jong en oud. Kom langs met familie, buren en vrienden en maak er samen een feestelijke dag van.',
            image: '/images/Agenda/koningsdag.png',
            start: '2026-04-27T10:00:00',
            end: '2026-04-27T16:00:00'
        },
        {
            id: 'iftar-2026-03-05',
            date: formatDateLabel('2026-03-05', 'nl'),
            time: '17:30 - 19:30',
            title: 'Vier IFTAR niet alleen',
            location: 'Buurthuis Gein',
            description:
                'Inloop vanaf 17:30. Om 17:45 vertelt een imam over Iftar. Vanaf 18:30 wordt een veelzijdig multicultureel menu geserveerd. Slechts 30 plekken beschikbaar. Aanmelden via 06-10625997.',
            image: '/images/Agenda/Iftar.png',
            start: '2026-03-05T17:30:00',
            end: '2026-03-05T19:30:00'
        }
    ],
    en: [
        {
            id: 'kings-day-2026-04-27',
            date: formatDateLabel('2026-04-27', 'en'),
            time: '10:00 – 16:00',
            title: "King's Day in the Neighborhood",
            location: 'Outdoor location in Gein',
            description:
                "Celebrate King's Day with the neighborhood! Wear something orange and enjoy music, togetherness and activities for all ages. Bring family, neighbors and friends to make it a festive day.",
            image: '/images/Agenda/koningsdag.png',
            start: '2026-04-27T10:00:00',
            end: '2026-04-27T16:00:00'
        },
        {
            id: 'iftar-en-2026-03-05',
            date: formatDateLabel('2026-03-05', 'en'),
            time: '17:30 – 19:30',
            title: "Don't celebrate IFTAR alone",
            location: 'Buurthuis Gein',
            description:
                'Doors open at 17:30. At 17:45 an imam explains the meaning of Iftar. From 18:30 a diverse multicultural dinner is served. Only 30 spots available. Register via 06-10625997.',
            image: '/images/Agenda/Iftar.png',
            start: '2026-03-05T17:30:00',
            end: '2026-03-05T19:30:00'
        }
    ],
    ar: [
        {
            id: 'yawm-almalik-2026-04-27',
            date: formatDateLabel('2026-04-27', 'ar'),
            time: '١٠:٠٠ – ١٦:٠٠',
            title: 'يوم الملك في الحي',
            location: 'موقع خارجي في خيـن',
            description:
                'احتفل بيوم الملك مع سكان الحي! ارتدِ شيئًا برتقاليًا واستمتع بالموسيقى والأجواء والأنشطة للصغار والكبار. تعال مع العائلة والجيران والأصدقاء لنجعلها مناسبة احتفالية.',
            image: '/images/Agenda/koningsdag.png',
            start: '2026-04-27T10:00:00',
            end: '2026-04-27T16:00:00'
        },
        {
            id: 'iftar-ar-2026-03-05',
            date: formatDateLabel('2026-03-05', 'ar'),
            time: '١٧:٣٠ – ١٩:٣٠',
            title: 'لا تحتفل بالإفطار وحدك',
            location: 'بيت الحي خيـن',
            description:
                'يبدأ الاستقبال ١٧:٣٠. عند ١٧:٤٥ يشرح إمام معنى الإفطار. من ١٨:٣٠ تُقدَّم وجبة متعددة الثقافات. المقاعد ٣٠ فقط. التسجيل عبر 06-10625997.',
            image: '/images/Agenda/Iftar.png',
            start: '2026-03-05T17:30:00',
            end: '2026-03-05T19:30:00'
        }
    ]
};

const sortEventsByStart = (events: AgendaEvent[]) =>
    [...events].sort((a, b) => {
        const aTime = a.start ? Date.parse(a.start) : Number.POSITIVE_INFINITY;
        const bTime = b.start ? Date.parse(b.start) : Number.POSITIVE_INFINITY;

        return aTime - bTime;
    });

const agendaEventsByLocale: Record<Locale, AgendaEvent[]> = {
    nl: sortEventsByStart([...fixedEventsByLocale.nl, ...buildRecurringEventsForLocale('nl')]),
    en: sortEventsByStart([...fixedEventsByLocale.en, ...buildRecurringEventsForLocale('en')]),
    ar: sortEventsByStart([...fixedEventsByLocale.ar, ...buildRecurringEventsForLocale('ar')])
};

type StatBlock = {
    label: string;
    value: string;
    detail: string;
};

type Insight = {
    title: string;
    description: string;
};

type ContactFields = {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    subjectOptions: {
        budget: string;
        info: string;
        facilitair: string;
    };
    messageLabel: string;
    messagePlaceholder: string;
};

type ContactChannel = {
    type: 'instagram' | 'whatsapp';
    title: string;
    description: string;
    href: string;
};

type HighlightDictionaryItem = {
    title: string;
    description: string;
    actionLabel: string;
    content: HighlightContentBlock[];
};

type Dictionary = {
    meta: {
        title: string;
        description: string;
    };
    media: {
        logoAlt: string;
        heroLogoAlt: string;
        missionImageAlt: string;
        mapAlt: string;
        marqueeAlt: string;
    };
    nav: {
        missie: string;
        overGein: string;
        initiatieven: string;
        nieuws: string;
        agenda: string;
        contact: string;
        doeMee: string;
        latestNews: string;
        languages: Record<Locale, string>;
    };
    hero: {
        titleLine1: string;
        titleLine2: string;
        primaryCta: string;
        secondaryCta: string;
    };
    mission: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        heroFooter: string;
        pillars: Pillar[];
    };
    marquee: {
        ariaLabel: string;
    };
    overGein: {
        eyebrow: string;
        title: string;
        subtitle: string;
        stats: StatBlock[];
        neighborhoodsTitle: string;
        neighborhoodsList: string[];
        ageTitle: string;
        ageDescription: string;
        outlookTitle: string;
        outlookPoints: Insight[];
        neighborhoodStatsTitle: string;
        statsLabels: {
            residents: string;
            homes: string;
            rental: string;
        };
    };
    initiatives: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
    };
    highlights: {
        items: HighlightDictionaryItem[];
    };
    news: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
    };
    newsControls: {
        previous: string;
        next: string;
        articleCount: string;
        otherArticles: string;
        closeLabel: string;
    };
    agenda: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        ctaLabel: string;
        events: AgendaEvent[];
        viewToggle: {
            cards: string;
            calendar: string;
        };
        moreInfo: string;
        calendar: {
            weekDays: [string, string, string, string, string, string, string];
            monthDays: [string, string, string, string, string, string, string];
            previousWeek: string;
            nextWeek: string;
            noEvents: string;
            previousMonth: string;
            nextMonth: string;
        };
    };
    contact: {
        eyebrow: string;
        title: string;
        subtitle: string;
        formEyebrow: string;
        formTitle: string;
        formDescription: string;
        fields: ContactFields;
        formButton: string;
        newsletterEyebrow: string;
        newsletterTitle: string;
        newsletterDescription: string;
        newsletterPlaceholder: string;
        newsletterButton: string;
        channelsEyebrow: string;
        addressEyebrow: string;
        addressTitle: string;
        addressLine: string;
        addressNote: string;
        addressMapTitle: string;
        channels: ContactChannel[];
    };
    footer: {
        orgName: string;
        tagline: string;
        highlight: string;
        legal: {
            foundation: string;
            registration: string;
            status: string;
        };
        credit: {
            prefix: string;
            linkLabel: string;
        };
    };
    ui: {
        modalEyebrow: string;
        closeLabel: string;
        eventModal: {
            addToCalendar: string;
            openLink: string;
        };
    };
};

const nl: Dictionary = {
    meta: {
        title: 'Buurtplatform Gein',
        description: 'Bewoners in Gein – voor elkaar, met elkaar.'
    },
    media: {
        logoAlt: 'Buurtplatform Gein logo',
        heroLogoAlt: 'Buurtplatform Gein logo',
        missionImageAlt: 'Buurtbewoner portret',
        mapAlt: 'Overzichtskaart met Gein1-4',
        marqueeAlt: 'Buurtplatform Gein foto collage'
    },
    nav: {
        missie: 'Missie',
        overGein: 'Over Gein',
        initiatieven: 'Initiatieven',
        nieuws: 'Nieuws',
        agenda: 'Agenda',
        contact: 'Contact',
        doeMee: 'Doe mee',
        latestNews: 'Laatste nieuws',
        languages: {
            nl: '🇳🇱 Nederlands',
            en: '🇬🇧 English',
            ar: '🇸🇦 العربية'
        }
    },
    hero: {
        titleLine1: 'Bewoners in Gein',
        titleLine2: 'Voor elkaar met elkaar',
        primaryCta: 'Doe mee',
        secondaryCta: 'Laatste nieuws'
    },
    mission: {
        eyebrow: 'Onze missie',
        title: 'Onze missie',
        subtitle: 'Een actieve, inclusieve buurt met oog voor elkaar.',
        description:
            'We verbinden bewoners, ondersteunen initiatieven en blijven in gesprek met de gemeente zodat plannen voor Gein altijd beginnen bij wat bewoners belangrijk vinden. Onze grondhouding is actief verbinden: luisteren, initiëren en ruimte geven aan verschillende perspectieven.',
        heroFooter: 'WhatsApp • Nieuwsbrief • Instagram',
        pillars: [
            {
                title: 'Samenwerking met partners',
                description:
                    'Tweemaandelijks wijkoverleg met 30+ partners, kwartaalgesprekken met Gebiedsbeheer en structurele afstemming met gemeente, Democratisering en Stichting !WOON voor snelle opvolging.'
            },
            {
                title: 'Buurthub De Ster',
                description:
                    'Een locatie in Gein waar bewoners, organisaties en gemeente elkaar ontmoeten. Hier starten plannen, spreekuren en pilots.'
            },
            {
                title: 'Verbinden & activeren',
                description:
                    'Website, nieuwsbrief, Instagram en de WhatsApp Community brengen buren met elkaar in gesprek en inspireren tot actie.'
            },
            {
                title: 'Stem van de buurt',
                description:
                    'We signaleren zorgen, stimuleren inspraak en houden de overheid scherp voor wat inwoners van Gein nodig hebben.'
            }
        ]
    },
    marquee: {
        ariaLabel: 'Buurtbeelden'
    },
    overGein: {
        eyebrow: 'Over Gein',
        title: 'Over Gein',
        subtitle: 'Cijfers, context en vooruitblik voor onze wijk.',
        stats: [
            { label: 'Inwoners', value: '11.190', detail: 'stand 1 jan 2024' },
            { label: 'Woningen', value: '5.148', detail: '45% huur' },
            { label: 'Grootste buurt', value: 'Gein4', detail: 'Gein3 & 1 volgen' }
        ],
        neighborhoodsTitle: 'Bewoonde buurten',
        neighborhoodsList: [
            'Gein4 en Gein3 tellen de meeste bewoners; Gein2 is het kleinst.',
            'Gein3 heeft vooral koopwoningen dankzij het voormalige Olympische woonplan.',
            'In Gein1 wonen relatief weinig jongeren en 65-plussers.'
        ],
        ageTitle: 'Leeftijdsopbouw',
        ageDescription:
            'De grootste groep is 25–45 jaar, behalve in Gein3 waar 45–65 jaar overheerst. Gein3 en Gein4 hebben veel gepensioneerden.',
        outlookTitle: 'Vooruitblik',
        outlookPoints: [
            {
                title: '1 · Groei door verdichting',
                description: 'GeinS en nieuwe hoogbouw bij metro Gein laten het inwonertal weer stijgen.'
            },
            {
                title: '2 · Woningmix voor ouderen',
                description: 'Meer compacte woningen met zorgvoorzieningen houden senioren in de wijk.'
            },
            {
                title: '3 · Verbonden buurt',
                description: 'Buurtactiviteiten, De Ster en scholen blijven cruciaal voor sociale veiligheid.'
            }
        ],
        neighborhoodStatsTitle: 'Cijfers per buurt',
        statsLabels: {
            residents: 'Inwoners',
            homes: 'Woningen',
            rental: 'Huur'
        }
    },
    initiatives: {
        eyebrow: 'Initiatieven',
        title: 'Initiatieven',
        subtitle: 'Buurt hoogtepunten die Gein vooruit helpen.',
        description:
            'Van buurtbudget tot advies – we geven goede ideeën een podium, koppelen mensen aan elkaar en zorgen dat partners aansluiten. Deel jouw plan en we denken direct mee over stappen, middelen en zichtbaarheid.'
    },
    highlights: {
        items: [
            {
                title: 'Buurtbudget 2026',
                description:
                    'Samen maken we Gein nog sterker met €61.330,47 voor community building, inclusiviteit en bewonersinitiatieven in 2026.',
                actionLabel: 'Lees volledige info',
                content: [
                    {
                        type: 'paragraph',
                        text: 'Buurtplatform Gein verbindt bewoners in een wijk met weinig fysieke ontmoetingsplekken en beperkte investeringen. Via digitale kanalen én huiskamergesprekken brengen we mensen samen.'
                    },
                    {
                        type: 'paragraph',
                        text: 'De Buurthub De Ster en Buurthuis Gein zijn plekken waar ideeën uitgroeien tot plannen. In 2026 zetten we extra in op inclusiviteit en het bereiken van stille doelgroepen.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Het budget van €61.330,47 investeren we met de “kaasschaafmethode”: samen bepalen waar slimmer kan, zodat middelen eerlijk worden verdeeld.'
                    },
                    {
                        type: 'list',
                        heading: 'We investeren in:',
                        items: [
                            'Community building en bewonersbetrokkenheid',
                            'Ondersteuning bij thema’s zoals groen, cultuur, jeugd en ouderen',
                            'Bewoners activeren en zelforganisatie stimuleren',
                            'Inclusiviteit versterken in alle buurten'
                        ]
                    }
                ]
            },
            {
                title: 'ANBI-status',
                description:
                    'Buurtplatform Gein is een erkende ANBI-stichting. Transparantie over inkomsten en bestedingen vind je in het jaarverslag.',
                actionLabel: 'Wat houdt dit in?',
                content: [
                    {
                        type: 'paragraph',
                        text: 'Sinds 2022 hebben we de officiële ANBI-status. Elke euro aan giften en subsidies leggen we vast in het jaarverslag.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Voor bewoners betekent dit fiscale voordelen én inzicht in hoe we middelen inzetten om Gein leefbaar te houden.'
                    }
                ]
            },
            {
                title: 'Jaarverslag 2025',
                description:
                    'Een jaar vol activiteiten, buurtbudget, partners en zichtbare impact in Gein. Vraag het volledige verslag op.',
                actionLabel: 'Bekijk rapport',
                content: [
                    {
                        type: 'subheading',
                        text: 'Bestuur'
                    },
                    {
                        type: 'paragraph',
                        text: 'Na een korte kennismakingsperiode eind 2024 hebben we met genoegen per 1-1-2025 Chris Koning benoemd als Algemeen Bestuurslid bij BPG. Elvira d’Agrella was per 24-1-2024 Algemeen Bestuurslid bij BPG, maar moest helaas afscheid van haar Bestuurstaak nemen per 1-12-2025. Zij blijft gelukkig wel op de zijlijn zeer betrokken bij het BPG en zal regelmatig voor ons activiteiten blijven uitvoeren.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Hoe om te gaan met de werkzaamheden voor het Penvoerderschap voor het BUURTBUDGET bleef ook in 2025 zoeken naar de juiste weg. Het idee om één aparte (vrijwillige) coördinator aan te stellen, bleek in de praktijk niet de juiste verlichting aan de taken van de Bestuursleden te geven en daarom besloten wij om de samenwerking met de coördinator te verbreken. Uiteraard danken wij de coördinator voor de getoonde inzet.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Het plotselinge stopzetten door de Gemeente van het “Open Poen” systeem (om de gedane betalingen op een transparante wijze voor de buurt te kunnen verwerken) en ondanks dat toch te kunnen zorgen dat de diverse Projecten waar nodig goed begeleid werden, heeft een zware organisatorische druk gegeven aan het Bestuur BPG.'
                    },
                    {
                        type: 'subheading',
                        text: 'Locatie van BPG'
                    },
                    {
                        type: 'paragraph',
                        text: 'Er is op het moment van schrijven van dit Jaarverslag 2025 nog geen duidelijkheid of het BPG kan blijven in de voormalige basisschool De Ster, Woudrichemstraat 8. De voorgenomen afbraak van het pand (dat oorspronkelijk eind december 2025 zou plaatsvinden) is inmiddels uitgesteld tot medio 2027 omdat de naastgelegen school De Regenboog, tijdens hun aankomende renovatie, tijdelijk in het gebouw De Ster zal trekken. In goed overleg met onze Gebiedsmakelaar, Robert Kathusing, blijven wij echter goede hoop houden dat we gezamenlijk een oplossing kunnen vinden om onze werkzaamheden voort te kunnen zetten in De Ster (of elders).'
                    },
                    {
                        type: 'paragraph',
                        text: 'Gezien het grote aantal activiteiten in 2025 in De Ster hebben we inmiddels wel overduidelijk kunnen aantonen dat het noodzakelijk en wenselijk is dat wij de genoemde activiteiten – als centrale Buurthub – kunnen blijven voortzetten en dat het voor een grote wijk als Gein (met ongeveer 11.545 inwoners) echt nodig is dat er een centrale Buurthub moet zijn, die door Bewoners en Bewonersorganisaties voor hun activiteiten gebruikt kan worden! Het Buurthuis Gein is, zoals bekend, té klein en té beperkt geopend.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Ter illustratie, hierbij een opsomming van de activiteiten in 2025 in De Ster welke door het BPG ondersteund zijn:'
                    },
                    {
                        type: 'list',
                        heading: '2x per week',
                        items: [
                            'De Kunst & Cultuurgroep Gein met teken- en schilderworkshops en lezingen.',
                            'GLI – Gecombineerde Leeftijd Interventie Samen Sportief in Beweging (na doorverwijzing door huisarts of specialist).'
                        ]
                    },
                    {
                        type: 'list',
                        heading: '1x per week',
                        items: [
                            'Operation Food Freedom Zuidoost: Groente en fruit Uitgiftepunt op basis van abonnement.',
                            'Handwerkgroep Gein voor alle soorten handwerk op elk niveau.',
                            'Shore No Mi Workshops voor alleenstaande moeders met krappe beurs en gedupeerden van de Kinderopvangtoeslag.',
                            'Dansgroep Aashish Dance – Indiaanse klassieke dans.',
                            'Dansgroep Gentiaan – Curaçaose traditionele dans.',
                            'Dansgroep Igbo – Nigerian cultural dance group Amsterdam.'
                        ]
                    },
                    {
                        type: 'list',
                        heading: '1x per twee weken',
                        items: ['Hindoestaanse Mandir Kerkdiensten.', 'Kinderkleding Ruilbeurs.', 'Yogalessen.']
                    },
                    {
                        type: 'list',
                        heading: '1x per maand',
                        items: [
                            'AMMA’s Precious Ladies, Ghanese Social Meeting Damesgroep.',
                            'Leesgroep – literaire boekbesprekingen.',
                            'REPAIRCAFÉ: geef elektrische apparaten een tweede leven door ze te repareren.'
                        ]
                    },
                    {
                        type: 'list',
                        heading: 'Ad hoc activiteiten',
                        items: [
                            'The Gein, Reigersbos & Holendrecht Ghanaian Community met bewonersbijeenkomsten en voordrachten.',
                            'E-Car pilot overleggen van partner Stichting De Groene Parasol met chauffeurs/gemeente/planning.',
                            'Veel Bestuur BPG overleggen met diverse stakeholders.',
                            'Heel veel losse vergaderingen/bijeenkomsten van buurtbewoners en VvE’s (ook van Reigersbos Buren).'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Multifunctioneel gebruik'
                    },
                    {
                        type: 'paragraph',
                        text: 'Ouder- en Kind Team Gaasperdam organiseerde Rots en Water training voor kwetsbare kinderen, er waren veel kinder-verjaardagsfeestjes, diverse beurzen en ook de Politie Gaasperdam maakt graag gebruik van de Buurthub voor haar eigen vaardigheidstrainingen.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Met ondersteuning van het V-fonds en het Nationaal Comité 4 en 5 mei (én diverse actieve buurtbewoners) organiseerden we in De Ster op 5 mei 2025 ook een goed bezochte Vrijheidslunch met de onderwerpen 80 jaar Vrijheid en 40 jaar Gein.'
                    },
                    {
                        type: 'subheading',
                        text: 'Promotie en zichtbare aanwezigheid in Gein'
                    },
                    {
                        type: 'paragraph',
                        text: 'We hebben ruim 5.000 flyers verspreid om bewoners te motiveren met ideeën te komen en veel tijd gestoken in het begeleiden/faciliteren/uitvoeren van diverse projecten ten behoeve van het Buurtbudget Gein in 2025.'
                    },
                    {
                        type: 'list',
                        heading: 'Promotieacties 2025',
                        items: [
                            '5-4-2025: BPG-promotie fruitkar tijdens Eid Mubarak op Wisseloord.',
                            '26-4-2025: BPG-promotie marktkraam op het Koningsdagfeest in Gein3Dorp.',
                            '31-5-2025: BPG-promotie fruitkar tijdens Gezondheidsmarkt.',
                            '19-7-2025: BPG-promotie samen met Burennetwerk “spelletjes” op Wisseloord.',
                            '27-9-2025: BPG-promotie marktkraam op openingsfeest van het Jan Schäeferplantsoen.',
                            '20-12-2025: BPG-promotie marktkraam Kerstmarkt bij Winkelcentrum Gein.'
                        ]
                    },
                    {
                        type: 'paragraph',
                        text: 'Tevens hebben we meegewerkt aan diverse promotiefilmpjes van o.a. Coalitie van Buurtplatformen.'
                    },
                    {
                        type: 'subheading',
                        text: 'Uitvoering/facilitering Buurtbudget Gein 2025 in De Ster'
                    },
                    {
                        type: 'list',
                        items: [
                            '8-3-2025: Internationale Vrouwen Pyjama Party in De Ster.',
                            '23-5-2025: Vrouwen Verwenavond in De Ster.',
                            '7-6-2025: Hawaï Bingo in De Ster.',
                            '27-6-2025: Kinder- en jeugdactiviteit “Zomer in De Ster”.',
                            '30-6-2025: Kinder Keti Koti festival voor/door jongeren in De Ster.',
                            '4-10-2025: Culturele Curaçaose Dag in De Ster van Dansgroep Gentiaan.',
                            '11-11-2025: Workshops lichtkunstwerken maken in De Ster en tentoonstelling in Gein3Dorp.',
                            '15-11-2025: Elevate Yourself workshops voor Moeders in hun Kracht in De Ster.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Evenementen elders in Gein vanuit Buurtbudget'
                    },
                    {
                        type: 'list',
                        items: [
                            '29-1-2025: BPG-nieuwjaarsproost voor Gein in Buurthuis Gein.',
                            '27-3-2025: IFTAR-maaltijd in Buurthuis Gein.',
                            '21-4-2025: Buurt Paasfeest in de Wethouderbuurt.',
                            '26-4-2025: Koningsdag in Gein3Dorp voor Gein (tevens kraam met BPG-promotie).',
                            '24-8-2025: Jubileumviering bij Winkelcentrum Gein – 40 jaar Gein / Fijn in Gein.',
                            '28-9-2025: Burendag Wethouder den Hertogstraat.',
                            '28-9-2025: Burendag Wethouder Driessenstraat.',
                            '11-11-2025: St. Maarten viering traditioneel bij de Bijentuin Gein3Dorp.',
                            '20-12-2025: Kerstmarkt bij Winkelcentrum Gein.',
                            '22-12-2025: Kerstlunch in de Wintertuin van flat Wisseloord.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: '(Mede)financiering vanuit het Buurtbudget Gein'
                    },
                    {
                        type: 'list',
                        items: [
                            '14-4-2025: De verbouwing van de stalling en de lease van de E-Car Gaasperdam.',
                            '19-6-2025: Bouw en plaatsing van de Buurt Kast naast Partou op Wisseloord.',
                            '30-12-2025: Jongerenproject Wellvest.',
                            '(Mede financiering) Jan Schaefermonument.',
                            '(Mede financiering) Ai in de Zorg.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Doorlopende activiteiten vanuit het Buurtbudget'
                    },
                    {
                        type: 'list',
                        items: [
                            'Open Atelier Kunst & Cultuurgroep in De Ster.',
                            'Spelletjesochtenden in Buurthuis Gein.',
                            'Veggie Pastry (o.a. kookgroep) in Buurthuis Gein.',
                            'Krachtvrouwen workshops in Buurthuis Gein.',
                            'Kinderkleding Ruilbeurs in De Ster.',
                            'Workshops Synestheet Lichtbeelden Sint Maarten.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Sportcontrainer langs de Stoutenburgergracht'
                    },
                    {
                        type: 'paragraph',
                        text: 'De sportcontrainer die geplaatst is op 19 oktober 2023 langs de Stoutenburgergracht werd té weinig gebruikt in 2025. De ondergrond is door het aanhoudende slechte weer niet goed beloopbaar en heeft gevaarlijke kuilen (door mollen). Dit blijft ook in 2026 een aandachtspunt. We zijn samen met de Gebiedsmakelaar aan het onderzoeken of de sportcontrainer op een andere locatie gezet kan worden.'
                    },
                    {
                        type: 'subheading',
                        text: 'Achterstallig onderhoud & leefomgeving'
                    },
                    {
                        type: 'paragraph',
                        text: 'Het Bestuur BPG heeft meegewerkt aan een inventarisatie van achterstallig onderhoud in Gein.'
                    },
                    {
                        type: 'subheading',
                        text: 'Verbeteringen in 2025'
                    },
                    {
                        type: 'paragraph',
                        text: 'We beginnen in 2025 wel wat verbeteringen te zien. De lelijke gele panelen en de zijwand van het Metrostation Gein (uitgangszijde Wisseloord) zijn nu voorzien van prachtige beschilderingen ontworpen door Kunstenaar Tim Rodermans. Zie filmpje met dank aan Zuidoosttv: https://www.facebook.com/share/v/1Mjd9NMaLD/.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Ook is een start gemaakt met de herinrichting van de openbare ruimte rond het winkelcentrum. De uitvoering van de overige knelpunten in Gein vereist zeker nog grote aandacht in 2026. De blijvende strijd tegen het zwerfafval in de wijk én het, door ons geïnitieerde, Gaasperdam Brede Overleg met Medewerkers van Afval en Grondstoffen is helaas door wisseling van Ambtenaren weer stil komen te liggen en dient weer nodig opgestart te worden.'
                    },
                    {
                        type: 'subheading',
                        text: 'Wijkpartneroverleg'
                    },
                    {
                        type: 'paragraph',
                        text: 'Het Wijkpartneroverleg (ook wel Stakeholdersoverleg Gein genoemd) vindt nu structureel plaats en wordt goed bezocht. De lijnen tussen de diverse Stakeholders onderling én richting bewoners worden korter en we beginnen elkaar steeds beter te vinden. Door het voortdurende contact tussen bewoners en BPG onderling en het genoemde Wijkpartneroverleg kunnen de signalen en zorgen van bewoners samengebracht worden. Dit overleg is dan ook flink gegroeid in 2025 en brengt intussen 30 bewoners, organisaties en instanties bij elkaar. Het heeft er ook toe geleid dat de Professionals in de wijk elke woensdagochtend een laagdrempelige mogelijkheid bieden aan de bewoners om met hen in gesprek te gaan. We zijn best trots op dit initiatief dat we, samen met onze Gebiedsmakelaar, opgestart hebben.'
                    },
                    {
                        type: 'subheading',
                        text: 'Bijeenkomsten van de Coalitie Buurtplatformen'
                    },
                    {
                        type: 'paragraph',
                        text: 'BPG is 10x aanwezig geweest in 2025 bij de roulerende maandelijkse Kartrekkersoverleggen van de Coalitie Buurtplatformen ZO. Tijdens deze peer-to-peer overleggen bespreken wij knelpunten en successen van de Buurtplatformen en hoe wij krachten kunnen bundelen zodat we niet allemaal hetzelfde wiel hoeven uit te vinden. Op 14 juli 2025 waren wij in De Ster de gastlocatie voor dit Kartrekkersoverleg. In december 2025 namen we afscheid van onze democratisering ambtenaar, Camilla Meijer. Jammer dat Camilla na slechts 1 jaar op een andere functie geplaatst is. Mede door haar hebben wij weer wat stappen in de lange democratiseringsweg kunnen zetten en we wensen haar succes met de volgende klus. We kijken uit naar de samenwerking met de volgende ambtenaar in de rij.'
                    },
                    {
                        type: 'subheading',
                        text: 'Stedelijke coalitie'
                    },
                    {
                        type: 'paragraph',
                        text: 'De bijeenkomsten van de Stedelijke Coalitie van Buurtplatformen Amsterdam vinden maandelijks plaats (ook via roulerend voorzitterschap) waarbij Sjoukje Alta 1x per 2 maanden aanschuift. BPG was daarbij 4x aanwezig. Tevens was BPG 8x bij de tweewekelijkse online check-in met ondersteuners en stedelijke ambtenaren.'
                    },
                    {
                        type: 'subheading',
                        text: 'Afronding'
                    },
                    {
                        type: 'paragraph',
                        text: 'Deze opsomming van werkzaamheden is opgetekend op 17 februari 2026 door Gery Kraaijkamp, Voorzitter van Stichting Buurt en Bewoners Platform Gein. Stichting Buurt en Bewoners Platform Gein – KvK nummer 85747254 – 21-2-2026 – bewonersplatformgein@gmail.com.'
                    }
                ]
            }
        ]
    },
    news: {
        eyebrow: 'Nieuws',
        title: 'Nieuws',
        subtitle: 'Actuele verhalen uit de buurt',
        description:
            'Verhalen over bewoners, partners en initiatieven die Gein vooruit helpen. Lees de nieuwste updates of open de kaarten om het volledige bericht te bekijken.'
    },
    newsControls: {
        previous: 'Vorige',
        next: 'Volgende',
        articleCount: 'Bericht {current} / {total}',
        otherArticles: 'Andere berichten',
        closeLabel: 'Sluit artikel'
    },
    agenda: {
        eyebrow: 'Agenda',
        title: 'Agenda',
        subtitle: 'Activiteiten & ontmoetingen in Gein.',
        description:
            'We vullen de agenda continu met buurtfeesten, workshops, overlegmomenten en activiteiten van partners. Hieronder vind je de eerstvolgende hoogtepunten. Organiseer je iets? Meld het en we voegen het meteen toe.',
        ctaLabel: 'Meld activiteit aan',
        events: agendaEventsByLocale.nl,
        viewToggle: {
            cards: 'Kaarten',
            calendar: 'Kalender'
        },
        moreInfo: 'Meer info',
        calendar: {
            weekDays: ['MA', 'DI', 'WOE', 'DO', 'VR', 'ZA', 'ZO'],
            monthDays: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'],
            previousWeek: 'Vorige week',
            nextWeek: 'Volgende week',
            noEvents: 'Geen events',
            previousMonth: 'Vorige',
            nextMonth: 'Volgende'
        }
    },
    contact: {
        eyebrow: 'Contact & meedoen',
        title: 'Contact & meedoen',
        subtitle: 'Laat van je horen via het formulier of onze kanalen.',
        formEyebrow: 'Contactformulier',
        formTitle: 'Laat van je horen',
        formDescription: 'Wil je samenwerken of zorgen delen? Vul het formulier in of kies een kanaal.',
        fields: {
            nameLabel: 'Naam',
            namePlaceholder: 'Je naam',
            emailLabel: 'E-mail',
            emailPlaceholder: 'je@email.nl',
            subjectLabel: 'Onderwerp',
            subjectPlaceholder: 'Kies een onderwerp',
            subjectOptions: {
                budget: 'Budget aanvraag',
                info: 'Overig en info',
                facilitair: 'Facilitair'
            },
            messageLabel: 'Bericht',
            messagePlaceholder: 'Waar kunnen we mee helpen?'
        },
        formButton: 'Verstuur bericht',
        newsletterEyebrow: 'Nieuwsbrief',
        newsletterTitle: 'Blijf op de hoogte',
        newsletterDescription: 'Nieuws, agenda en oproepen direct in je inbox.',
        newsletterPlaceholder: 'E-mailadres',
        newsletterButton: 'Aanmelden',
        channelsEyebrow: 'Kanalen',
        addressEyebrow: 'Adres',
        addressTitle: 'Buurthub De Ster',
        addressLine: 'Woudrichemstraat 8, 1106 LG Amsterdam',
        addressNote: 'Kom langs tijdens activiteiten of maak vooraf een afspraak.',
        addressMapTitle: 'Google Maps - Buurthub De Ster',
        channels: [
            {
                type: 'instagram',
                title: 'Instagram',
                description: '@buurtplatformgein voor foto’s, verhalen en oproepen.',
                href: 'https://www.instagram.com/buurtplatformgein/'
            },
            {
                type: 'whatsapp',
                title: 'WhatsApp',
                description: 'Direct in gesprek met buurtgenoten via onze groep.',
                href: 'https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA'
            }
        ]
    },
    footer: {
        orgName: 'Buurtplatform Gein',
        tagline: 'Voor elkaar. Met elkaar.',
        highlight: 'Samen houden we de buurt warm, veilig en toekomstbestendig.',
        legal: {
            foundation: 'Stichting Buurt en Bewoners Platform Gein',
            registration: 'KVK: 85747254 · RSIN: 863727876',
            status: 'ANBI-status erkend door de Belastingdienst'
        },
        credit: {
            prefix: 'Website gemaakt door',
            linkLabel: 'Amplify'
        }
    },
    ui: {
        modalEyebrow: 'Initiatief',
        closeLabel: 'Sluit',
        eventModal: {
            addToCalendar: 'Voeg toe aan kalender',
            openLink: 'Open link'
        }
    }
};

const en: Dictionary = {
    meta: {
        title: 'Gein Neighborhood Platform',
        description: 'Residents in Gein – for each other, with each other.'
    },
    media: {
        logoAlt: 'Gein Neighborhood Platform logo',
        heroLogoAlt: 'Gein Neighborhood Platform logo',
        missionImageAlt: 'Portrait of a Gein resident',
        mapAlt: 'Overview map showing Gein 1-4',
        marqueeAlt: 'Photo collage of Gein neighborhood life'
    },
    nav: {
        missie: 'Mission',
        overGein: 'About Gein',
        initiatieven: 'Initiatives',
        nieuws: 'News',
        agenda: 'Agenda',
        contact: 'Contact',
        doeMee: 'Join in',
        latestNews: 'Latest news',
        languages: {
            nl: '🇳🇱 Nederlands',
            en: '🇬🇧 English',
            ar: '🇸🇦 العربية'
        }
    },
    hero: {
        titleLine1: 'Residents in Gein',
        titleLine2: 'For each other, with each other',
        primaryCta: 'Join in',
        secondaryCta: 'Latest news'
    },
    mission: {
        eyebrow: 'Our mission',
        title: 'Our mission',
        subtitle: 'An active, inclusive neighborhood that cares for one another.',
        description:
            'We connect residents, support initiatives and keep talking with the municipality so every plan for Gein starts with what locals find important. Our mindset is proactive connection: listen, initiate and make space for different perspectives.',
        heroFooter: 'WhatsApp • Newsletter • Instagram',
        pillars: [
            {
                title: 'Working with partners',
                description:
                    'Bi-monthly neighborhood sessions with 30+ partners, quarterly talks with district management and structural alignment with the city, Democratisation team and Stichting !WOON for quick follow-up.'
            },
            {
                title: 'Community hub De Ster',
                description:
                    'A space in Gein where residents, organizations and the municipality meet. Plans, walk-in hours and pilots all start here.'
            },
            {
                title: 'Connecting & activating',
                description:
                    'Website, newsletter, Instagram and the WhatsApp community get neighbors talking and inspired to act.'
            },
            {
                title: 'Voice of the neighborhood',
                description:
                    'We pick up concerns, encourage participation and keep government focused on what Gein residents need.'
            }
        ]
    },
    marquee: {
        ariaLabel: 'Neighborhood snapshots'
    },
    overGein: {
        eyebrow: 'About Gein',
        title: 'About Gein',
        subtitle: 'Figures, context and outlook for our district.',
        stats: [
            { label: 'Residents', value: '11,190', detail: 'as of 1 Jan 2024' },
            { label: 'Homes', value: '5,148', detail: '45% rental' },
            { label: 'Largest area', value: 'Gein4', detail: 'Gein3 & 1 follow' }
        ],
        neighborhoodsTitle: 'Neighborhood insights',
        neighborhoodsList: [
            'Gein4 and Gein3 house the most residents; Gein2 is the smallest.',
            'Gein3 mainly has owner-occupied homes thanks to the Olympic housing plan.',
            'Gein1 has relatively few young people and seniors.'
        ],
        ageTitle: 'Age profile',
        ageDescription:
            'The largest group is 25–45 years old, except in Gein3 where 45–65 dominates. Gein3 and Gein4 have many retirees.',
        outlookTitle: 'Looking ahead',
        outlookPoints: [
            {
                title: '1 · Growth through densification',
                description: 'GeinS and new high-rises near metro Gein will raise resident numbers.'
            },
            {
                title: '2 · Housing mix for seniors',
                description: 'More compact homes with care nearby help seniors stay in the neighborhood.'
            },
            {
                title: '3 · Connected community',
                description: 'Events, De Ster and schools remain key for social safety.'
            }
        ],
        neighborhoodStatsTitle: 'Neighborhood statistics',
        statsLabels: {
            residents: 'Residents',
            homes: 'Homes',
            rental: 'Rental'
        }
    },
    initiatives: {
        eyebrow: 'Initiatives',
        title: 'Initiatives',
        subtitle: 'Neighborhood highlights that move Gein forward.',
        description:
            'From neighborhood budgets to advice—we give strong ideas a stage, connect people and ensure partners link up. Share your plan and we immediately help with steps, resources and visibility.'
    },
    highlights: {
        items: [
            {
                title: 'Neighborhood budget 2026',
                description:
                    'Together we strengthen Gein with €61,330.47 for community building, inclusion and resident initiatives.',
                actionLabel: 'Read full details',
                content: [
                    {
                        type: 'paragraph',
                        text: 'Gein Neighborhood Platform connects residents in an area with few public meeting spots. We mix digital outreach with one-on-one conversations to spark action.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Community hub De Ster and Buurthuis Gein are where ideas become plans. In 2026 we focus on inclusion and supporting underrepresented groups.'
                    },
                    {
                        type: 'paragraph',
                        text: 'The €61,330.47 budget fuels community building, thematic support and inclusive programming. We prioritize together using a “slicing” method so funds stay transparent.'
                    },
                    {
                        type: 'list',
                        heading: 'Funding priorities:',
                        items: [
                            'Community engagement and participation',
                            'Support for themes like public space, culture, youth and seniors',
                            'Activating residents and encouraging self-organization',
                            'Strengthening inclusion across all neighborhoods'
                        ]
                    }
                ]
            },
            {
                title: 'ANBI charity status',
                description: 'Our certified ANBI foundation reports every euro in the annual report.',
                actionLabel: 'What does this mean?',
                content: [
                    {
                        type: 'paragraph',
                        text: 'Since 2022 we have been officially recognized as an ANBI charity. Donors benefit from tax advantages while we commit to full transparency.'
                    },
                    {
                        type: 'paragraph',
                        text: 'Annual reports show income, spending and policy goals so residents know how we invest in Gein.'
                    }
                ]
            },
            {
                title: 'Annual report 2025',
                description:
                    'A year packed with programming, neighborhood budget projects, partners and visible impact in Gein. Request the full PDF.',
                actionLabel: 'View report',
                content: [
                    {
                        type: 'subheading',
                        text: 'Board'
                    },
                    {
                        type: 'paragraph',
                        text: "After a short introduction period at the end of 2024, we were pleased to appoint Chris Koning as a General Board Member of BPG as of 1 January 2025. Elvira d'Agrella was a General Board Member of BPG from 24 January 2024, but unfortunately had to step down from her Board duties on 1 December 2025. Fortunately, she remains very involved with BPG from the sidelines and will continue to carry out activities for us regularly."
                    },
                    {
                        type: 'paragraph',
                        text: 'How to deal with the work for the Lead Coordination of the NEIGHBOURHOOD BUDGET continued to be a search for the right approach in 2025. The idea of appointing one separate (voluntary) coordinator proved in practice not to provide the right relief for the tasks of the Board Members, and therefore we decided to terminate the cooperation with the coordinator. Of course, we thank the coordinator for the commitment shown.'
                    },
                    {
                        type: 'paragraph',
                        text: 'The sudden discontinuation by the Municipality of the "Open Poen" system (to be able to process the payments made in a transparent way for the neighbourhood) and despite that still being able to ensure that the various Projects were properly supervised where necessary, has put heavy organisational pressure on the BPG Board.'
                    },
                    {
                        type: 'subheading',
                        text: 'Location of BPG'
                    },
                    {
                        type: 'paragraph',
                        text: 'At the time of writing this Annual Report 2025, there is still no clarity as to whether BPG can remain in the former primary school De Ster, Woudrichemstraat 8. The planned demolition of the building (which was originally scheduled for the end of December 2025) has now been postponed until mid-2027 because the adjacent school De Regenboog will temporarily move into the De Ster building during their upcoming renovation. In good consultation with our Area Broker, Robert Kathusing, we remain hopeful that together we can find a solution to continue our work in De Ster (or elsewhere).'
                    },
                    {
                        type: 'paragraph',
                        text: "Given the large number of activities in 2025 in De Ster, we have now been able to clearly demonstrate that it is necessary and desirable that we can continue the mentioned activities – as a central Community Hub – and that for a large neighbourhood like Gein (with approximately 11,545 inhabitants) it is really necessary that there must be a central Community Hub, which can be used by Residents and Residents' Organisations for their activities! Buurthuis Gein is, as is known, too small and too limited in opening hours."
                    },
                    {
                        type: 'paragraph',
                        text: 'To illustrate, here is a list of the activities in 2025 in De Ster that were supported by BPG:'
                    },
                    {
                        type: 'list',
                        heading: '2x per week',
                        items: [
                            'The Art & Culture Group Gein with drawing and painting workshops and lectures.',
                            'GLI – Combined Age Intervention Together Sporty in Motion (after referral by GP or specialist).'
                        ]
                    },
                    {
                        type: 'list',
                        heading: '1x per week',
                        items: [
                            'Operation Food Freedom Southeast: Vegetable and fruit Distribution Point on a subscription basis.',
                            'Handwork Group Gein for all types of handicrafts at every level.',
                            'Shore No Mi Workshops for single mothers on a tight budget and victims of the Childcare Allowance.',
                            'Dance Group Aashish Dance – Indian classical dance.',
                            'Dance Group Gentiaan – Curaçaoan traditional dance.',
                            'Dance Group Igbo – Nigerian cultural dance group Amsterdam.'
                        ]
                    },
                    {
                        type: 'list',
                        heading: '1x per two weeks',
                        items: ['Hindustani Mandir Church Services.', "Children's Clothing Swap.", 'Yoga classes.']
                    },
                    {
                        type: 'list',
                        heading: '1x per month',
                        items: [
                            "AMMA's Precious Ladies, Ghanaian Social Meeting Ladies Group.",
                            'Reading Group – literary book discussions.',
                            'REPAIR CAFÉ: give electrical appliances a second life by repairing them.'
                        ]
                    },
                    {
                        type: 'list',
                        heading: 'Ad hoc activities',
                        items: [
                            "The Gein, Reigersbos & Holendrecht Ghanaian Community with residents' meetings and presentations.",
                            'E-Car pilot meetings of partner Foundation De Groene Parasol with drivers/municipality/planning.',
                            'Many BPG Board meetings with various stakeholders.',
                            "Many individual meetings/gatherings of neighbourhood residents and VvE's (also from Reigersbos Buren)."
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Multifunctional use'
                    },
                    {
                        type: 'paragraph',
                        text: "Parent and Child Team Gaasperdam organised Rock and Water training for vulnerable children, there were many children's birthday parties, various fairs and also the Police Gaasperdam likes to use the Community Hub for their own skills training."
                    },
                    {
                        type: 'paragraph',
                        text: 'With support from the V-fund and the National Committee 4 and 5 May (and various active neighbourhood residents) we also organised a well-attended Freedom Lunch in De Ster on 5 May 2025 with the themes 80 years of Freedom and 40 years of Gein.'
                    },
                    {
                        type: 'subheading',
                        text: 'Promotion and visible presence in Gein'
                    },
                    {
                        type: 'paragraph',
                        text: 'We distributed over 5,000 flyers to motivate residents to come up with ideas and spent a lot of time guiding/facilitating/implementing various projects for the Neighbourhood Budget Gein in 2025.'
                    },
                    {
                        type: 'list',
                        heading: 'Promotional activities 2025',
                        items: [
                            '5-4-2025: BPG promotion fruit cart during Eid Mubarak at Wisseloord.',
                            "26-4-2025: BPG promotion market stall at the King's Day festival in Gein3Dorp.",
                            '31-5-2025: BPG promotion fruit cart during Health Market.',
                            '19-7-2025: BPG promotion together with Neighbours Network "games" at Wisseloord.',
                            '27-9-2025: BPG promotion market stall at the opening party of the Jan Schäeferplantsoen.',
                            '20-12-2025: BPG promotion market stall Christmas Market at Shopping Centre Gein.'
                        ]
                    },
                    {
                        type: 'paragraph',
                        text: 'We also contributed to various promotional videos from, among others, the Coalition of Neighbourhood Platforms.'
                    },
                    {
                        type: 'subheading',
                        text: 'Implementation/facilitation Neighbourhood Budget Gein 2025 in De Ster'
                    },
                    {
                        type: 'list',
                        items: [
                            "8-3-2025: International Women's Pyjama Party in De Ster.",
                            "23-5-2025: Women's Pampering Evening in De Ster.",
                            '7-6-2025: Hawaii Bingo in De Ster.',
                            '27-6-2025: Children and youth activity "Summer in De Ster".',
                            "30-6-2025: Children's Keti Koti festival for/by young people in De Ster.",
                            '4-10-2025: Cultural Curaçaoan Day in De Ster by Dance Group Gentiaan.',
                            '11-11-2025: Workshops making light artworks in De Ster and exhibition in Gein3Dorp.',
                            '15-11-2025: Elevate Yourself workshops for Mothers in their Power in De Ster.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Events elsewhere in Gein from Neighbourhood Budget'
                    },
                    {
                        type: 'list',
                        items: [
                            "29-1-2025: BPG New Year's toast for Gein in Buurthuis Gein.",
                            '27-3-2025: IFTAR meal in Buurthuis Gein.',
                            '21-4-2025: Neighbourhood Easter party in the Wethouderbuurt.',
                            "26-4-2025: King's Day in Gein3Dorp for Gein (also stall with BPG promotion).",
                            '24-8-2025: Anniversary celebration at Shopping Centre Gein – 40 years of Gein / Great in Gein.',
                            '28-9-2025: Neighbours Day Wethouder den Hertogstraat.',
                            '28-9-2025: Neighbours Day Wethouder Driessenstraat.',
                            '11-11-2025: St. Martin celebration traditionally at the Bee Garden Gein3Dorp.',
                            '20-12-2025: Christmas Market at Shopping Centre Gein.',
                            '22-12-2025: Christmas lunch in the Winter Garden of flat Wisseloord.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: '(Co)financing from the Neighbourhood Budget Gein'
                    },
                    {
                        type: 'list',
                        items: [
                            '14-4-2025: The renovation of the garage and the lease of the E-Car Gaasperdam.',
                            '19-6-2025: Construction and placement of the Neighbourhood Cabinet next to Partou at Wisseloord.',
                            '30-12-2025: Youth project Wellvest.',
                            '(Co-financing) Jan Schaefer monument.',
                            '(Co-financing) AI in Healthcare.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Ongoing activities from the Neighbourhood Budget'
                    },
                    {
                        type: 'list',
                        items: [
                            'Open Studio Art & Culture Group in De Ster.',
                            'Game mornings in Buurthuis Gein.',
                            'Veggie Pastry (including cooking group) in Buurthuis Gein.',
                            'Power Women workshops in Buurthuis Gein.',
                            "Children's Clothing Swap in De Ster.",
                            'Workshops Synesthete Light Images Saint Martin.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'Sports container along the Stoutenburgergracht'
                    },
                    {
                        type: 'paragraph',
                        text: 'The sports container that was placed on 19 October 2023 along the Stoutenburgergracht was used too little in 2025. The surface is not easily accessible due to the persistent bad weather and has dangerous holes (from moles). This will also remain a point of attention in 2026. Together with the Area Broker, we are investigating whether the sports container can be placed in a different location.'
                    },
                    {
                        type: 'subheading',
                        text: 'Deferred maintenance & living environment'
                    },
                    {
                        type: 'paragraph',
                        text: 'The BPG Board has contributed to an inventory of deferred maintenance in Gein.'
                    },
                    {
                        type: 'subheading',
                        text: 'Improvements in 2025'
                    },
                    {
                        type: 'paragraph',
                        text: 'We are beginning to see some improvements in 2025. The ugly yellow panels and the side wall of the Gein Metro Station (exit side Wisseloord) are now decorated with beautiful paintings designed by Artist Tim Rodermans. See video thanks to Zuidoosttv: https://www.facebook.com/share/v/1Mjd9NMaLD/.'
                    },
                    {
                        type: 'paragraph',
                        text: 'A start has also been made with the redesign of the public space around the shopping centre. The implementation of the other bottlenecks in Gein certainly still requires great attention in 2026. The ongoing fight against litter in the neighbourhood and the Gaasperdam-wide Consultation with Waste and Resources Employees that we initiated has unfortunately come to a standstill again due to a change of Civil Servants and needs to be restarted.'
                    },
                    {
                        type: 'subheading',
                        text: 'Neighbourhood partner meeting'
                    },
                    {
                        type: 'paragraph',
                        text: 'The Neighbourhood Partner Meeting (also called Stakeholders Meeting Gein) now takes place structurally and is well attended. The lines between the various Stakeholders among themselves and towards residents are getting shorter and we are beginning to find each other better and better. Through the continuous contact between residents and BPG among themselves and the mentioned Neighbourhood Partner Meeting, the signals and concerns of residents can be brought together. This meeting has therefore grown considerably in 2025 and now brings together 30 residents, organisations and institutions. It has also led to the Professionals in the neighbourhood offering residents a low-threshold opportunity to talk to them every Wednesday morning. We are quite proud of this initiative that we, together with our Area Broker, have started.'
                    },
                    {
                        type: 'subheading',
                        text: 'Meetings of the Coalition of Neighbourhood Platforms'
                    },
                    {
                        type: 'paragraph',
                        text: "BPG was present 10 times in 2025 at the rotating monthly Coordinators Meetings of the Coalition of Neighbourhood Platforms ZO. During these peer-to-peer meetings we discuss bottlenecks and successes of the Neighbourhood Platforms and how we can join forces so that we don't all have to reinvent the same wheel. On 14 July 2025 we were the host location in De Ster for this Coordinators Meeting. In December 2025 we said goodbye to our democratisation civil servant, Camilla Meijer. It's a pity that Camilla was placed in another position after only 1 year. Partly thanks to her, we have been able to take some steps in the long democratisation journey and we wish her success with the next job. We look forward to working with the next civil servant in line."
                    },
                    {
                        type: 'subheading',
                        text: 'City-wide coalition'
                    },
                    {
                        type: 'paragraph',
                        text: 'The meetings of the City-wide Coalition of Neighbourhood Platforms Amsterdam take place monthly (also via rotating chairmanship) where Sjoukje Alta joins once every 2 months. BPG was present 4 times. BPG was also present 8 times at the bi-weekly online check-in with supporters and city-wide civil servants.'
                    },
                    {
                        type: 'subheading',
                        text: 'Conclusion'
                    },
                    {
                        type: 'paragraph',
                        text: 'This summary of activities was recorded on 17 February 2026 by Gery Kraaijkamp, Chairman of Foundation Neighbourhood and Residents Platform Gein. Foundation Neighbourhood and Residents Platform Gein – Chamber of Commerce number 85747254 – 21-2-2026 – bewonersplatformgein@gmail.com.'
                    }
                ]
            }
        ]
    },
    news: {
        eyebrow: 'News',
        title: 'News',
        subtitle: 'Current stories from the neighborhood',
        description:
            'Stories about residents, partners and initiatives that help Gein progress. Read the latest updates or open the cards for the full article.'
    },
    newsControls: {
        previous: 'Previous',
        next: 'Next',
        articleCount: 'Article {current} / {total}',
        otherArticles: 'Other stories',
        closeLabel: 'Close article'
    },
    agenda: {
        eyebrow: 'Agenda',
        title: 'Agenda',
        subtitle: 'Activities & gatherings in Gein.',
        description:
            'We update the agenda with festivals, workshops, meetings and partner events. Below are the next highlights. Organizing something? Share it and we will add it right away.',
        ctaLabel: 'Submit an activity',
        events: agendaEventsByLocale.en,
        viewToggle: {
            cards: 'Cards',
            calendar: 'Calendar'
        },
        moreInfo: 'More info',
        calendar: {
            weekDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            monthDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            previousWeek: 'Previous week',
            nextWeek: 'Next week',
            noEvents: 'No events',
            previousMonth: 'Previous',
            nextMonth: 'Next'
        }
    },
    contact: {
        eyebrow: 'Contact & participate',
        title: 'Contact & participate',
        subtitle: 'Reach out via the form or one of our channels.',
        formEyebrow: 'Contact form',
        formTitle: 'Tell us what you need',
        formDescription: 'Want to collaborate or share concerns? Fill out the form or pick a channel.',
        fields: {
            nameLabel: 'Name',
            namePlaceholder: 'Your name',
            emailLabel: 'Email',
            emailPlaceholder: 'you@email.com',
            subjectLabel: 'Subject',
            subjectPlaceholder: 'Choose a subject',
            subjectOptions: {
                budget: 'Budget request',
                info: 'Other and info',
                facilitair: 'Facilities'
            },
            messageLabel: 'Message',
            messagePlaceholder: 'How can we help?'
        },
        formButton: 'Send message',
        newsletterEyebrow: 'Newsletter',
        newsletterTitle: 'Stay informed',
        newsletterDescription: 'News, agenda and calls-to-action straight to your inbox.',
        newsletterPlaceholder: 'Email address',
        newsletterButton: 'Subscribe',
        channelsEyebrow: 'Channels',
        addressEyebrow: 'Address',
        addressTitle: 'Community hub De Ster',
        addressLine: 'Woudrichemstraat 8, 1106 LG Amsterdam',
        addressNote: 'Drop by during activities or schedule an appointment.',
        addressMapTitle: 'Google Maps – Community hub De Ster',
        channels: [
            {
                type: 'instagram',
                title: 'Instagram',
                description: '@buurtplatformgein for photos, stories and calls.',
                href: 'https://www.instagram.com/buurtplatformgein/'
            },
            {
                type: 'whatsapp',
                title: 'WhatsApp',
                description: 'Chat directly with neighbors in our group.',
                href: 'https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA'
            }
        ]
    },
    footer: {
        orgName: 'Gein Neighborhood Platform',
        tagline: 'For each other. With each other.',
        highlight: 'Together we keep the neighborhood warm, safe and future-proof.',
        legal: {
            foundation: 'Foundation Neighborhood & Residents Platform Gein',
            registration: 'Chamber of Commerce: 85747254 · RSIN: 863727876',
            status: 'ANBI charity status recognized by the tax authorities'
        },
        credit: {
            prefix: 'Website by',
            linkLabel: 'Amplify'
        }
    },
    ui: {
        modalEyebrow: 'Initiative',
        closeLabel: 'Close',
        eventModal: {
            addToCalendar: 'Add to calendar',
            openLink: 'Open link'
        }
    }
};

const ar: Dictionary = {
    meta: {
        title: 'منصة حي خيـن',
        description: 'سكان خيـن – معًا ومن أجل بعضنا البعض.'
    },
    media: {
        logoAlt: 'شعار منصة حي خيـن',
        heroLogoAlt: 'شعار منصة حي خيـن',
        missionImageAlt: 'صورة لأحد سكان خيـن',
        mapAlt: 'خريطة توضح مناطق خيـن 1 إلى 4',
        marqueeAlt: 'مجموعة صور من حياة الحي في خيـن'
    },
    nav: {
        missie: 'الرسالة',
        overGein: 'عن خيـن',
        initiatieven: 'المبادرات',
        nieuws: 'الأخبار',
        agenda: 'الأجندة',
        contact: 'اتصل بنا',
        doeMee: 'شارك',
        latestNews: 'آخر الأخبار',
        languages: {
            nl: '🇳🇱 Nederlands',
            en: '🇬🇧 English',
            ar: '🇸🇦 العربية'
        }
    },
    hero: {
        titleLine1: 'السكان في خيـن',
        titleLine2: 'معًا ومن أجل بعضنا البعض',
        primaryCta: 'شارك',
        secondaryCta: 'آخر الأخبار'
    },
    mission: {
        eyebrow: 'رسالتنا',
        title: 'رسالتنا',
        subtitle: 'حي نشط وشامل يهتم الجميع فيه ببعضهم البعض.',
        description:
            'نربط بين السكان، وندعم المبادرات، ونبقى في حوار مستمر مع البلدية حتى تبدأ كل خطة لخيـن من أولويات السكان. فلسفتنا هي الوصل النشط: نستمع، نبادر، ونمنح المساحة لوجهات النظر المختلفة.',
        heroFooter: 'واتساب • النشرة البريدية • إنستغرام',
        pillars: [
            {
                title: 'التعاون مع الشركاء',
                description:
                    'اجتماع حي نصف شهري مع أكثر من 30 شريكًا، وحوارات ربع سنوية مع إدارة المنطقة، وتنسيق دائم مع البلدية وفريق الديمقراطية ومؤسسة !WOON لضمان سرعة الاستجابة.'
            },
            {
                title: 'مركز الحي "دي ستر"',
                description:
                    'مساحة في خيـن يلتقي فيها السكان والمنظمات والبلدية. هنا تبدأ الخطط وساعات الاستقبال والتجارب.'
            },
            {
                title: 'الربط والتحفيز',
                description: 'الموقع والنشرة الإلكترونية وإنستغرام ومجموعة واتساب تجمع الجيران وتشجعهم على المبادرة.'
            },
            {
                title: 'صوت الحي',
                description: 'نلتقط المخاوف، نشجع المشاركة، ونبقي الحكومة يقظة تجاه احتياجات سكان خيـن.'
            }
        ]
    },
    marquee: {
        ariaLabel: 'لقطات من الحي'
    },
    overGein: {
        eyebrow: 'عن خيـن',
        title: 'عن خيـن',
        subtitle: 'أرقام وسياق ونظرة مستقبلية لحيّنا.',
        stats: [
            { label: 'السكان', value: '١١٬١٩٠', detail: 'حتى ١ يناير ٢٠٢٤' },
            { label: 'المساكن', value: '٥٬١٤٨', detail: '٤٥٪ إيجار' },
            { label: 'أكبر منطقة', value: 'خيـن٤', detail: 'تليها خيـن٣ و١' }
        ],
        neighborhoodsTitle: 'ملاحظات حول الأحياء',
        neighborhoodsList: [
            'خيـن٤ و خيـن٣ تضمان أكبر عدد من السكان؛ خيـن٢ هي الأصغر.',
            'خيـن٣ تضم مساكن للملكية الخاصة بفضل الخطة السكنية الأولمبية.',
            'خيـن١ فيها عدد أقل من الشباب وكبار السن.'
        ],
        ageTitle: 'التركيبة العمرية',
        ageDescription:
            'الفئة الأكبر عمرها بين ٢٥ و٤٥ عامًا، ما عدا خيـن٣ حيث تبرز فئة ٤٥–٦٥ عامًا. خيـن٣ و٤ فيهما كثير من المتقاعدين.',
        outlookTitle: 'نظرة مستقبلية',
        outlookPoints: [
            { title: '١ · نمو عبر الكثافة', description: 'خيـنS والأبراج الجديدة قرب مترو خيـن سترفع عدد السكان.' },
            {
                title: '٢ · مزيج سكني لكبار السن',
                description: 'مساكن مدمجة مع خدمات رعاية قريبة تساعد كبار السن على البقاء في الحي.'
            },
            { title: '٣ · حي مترابط', description: 'الأنشطة ومركز دي ستر والمدارس ضرورية لاستمرار الأمان الاجتماعي.' }
        ],
        neighborhoodStatsTitle: 'إحصائيات الأحياء',
        statsLabels: {
            residents: 'السكان',
            homes: 'المساكن',
            rental: 'إيجار'
        }
    },
    initiatives: {
        eyebrow: 'المبادرات',
        title: 'المبادرات',
        subtitle: 'مبادرات من الحي تدفع خيـن إلى الأمام.',
        description:
            'من ميزانيات الحي إلى الاستشارات – نعطي الأفكار الجيدة منصة، نربط الناس ببعضهم ونتأكد من انضمام الشركاء. شارك خطتك وسنفكر فورًا في الخطوات والموارد والظهور.'
    },
    highlights: {
        items: [
            {
                title: 'ميزانية الحي 2026',
                description: '‏€61,330.47 لدعم مبادرات السكان وتعزيز الشمولية في خيـن.',
                actionLabel: 'اطلع على التفاصيل',
                content: [
                    {
                        type: 'paragraph',
                        text: 'نربط بين السكان عبر القنوات الرقمية واللقاءات المباشرة لنشجع المشاركة ونبقي الجميع على اطلاع.'
                    },
                    {
                        type: 'paragraph',
                        text: 'يوفر مركز "دي ستر" وبيت الحي مساحة لتحويل الأفكار إلى خطط. في 2026 نركز على الشمولية ودعم الفئات الأقل تمثيلًا.'
                    },
                    {
                        type: 'paragraph',
                        text: 'نستثمر مبلغ €61,330.47 في بناء المجتمع مع شفافية كاملة حول طريقة التوزيع.'
                    },
                    {
                        type: 'list',
                        heading: 'نموّل:',
                        items: [
                            'مبادرات المجتمع المحلي ومشاركة السكان',
                            'مواضيع الحي مثل المساحات الخضراء والثقافة والشباب وكبار السن',
                            'تنشيط المتطوعين وتشجيع التنظيم الذاتي',
                            'تعزيز الشمولية في جميع أحياء خيـن'
                        ]
                    }
                ]
            },
            {
                title: 'صفة ANBI الخيرية',
                description: 'نعرض كل الإيرادات والمصروفات في التقرير السنوي.',
                actionLabel: 'ما معنى ذلك؟',
                content: [
                    {
                        type: 'paragraph',
                        text: 'منذ 2022 نحمل صفة ANBI، ما يعني شفافية كاملة في التبرعات وإمكانية الحصول على مزايا ضريبية للمتبرعين.'
                    },
                    {
                        type: 'paragraph',
                        text: 'يمكن الاطلاع على كل التفاصيل المالية في التقرير السنوي المتاح للرأي العام.'
                    }
                ]
            },
            {
                title: 'التقرير السنوي 2025',
                description: 'عام حافل بالأنشطة ومشاريع ميزانية الحي والتأثير في خيـن. اطلب النسخة الكاملة.',
                actionLabel: 'اعرض التقرير',
                content: [
                    {
                        type: 'subheading',
                        text: 'مجلس الإدارة'
                    },
                    {
                        type: 'paragraph',
                        text: 'بعد فترة تعارف قصيرة في نهاية عام 2024، سررنا بتعيين كريس كونينغ كعضو عام في مجلس إدارة BPG اعتبارًا من 1 يناير 2025. كانت إلفيرا داغريلا عضوًا عامًا في مجلس الإدارة منذ 24 يناير 2024، لكنها اضطرت للأسف للتنحي عن مهامها في المجلس في 1 ديسمبر 2025. لحسن الحظ، لا تزال متابعة للمنظمة عن كثب وستواصل تنفيذ أنشطة لنا بانتظام.'
                    },
                    {
                        type: 'paragraph',
                        text: 'استمر البحث عن الطريقة الصحيحة للتعامل مع مهام التنسيق الرئيسي لميزانية الحي في عام 2025. ثبت عمليًا أن فكرة تعيين منسق منفصل (تطوعي) لم توفر الراحة المناسبة لمهام أعضاء المجلس، ولذلك قررنا إنهاء التعاون مع المنسق. بالطبع، نشكر المنسق على الالتزام المبذول.'
                    },
                    {
                        type: 'paragraph',
                        text: 'أدى التوقف المفاجئ من قبل البلدية لنظام "أوبن بون" (لمعالجة المدفوعات بطريقة شفافة للحي) ورغم ذلك القدرة على ضمان الإشراف الجيد على المشاريع المختلفة عند الضرورة، إلى ضغط تنظيمي كبير على مجلس إدارة BPG.'
                    },
                    {
                        type: 'subheading',
                        text: 'موقع BPG'
                    },
                    {
                        type: 'paragraph',
                        text: 'في وقت كتابة هذا التقرير السنوي 2025، لا يزال هناك عدم وضوح حول ما إذا كان بإمكان BPG البقاء في المدرسة الابتدائية السابقة دي ستر، Woudrichemstraat 8. تم تأجيل الهدم المخطط للمبنى (الذي كان مقررًا في الأصل لنهاية ديسمبر 2025) الآن حتى منتصف عام 2027 لأن مدرسة De Regenboog المجاورة ستنتقل مؤقتًا إلى مبنى دي ستر خلال تجديدها القادم. في تشاور جيد مع وسيط المنطقة لدينا، روبرت كاثوسينغ، نظل متفائلين بأننا معًا يمكننا إيجاد حل لمواصلة عملنا في دي ستر (أو في مكان آخر).'
                    },
                    {
                        type: 'paragraph',
                        text: 'نظرًا للعدد الكبير من الأنشطة في عام 2025 في دي ستر، تمكنا الآن من إثبات بوضوح أنه من الضروري والمرغوب فيه أن نتمكن من مواصلة الأنشطة المذكورة - كمركز مجتمعي مركزي - وأنه بالنسبة لحي كبير مثل خيـن (بحوالي 11,545 ساكنًا) من الضروري حقًا أن يكون هناك مركز مجتمعي مركزي، يمكن للسكان ومنظمات السكان استخدامه لأنشطتهم! Buurthuis Gein، كما هو معروف، صغير جدًا ومحدود جدًا في ساعات العمل.'
                    },
                    {
                        type: 'paragraph',
                        text: 'للتوضيح، إليك قائمة بالأنشطة في عام 2025 في دي ستر التي دعمتها BPG:'
                    },
                    {
                        type: 'list',
                        heading: 'مرتان في الأسبوع',
                        items: [
                            'مجموعة الفن والثقافة خيـن مع ورش الرسم والتلوين والمحاضرات.',
                            'GLI - التدخل المشترك للأعمار معًا رياضيًا في الحركة (بعد الإحالة من الطبيب العام أو الأخصائي).'
                        ]
                    },
                    {
                        type: 'list',
                        heading: 'مرة في الأسبوع',
                        items: [
                            'Operation Food Freedom جنوب شرق: نقطة توزيع الخضار والفواكه على أساس الاشتراك.',
                            'مجموعة الأعمال اليدوية خيـن لجميع أنواع الحرف اليدوية على كل المستويات.',
                            'ورش Shore No Mi للأمهات العازبات ذوات الميزانية المحدودة وضحايا بدل رعاية الأطفال.',
                            'مجموعة الرقص Aashish Dance - الرقص الكلاسيكي الهندي.',
                            'مجموعة الرقص Gentiaan - الرقص التقليدي الكوراساوي.',
                            'مجموعة الرقص Igbo - مجموعة الرقص الثقافي النيجيري أمستردام.'
                        ]
                    },
                    {
                        type: 'list',
                        heading: 'مرة كل أسبوعين',
                        items: ['خدمات كنيسة Mandir الهندوستانية.', 'سوق تبادل ملابس الأطفال.', 'دروس اليوغا.']
                    },
                    {
                        type: 'list',
                        heading: 'مرة في الشهر',
                        items: [
                            "AMMA's Precious Ladies، مجموعة اللقاء الاجتماعي الغانية للسيدات.",
                            'مجموعة القراءة - مناقشات الكتب الأدبية.',
                            'مقهى الإصلاح: امنح الأجهزة الكهربائية حياة ثانية من خلال إصلاحها.'
                        ]
                    },
                    {
                        type: 'list',
                        heading: 'أنشطة مخصصة',
                        items: [
                            'مجتمع خيـن وReigersbos وHolendrecht الغاني مع اجتماعات السكان والعروض التقديمية.',
                            'اجتماعات تجريبية للسيارة الكهربائية مع شريك مؤسسة De Groene Parasol مع السائقين/البلدية/التخطيط.',
                            'العديد من اجتماعات مجلس إدارة BPG مع مختلف أصحاب المصلحة.',
                            'العديد من الاجتماعات/التجمعات الفردية لسكان الحي وجمعيات الملاك (أيضًا من Reigersbos Buren).'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'الاستخدام متعدد الوظائف'
                    },
                    {
                        type: 'paragraph',
                        text: 'نظم فريق الآباء والأطفال Gaasperdam تدريب Rock and Water للأطفال الضعفاء، وكانت هناك العديد من حفلات أعياد ميلاد الأطفال، ومعارض مختلفة، كما تحب شرطة Gaasperdam استخدام مركز المجتمع لتدريبها على المهارات الخاصة.'
                    },
                    {
                        type: 'paragraph',
                        text: 'بدعم من صندوق V واللجنة الوطنية 4 و5 مايو (ومختلف سكان الحي النشطين) نظمنا أيضًا غداء الحرية الذي حضره الكثيرون في دي ستر في 5 مايو 2025 بموضوعات 80 عامًا من الحرية و40 عامًا من خيـن.'
                    },
                    {
                        type: 'subheading',
                        text: 'الترويج والحضور المرئي في خيـن'
                    },
                    {
                        type: 'paragraph',
                        text: 'وزعنا أكثر من 5000 منشور لتحفيز السكان على طرح الأفكار وقضينا الكثير من الوقت في توجيه/تسهيل/تنفيذ مشاريع مختلفة لميزانية حي خيـن في عام 2025.'
                    },
                    {
                        type: 'list',
                        heading: 'أنشطة ترويجية 2025',
                        items: [
                            '5-4-2025: عربة فواكه ترويجية لـ BPG خلال عيد الفطر المبارك في Wisseloord.',
                            '26-4-2025: كشك سوق ترويجي لـ BPG في مهرجان يوم الملك في Gein3Dorp.',
                            '31-5-2025: عربة فواكه ترويجية لـ BPG خلال سوق الصحة.',
                            '19-7-2025: ترويج BPG مع شبكة الجيران "الألعاب" في Wisseloord.',
                            '27-9-2025: كشك سوق ترويجي لـ BPG في حفل افتتاح Jan Schäeferplantsoen.',
                            '20-12-2025: كشك سوق ترويجي لـ BPG في سوق عيد الميلاد في مركز التسوق خيـن.'
                        ]
                    },
                    {
                        type: 'paragraph',
                        text: 'ساهمنا أيضًا في مقاطع فيديو ترويجية مختلفة من، من بين آخرين، تحالف منصات الأحياء.'
                    },
                    {
                        type: 'subheading',
                        text: 'التنفيذ/التسهيل لميزانية حي خيـن 2025 في دي ستر'
                    },
                    {
                        type: 'list',
                        items: [
                            '8-3-2025: حفلة البيجاما الدولية للنساء في دي ستر.',
                            '23-5-2025: أمسية التدليل للنساء في دي ستر.',
                            '7-6-2025: Hawaii Bingo في دي ستر.',
                            '27-6-2025: نشاط الأطفال والشباب "صيف في دي ستر".',
                            '30-6-2025: مهرجان Keti Koti للأطفال من قبل/للشباب في دي ستر.',
                            '4-10-2025: اليوم الثقافي الكوراساوي في دي ستر من قبل مجموعة الرقص Gentiaan.',
                            '11-11-2025: ورش صنع الأعمال الفنية الضوئية في دي ستر ومعرض في Gein3Dorp.',
                            '15-11-2025: ورش Elevate Yourself للأمهات في قوتهن في دي ستر.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'فعاليات في أماكن أخرى في خيـن من ميزانية الحي'
                    },
                    {
                        type: 'list',
                        items: [
                            '29-1-2025: نخب رأس السنة الجديدة لـ BPG لخيـن في Buurthuis Gein.',
                            '27-3-2025: وجبة إفطار في Buurthuis Gein.',
                            '21-4-2025: حفلة عيد الفصح في الحي في Wethouderbuurt.',
                            '26-4-2025: يوم الملك في Gein3Dorp لخيـن (أيضًا كشك مع ترويج BPG).',
                            '24-8-2025: احتفال الذكرى السنوية في مركز التسوق خيـن - 40 عامًا من خيـن / رائع في خيـن.',
                            '28-9-2025: يوم الجيران Wethouder den Hertogstraat.',
                            '28-9-2025: يوم الجيران Wethouder Driessenstraat.',
                            '11-11-2025: احتفال القديس مارتن تقليديًا في حديقة النحل Gein3Dorp.',
                            '20-12-2025: سوق عيد الميلاد في مركز التسوق خيـن.',
                            '22-12-2025: غداء عيد الميلاد في الحديقة الشتوية لشقة Wisseloord.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: '(التمويل المشترك) من ميزانية حي خيـن'
                    },
                    {
                        type: 'list',
                        items: [
                            '14-4-2025: تجديد المرآب وتأجير السيارة الكهربائية Gaasperdam.',
                            '19-6-2025: بناء ووضع خزانة الحي بجوار Partou في Wisseloord.',
                            '30-12-2025: مشروع الشباب Wellvest.',
                            '(التمويل المشترك) نصب يان شيفر.',
                            '(التمويل المشترك) الذكاء الاصطناعي في الرعاية الصحية.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'الأنشطة المستمرة من ميزانية الحي'
                    },
                    {
                        type: 'list',
                        items: [
                            'الاستوديو المفتوح لمجموعة الفن والثقافة في دي ستر.',
                            'صباحات الألعاب في Buurthuis Gein.',
                            'Veggie Pastry (بما في ذلك مجموعة الطبخ) في Buurthuis Gein.',
                            'ورش النساء القويات في Buurthuis Gein.',
                            'سوق تبادل ملابس الأطفال في دي ستر.',
                            'ورش صور الضوء Synesthete القديس مارتن.'
                        ]
                    },
                    {
                        type: 'subheading',
                        text: 'حاوية الرياضة على طول Stoutenburgergracht'
                    },
                    {
                        type: 'paragraph',
                        text: 'حاوية الرياضة التي تم وضعها في 19 أكتوبر 2023 على طول Stoutenburgergracht لم تُستخدم بشكل كافٍ في عام 2025. السطح غير قابل للوصول بسهولة بسبب الطقس السيئ المستمر وبه ثقوب خطيرة (من الشامات). سيظل هذا أيضًا نقطة اهتمام في عام 2026. نحن نحقق مع وسيط المنطقة فيما إذا كان يمكن وضع حاوية الرياضة في موقع مختلف.'
                    },
                    {
                        type: 'subheading',
                        text: 'الصيانة المؤجلة وبيئة المعيشة'
                    },
                    {
                        type: 'paragraph',
                        text: 'ساهم مجلس إدارة BPG في جرد الصيانة المؤجلة في خيـن.'
                    },
                    {
                        type: 'subheading',
                        text: 'التحسينات في عام 2025'
                    },
                    {
                        type: 'paragraph',
                        text: 'بدأنا نرى بعض التحسينات في عام 2025. الألواح الصفراء القبيحة والجدار الجانبي لمحطة مترو خيـن (جانب الخروج Wisseloord) مزينة الآن بلوحات جميلة صممها الفنان تيم رودرمانز. شاهد الفيديو بفضل Zuidoosttv: https://www.facebook.com/share/v/1Mjd9NMaLD/.'
                    },
                    {
                        type: 'paragraph',
                        text: 'تم أيضًا البدء في إعادة تصميم المساحة العامة حول مركز التسوق. لا يزال تنفيذ الاختناقات الأخرى في خيـن يتطلب بالتأكيد اهتمامًا كبيرًا في عام 2026. لسوء الحظ، توقفت المعركة المستمرة ضد القمامة في الحي والمشاورة على نطاق Gaasperdam مع موظفي النفايات والموارد التي بدأناها مرة أخرى بسبب تغيير الموظفين المدنيين ويجب إعادة تشغيلها.'
                    },
                    {
                        type: 'subheading',
                        text: 'اجتماع شركاء الحي'
                    },
                    {
                        type: 'paragraph',
                        text: 'يُعقد اجتماع شركاء الحي (يُسمى أيضًا اجتماع أصحاب المصلحة خيـن) الآن بشكل منظم ويحضره الكثيرون. الخطوط بين مختلف أصحاب المصلحة فيما بينهم وتجاه السكان تصبح أقصر ونبدأ في إيجاد بعضنا البعض بشكل أفضل وأفضل. من خلال الاتصال المستمر بين السكان وBPG فيما بينهم واجتماع شركاء الحي المذكور، يمكن جمع إشارات ومخاوف السكان. لذلك نما هذا الاجتماع بشكل كبير في عام 2025 ويجمع الآن 30 ساكنًا ومنظمة ومؤسسة. كما أدى إلى قيام المهنيين في الحي بتقديم فرصة منخفضة العتبة للسكان للتحدث معهم كل صباح أربعاء. نحن فخورون جدًا بهذه المبادرة التي بدأناها، مع وسيط المنطقة لدينا.'
                    },
                    {
                        type: 'subheading',
                        text: 'اجتماعات تحالف منصات الأحياء'
                    },
                    {
                        type: 'paragraph',
                        text: 'حضرت BPG 10 مرات في عام 2025 في اجتماعات المنسقين الشهرية المتناوبة لتحالف منصات الأحياء ZO. خلال هذه الاجتماعات من نظير إلى نظير نناقش الاختناقات ونجاحات منصات الأحياء وكيف يمكننا توحيد القوى حتى لا نضطر جميعًا إلى إعادة اختراع نفس العجلة. في 14 يوليو 2025 كنا الموقع المضيف في دي ستر لاجتماع المنسقين هذا. في ديسمبر 2025 ودعنا موظفنا المدني للديمقراطية، كاميلا مايجر. من المؤسف أن كاميلا تم وضعها في منصب آخر بعد عام واحد فقط. بفضلها جزئيًا، تمكنا من اتخاذ بعض الخطوات في رحلة الديمقراطية الطويلة ونتمنى لها النجاح في الوظيفة التالية. نتطلع إلى العمل مع الموظف المدني التالي في الصف.'
                    },
                    {
                        type: 'subheading',
                        text: 'التحالف على مستوى المدينة'
                    },
                    {
                        type: 'paragraph',
                        text: 'تُعقد اجتماعات التحالف على مستوى المدينة لمنصات الأحياء أمستردام شهريًا (أيضًا عبر الرئاسة المتناوبة) حيث تنضم Sjoukje Alta مرة كل شهرين. حضرت BPG 4 مرات. كانت BPG أيضًا حاضرة 8 مرات في الفحص عبر الإنترنت كل أسبوعين مع الداعمين والموظفين المدنيين.'
                    },
                    {
                        type: 'subheading',
                        text: 'الخاتمة'
                    },
                    {
                        type: 'paragraph',
                        text: 'تم تسجيل هذا الملخص للأنشطة في 17 فبراير 2026 من قبل جيري كرايكامب، رئيس مؤسسة منصة الحي والسكان خيـن. مؤسسة منصة الحي والسكان خيـن – رقم غرفة التجارة 85747254 – 21-2-2026 – bewonersplatformgein@gmail.com.'
                    }
                ]
            }
        ]
    },
    news: {
        eyebrow: 'الأخبار',
        title: 'الأخبار',
        subtitle: 'قصص حديثة من الحي',
        description:
            'قصص عن السكان والشركاء والمبادرات التي تدفع خيـن إلى الأمام. اقرأ آخر التحديثات أو افتح البطاقات لقراءة المقال الكامل.'
    },
    newsControls: {
        previous: 'السابق',
        next: 'التالي',
        articleCount: 'مقال {current} / {total}',
        otherArticles: 'مقالات أخرى',
        closeLabel: 'إغلاق المقال'
    },
    agenda: {
        eyebrow: 'الأجندة',
        title: 'الأجندة',
        subtitle: 'نشاطات ولقاءات في خيـن.',
        description:
            'نحدث الأجندة باستمرار بفعاليات الحي وورش العمل والاجتماعات وأنشطة الشركاء. أدناه أبرز المواعيد القادمة. هل تنظم فعالية؟ أخبرنا لنضيفها فورًا.',
        ctaLabel: 'أضف نشاطًا',
        events: agendaEventsByLocale.ar,
        viewToggle: {
            cards: 'بطاقات',
            calendar: 'التقويم'
        },
        moreInfo: 'مزيد من المعلومات',
        calendar: {
            weekDays: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
            monthDays: ['الإث', 'الثل', 'الأر', 'الخم', 'الجم', 'السب', 'الأح'],
            previousWeek: 'الأسبوع السابق',
            nextWeek: 'الأسبوع القادم',
            noEvents: 'لا توجد فعاليات',
            previousMonth: 'السابق',
            nextMonth: 'التالي'
        }
    },
    contact: {
        eyebrow: 'تواصل وشارك',
        title: 'تواصل وشارك',
        subtitle: 'تواصل معنا عبر النموذج أو قنواتنا.',
        formEyebrow: 'نموذج التواصل',
        formTitle: 'أخبرنا بما تحتاجه',
        formDescription: 'هل تريد التعاون أو مشاركة هواجسك؟ املأ النموذج أو اختر قناة مناسبة.',
        fields: {
            nameLabel: 'الاسم',
            namePlaceholder: 'اسمك',
            emailLabel: 'البريد الإلكتروني',
            emailPlaceholder: 'you@email.com',
            subjectLabel: 'الموضوع',
            subjectPlaceholder: 'اختر موضوعًا',
            subjectOptions: {
                budget: 'طلب ميزانية',
                info: 'معلومات أخرى',
                facilitair: 'المرافق'
            },
            messageLabel: 'الرسالة',
            messagePlaceholder: 'كيف يمكننا المساعدة؟'
        },
        formButton: 'إرسال الرسالة',
        newsletterEyebrow: 'النشرة البريدية',
        newsletterTitle: 'ابقَ على اطلاع',
        newsletterDescription: 'أخبار وأجندة ونداءات تصل إلى بريدك.',
        newsletterPlaceholder: 'عنوان البريد الإلكتروني',
        newsletterButton: 'اشترك',
        channelsEyebrow: 'القنوات',
        addressEyebrow: 'العنوان',
        addressTitle: 'مركز الحي دي ستر',
        addressLine: 'وودريخمسترات ٨، ١١٠٦ إل جي أمستردام',
        addressNote: 'تفضل بالزيارة أثناء الأنشطة أو احجز موعدًا مسبقًا.',
        addressMapTitle: 'خرائط غوغل – مركز الحي دي ستر',
        channels: [
            {
                type: 'instagram',
                title: 'إنستغرام',
                description: '@buurtplatformgein للصور والقصص والدعوات.',
                href: 'https://www.instagram.com/buurtplatformgein/'
            },
            {
                type: 'whatsapp',
                title: 'واتساب',
                description: 'انضم مباشرة إلى الجيران عبر مجموعتنا.',
                href: 'https://chat.whatsapp.com/FGJyu57xFQWGDcq7eF7gOA'
            }
        ]
    },
    footer: {
        orgName: 'منصة حي خيـن',
        tagline: 'من أجل بعضنا. مع بعضنا.',
        highlight: 'معًا نحافظ على الحي دافئًا وآمنًا ومستقبلًا.',
        legal: {
            foundation: 'مؤسسة منصة الحي والسكان خيـن',
            registration: 'رقم غرفة التجارة 85747254',
            status: 'منظمة خيرية ANBI معترف بها من مصلحة الضرائب'
        },
        credit: {
            prefix: 'الموقع من تصميم',
            linkLabel: 'Amplify'
        }
    },
    ui: {
        modalEyebrow: 'مبادرة',
        closeLabel: 'إغلاق',
        eventModal: {
            addToCalendar: 'أضف إلى التقويم',
            openLink: 'افتح الرابط'
        }
    }
};

export const dictionaries: Record<Locale, Dictionary> = {
    nl,
    en,
    ar
};

export type { Dictionary };
