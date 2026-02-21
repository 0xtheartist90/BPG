export type NewsItem = {
    slug: string;
    title: string;
    excerpt: string;
    content: string[];
    tag?: string;
    date?: string;
    image: string;
};

export const newsItems: NewsItem[] = [
    {
        slug: 'levensloopbestendig-wooncomplex-gein',
        title: 'Levensloopbestendig wooncomplex in Gein?',
        excerpt: 'Meedenken over nieuw woonaanbod dat past bij elke levensfase van bewoners.',
        date: '12 januari 2026',
        image: '/images/Infinite%20loop/bpgloop1.png',
        content: [
            'Samen met bewoners en partners onderzoeken we hoe een levensloopbestendig wooncomplex er in Gein uit kan zien. Van gezamenlijke voorzieningen tot aangepaste woningen – we halen wensen op en toetsen plannen aan de realiteit van de wijk.',
            'We organiseren ontwerpsessies, lopen mee met ouderenwerk en testen wat er nodig is om prettig samen te wonen. Denk aan zorg aan huis, gedeelde tuinen en ontmoetingsruimtes waar buren elkaar makkelijk treffen.',
            'Jouw ervaringen en ideeën zijn onmisbaar. Via de nieuwsbrief en bijeenkomsten delen we concepten en concrete vervolgstappen.'
        ]
    },
    {
        slug: 'geen-hoogspanningsstation-gein',
        title: 'Reageer: geen hoogspanningsstation naast Gein',
        excerpt: 'Bewoners bundelden signalen richting gemeente om de Gaasperzoom groen en leefbaar te houden.',
        date: '6 december 2025',
        image: '/images/Infinite%20loop/bpgloop2.png',
        content: [
            'Er liggen plannen voor een nieuw hoogspanningsstation in de Gaasperzoom. Bewoners maken zich zorgen over gezondheid, geluid en het effect op het groen rondom Gein.',
            'Buurtplatform Gein verzamelt reacties, spreekt met de gemeente en zorgt dat argumenten van bewoners goed landen. We helpen bij het indienen van zienswijzen en organiseren spreekuren voor vragen.',
            'Samen houden we de druk op de ketel zodat besluiten aansluiten bij wat er in de buurt leeft.'
        ]
    },
    {
        slug: 'maak-gein-levensloopbestendig',
        title: 'Maak Gein levensloopbestendig',
        excerpt: 'We bouwen aan een wijk waar je comfortabel kunt wonen, ongeacht leeftijd of gezinssamenstelling.',
        date: '29 november 2025',
        image: '/images/Infinite%20loop/bpgloop3.png',
        content: [
            'Hoe zorgen we dat iedereen in Gein prettig oud kan worden? Met bewoners, zorgpartners en scholen werken we aan een routekaart voor een toekomstbestendige wijk.',
            'We experimenteren met buurthubs, digitale ondersteuning en ontmoetingen tussen jong en oud. De Ster fungeert als testplek voor nieuwe diensten.',
            'Halfjaarlijks delen we resultaten en vragen we hulp om pilots op te schalen. Zo blijft Gein een buurt waar iedereen meetelt.'
        ]
    },
    {
        slug: 'activiteitenkalender-gein-bewoners',
        title: 'Activiteitenkalender voor bewoners',
        excerpt: 'Van burendagen tot sport en cultuur – dit staat er op stapel in Gein.',
        date: '13 oktober 2025',
        image: '/images/Infinite%20loop/bpgloop4.png',
        content: [
            'Van wijkdiners tot repair cafés: Gein bruist van de initiatieven. Met scholen, kerken en sportverenigingen bundelen we alle data in één kalender.',
            'De kalender hangt in Buurthub De Ster, staat online en wordt gedeeld via WhatsApp. Zo mis je geen oproep of kans om mee te doen.',
            'Organiseer je iets nieuws? Meld het en we helpen met promotie en praktische tips.'
        ]
    },
    {
        slug: 'terugblik-buurtfeest-gein3dorp',
        title: 'Terugblik buurtfeest Gein3Dorp',
        excerpt: 'Burendag 2025 stond in het teken van ontmoeting, muziek en verhalen van Jan Schaefer.',
        date: '1 oktober 2025',
        image: '/images/Infinite%20loop/bpgloop5.png',
        content: [
            'Het veld bij de Cornelis Aarnoutsstraat veranderde in een festivalterrein met muziek, spelletjes en verhalen van oud-bewoners. Jong en oud vierden samen 40 jaar Gein3Dorp en 750 jaar Amsterdam.',
            'Vrijwilligers van het Buurtplatform en partners zorgden voor workshops, kinderactiviteiten en een gezamenlijke maaltijd. Zo ontstond een dag vol herkenning en nieuwe ontmoetingen.',
            'De evaluatie leert dat bewoners graag vaker zulke buurtfeesten zien – met ruimte voor lokale makers en initiatieven. We zoeken daarom nieuwe organisatoren en sponsoren.'
        ]
    },
    {
        slug: 'programma-viering-750-jaar-amsterdam',
        title: 'Programma 750 jaar Amsterdam & 40 jaar Gein3Dorp',
        excerpt: 'Dit was het dagprogramma voor zaterdag 27 september 2025 in Gein.',
        date: '17 september 2025',
        image: '/images/Infinite%20loop/bpgloop6.png',
        content: [
            'Op 27 september 2025 vierden we dat Amsterdam 750 jaar bestaat en Gein3Dorp 40 jaar. Het programma liep van ochtendwandelingen en verhalen tot een avond vol live muziek.',
            'Het feest vond plaats op het veld bij de Cornelis Aarnoutsstraat. Bewoners verzorgden kraampjes, kinderen konden terecht bij creatieve activiteiten en de buurtbakkers trakteerden op lekkers.',
            'Wil jij volgend jaar mee programmeren of een eigen onderdeel hosten? Meld je bij het Buurtplatform zodat we samen een nóg mooier jubileum organiseren.'
        ]
    },
    {
        slug: 'heel-gein-bakt',
        title: 'Bak mee met HEEL GEIN BAKT',
        excerpt: 'Buurtbakkers streden om de lekkerste taart tijdens het jubileumweekend.',
        date: '17 september 2025',
        image: '/images/Infinite%20loop/bpgloop7.png',
        content: [
            'Tijdens Burendag 2025 organiseerden we HEEL GEIN BAKT: bewoners brachten hun favoriete taart mee en deelden recepten met de jury. Van Surinaamse pom tot vegan citroencake – alles kwam voorbij.',
            'Het doel van de bakwedstrijd was simpel: elkaar ontmoeten en verhalen delen. Tussen het proeven door werd gesproken over nieuwe activiteiten voor kinderen en ouderen.',
            'Wil jij volgend jaar meebakken of jurylid worden? Laat het weten, dan nemen we je mee in de voorbereidingen en ontvang je het draaiboek.'
        ]
    },
    {
        slug: 'vier-40-jaar-gein',
        title: 'Vier als bewoners 40 jaar Gein',
        excerpt: 'Waarom we samen feestvierden op 27 september en hoe jij volgend jaar meehelpt.',
        date: '17 september 2025',
        image: '/images/Infinite%20loop/bpgloop8.png',
        content: [
            'Gein bestaat in 2025 veertig jaar en dat wilden we vieren met iedereen die hier woont of heeft gewoond. Bewoners stelden een feestcommissie samen en maakten een programma voor alle leeftijden.',
            'Naast muziek en eten was er ruimte voor herinneringen: mensen brachten foto’s mee uit de beginjaren, vertelden over hun straat en de eerste jaren in de wijk.',
            'We zoeken nog verhalen, foto’s en vrijwilligers om de historie van Gein te bewaren. Mail je bijdrage naar info@buurtplatformgein.nl en doe mee.'
        ]
    },
    {
        slug: 'zaterdag-bij-de-jumbo',
        title: 'Zaterdag bij de Jumbo',
        excerpt: 'Burennetwerk en Buurtplatform stonden bij de supermarkt met een sjoelbak en vrijwilligersoproep.',
        date: '18 juli 2025',
        image: '/images/Infinite%20loop/bpgloop1.png',
        content: [
            'Tijdens de zomeractie stonden we bij de Jumbo om in gesprek te gaan met bewoners. Met een sjoelbak trokken we aandacht en vertelden we over Burennetwerk en het Buurtplatform.',
            'Vrijwilligers vertelden hoe zij zich inzetten voor maatjesprojecten, buurtfeesten en hulpvragen. Zo hoorden voorbijgangers direct wat er in de wijk speelt.',
            'Wil je vrijwilliger worden? Kom langs bij Buurthub De Ster of stuur ons een bericht, dan koppelen we je aan een passende taak.'
        ]
    },
    {
        slug: 'herdenking-4-mei-gein3',
        title: 'Herdenking 4 mei in Gein3',
        excerpt: 'Guido de Bruin vertelde het verhaal achter de straatnamen en verzetshelden.',
        date: '17 mei 2025',
        image: '/images/Infinite%20loop/bpgloop2.png',
        content: [
            'Tijdens de 4 mei-herdenking in Gein3 vertelde Guido de Bruin hoe de straatnamen verwijzen naar verzetshelden van Het Parool, Trouw, De Waarheid en Vrij Nederland.',
            'Bewoners stonden stil bij de geschiedenis van de wijk en bij de rol van verzetsmensen die hun leven gaven voor vrijheid. Kinderen lazen gedichten voor en legden bloemen bij het monument.',
            'We blijven verhalen verzamelen zodat de betekenis van Gein3Dorp zichtbaar blijft. Heb je familieverhalen? Deel ze met het Buurtplatform.'
        ]
    },
    {
        slug: 'gein1-schoonste-kant',
        title: 'Gein 1 liet zich van haar schoonste kant zien',
        excerpt: 'Bewoners trokken eropuit tijdens de Landelijke Opschoondag.',
        date: '2 april 2025',
        image: '/images/Infinite%20loop/bpgloop3.png',
        content: [
            'Op 22 maart gingen bewoners uit Gein 1 gewapend met grijpers en vuilniszakken de straat op. De oproepposter in de portieken zorgde voor een mooie opkomst.',
            'Samen maakten ze plantsoenen schoon, haalden zwerfafval weg en gingen in gesprek over wat er nog beter kan in de buurt.',
            'De actie smaakt naar meer: we plannen nieuwe opschoonmomenten en betrekken scholen en sportclubs om mee te doen.'
        ]
    },
    {
        slug: 'oproep-gein3dorp-verhalen',
        title: 'Oproep: wat deed jij vroeger in Gein3Dorp?',
        excerpt: 'Voor de viering van 40 jaar Gein zoeken we verhalen uit de beginjaren.',
        date: '10 maart 2025',
        image: '/images/Infinite%20loop/bpgloop4.png',
        content: [
            'Amsterdam bestaat 750 jaar en Gein 40 jaar. Daarom verzamelen we verhalen en foto’s uit de beginjaren van Gein3Dorp. Wat herinner jij je van de eerste jaren?',
            'In de Gein3Dorper plaatsen we interviews en foto’s. We zoeken bewoners van toen én nu om nieuwe rubrieken te vullen.',
            'Stuur je herinnering of tip naar het Buurtplatform, dan nemen we contact op voor een gesprek of opname.'
        ]
    },
    {
        slug: 'buurtplatform-gein-zoekt-versterking',
        title: 'Buurtplatform Gein zoekt versterking',
        excerpt: 'We zijn op zoek naar een penningmeester en vrijwilligers met organisatietalent.',
        date: '10 maart 2025',
        image: '/images/Infinite%20loop/bpgloop5.png',
        content: [
            'Het Buurtplatform groeit en daarom zoeken we versterking in het bestuur en bij werkgroepen. Vooral een penningmeester en mensen die events willen organiseren zijn welkom.',
            'We werken aan buurtprojecten, subsidieaanvragen en bewonersinitiatieven. Met jouw talent maken we meer impact en houden we de buurt in beweging.',
            'Interesse? Mail ons of loop binnen bij Buurthub De Ster voor een kennismaking.'
        ]
    },
    {
        slug: 'gein-is-40-jaar',
        title: 'Gein is 40 jaar',
        excerpt: 'Een moment om terug te kijken en plannen te maken voor de komende decennia.',
        date: '17 januari 2025',
        image: '/images/Infinite%20loop/bpgloop6.png',
        content: [
            'In 2025 vieren we dat Gein veertig jaar bestaat. Een aanleiding om de pioniers te eren en nieuwe bewoners te betrekken bij buurtprojecten.',
            'We maken een tijdlijn van gebeurtenissen, verzamelen foto’s en verhalen en zoeken naar manieren om de wijk toekomstbestendig te houden.',
            'Doe mee door je herinneringen te delen of aan te sluiten bij werkgroepen die feesten, tentoonstellingen en podcasts voorbereiden.'
        ]
    },
    {
        slug: 'windmolens-gemeenteraad',
        title: 'Windmolens in de gemeenteraad',
        excerpt: 'Op 11 december 2024 sprak de raad over locaties voor windturbines – bewoners lieten hun stem horen.',
        date: '10 december 2024',
        image: '/images/Infinite%20loop/bpgloop7.png',
        content: [
            'De gemeenteraad debatteerde over windturbines in Zuidoost en mogelijk in de Gaasperzoom. Bewoners en actiegroepen wilden duidelijk maken dat groen en gezondheid voorop moeten staan.',
            'We deelden zorgen, alternatieven en pleitten voor betere participatie. Ook riepen we op tot onafhankelijke onderzoeken naar geluid en slagschaduw.',
            'Na de vergadering blijven we signalen verzamelen en bereiden we vervolgacties voor om de leefbaarheid te bewaken.'
        ]
    },
    {
        slug: 'gemeente-aansprakelijk-windturbines',
        title: 'Gemeente aansprakelijk gesteld voor windturbineplannen',
        excerpt: 'Bewoners verenigden zich om schade te voorkomen en juridische duidelijkheid te krijgen.',
        date: '26 september 2024',
        image: '/images/Infinite%20loop/bpgloop8.png',
        content: [
            'Vereniging Spaar het Gein, Gein3dorp, Stichting Stop Windturbines Geingebied en bewoners hebben de gemeente aansprakelijk gesteld voor eventuele schade van de plannen.',
            'Ze vragen om transparantie, betere participatie en bescherming van natuur en gezondheid in het gebied. Het Buurtplatform ondersteunt deze oproep.',
            'We volgen de juridische stappen en houden bewoners op de hoogte via nieuwsbrief en bijeenkomsten.'
        ]
    },
    {
        slug: 'buurtbudget-toegekend-2024',
        title: 'Buurtbudget 2024 toegekend',
        excerpt: 'Gein kreeg opnieuw budget om bewonersideeën uit te voeren.',
        date: '3 september 2024',
        image: '/images/Infinite%20loop/bpgloop1.png',
        content: [
            'In juli kregen we te horen dat Gein opnieuw buurtbudget ontvangt. Op 29 april verzamelden we ideeën met zo’n 40 bewoners: van vergroening tot jeugdactiviteiten.',
            'De komende periode werken we deze plannen uit en koppelen we initiatiefnemers aan coaches of partners.',
            'Heb jij nog een idee of wil je meehelpen bij uitvoering? Laat het weten via het contactformulier.'
        ]
    },
    {
        slug: 'gratis-tennis-gein',
        title: 'Gratis tennis in Gein',
        excerpt: 'Sinds april 2024 krijgen kinderen uit de wijk gratis tennisles.',
        date: '3 september 2024',
        image: '/images/Infinite%20loop/bpgloop2.png',
        content: [
            'Tennisleraar Billy Woods geeft lessen aan circa 30 kinderen tussen 5 en 15 jaar op de baan tussen Wamelplein en Veldhuizenstraat. Doel: sport toegankelijk maken voor iedereen.',
            'Met steun van buurtbudget en vrijwilligers lukt het om rackets, ballen en begeleiding te financieren.',
            'Ouders en kinderen zijn enthousiast – we zoeken sponsors om het project ook volgend jaar voort te zetten.'
        ]
    },
    {
        slug: 'grote-renovatie-gein1',
        title: 'Grote renovatie van woningen in Gein 1',
        excerpt: 'Corporaties starten met een meerjarige aanpak voor onderhoud en verduurzaming.',
        date: 'juli 2024',
        image: '/images/Infinite%20loop/bpgloop3.png',
        content: [
            'Bewoners van Gein 1 krijgen te maken met een grote renovatie. Denk aan nieuwe kozijnen, betere isolatie en aandacht voor vochtproblemen.',
            'Het Buurtplatform denkt mee over planning en communicatie zodat bewoners weten waar ze aan toe zijn.',
            'Heb je vragen of wil je ervaringen delen? Kom langs tijdens de spreekuren in Buurthub De Ster.'
        ]
    },
    {
        slug: 'zienswijze-windturbines-gein3dorp',
        title: 'Zienswijze windturbines namens Gein3Dorp',
        excerpt: 'De vereniging diende een officiële reactie in tegen plaatsing van turbines in het Geingebied.',
        date: 'juli 2024',
        image: '/images/Infinite%20loop/bpgloop4.png',
        content: [
            'Gein3Dorp lichtte in een zienswijze toe waarom turbines niet passen bij de open polders en woonbuurten. Argumenten gingen over veiligheid, gezondheid en cultuurhistorie.',
            'De vereniging werkte samen met andere bewonersgroepen om gegevens te verzamelen en alternatieven te schetsen.',
            'We blijven betrokken bij het proces en delen updates zodra de gemeente reageert.'
        ]
    },
    {
        slug: 'gein-telt-tot-vier',
        title: 'Gein telt tot 4 – zo zit het',
        excerpt: 'Uitleg over de grenzen van Gein1 tot en met Gein4.',
        date: '5 juli 2024',
        image: '/images/Infinite%20loop/bpgloop5.png',
        content: [
            'Gein bestaat uit vier delen, elk met een eigen karakter. Veel bewoners vragen zich af waar de grenzen precies lopen.',
            'In dit artikel laten we een kaart zien en beschrijven we herkenningspunten zoals pleinen, metrohaltes en groenstructuren.',
            'Handig voor nieuwe bewoners én voor iedereen die wil weten welke projecten in welk deel plaatsvinden.'
        ]
    },
    {
        slug: 'geinlijn-verhalen',
        title: 'Geinlijn: verhalen uit de wijk',
        excerpt: 'Een nostalgische terugblik op de telefoonlijn vol moppen en nieuws.',
        date: '5 juli 2024',
        image: '/images/Infinite%20loop/bpgloop6.png',
        content: [
            'Lang voordat de metro er was, bestond de “Geinlijn” als telefoonnummer waarop je dagelijks een mop van Max Tailleur kon horen.',
            'Bewoners vertelden hoe die lijn zorgde voor verbondenheid en humor in de wijk.',
            'Met dit artikel roepen we mensen op om nieuwe verhalen of geluidsopnames te delen, zodat we ze kunnen archiveren.'
        ]
    },
    {
        slug: 'evenement-organiseren',
        title: 'Een evenement organiseren? Meld je aan!',
        excerpt: 'Buurtplatform Gein helpt je bij vergunningen, promotie en tips.',
        date: '27 maart 2024',
        image: '/images/Infinite%20loop/bpgloop7.png',
        content: [
            'Wil jij iets organiseren voor je straat, vereniging of school? Via het Buurtplatform kun je sparren over locatie, financiën en communicatie.',
            'We koppelen je aan ervaringsdeskundigen en helpen bij het aanvragen van buurtbudget of andere subsidies.',
            'Meld je plan aan zodat we tijdig kunnen meedenken en je activiteit kunnen opnemen in de agenda.'
        ]
    },
    {
        slug: 'het-buurtplatform-zoekt-jou',
        title: 'Het Buurtplatform zoekt jou!',
        excerpt: 'We zoeken bestuursleden en aanpakkers met ideeën voor Gein.',
        date: '15 maart 2024',
        image: '/images/Infinite%20loop/bpgloop8.png',
        content: [
            'Wil je meedenken over buurtinitiatieven, communicatie of evenementen? Dan ben je welkom als bestuurslid of vrijwilliger.',
            'We groeien snel en kunnen hulp gebruiken bij administratie, communicatie en het begeleiden van bewonersplannen.',
            'Reageer via de site of loop binnen bij Buurthub De Ster – we vertellen je graag meer.'
        ]
    }
];
