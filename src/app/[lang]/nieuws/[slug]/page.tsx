import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getArticleBySlug } from '@/db/queries';
import { type Locale, locales } from '@/lib/i18n';

export const dynamicParams = true;
export const revalidate = 60;

type Props = {
    params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { lang, slug } = await params;
    const locale: Locale = locales.includes(lang as Locale) ? (lang as Locale) : 'nl';
    const article = await getArticleBySlug(slug, locale);
    if (!article) return { title: 'Niet gevonden' };

    return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: Props) {
    const { lang, slug } = await params;
    const locale: Locale = locales.includes(lang as Locale) ? (lang as Locale) : 'nl';

    const article = await getArticleBySlug(slug, locale);
    if (!article) notFound();

    return (
        <main className='bg-[#eaa854] text-foreground'>
            <section className='px-4 py-16 sm:px-6 lg:px-10'>
                <div className='mx-auto max-w-4xl space-y-6 rounded-3xl bg-white/90 p-8 shadow-2xl shadow-[#d06129]/20'>
                    {article.image && (
                        <div className='relative -mx-8 -mt-8 mb-2 h-64 overflow-hidden rounded-t-3xl sm:h-80'>
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className='object-cover'
                                sizes='(max-width: 896px) 100vw, 896px'
                                priority
                            />
                        </div>
                    )}
                    <div className='text-sm uppercase tracking-[0.3em] text-[#d06129]'>{article.tag ?? 'Nieuws'}</div>
                    <h1 className='text-4xl font-black leading-tight text-[#43160c] sm:text-5xl'>{article.title}</h1>
                    <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#43160c]/70'>
                        {article.date ?? 'Gein'} · Buurtplatform Gein
                    </p>
                    <div className='space-y-4 text-lg text-[#43160c]/90'>
                        {article.content.map((paragraph, index) => (
                            <p key={`p-${index}`}>{paragraph}</p>
                        ))}
                    </div>
                    <div className='flex flex-wrap gap-3 pt-4'>
                        <Link
                            href={`/${locale}#nieuws`}
                            className='inline-flex items-center gap-2 rounded-full border border-[#d06129] px-5 py-2 text-sm font-semibold text-[#d06129] transition hover:bg-[#d06129] hover:text-white'>
                            ← Terug naar overzicht
                        </Link>
                        <Link
                            href={`/${locale}#contact`}
                            className='inline-flex items-center gap-2 rounded-full bg-[#d06129] px-5 py-2 text-sm font-semibold text-white shadow shadow-[#d06129]/30'>
                            Deel jouw verhaal
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
