import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Card } from '../../src/components/Card';
import { withProviders } from '../decorators';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default {
  title: 'Components/Card',
  decorators: [withProviders],
};

export const Basic = () => (
  <View style={styles.container}>
    <Card>
      <View style={styles.cardContent}>
        <Text style={styles.title}>Card Title</Text>
        <Text style={styles.description}>
          This is a basic card component with some content inside.
        </Text>
      </View>
    </Card>
  </View>
);

export const WithPressHandler = () => (
  <View style={styles.container}>
    <Card
      onPress={() => console.log('Card pressed')}
      accessibilityLabel="Pressable Card"
    >
      <View style={styles.cardContent}>
        <Text style={styles.title}>Pressable Card</Text>
        <Text style={styles.description}>
          Tap this card to trigger an action.
        </Text>
      </View>
    </Card>
  </View>
);

export const MultipleCards = () => (
  <View style={styles.container}>
    <Card>
      <View style={styles.cardContent}>
        <Text style={styles.title}>Card 1</Text>
        <Text style={styles.description}>First card content</Text>
      </View>
    </Card>
    <Card>
      <View style={styles.cardContent}>
        <Text style={styles.title}>Card 2</Text>
        <Text style={styles.description}>Second card content</Text>
      </View>
    </Card>
    <Card>
      <View style={styles.cardContent}>
        <Text style={styles.title}>Card 3</Text>
        <Text style={styles.description}>Third card content</Text>
      </View>
    </Card>
  </View>
);

