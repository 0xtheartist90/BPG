'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

type HighlightItem = {
    title: string;
    description: string;
    actionLabel: string;
    content: ReactNode;
};

const highlights: HighlightItem[] = [
    {
        title: 'Buurtbudget 2024-2025',
        description:
            'Financiële ondersteuning voor ideeën die Gein mooier en socialer maakt. Ontdek de criteria en plan een gesprek om hulp te krijgen bij je aanvraag.',
        actionLabel: 'Lees volledige info',
        content: (
            <div className='space-y-4 text-base text-[#43160c]/90'>
                <p>Wij brengen je graag op de hoogte van de laatste ontwikkelingen rond het Buurtbudget. November 2024 – Beste medebewoners van Gein, zoals eerder gemeld heeft Gein dit jaar weer een Buurtbudget ontvangen. De periode van uitvoering loopt tot en met 1 juli 2025.</p>
                <p>
                    In elke buurt in Zuidoost vraagt een buurtplatform het bedrag aan namens de buurt. Bewoners komen vervolgens met ideeën. Dit jaar investeren we niet alleen in losse activiteiten, maar vooral in blijvende sociale activiteiten en een sterk buurtplatform – zo werken we toe naar een goed georganiseerde buurt.
                </p>
                <p>
                    Buurtplatform Gein organiseerde twee informatieavonden op 29 april en 3 juni. Bewoners brachten thema’s en concrete plannen in. Heb je vragen of wil je zelf iets organiseren? We denken het hele jaar mee. Belangrijk: we verzamelen geen losse ideeën, maar concrete plannen. Dus: wat ga je doen, wie voert het uit, hoe bereik je de buurt en wat heb je nodig?
                </p>
                <div>
                    <h4 className='text-lg font-semibold text-[#d06129]'>Projecten die van start gaan</h4>
                    <ul className='mt-2 list-disc space-y-2 pl-5 text-sm text-[#43160c]'>
                        <li>
                            <strong>E-Car</strong>: een elektrische buurtauto voor senioren en bewoners met een (tijdelijke) mobiliteitsbeperking. Pilot samen met de gemeente, Nellestein en vrijwilligers voor coördinatie.
                        </li>
                        <li>
                            <strong>Multifunctioneel monument Jan Schaëferplein</strong>: opslagruimte met overkapping ter ere van 40 jaar Gein3Dorp, ontworpen door Frans Salman en bruikbaar voor Gein3Dorp, de Bijentuin en basisschool Het Gein.
                        </li>
                        <li>
                            <strong>Buurtkast</strong>: een grotere kast bij kinderopvang Partou voor voedseluitgifte en armoedebestrijding.
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className='text-lg font-semibold text-[#d06129]'>Daarnaast</h4>
                    <p className='text-sm text-[#43160c]'>Op initiatief van BPG werken we aan: kunstgroepen en workshops, activiteiten voor kinderen en jongeren, Buurt Bingo, Nieuwjaarsproost, Voorjaarsmarkt en Zomerfeest. Houd het BPG-informatiebord in Winkelcentrum Gein in de gaten voor updates.</p>
                </div>
            </div>
        )
    },
    {
        title: 'ANBI-status',
        description: 'Buurtplatform Gein is een erkende ANBI-stichting. Transparantie over inkomsten en bestedingen vind je in het jaarverslag.',
        actionLabel: 'Wat houdt dit in?',
        content: (
            <div className='space-y-4 text-base text-[#43160c]/90'>
                <p>
                    Sinds 2022 heeft Buurtplatform Gein de officiële ANBI-status. Dat betekent dat we elke gift en subsidie transparant verantwoorden en dat donaties voor inwoners fiscaal aantrekkelijker kunnen zijn.
                </p>
                <p>
                    In het jaarverslag vind je de volledige financiële verantwoording, onze beleidsplannen en de wijze waarop we middelen inzetten om Gein leefbaar en verbonden te houden.
                </p>
                <p className='text-sm text-[#43160c]'>Wil je het rapport ontvangen of heb je vragen over bestedingen? Laat het ons weten via het contactformulier – we delen graag alle cijfers.</p>
            </div>
        )
    },
    {
        title: 'Jaarverslag 2024',
        description: 'Een overzicht van alle activiteiten, samenwerkingen en impact in de wijk. Download het verslag en lees wat we samen bereikten.',
        actionLabel: 'Vraag rapport op',
        content: (
            <div className='space-y-4 text-base text-[#43160c]/90'>
                <p>
                    In het jaarverslag 2024 beschrijven we per kwartaal welke projecten zijn uitgevoerd, hoeveel bewoners meededen en welke lessen we meenemen naar 2025. Van buurtbudget tot jongerenactiviteiten: alles staat erin.
                </p>
                <p>
                    Vraag het verslag op via het contactformulier of stuur ons een e-mail. Je ontvangt dan een digitale PDF met financiële overzichten, partnerbijdragen en plannen voor het komende jaar.
                </p>
            </div>
        )
    }
];

const HighlightsShowcase = () => {
    const [activeHighlight, setActiveHighlight] = useState<(typeof highlights)[number] | null>(null);

    return (
        <>
            <div className='mt-8 grid gap-4 md:grid-cols-3'>
                {highlights.map((item) => (
                    <div
                        key={item.title}
                        className='flex h-full flex-col rounded-2xl border border-white/20 p-5 shadow-sm shadow-black/10'
                        style={{ backgroundColor: 'rgba(13, 94, 52, 0.65)' }}>
                        <h3 className='text-xl font-semibold text-white'>{item.title}</h3>
                        <p className='mt-2 text-sm text-white/85'>{item.description}</p>
                        <button
                            type='button'
                            onClick={() => setActiveHighlight(item)}
                            className='mt-4 inline-flex w-fit rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0d5e34] transition hover:-translate-y-0.5'>
                            {item.actionLabel}
                        </button>
                    </div>
                ))}
            </div>

            {activeHighlight && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8'>
                    <div className='relative w-full max-w-3xl rounded-3xl bg-white p-8 text-[#43160c] shadow-2xl'>
                        <button
                            type='button'
                            onClick={() => setActiveHighlight(null)}
                            className='absolute right-4 top-4 rounded-full border border-[#d06129]/30 bg-white/80 px-3 text-lg text-[#d06129] backdrop-blur hover:bg-[#d06129]/10'>
                            <span className='sr-only'>Sluit</span>
                            ×
                        </button>
                        <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[#d06129]'>Initiatief</p>
                        <h3 className='mt-2 text-3xl font-black text-[#43160c]'>{activeHighlight.title}</h3>
                        <div className='mt-4 space-y-4'>{activeHighlight.content}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HighlightsShowcase;
