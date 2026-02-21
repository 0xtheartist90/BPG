import Link from 'next/link';
import { notFound } from 'next/navigation';

import { newsItems } from '@/data/newsItems';

type ArticlePageProps = {
    params: Promise<{ slug: string }>;
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { slug } = await params;
    const article = newsItems.find((item) => item.slug === slug);

    if (!article) {
        notFound();
    }

    return (
        <main className='bg-[#eaa854] text-foreground'>
            <section className='px-4 py-16 sm:px-6 lg:px-10'>
                <div className='mx-auto max-w-4xl space-y-6 rounded-3xl bg-white/90 p-8 shadow-2xl shadow-[#d06129]/20'>
                    <div className='text-sm uppercase tracking-[0.3em] text-[#d06129]'>{article.tag ?? 'Nieuws'}</div>
                    <h1 className='text-4xl font-black leading-tight text-[#43160c] sm:text-5xl'>{article.title}</h1>
                    <p className='text-sm font-semibold uppercase tracking-[0.3em] text-[#43160c]/70'>{article.date ?? 'Gein'} · Buurtplatform Gein</p>
                    <div className='space-y-4 text-lg text-[#43160c]/90'>
                        {article.content.map((paragraph, index) => (
                            <p key={`${article.slug}-paragraph-${index}`}>{paragraph}</p>
                        ))}
                    </div>
                    <div className='flex flex-wrap gap-3 pt-4'>
                        <Link
                            href='/#nieuws'
                            className='inline-flex items-center gap-2 rounded-full border border-[#d06129] px-5 py-2 text-sm font-semibold text-[#d06129] transition hover:bg-[#d06129] hover:text-white'>
                            ← Terug naar overzicht
                        </Link>
                        <Link
                            href='/#contact'
                            className='inline-flex items-center gap-2 rounded-full bg-[#d06129] px-5 py-2 text-sm font-semibold text-white shadow shadow-[#d06129]/30'>
                            Deel jouw verhaal
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export async function generateStaticParams() {
    return newsItems.map((item) => ({ slug: item.slug }));
}

export default ArticlePage;
