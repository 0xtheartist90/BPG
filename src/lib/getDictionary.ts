import type { Locale } from './i18n';
import { dictionaries } from './translations';

export function getDictionary(locale: Locale) {
    return dictionaries[locale] ?? dictionaries.nl;
}

export type { Dictionary } from './translations';
