import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';
import { spacing, colors, typography } from '../theme';
import i18n from '../i18n';

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
            title={i18n.t('common.reload')}
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
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body2,
    marginBottom: spacing.md,
  },
});

