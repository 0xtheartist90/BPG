import { dictionaries } from './translations';
import type { Locale } from './i18n';

export function getDictionary(locale: Locale) {
    return dictionaries[locale] ?? dictionaries.nl;
}
