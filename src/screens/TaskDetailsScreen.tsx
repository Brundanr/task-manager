import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export const TaskDetailsScreen: React.FC = () => {
 return (
    <View style={styles.container}>
      <Text>Tasks Details Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  surface: {
    padding: 24,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#b00020',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  taskInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dateText: {
    marginTop: 8,
    color: '#666',
  },
  actions: {
    marginTop: 24,
  },
  button: {
    marginTop: 8,
  },
});

