import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../i18n';
import { useThemeMode } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

export const SignOutScreen = () => {
  const { signOut, user } = useAuth();
  const { tasks, refreshTasks } = useTasks(user?.id || '');
  const { theme } = useThemeMode();

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
    <View style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={{alignItems: 'flex-end', margin: 8}}><ThemeToggleButton /></View>
      <Text style={[styles.text, {color: theme.colors.text}]}>Hello {user?.name}</Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>Total Tasks Count: {tasks.length}</Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>Completed Count: {getTaskCounts(tasks).completed}</Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>Incompleted Count: {getTaskCounts(tasks).incomplete}</Text>
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
    margin: 16,
  },
  button: {
    padding: 16
  },
});
