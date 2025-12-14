import React from 'react';
import { View } from 'react-native';
import { TabIcon } from '../src/components/TabIcon';

export default {
  title: 'Components/TabIcon',
  component: TabIcon,
};

export const Check = () => (
  <View style={{ padding: 16 }}>
    <TabIcon name="check-circle" size={24} color="#4caf50" />
  </View>
);

export const Alert = () => (
  <View style={{ padding: 16 }}>
    <TabIcon name="alert-circle" size={24} color="#ff9800" />
  </View>
);

export const Logout = () => (
  <View style={{ padding: 16 }}>
    <TabIcon name="logout" size={24} color="#f44336" />
  </View>
);
