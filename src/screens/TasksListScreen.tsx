import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TasksListNavigationProp = NativeStackNavigationProp<{
  TaskDetails: { taskId: string | null };
}>;

export const TasksListScreen: React.FC<{ navigation: TasksListNavigationProp }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Tasks List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

