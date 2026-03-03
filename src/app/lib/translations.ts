import type { Locale } from './i18n';

export type Dictionary = {
    common: {
        hello: string;
    };
};

const nl: Dictionary = {
    common: {
        hello: 'Hallo'
    }
};

const en: Dictionary = {
    common: {
        hello: 'Hello'
    }
};

const ar: Dictionary = {
    common: {
        hello: 'مرحبا'
    }
};

export const dictionaries: Record<Locale, Dictionary> = {
    nl,
    en,
    ar
};
