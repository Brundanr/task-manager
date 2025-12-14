import React from 'react';
import { View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Button } from '../src/components/Button';
import { lightTheme } from '../src/theme';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => (
  <PaperProvider theme={lightTheme}>
    <View style={{ padding: 16 }}>
      <Button title="Primary button" variant="primary" onPress={() => {}} />
    </View>
  </PaperProvider>
);

export const Secondary = () => (
  <PaperProvider theme={lightTheme}>
    <View style={{ padding: 16 }}>
      <Button title="Secondary button" variant="secondary" onPress={() => {}} />
    </View>
  </PaperProvider>
);

export const Disabled = () => (
  <PaperProvider theme={lightTheme}>
    <View style={{ padding: 16 }}>
      <Button title="Disabled button" variant="primary" disabled onPress={() => {}} />
    </View>
  </PaperProvider>
);

export const Loading = () => (
  <PaperProvider theme={lightTheme}>
    <View style={{ padding: 16 }}>
      <Button title="Loading button" variant="primary" loading onPress={() => {}} />
    </View>
  </PaperProvider>
);
