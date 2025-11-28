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

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
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
      const { theme } = useThemeMode();
      return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
          <Text style={[styles.title, {color: theme.colors.error}]}>Something went wrong</Text>
          <Text style={[styles.message, {color: theme.colors.text}]}>{this.state.error?.message}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});

