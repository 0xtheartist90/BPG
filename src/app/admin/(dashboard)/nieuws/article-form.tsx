'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { createArticle, updateArticle } from '../../actions/articles';
import { ImageUpload } from '../../components/image-upload';

type LocaleFields = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    tag: string;
};

type ArticleData = {
    groupId: string;
    version: number;
    published: boolean;
    locales: Record<
        string,
        {
            id: number;
            title: string;
            slug: string;
            excerpt: string | null;
            content: string | null;
            image: string | null;
            tag: string | null;
        }
    >;
};

const LOCALES = [
    { key: 'nl', label: '🇳🇱 Nederlands' },
    { key: 'en', label: '🇬🇧 English' },
    { key: 'ar', label: '🇸🇦 عربي' }
] as const;

const emptyFields = (): LocaleFields => ({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    tag: ''
});

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function isLocaleEmpty(fields: LocaleFields): boolean {
    return !fields.title.trim() && !fields.content.trim();
}

export function ArticleForm({ article }: { article?: ArticleData }) {
    const router = useRouter();
    const isEdit = !!article;

    const [activeTab, setActiveTab] = useState<string>('nl');
    const [published, setPublished] = useState(article?.published ?? true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);

    const [localeData, setLocaleData] = useState<Record<string, LocaleFields>>(() => {
        const data: Record<string, LocaleFields> = {};
        for (const { key } of LOCALES) {
            const existing = article?.locales[key];
            data[key] = existing
                ? {
                      title: existing.title,
                      slug: existing.slug,
                      excerpt: existing.excerpt ?? '',
                      content: existing.content ?? '',
                      image: existing.image ?? '',
                      tag: existing.tag ?? ''
                  }
                : emptyFields();
        }

        return data;
    });

    function updateField(locale: string, field: keyof LocaleFields, value: string) {
        setLocaleData((prev) => ({
            ...prev,
            [locale]: { ...prev[locale], [field]: value }
        }));

        // Auto-generate slug from NL title on create
        if (!isEdit && locale === 'nl' && field === 'title' && !slugManuallyEdited) {
            const slug = generateSlug(value);
            setLocaleData((prev) => ({
                ...prev,
                nl: { ...prev.nl, slug }
            }));
        }

        // Clear field error
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[`${locale}.${field}`];

            return next;
        });
    }

    function validate(): boolean {
        const errors: Record<string, string> = {};
        const nl = localeData.nl;

        if (!nl.title.trim() || nl.title.trim().length < 3) {
            errors['nl.title'] = 'Nederlandse titel is verplicht (min. 3 tekens)';
        }

        // Validate slug format for all non-empty locales
        for (const { key } of LOCALES) {
            const fields = localeData[key];
            if (isLocaleEmpty(fields)) continue;

            if (!fields.slug.trim()) {
                errors[`${key}.slug`] = 'Slug is verplicht';
            } else if (!/^[a-z0-9-]{3,200}$/.test(fields.slug)) {
                errors[`${key}.slug`] = 'Slug: alleen a-z, 0-9 en - (3-200 tekens)';
            }

            if (fields.image && !fields.image.startsWith('/images/') && !fields.image.startsWith('http')) {
                errors[`${key}.image`] = 'Upload een afbeelding of gebruik een pad dat begint met /images/';
            }
        }

        // Published requires NL content
        if (published && !nl.content.trim()) {
            errors['nl.content'] = 'Nederlandse inhoud is verplicht om te publiceren';
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    }

    async function handleSave() {
        if (!validate()) return;

        setSaving(true);
        setError(null);

        const locales: Record<string, LocaleFields | null> = {};
        for (const { key } of LOCALES) {
            locales[key] = isLocaleEmpty(localeData[key]) ? null : localeData[key];
        }

        let result: { success: boolean; error?: string };

        if (isEdit && article) {
            result = await updateArticle(article.groupId, article.version, { published, locales });
        } else {
            result = await createArticle({ published, locales });
        }

        if (result.success) {
            router.push('/admin/nieuws');
        } else {
            setError(result.error ?? 'Opslaan mislukt. Probeer opnieuw.');
            setSaving(false);
        }
    }

    const current = localeData[activeTab];
    const isRtl = activeTab === 'ar';

    return (
        <div>
            <h1 className='mb-6 text-2xl font-bold text-[#43160c]'>{isEdit ? 'Artikel bewerken' : 'Nieuw artikel'}</h1>

            {error && (
                <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                    <p role='alert' className='text-sm text-red-700'>
                        {error}
                    </p>
                </div>
            )}

            {/* Language tabs */}
            <div className='mb-6 flex gap-1 rounded-xl bg-[#faeacd]/60 p-1'>
                {LOCALES.map(({ key, label }) => {
                    const hasContent = !isLocaleEmpty(localeData[key]);

                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                                activeTab === key
                                    ? 'bg-white text-[#43160c] shadow-sm'
                                    : 'text-[#6c3d20] hover:bg-white/50'
                            }`}>
                            {label}
                            {hasContent && <span className='ml-1.5 text-[#33c17d]'>●</span>}
                        </button>
                    );
                })}
            </div>

            {/* Form fields */}
            <div className='space-y-5 rounded-2xl border border-[#f3d9ba] bg-white p-6 shadow-sm' dir={isRtl ? 'rtl' : 'ltr'}>
                {isLocaleEmpty(current) && activeTab !== 'nl' && !isEdit && (
                    <p className='mb-2 text-sm text-[#d9c4ad] italic'>
                        {activeTab === 'en' ? 'Not yet translated' : 'لم تتم الترجمة بعد'}
                    </p>
                )}

                <div>
                    <label htmlFor='title' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Titel *
                    </label>
                    <input
                        id='title'
                        type='text'
                        value={current.title}
                        onChange={(e) => updateField(activeTab, 'title', e.target.value)}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                        aria-describedby={fieldErrors[`${activeTab}.title`] ? 'title-error' : undefined}
                    />
                    {fieldErrors[`${activeTab}.title`] && (
                        <p id='title-error' className='mt-1 text-xs text-red-600'>
                            {fieldErrors[`${activeTab}.title`]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor='slug' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Slug *
                    </label>
                    <input
                        id='slug'
                        type='text'
                        value={current.slug}
                        onChange={(e) => {
                            updateField(activeTab, 'slug', e.target.value);
                            if (activeTab === 'nl') setSlugManuallyEdited(true);
                        }}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 font-mono text-sm text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                        aria-describedby={fieldErrors[`${activeTab}.slug`] ? 'slug-error' : undefined}
                    />
                    {fieldErrors[`${activeTab}.slug`] && (
                        <p id='slug-error' className='mt-1 text-xs text-red-600'>
                            {fieldErrors[`${activeTab}.slug`]}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor='excerpt' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Samenvatting
                    </label>
                    <input
                        id='excerpt'
                        type='text'
                        value={current.excerpt}
                        onChange={(e) => updateField(activeTab, 'excerpt', e.target.value)}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                    />
                </div>

                <ImageUpload
                    value={current.image}
                    onChange={(url) => updateField(activeTab, 'image', url)}
                    error={fieldErrors[`${activeTab}.image`]}
                />

                <div>
                    <label htmlFor='tag' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Tag (optioneel)
                    </label>
                    <input
                        id='tag'
                        type='text'
                        value={current.tag}
                        onChange={(e) => updateField(activeTab, 'tag', e.target.value)}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                    />
                </div>

                <div>
                    <label htmlFor='content' className='mb-1.5 block text-sm font-medium text-[#43160c]'>
                        Inhoud *{' '}
                        <span className='font-normal text-[#d9c4ad]'>(scheid alinea&apos;s met een lege regel)</span>
                    </label>
                    <textarea
                        id='content'
                        rows={12}
                        value={current.content}
                        onChange={(e) => updateField(activeTab, 'content', e.target.value)}
                        className='w-full rounded-xl border border-[#f3d9ba] bg-[#faeacd]/20 px-4 py-2.5 text-[#43160c] focus:border-[#d06129] focus:ring-2 focus:ring-[#ff4d00]/20 focus:outline-none'
                        aria-describedby={fieldErrors[`${activeTab}.content`] ? 'content-error' : undefined}
                    />
                    {fieldErrors[`${activeTab}.content`] && (
                        <p id='content-error' className='mt-1 text-xs text-red-600'>
                            {fieldErrors[`${activeTab}.content`]}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom controls */}
            <div className='mt-6 flex items-center justify-between'>
                <label className='flex cursor-pointer items-center gap-2'>
                    <input
                        type='checkbox'
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className='h-4 w-4 rounded border-[#f3d9ba] text-[#ff4d00] focus:ring-[#ff4d00]'
                    />
                    <span className='text-sm text-[#43160c]'>Gepubliceerd</span>
                </label>

                <div className='flex gap-2'>
                    <button
                        onClick={() => router.push('/admin/nieuws')}
                        className='rounded-xl border border-[#f3d9ba] bg-[#faeacd]/50 px-5 py-2.5 text-sm font-medium text-[#43160c] hover:bg-[#faeacd]'>
                        Annuleren
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className='rounded-xl bg-[#ff4d00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e04400] disabled:opacity-50'>
                        {saving ? 'Bezig...' : 'Opslaan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
