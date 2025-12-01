import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Class component cannot use hooks directly; we inject themed styles via props.
interface ThemedProps extends Props {
  themeColors: {
    background: string;
    error: string;
    text: string;
  };
}

class ErrorBoundaryInner extends Component<ThemedProps, State> {
  constructor(props: ThemedProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { background, error, text } = this.props.themeColors;
      return (
        <View style={[styles.container, { backgroundColor: background }]}>
          <Text style={[styles.title, { color: error }]}>Something went wrong</Text>
          <Text style={[styles.message, { color: text }]}>{this.state.error?.message}</Text>
          <Button
            title="Reload App"
            onPress={() => {
              this.setState({ hasError: false, error: null });
            }}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const { theme } = useThemeMode();
  return (
    <ErrorBoundaryInner
      themeColors={{
        background: theme.colors.background,
        error: theme.colors.error,
        text: theme.colors.text,
      }}
    >
      {children}
    </ErrorBoundaryInner>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
