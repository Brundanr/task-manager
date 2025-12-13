import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../i18n';
import { spacing } from '../theme';

export const SignOutScreen = () => {
  const { signOut, user } = useAuth();
  const { tasks, refreshTasks } = useTasks(user?.id || '');

  useFocusEffect(
      useCallback(() => {
        refreshTasks();
      }, [refreshTasks])
    );

  const getTaskCounts = (tasks: Task[]): { completed: number; incomplete: number } => {
    const completed = tasks.filter(task => task.completed).length;
    const incomplete = tasks.length - completed;
    return { completed, incomplete };
  };

  return (
    <View>
      <Text style={styles.text}>Hello {user?.name}</Text>
      <Text style={styles.text}>Total Tasks Count: {tasks.length}</Text>
      <Text style={styles.text}>Completed Count: {getTaskCounts(tasks).completed}</Text>
      <Text style={styles.text}>Incompleted Count: {getTaskCounts(tasks).incomplete}</Text>
      <View style={styles.button}>
        <Button
            title={i18n.t('auth.signOut')}
            onPress={signOut}
            accessibilityLabel={i18n.t('auth.signOut')}
            accessibilityHint="Sign out to your account"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    margin: spacing.md,
  },
  button: {
    padding: spacing.md,
  },
});
