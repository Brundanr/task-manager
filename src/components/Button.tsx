import React from 'react';
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { typography } from '../theme';
import { spacing, borderRadius, colors } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Platform-specific Button component
 * Uses TouchableNativeFeedback on Android and TouchableOpacity on iOS/Web
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();

  // Build style object properly
  const buttonStyle: {
    backgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    opacity?: number;
  } = {
    ...styles.button,
  };

  if (variant === 'primary') {
    buttonStyle.backgroundColor = theme.colors.primary;
  } else if (variant === 'secondary') {
    buttonStyle.backgroundColor = theme.colors.secondary;
  } else if (variant === 'outlined') {
    buttonStyle.backgroundColor = 'transparent';
    buttonStyle.borderWidth = 1;
    buttonStyle.borderColor = theme.colors.primary;
  }

  if (disabled) {
    buttonStyle.opacity = 0.5;
  }

  // Build text style object
  const textStyle: {
    color?: string;
    fontSize?: number;
    fontWeight?: any;
    lineHeight?: number;
  } = {
    ...typography.body1,
    ...styles.text,
  };

  if (variant === 'outlined') {
    textStyle.color = theme.colors.primary;
  } else if (variant === 'primary' || variant === 'secondary') {
    textStyle.color = colors.white;
  }

  const buttonContent = (
    <View style={buttonStyle}>
      {loading ? (
        <ActivityIndicator
          testID="ActivityIndicator"
          color={variant === 'outlined' ? theme.colors.primary : colors.white}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        {buttonContent}
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={styles.container}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  container: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
