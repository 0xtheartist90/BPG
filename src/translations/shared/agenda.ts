import type { Locale } from '@/lib/i18n';
import type { AgendaEvent } from '@/types/agenda';

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
    '2026-01-14',
    '2026-01-28',
    '2026-02-11',
    '2026-02-25',
    '2026-03-11',
    '2026-03-25',
    '2026-04-08',
    '2026-04-22',
    '2026-05-06',
    '2026-05-20',
    '2026-06-03',
    '2026-06-17',
    '2026-07-01',
    '2026-07-15',
    '2026-07-29',
    '2026-08-12',
    '2026-08-26',
    '2026-09-09',
    '2026-09-23',
    '2026-10-07',
    '2026-10-21',
    '2026-11-04',
    '2026-11-18',
    '2026-12-02',
    '2026-12-16',
    '2026-12-30'
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

export const agendaEventsByLocale: Record<Locale, AgendaEvent[]> = {
    nl: sortEventsByStart([...fixedEventsByLocale.nl, ...buildRecurringEventsForLocale('nl')]),
    en: sortEventsByStart([...fixedEventsByLocale.en, ...buildRecurringEventsForLocale('en')]),
    ar: sortEventsByStart([...fixedEventsByLocale.ar, ...buildRecurringEventsForLocale('ar')])
};
