import { getDictionary } from '@/lib/getDictionary';
import { type Locale, locales } from '@/lib/i18n';
import { getPublishedArticles, getUpcomingEvents } from '@/db/queries';

import BPGPage from './BPGPage';

type PageProps = {
    params: Promise<{ lang?: string }>;
};

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    const locale: Locale = locales.includes(lang as Locale) ? (lang as Locale) : 'nl';
    const dict = getDictionary(locale);

    const [articles, events] = await Promise.all([
        getPublishedArticles(locale, 24),
        getUpcomingEvents(locale)
    ]);

    return <BPGPage dict={dict} locale={locale} articles={articles} events={events} />;
}
