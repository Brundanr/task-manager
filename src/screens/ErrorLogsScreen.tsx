import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card as PaperCard, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { ErrorService } from '../services/errorService';
import { useAdminGuard } from '../navigation/guards';
import { ErrorLog } from '../types';
import i18n from '../i18n';
import { useThemeMode } from '../context/ThemeContext';
import { Button } from '../components/Button';

export const ErrorLogsScreen: React.FC = () => {
  useAdminGuard(); // Protect this route for admin only
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeMode();

  const loadErrors = useCallback(async () => {
    setLoading(true);
    try {
      const errorLogs = await ErrorService.getAllErrors();
      setErrors(errorLogs ? errorLogs.reverse() : []); // Show newest first
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
                ...(item.statusCode >= 500
                  ? { backgroundColor: theme.colors.errorContainer || theme.colors.error + '20' }
                  : {}),
              }}
            >
              {item.statusCode}
            </Chip>
          </View>
          <Text
            variant="bodySmall"
            style={[styles.errorDetails, { color: theme.colors.onSurface }]}
          >
            {i18n.t('errors.userId')}: {item.userId}
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.errorDetails, { color: theme.colors.onSurface }]}
          >
            {i18n.t('errors.timestamp')}: {new Date(item.timestamp).toLocaleString()}
          </Text>
          {item.stack && (
            <Text
              variant="bodySmall"
              style={[styles.stackTrace, { color: theme.colors.onSurface }]}
            >
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        {errors.length > 0 && (
          <Button
            title={i18n.t('errors.clearErrors')}
            variant="outlined"
            onPress={async () => {
              await ErrorService.clearErrors();
              setErrors([]);
            }}
            accessibilityLabel={i18n.t('errors.clearErrors')}
          />
        )}
      </View>

      {errors.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="bodyLarge" style={{ color: theme.colors.text }}>
            {i18n.t('errors.noErrors')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={errors}
          renderItem={renderError}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          accessibilityLabel="Error logs list"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorDetails: {
    marginTop: 4,
  },
  errorHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  errorMessage: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    padding: 16,
  },
  stackTrace: {
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
});
