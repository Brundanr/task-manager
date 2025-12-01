import React from 'react';
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { ThemeToggleButton } from '../src/components/ThemeToggleButton';
import { ThemeProvider } from '../src/context/ThemeContext';
import { FeatureFlagsProvider } from '../src/context/FeatureFlagsContext';
import { lightTheme } from '../src/theme';

export default {
  title: 'Components/ThemeToggleButton',
  component: ThemeToggleButton,
};

const Decorator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FeatureFlagsProvider>
    <ThemeProvider>
      <PaperProvider theme={lightTheme}>
        <View style={{ padding: 16 }}>{children}</View>
      </PaperProvider>
    </ThemeProvider>
  </FeatureFlagsProvider>
);

export const Default = () => (
  <Decorator>
    <ThemeToggleButton />
  </Decorator>
);
