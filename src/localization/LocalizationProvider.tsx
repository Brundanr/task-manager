import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Localization from 'expo-localization';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalizationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (scope: string, options?: any) => string;
}

const LocalizationContext = createContext<LocalizationContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (scope: string) => scope,
});

const LOCALE_KEY = 'app_locale';

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState(i18n.locale);

  // Persist locale in AsyncStorage
  const setLocale = useCallback(async (newLocale: string) => {
    setLocaleState(newLocale);
    i18n.setLocale(newLocale);
    await AsyncStorage.setItem(LOCALE_KEY, newLocale);
  }, []);

  // Load persisted locale on mount
  useEffect(() => {
    (async () => {
      const storedLocale = await AsyncStorage.getItem(LOCALE_KEY);
      if (storedLocale) {
        setLocaleState(storedLocale);
        i18n.setLocale(storedLocale);
      } else {
        const deviceLocale = (Localization as any).locale || 'en';
        setLocaleState(deviceLocale);
        i18n.setLocale(deviceLocale);
      }
    })();
  }, []);

  useEffect(() => {
    i18n.setLocale(locale);
  }, [locale]);

  const value = {
    locale,
    setLocale,
    t: (key: string, options?: any) => i18n.t(key, options),
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
