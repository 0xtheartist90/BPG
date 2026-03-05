export default async function LangLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <div lang={lang} dir={dir}>
            {children}
        </div>
    );
}
