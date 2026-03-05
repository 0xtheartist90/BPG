import type { Locale } from '@/lib/i18n';
import type { AgendaEvent } from '@/types/agenda';
import type { HighlightContentBlock } from '@/types/content';

export type Pillar = {
    title: string;
    description: string;
};

export type StatBlock = {
    label: string;
    value: string;
    detail: string;
};

export type Insight = {
    title: string;
    description: string;
};

export type ContactFields = {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    subjectOptions: {
        budget: string;
        info: string;
        facilitair: string;
    };
    messageLabel: string;
    messagePlaceholder: string;
};

export type ContactChannel = {
    type: 'instagram' | 'whatsapp';
    title: string;
    description: string;
    href: string;
};

export type HighlightDictionaryItem = {
    title: string;
    description: string;
    actionLabel: string;
    content: HighlightContentBlock[];
};

export type AnnualReportSections = {
    bestuurTitle: string;
    bestuurText: string;
    locationTitle: string;
    locationText: string;
    activitiesTitle: string;
    activitiesText: string;
    promotionTitle: string;
    promotionText: string;
    neighborhoodBudgetTitle: string;
    neighborhoodBudgetText: string;
    eventsTitle: string;
    eventsText: string;
    projectsTitle: string;
    projectsText: string;
    maintenanceTitle: string;
    maintenanceText: string;
    improvementsTitle: string;
    improvementsText: string;
    stakeholdersTitle: string;
    stakeholdersText: string;
    coalitionsTitle: string;
    coalitionsText: string;
    conclusionTitle: string;
    conclusionText: string;
};

export type TranslationSchema = {
    meta: {
        title: string;
        description: string;
    };
    media: {
        logoAlt: string;
        heroLogoAlt: string;
        missionImageAlt: string;
        mapAlt: string;
        marqueeAlt: string;
    };
    nav: {
        missie: string;
        overGein: string;
        initiatieven: string;
        nieuws: string;
        agenda: string;
        contact: string;
        doeMee: string;
        latestNews: string;
        languages: Record<Locale, string>;
    };
    hero: {
        titleLine1: string;
        titleLine2: string;
        primaryCta: string;
        secondaryCta: string;
    };
    mission: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        heroFooter: string;
        pillars: Pillar[];
    };
    marquee: {
        ariaLabel: string;
    };
    overGein: {
        eyebrow: string;
        title: string;
        subtitle: string;
        stats: StatBlock[];
        neighborhoodsTitle: string;
        neighborhoodsList: string[];
        ageTitle: string;
        ageDescription: string;
        outlookTitle: string;
        outlookPoints: Insight[];
        neighborhoodStatsTitle: string;
        statsLabels: {
            residents: string;
            homes: string;
            rental: string;
        };
    };
    initiatives: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
    };
    highlights: {
        items: HighlightDictionaryItem[];
    };
    news: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
    };
    newsControls: {
        previous: string;
        next: string;
        articleCount: string;
        otherArticles: string;
        closeLabel: string;
    };
    agenda: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        ctaLabel: string;
        events: AgendaEvent[];
        viewToggle: {
            cards: string;
            calendar: string;
        };
        moreInfo: string;
        calendar: {
            weekDays: [string, string, string, string, string, string, string];
            monthDays: [string, string, string, string, string, string, string];
            previousWeek: string;
            nextWeek: string;
            noEvents: string;
            previousMonth: string;
            nextMonth: string;
        };
    };
    contact: {
        eyebrow: string;
        title: string;
        subtitle: string;
        formEyebrow: string;
        formTitle: string;
        formDescription: string;
        fields: ContactFields;
        formButton: string;
        newsletterEyebrow: string;
        newsletterTitle: string;
        newsletterDescription: string;
        newsletterPlaceholder: string;
        newsletterButton: string;
        channelsEyebrow: string;
        addressEyebrow: string;
        addressTitle: string;
        addressLine: string;
        addressNote: string;
        addressMapTitle: string;
        channels: ContactChannel[];
    };
    footer: {
        orgName: string;
        tagline: string;
        highlight: string;
        legal: {
            foundation: string;
            registration: string;
            status: string;
        };
        credit: {
            prefix: string;
            linkLabel: string;
        };
    };
    ui: {
        modalEyebrow: string;
        closeLabel: string;
        eventModal: {
            addToCalendar: string;
            openLink: string;
        };
    };
    annualReport2025: {
        title: string;
        sections: AnnualReportSections;
    };
};
