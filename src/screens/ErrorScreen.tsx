import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useErrorLogger } from '../context/ErrorContext';
import { useAuth } from '../context/AuthContext';
import { spacing, colors, elevation, borderRadius } from '../theme';
import { ErrorScreenParams } from '../types';

export const ErrorScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { logError } = useErrorLogger();
  const { user } = useAuth();

  const { error, statusCode } = (route.params as ErrorScreenParams) || {};

  useEffect(() => {
    if (error && statusCode >= 500 && user) {
      logError(error, statusCode);
    }
  }, [error, statusCode, user, logError]);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Tasks' as never);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          {'Error'}
        </Text>
        <Text variant="bodyLarge" style={styles.message}>
          {error || 'An unexpected error occurred'}
        </Text>
        {statusCode && (
          <Text variant="bodyMedium" style={styles.statusCode}>
            Status Code: {statusCode}
          </Text>
        )}
        <Button
          mode="contained"
          onPress={handleGoBack}
          style={styles.button}
          accessibilityLabel="Go back"
        >
          {'OK'}
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

