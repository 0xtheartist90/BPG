import { getDictionary } from '@/lib/getDictionary';
import { type Locale, locales } from '@/lib/i18n';

import BPGPage from './BPGPage';

type PageProps = {
    params: Promise<{ lang?: string }>;
};

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    const locale: Locale = locales.includes(lang as Locale) ? (lang as Locale) : 'nl';
    const dict = getDictionary(locale);

    const hasDatabase = Boolean(process.env.DATABASE_URL);

    const [articles, events] = hasDatabase
        ? await (async () => {
              const { getPublishedArticles, getUpcomingEvents } = await import('@/db/queries');

              return Promise.all([getPublishedArticles(locale, 24), getUpcomingEvents(locale)]);
          })()
        : await (async () => {
              const { newsItems } = await import('@/data/newsItems');

              return [newsItems.slice(0, 24), dict.agenda.events];
          })();

    return <BPGPage dict={dict} locale={locale} articles={articles} events={events} />;
}
