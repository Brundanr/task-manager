import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card as PaperCard, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { ErrorService } from '../services/errorService';
import { ErrorLog } from '../types';
import { spacing, colors, elevation } from '../theme';
import i18n from '../i18n';
import { useThemeMode } from '../context/ThemeContext';

export const ErrorLogsScreen: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeMode();

  const loadErrors = useCallback(async () => {
    setLoading(true);
    try {
      const errorLogs = await ErrorService.getAllErrors();
      setErrors(errorLogs? errorLogs.reverse(): []); // Show newest first
    } catch (error) {
      console.error('Error loading error logs:', error);
      setErrors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadErrors();
    }, [loadErrors])
  );

  const renderError = useCallback(
    ({ item }: { item: ErrorLog }) => (
      <PaperCard style={styles.card}>
        <PaperCard.Content>
          <View style={styles.errorHeader}>
            <Text variant="titleMedium" style={[styles.errorMessage, { color: theme.colors.text }]}>
              {item.message}
            </Text>
            <Chip
              style={{
                ...styles.statusChip,
                ...(item.statusCode >= 500 ? { backgroundColor: theme.colors.errorContainer || theme.colors.error + '20' } : {}),
              }}
            >
              {item.statusCode}
            </Chip>
          </View>
          <Text variant="bodySmall" style={[styles.errorDetails, { color: theme.colors.onSurface }]}>
            {i18n.t('errors.userId')}: {item.userId}
          </Text>
          <Text variant="bodySmall" style={[styles.errorDetails, { color: theme.colors.onSurface }]}>
            {i18n.t('errors.timestamp')}: {new Date(item.timestamp).toLocaleString()}
          </Text>
          {item.stack && (
            <Text variant="bodySmall" style={[styles.stackTrace, { color: theme.colors.onSurface }]}>
              {item.stack.substring(0, 200)}...
            </Text>
          )}
        </PaperCard.Content>
      </PaperCard>
    ),
    [theme]
  );

  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={{color: theme.colors.text}}>{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {errors.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="bodyLarge" style={{color: theme.colors.text}}>{i18n.t('errors.noErrors')}</Text>
        </View>
      ) : (
        <FlatList
          data={errors}
          renderItem={renderError}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          accessibilityLabel="Error logs list"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  list: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
    elevation: elevation.low,
  },
  errorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  errorMessage: {
    flex: 1,
    marginRight: spacing.sm,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  errorDetails: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  stackTrace: {
    marginTop: spacing.sm,
    fontFamily: 'monospace',
    fontSize: 10,
    color: colors.textTertiary,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});