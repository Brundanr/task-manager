import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ErrorProvider } from './src/context/ErrorContext';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LocalizationProvider } from './src/localization/LocalizationProvider';
import { ThemeProvider, useThemeMode } from './src/context/ThemeContext';
import { FeatureFlagsProvider } from './src/context/FeatureFlagsContext';

// Paper Theme Wrapper
const PaperThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useThemeMode();
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <FeatureFlagsProvider>
          <ThemeProvider>
            <PaperThemeWrapper>
              <LocalizationProvider>
                <AuthProvider>
                  <ErrorProvider>
                    <AppNavigator />
                    <StatusBar style="auto" />
                  </ErrorProvider>
                </AuthProvider>
              </LocalizationProvider>
            </PaperThemeWrapper>
          </ThemeProvider>
        </FeatureFlagsProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
