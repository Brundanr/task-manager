import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing, colors } from '../theme';
import { useTheme } from 'react-native-paper';
import { useLocalization } from '../localization/LocalizationProvider';

export const LoadingScreen: React.FC = () => {
  const { t } = useLocalization();
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.text}>{t('common.loading')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  text: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});