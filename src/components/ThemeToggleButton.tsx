import React from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { useThemeMode } from '../context/ThemeContext';
import { useFeatureFlags } from '../context/FeatureFlagsContext';
import { Text, View } from 'react-native';

export const ThemeToggleButton: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();
  const { isEnabled } = useFeatureFlags();
  const theme = useTheme() as any;
  
  // Hide button if theme feature is disabled
  if (!isEnabled('theme')) {
    return null;
  }
  
  return (
    <View style={{flexDirection: 'column'}}>
      <Text style={{color: theme.colors.text}}>{mode === 'dark' ? 'Dark' : 'Light'}</Text>
      <IconButton
        icon={mode === 'dark' ? 'weather-sunny' : 'moon-waning-crescent'}
        size={24}
        onPress={toggleTheme}
        accessibilityLabel={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      />
    </View>
  );
};
