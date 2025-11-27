import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ErrorProvider } from './src/context/ErrorContext';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme } from './src/theme';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LocalizationProvider } from './src/localization/LocalizationProvider';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={lightTheme}>
          <LocalizationProvider>
            <AuthProvider>
              <ErrorProvider>
                <AppNavigator />
                <StatusBar style="auto" />
              </ErrorProvider>
            </AuthProvider>
          </LocalizationProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;