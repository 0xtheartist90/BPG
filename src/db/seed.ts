import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { articles, agendaEvents } from './schema'
import { newsItems } from './seed-data/newsItems'
import { newsTranslations } from './seed-data/newsTranslations'
import type { Locale } from '../lib/i18n'

// Direct connection for seed script (doesn't use Next.js env loading)
const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
}

const localeDateFormatters: Record<Locale, Intl.DateTimeFormat> = {
    nl: new Intl.DateTimeFormat('nl-NL', { ...dateFormatOptions, timeZone: 'Europe/Amsterdam' }),
    en: new Intl.DateTimeFormat('en-GB', { ...dateFormatOptions, timeZone: 'Europe/Amsterdam' }),
    ar: new Intl.DateTimeFormat('ar-SA', { ...dateFormatOptions, timeZone: 'Europe/Amsterdam' })
}

function formatDateLabel(isoDate: string, locale: Locale): string {
    return localeDateFormatters[locale].format(new Date(`${isoDate}T12:00:00`))
}

/**
 * Create a Date for a given date + time in Europe/Amsterdam timezone.
 * Uses Intl to determine the correct UTC offset (CET +01:00 or CEST +02:00).
 */
function toAmsterdamDate(isoDate: string, time: string): Date {
    const rough = new Date(`${isoDate}T${time}Z`)
    const amParts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Amsterdam',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).formatToParts(rough)
    const get = (t: string) => amParts.find(p => p.type === t)?.value ?? '0'
    const amLocal = Date.UTC(
        parseInt(get('year')), parseInt(get('month')) - 1, parseInt(get('day')),
        parseInt(get('hour')), parseInt(get('minute')), parseInt(get('second'))
    )
    const offsetMs = amLocal - rough.getTime()
    const offsetHours = Math.round(offsetMs / 3_600_000)
    const offsetStr = `${offsetHours >= 0 ? '+' : '-'}${String(Math.abs(offsetHours)).padStart(2, '0')}:00`

    return new Date(`${isoDate}T${time}${offsetStr}`)
}

// ── Recurring event config ──

type RecurringEventKey = 'kunstInGein' | 'kinderkledingRuilpunt' | 'bewegingsexpressie' | 'repairCafe'

type RecurringEventTemplate = {
    image: string
    startTime: string
    endTime: string
    recurrencePattern: string
    timeLabel: Record<Locale, string>
    title: Record<Locale, string>
    location: Record<Locale, string>
    description: Record<Locale, string>
}

const KUNST_IN_GEIN_DATES = [
    '2026-01-06','2026-01-13','2026-01-20','2026-01-27',
    '2026-02-03','2026-02-10','2026-02-17','2026-02-24',
    '2026-03-03','2026-03-10','2026-03-17','2026-03-24','2026-03-31',
    '2026-04-07','2026-04-14','2026-04-21','2026-04-28',
    '2026-05-05','2026-05-12','2026-05-19','2026-05-26',
    '2026-06-02','2026-06-09','2026-06-16','2026-06-23','2026-06-30',
    '2026-07-07','2026-07-14','2026-07-21','2026-07-28',
    '2026-08-04','2026-08-11','2026-08-18','2026-08-25',
    '2026-09-01','2026-09-08','2026-09-15','2026-09-22','2026-09-29',
    '2026-10-06','2026-10-13','2026-10-20','2026-10-27',
    '2026-11-03','2026-11-10','2026-11-17','2026-11-24',
    '2026-12-01','2026-12-08','2026-12-15','2026-12-22','2026-12-29'
]

const KINDERKLEDING_DATES = [
    '2026-01-14','2026-01-28','2026-02-11','2026-02-25',
    '2026-03-11','2026-03-25','2026-04-08','2026-04-22',
    '2026-05-06','2026-05-20','2026-06-03','2026-06-17',
    '2026-07-01','2026-07-15','2026-07-29','2026-08-12',
    '2026-08-26','2026-09-09','2026-09-23','2026-10-07',
    '2026-10-21','2026-11-04','2026-11-18','2026-12-02',
    '2026-12-16','2026-12-30'
]

