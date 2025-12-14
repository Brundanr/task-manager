import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing, colors } from '../theme';
import { useLocalization } from '../localization/LocalizationProvider';
import { useThemeMode } from '../context/ThemeContext';

export const LoadingScreen: React.FC = () => {
  const { t } = useLocalization();
  const { theme } = useThemeMode();
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.text, {color: theme.colors.text}]}>{t('common.loading')}</Text>
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