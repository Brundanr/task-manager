import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TabIconProps {
  name: string;
  size: number;
  color: string;
}

// Icon mapping - using Unicode symbols that work everywhere
const iconMap: Record<string, string> = {
  'check-circle': '✓',
  'alert-circle': '⚠',
  'logout': '→',
};

export const TabIcon: React.FC<TabIconProps> = ({ name, size, color }) => {
  // Ensure size is a number and color is a string
  const iconSize = typeof size === 'number' ? size : 24;
  const iconColor = typeof color === 'string' ? color : '#000';
  
  // Build style object properly
  const textStyle = {
    ...styles.icon,
    fontSize: iconSize,
    color: iconColor,
  };
  
  // Use simple text-based icons that work on all platforms
  return (
    <View style={styles.container}>
      <Text style={textStyle}>
        {iconMap[name] || '•'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  icon: {
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
});

