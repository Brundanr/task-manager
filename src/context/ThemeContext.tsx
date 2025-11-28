import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { lightTheme, darkTheme } from '../theme';
import { StorageService } from '../utills/storage';

export type ThemeMode = 'light' | 'dark';
const STORAGE_KEY = 'theme_mode';

interface ThemeContextProps {
  mode: ThemeMode;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  theme: lightTheme,
  toggleTheme: () => {},
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    (async () => {
      const saved = await StorageService.getItem<ThemeMode>(STORAGE_KEY);
      if (saved && (saved === 'light' || saved === 'dark')) setModeState(saved);
    })();
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    StorageService.setItem(STORAGE_KEY, newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, theme, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
