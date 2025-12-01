import React from 'react';
import { LocalizationProvider } from '../src/localization/LocalizationProvider';
import { ThemeProvider } from '../src/context/ThemeContext';
import { LoadingScreen } from '../src/components/LoadingScreen';

export default {
  title: 'Screens/LoadingScreen',
  component: LoadingScreen,
};

export const Default = () => (
  <ThemeProvider>
    <LocalizationProvider>
      <LoadingScreen />
    </LocalizationProvider>
  </ThemeProvider>
);