const BEWEGINGSEXPRESSIE_DATES = [
    '2026-01-07','2026-01-14','2026-01-21','2026-01-28',
    '2026-02-04','2026-02-11','2026-02-18','2026-02-25',
    '2026-03-04','2026-03-11','2026-03-18','2026-03-25',
    '2026-04-01','2026-04-08','2026-04-15','2026-04-22','2026-04-29',
    '2026-05-06','2026-05-13','2026-05-20','2026-05-27',
    '2026-06-03','2026-06-10','2026-06-17','2026-06-24',
    '2026-07-01','2026-07-08','2026-07-15','2026-07-22','2026-07-29',
    '2026-08-05','2026-08-12','2026-08-19','2026-08-26',
    '2026-09-02','2026-09-09','2026-09-16','2026-09-23','2026-09-30',
    '2026-10-07','2026-10-14','2026-10-21','2026-10-28',
    '2026-11-04','2026-11-11','2026-11-18','2026-11-25',
    '2026-12-02','2026-12-09','2026-12-16','2026-12-23','2026-12-30'
]

const REPAIR_CAFE_DATES = [
    '2026-01-09','2026-02-13','2026-03-13','2026-04-10',
    '2026-05-08','2026-06-12','2026-07-10','2026-08-14',
    '2026-09-11','2026-10-09','2026-11-13','2026-12-11'
]

const recurringEventDates: Record<RecurringEventKey, string[]> = {
    kunstInGein: KUNST_IN_GEIN_DATES,
    kinderkledingRuilpunt: KINDERKLEDING_DATES,
    bewegingsexpressie: BEWEGINGSEXPRESSIE_DATES,
    repairCafe: REPAIR_CAFE_DATES
}

const recurringEventTemplates: Record<RecurringEventKey, RecurringEventTemplate> = {
    kunstInGein: {
        image: '/images/Agenda/Kunst%20in%20gein.png',
        startTime: '20:00:00',
        endTime: '22:00:00',
        recurrencePattern: 'weekly',
        timeLabel: { nl: '20:00 - 22:00', en: '20:00 – 22:00', ar: '٢٠:٠٠ – ٢٢:٠٠' },
        title: { nl: 'Kunst in Gein', en: 'Art in Gein', ar: 'الفن في خيـن' },
        location: { nl: 'De Ster, Woudrichemstraat 8', en: 'De Ster, Woudrichemstraat 8', ar: 'دي ستر، شارع وودريخم ٨' },
        description: { nl: 'Gratis open atelier voor iedereen, van beginner tot gevorderde.', en: 'Free open studio for everyone—from beginners to advanced makers.', ar: 'مرسم مفتوح مجاني للجميع من المبتدئين إلى المتقدمين.' }
    },
    kinderkledingRuilpunt: {
        image: '/images/Agenda/Kinderkleding%20Ruilpunt.png',
        startTime: '10:00:00',
        endTime: '12:00:00',
        recurrencePattern: 'biweekly',
        timeLabel: { nl: '10:00 - 12:00', en: '10:00 – 12:00', ar: '١٠:٠٠ – ١٢:٠٠' },
        title: { nl: 'Kinderkleding Ruilpunt', en: 'Kids Clothing Swap', ar: 'نقطة تبادل ملابس الأطفال' },
        location: { nl: 'Buurthub De Ster, Woudrichemstraat 8', en: 'Buurthub De Ster, Woudrichemstraat 8', ar: 'مركز الحي دي ستر، شارع وودريخم ٨' },
        description: { nl: 'Ruil schone en onbeschadigde kinderkleding. Alle kindermaten welkom. Zaterdag 1x per maand.', en: 'Swap clean, undamaged children\u2019s clothes. All sizes welcome. Saturdays once per month.', ar: 'بدّل ملابس أطفال نظيفة وسليمة. جميع المقاسات مرحب بها. السبت مرة كل شهر.' }
    },
    bewegingsexpressie: {
        image: '/images/Agenda/Bewegingsexpressie.png',
        startTime: '19:00:00',
        endTime: '20:30:00',
        recurrencePattern: 'weekly',
        timeLabel: { nl: '19:00 - 20:30', en: '19:00 – 20:30', ar: '١٩:٠٠ – ٢٠:٣٠' },
        title: { nl: 'Bewegingsexpressie', en: 'Movement Expression Class', ar: 'تعبير حركي' },
        location: { nl: 'De Ster, Woudrichemstraat 8', en: 'De Ster, Woudrichemstraat 8', ar: 'دي ستر، شارع وودريخم ٨' },
        description: { nl: 'Movement Expression Class door Inger van den Berg. Contact: bewegingsexpressie@outlook.com', en: 'Movement Expression (Bewegingsexpressie) with Inger van den Berg. Contact: bewegingsexpressie@outlook.com', ar: 'حصة تعبير حركي مع إنخر فان دن بيرخ. للتواصل: bewegingsexpressie@outlook.com' }
    },
    repairCafe: {
        image: '/images/Agenda/Repair%20Cafe.png',
        startTime: '15:00:00',
        endTime: '18:00:00',
        recurrencePattern: 'monthly',
        timeLabel: { nl: '15:00 - 18:00', en: '15:00 – 18:00', ar: '١٥:٠٠ – ١٨:٠٠' },
        title: { nl: 'Repair Café', en: 'Repair Café', ar: 'مقهى الإصلاح' },
        location: { nl: 'De Ster (zij ingang), Woudrichemstraat 8', en: 'De Ster (side entrance), Woudrichemstraat 8', ar: 'دي ستر (المدخل الجانبي)، شارع وودريخم ٨' },
        description: { nl: 'Geef je kapotte apparaat een tweede leven. Weggooien? Mooi niet!', en: 'Give your broken device a second life. "Throw it away? No way!"', ar: 'امنح جهازك المعطّل حياة جديدة. "ترميه؟ مستحيل!"' }
    }
}

