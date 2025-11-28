import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

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
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
});