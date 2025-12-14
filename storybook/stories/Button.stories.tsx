import React from 'react';
import { View, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Button } from '../../src/components/Button';
import { withProviders } from '../decorators';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
});

export default {
  title: 'Components/Button',
  decorators: [withProviders],
};

export const Primary = () => (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <Button title="Primary Button" onPress={() => console.log('Pressed')} variant="primary" />
    </View>
  </View>
);

export const Secondary = () => (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <Button title="Secondary Button" onPress={() => console.log('Pressed')} variant="secondary" />
    </View>
  </View>
);

export const Outlined = () => (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <Button title="Outlined Button" onPress={() => console.log('Pressed')} variant="outlined" />
    </View>
  </View>
);

export const Disabled = () => (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <Button title="Disabled Button" onPress={() => console.log('Pressed')} variant="primary" disabled />
    </View>
  </View>
);

export const Loading = () => (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <Button title="Loading Button" onPress={() => console.log('Pressed')} variant="primary" loading />
    </View>
  </View>
);

