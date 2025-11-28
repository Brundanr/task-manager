// Simple i18n implementation for React Native
import en from './locale/en.json';
import es from './locale/es.json';

type Translations = typeof en;

const translations: Record<string, Translations> = {
  en,
  es,
};

let currentLocale = 'en';

/**
 * Get nested value from object using dot notation
 */
const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current === undefined || current === null) return undefined;
    if (typeof current === 'object') {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

const i18n = {
  translations,
  defaultLocale: 'en',
  enableFallback: true,
  locale: currentLocale,
  t: (key: string, options?: Record<string, string>): string => {
    const locale = currentLocale || i18n.defaultLocale;
    const translation = translations[locale];
    
    const text = getNestedValue(translation, key);
    
    if (text !== undefined && text !== null) {
      // Simple variable substitution
      let textStr = String(text);
      if (options) {
        Object.keys(options).forEach((k) => {
          textStr = textStr.replace(new RegExp(`{{${k}}}`, 'g'), options[k]);
        });
      }
      return textStr;
    }
    
    // Fallback to default locale
    if (i18n.enableFallback && locale !== i18n.defaultLocale) {
      const fallbackTranslation = translations[i18n.defaultLocale];
      const fallbackText = getNestedValue(fallbackTranslation, key);
      if (fallbackText !== undefined && fallbackText !== null) {
        return String(fallbackText);
      }
    }
    
    return key;
  },
  setLocale: (locale: string) => {
    currentLocale = locale;
    i18n.locale = locale;
  },
};

export default i18n;

