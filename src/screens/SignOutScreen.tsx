import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { useTasks } from '../hooks/useTasks';
import { Task, UserRole } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../i18n';
import { useThemeMode } from '../context/ThemeContext';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { FeatureFlagsManager } from '../components/FeatureFlagsManager';

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

  const dynamicStyles = getDynamicStyles(theme);

  return (
    <ScrollView style={[styles.scrollView, dynamicStyles.scrollView]}>
      <View style={[styles.themeToggleContainer, dynamicStyles.themeToggleContainer]}>
        <ThemeToggleButton />
      </View>

      <View style={[styles.statsContainer, dynamicStyles.statsContainer]}>
        <Text style={[styles.greetingText, dynamicStyles.greetingText]}>
          {i18n.t('greeting.hello', { name: user?.name || '' }) || `Hello ${user?.name}`}
        </Text>
        <View style={[styles.divider, dynamicStyles.divider]} />
        <Text style={[styles.text, dynamicStyles.text]}>
          {i18n.t('tasks.totalCount', { count: String(tasks.length) }) || `Total Tasks: ${tasks.length}`}
        </Text>
        <Text style={[styles.text, dynamicStyles.completedText]}>
          {i18n.t('tasks.completedCount', { count: String(getTaskCounts(tasks).completed) }) || `Completed: ${getTaskCounts(tasks).completed}`}
        </Text>
        <Text style={[styles.text, dynamicStyles.incompleteText]}>
          {i18n.t('tasks.incompleteCount', { count: String(getTaskCounts(tasks).incomplete) }) || `Incomplete: ${getTaskCounts(tasks).incomplete}`}
        </Text>
      </View>
      
      {/* Feature Flags Manager - Admin Only */}
      {user?.role === UserRole.ADMIN && (
        <View style={styles.section}>
          <FeatureFlagsManager />
        </View>
      )}
      
      <View style={styles.button}>
        <Button
            title={i18n.t('auth.signOut')}
            onPress={signOut}
            accessibilityLabel={i18n.t('auth.signOut')}
            accessibilityHint="Sign out to your account"
        />
      </View>
    </ScrollView>
  );
};

const getDynamicStyles = (theme: any) => ({
  scrollView: {
    backgroundColor: theme.colors.background,
  },
  themeToggleContainer: {
    backgroundColor: theme.colors.elevation?.level1 || theme.colors.surface,
  },
  statsContainer: {
    backgroundColor: theme.colors.elevation?.level2 || theme.colors.surfaceVariant,
    shadowColor: theme.colors.shadow,
  },
  greetingText: {
    color: theme.colors.primary,
  },
  divider: {
    backgroundColor: theme.colors.outlineVariant || theme.colors.outline,
  },
  text: {
    color: theme.colors.text,
  },
  completedText: {
    color: theme.colors.secondary,
  },
  incompleteText: {
    color: theme.colors.error,
  },
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  themeToggleContainer: {
    alignItems: 'flex-end',
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16,
  },
  statsContainer: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 20,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  greetingText: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  text: {
    fontSize: 18,
    margin: 16,
  },
  completedText: {
    fontSize: 18,
    margin: 16,
  },
  incompleteText: {
    fontSize: 18,
    margin: 16,
  },
  button: {
    padding: 16,
  },
  section: {
    marginVertical: 16,
  },
});
