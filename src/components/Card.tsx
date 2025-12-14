import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { spacing, elevation } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}) => {
  // Merge styles properly
  const cardStyle = style ? { ...styles.card, ...style } : styles.card;

  return (
    <PaperCard
      style={cardStyle}
      onPress={onPress}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      testID={accessibilityLabel ? accessibilityLabel : undefined}
    >
      <PaperCard.Content style={styles.content}>{children}</PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    elevation: elevation.low,
  },
  content: {
    padding: spacing.md,
  },
});