import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useErrorLogger } from '../context/ErrorContext';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';
import { useThemeMode } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { spacing, colors, elevation, borderRadius } from '../theme';
import { ErrorScreenParams } from '../types/error';

export const ErrorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { logError } = useErrorLogger();
  const { user } = useAuth();
  const { theme } = useThemeMode();

  const { error, statusCode } = (route.params as ErrorScreenParams) || {};

  useEffect(() => {
    // Log errors with statusCode >= 400 (client and server errors)
    // Allow logging even when user is not authenticated
    if (error && statusCode >= 400) {
      logError(error, statusCode);
    }
  }, [error, statusCode, logError]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Tasks' as never);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Surface style={[styles.surface, {backgroundColor: theme.colors.surface}]}>
        <View style={{alignItems: 'flex-end'}}><ThemeToggleButton /></View>
        <Text variant="headlineMedium" style={[styles.title, {color: theme.colors.error}]}>
          {i18n.t('common.error')}
        </Text>
        <Text variant="bodyLarge" style={[styles.message, {color: theme.colors.text}]}>
          {error || 'An unexpected error occurred'}
        </Text>
        {statusCode && (
          <Text variant="bodyMedium" style={[styles.statusCode, {color: theme.colors.text}]}>
            Status Code: {statusCode}
          </Text>
        )}
        <Button
          mode="contained"
          onPress={handleGoBack}
          style={styles.button}
          accessibilityLabel="Go back"
        >
          {i18n.t('common.ok')}
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  surface: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    elevation: elevation.medium,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.error,
  },
  message: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  statusCode: {
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  button: {
    marginTop: spacing.md,
  },
});