// ── Fixed events ──

const fixedEvents: Array<{
    groupId: string
    isoDate: string
    startTime: string
    endTime: string
    image: string
    locales: Record<Locale, { title: string; location: string; description: string; timeLabel: string }>
}> = [
    {
        groupId: crypto.randomUUID(),
        isoDate: '2026-04-27',
        startTime: '10:00:00',
        endTime: '16:00:00',
        image: '/images/Agenda/koningsdag.png',
        locales: {
            nl: { title: 'Koningsdag in de Wijk', location: 'Buitenlocatie in de wijk (Gein)', description: 'Vier Koningsdag samen met de buurt! Trek iets oranjes aan en geniet van muziek, gezelligheid en activiteiten voor jong en oud. Kom langs met familie, buren en vrienden en maak er samen een feestelijke dag van.', timeLabel: '10:00 - 16:00' },
            en: { title: "King's Day in the Neighborhood", location: 'Outdoor location in Gein', description: "Celebrate King's Day with the neighborhood! Wear something orange and enjoy music, togetherness and activities for all ages. Bring family, neighbors and friends to make it a festive day.", timeLabel: '10:00 – 16:00' },
            ar: { title: 'يوم الملك في الحي', location: 'موقع خارجي في خيـن', description: 'احتفل بيوم الملك مع سكان الحي! ارتدِ شيئًا برتقاليًا واستمتع بالموسيقى والأجواء والأنشطة للصغار والكبار. تعال مع العائلة والجيران والأصدقاء لنجعلها مناسبة احتفالية.', timeLabel: '١٠:٠٠ – ١٦:٠٠' }
        }
    },
    {
        groupId: crypto.randomUUID(),
        isoDate: '2026-03-05',
        startTime: '17:30:00',
        endTime: '19:30:00',
        image: '/images/Agenda/Iftar.png',
        locales: {
            nl: { title: 'Vier IFTAR niet alleen', location: 'Buurthuis Gein', description: 'Inloop vanaf 17:30. Om 17:45 vertelt een imam over Iftar. Vanaf 18:30 wordt een veelzijdig multicultureel menu geserveerd. Slechts 30 plekken beschikbaar. Aanmelden via 06-10625997.', timeLabel: '17:30 - 19:30' },
            en: { title: "Don't celebrate IFTAR alone", location: 'Buurthuis Gein', description: 'Doors open at 17:30. At 17:45 an imam explains the meaning of Iftar. From 18:30 a diverse multicultural dinner is served. Only 30 spots available. Register via 06-10625997.', timeLabel: '17:30 – 19:30' },
            ar: { title: 'لا تحتفل بالإفطار وحدك', location: 'بيت الحي خيـن', description: 'يبدأ الاستقبال ١٧:٣٠. عند ١٧:٤٥ يشرح إمام معنى الإفطار. من ١٨:٣٠ تُقدَّم وجبة متعددة الثقافات. المقاعد ٣٠ فقط. التسجيل عبر 06-10625997.', timeLabel: '١٧:٣٠ – ١٩:٣٠' }
        }
    }
]

// ── Seed function ──

