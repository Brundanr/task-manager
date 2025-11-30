import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useThemeMode } from '../src/context/ThemeContext';

// Paper Theme Wrapper for Storybook
const PaperThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useThemeMode();
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};

// Main decorator that wraps all stories with necessary providers
export const withProviders = (Story: any) => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperThemeWrapper>
          <Story />
        </PaperThemeWrapper>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

