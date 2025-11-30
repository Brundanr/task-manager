import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, Card, Button, Divider } from 'react-native-paper';
import { useFeatureFlags } from '../context/FeatureFlagsContext';
import { FeatureFlagKey, UserRole } from '../types';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import i18n from '../i18n';

export const FeatureFlagsManager: React.FC = () => {
  const { flags, setFlag, resetToDefaults, refreshFromRemote, loading } = useFeatureFlags();
  const { theme } = useThemeMode();
  const { user } = useAuth();

  // Only allow admin users to manage feature flags
  if (user?.role !== UserRole.ADMIN) {
    return (
      <Card>
        <Card.Content>
          <Text variant="bodyMedium" style={{ color: theme.colors.error, textAlign: 'center' }}>
            {i18n.t('featureFlags.accessDenied')}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const featureLabels: Record<FeatureFlagKey, string> = {
    theme: i18n.t('featureFlags.labels.theme'),
    language: i18n.t('featureFlags.labels.language'),
    search: i18n.t('featureFlags.labels.search'),
    sort: i18n.t('featureFlags.labels.sort'),
    filter: i18n.t('featureFlags.labels.filter'),
  };

  const handleToggle = async (key: FeatureFlagKey, value: boolean) => {
    await setFlag(key, value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.text }]}>
            {i18n.t('featureFlags.title')}
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurface }]}>
            {i18n.t('featureFlags.subtitle')}
          </Text>
          <Divider style={styles.divider} />

          {Object.entries(flags).map(([key, value]) => {
            const flagKey = key as FeatureFlagKey;
            return (
              <View key={key} style={styles.flagRow}>
                <View style={styles.flagInfo}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.text }}>
                    {featureLabels[flagKey]}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                    {value ? i18n.t('featureFlags.enabled') : i18n.t('featureFlags.disabled')}
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={(newValue) => handleToggle(flagKey, newValue)}
                  disabled={loading}
                />
              </View>
            );
          })}

          <Divider style={styles.divider} />

          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={resetToDefaults}
              disabled={loading}
              style={styles.button}
            >
              {i18n.t('featureFlags.resetToDefaults')}
            </Button>
            <Button
              mode="contained"
              onPress={refreshFromRemote}
              disabled={loading}
              style={styles.button}
            >
              {i18n.t('featureFlags.refreshFromRemote')}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  flagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  flagInfo: {
    flex: 1,
    marginRight: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