async function seed() {
    console.log('Clearing existing data...')
    await db.delete(agendaEvents)
    await db.delete(articles)

    // ── Articles ──
    console.log('Seeding articles...')
    let articleCount = 0

    for (const item of newsItems) {
        const groupId = crypto.randomUUID()

        await db.insert(articles).values({
            groupId,
            locale: 'nl',
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            content: item.content.join('\n\n'),
            image: item.image,
            tag: item.tag ?? null,
            version: 1
        })
        articleCount++

        const trans = newsTranslations[item.slug]
        if (trans?.en) {
            await db.insert(articles).values({
                groupId,
                locale: 'en',
                title: trans.en.title,
                slug: item.slug,
                excerpt: trans.en.excerpt,
                content: trans.en.content.join('\n\n'),
                image: item.image,
                tag: item.tag ?? null,
                version: 1
            })
            articleCount++
        }
        if (trans?.ar) {
            await db.insert(articles).values({
                groupId,
                locale: 'ar',
                title: trans.ar.title,
                slug: item.slug,
                excerpt: trans.ar.excerpt,
                content: trans.ar.content.join('\n\n'),
                image: item.image,
                tag: item.tag ?? null,
                version: 1
            })
            articleCount++
        }
    }

    // Content encoding verification (spot-check first 3 articles)
    console.log('Verifying content encoding...')
    for (let i = 0; i < 3 && i < newsItems.length; i++) {
        const original = newsItems[i].content
        const encoded = original.join('\n\n')
        const decoded = encoded.split('\n\n')
        if (JSON.stringify(original) !== JSON.stringify(decoded)) {
            console.error(`Content encoding roundtrip FAILED for article: ${newsItems[i].slug}`)
            process.exit(1)
        }
    }
    console.log('Content encoding verified OK')

    console.log(`Seeded ${articleCount} article rows`)

    // ── Agenda Events — Recurring ──
    console.log('Seeding recurring agenda events...')
    let eventCount = 0
    const locales: Locale[] = ['nl', 'en', 'ar']

    for (const key of Object.keys(recurringEventTemplates) as RecurringEventKey[]) {
        const template = recurringEventTemplates[key]
        const dates = recurringEventDates[key]
        const templateGroupId = crypto.randomUUID()

        // Insert template rows (one per locale) — use first date as startDatetime
        const templateIds: Record<Locale, number> = {} as Record<Locale, number>

        for (const locale of locales) {
            const result = await db.insert(agendaEvents).values({
                groupId: templateGroupId,
                locale,
                title: template.title[locale],
                date: formatDateLabel(dates[0], locale),
                time: template.timeLabel[locale],
                startDatetime: toAmsterdamDate(dates[0], template.startTime),
                endDatetime: toAmsterdamDate(dates[0], template.endTime),
                location: template.location[locale],
                description: template.description[locale],
                image: template.image,
                isRecurring: true,
                recurrencePattern: template.recurrencePattern,
                parentEventId: null,
                version: 1
            }).returning({ id: agendaEvents.id })

            templateIds[locale] = result[0].id
            eventCount++
        }

        // Insert instance rows for each date (skip first — that's the template date)
        for (const isoDate of dates.slice(1)) {
            for (const locale of locales) {
                await db.insert(agendaEvents).values({
                    groupId: templateGroupId,
                    locale,
                    title: template.title[locale],
                    date: formatDateLabel(isoDate, locale),
                    time: template.timeLabel[locale],
                    startDatetime: toAmsterdamDate(isoDate, template.startTime),
                    endDatetime: toAmsterdamDate(isoDate, template.endTime),
                    location: template.location[locale],
                    description: template.description[locale],
                    image: template.image,
                    isRecurring: false,
                    parentEventId: templateIds[locale],
                    version: 1
                })
                eventCount++
            }
        }
    }

    // ── Agenda Events — Fixed ──
    console.log('Seeding fixed agenda events...')

    for (const event of fixedEvents) {
        for (const locale of locales) {
            const localeData = event.locales[locale]
            await db.insert(agendaEvents).values({
                groupId: event.groupId,
                locale,
                title: localeData.title,
                date: formatDateLabel(event.isoDate, locale),
                time: localeData.timeLabel,
                startDatetime: toAmsterdamDate(event.isoDate, event.startTime),
                endDatetime: toAmsterdamDate(event.isoDate, event.endTime),
                location: localeData.location,
                description: localeData.description,
                image: event.image,
                isRecurring: false,
                parentEventId: null,
                version: 1
            })
            eventCount++
        }
    }

    console.log(`Seeded ${eventCount} agenda event rows`)
    console.log('Seed complete!')
}

// eslint-disable-next-line promise/catch-or-return
seed().catch(console.error).finally(() => process.exit())
