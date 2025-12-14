import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Text, Button, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateRequired } from '../validators';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';
import { TaskDetailsParams } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { TaskService } from '../services/taskService';
import i18n from '../i18n';
import { useThemeMode } from '../context/ThemeContext';
import { spacing, colors, elevation, borderRadius } from '../theme';

export const TaskDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { createTask, updateTask, deleteTask, refreshTasks } = useTasks(user?.id || '');

  const { taskId } = (route.params as TaskDetailsParams) || {};

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(!taskId);
  const { theme } = useThemeMode();

  const validate = useCallback((values: { title: string; description: string }) => {
    const errors: Record<string, string> = {};
    const titleError = validateRequired(values.title, 'title');
    if (titleError) errors.title = titleError;
    const descriptionError = validateRequired(values.description, 'description');
    if (descriptionError) errors.description = descriptionError;
    return errors;
  }, []);

  const { values, errors, touched, handleChange, handleBlur, validateForm, setValues } =
    useFormValidation({ title: '', description: '' }, validate);

  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        setLoading(true);
        const loadedTask = await TaskService.getTaskById(taskId);
        if (loadedTask) {
          setTask(loadedTask);
          setValues({ title: loadedTask.title, description: loadedTask.description });
        }
        setLoading(false);
      } else {
        setIsEditing(true);
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId, setValues]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    if (taskId) {
      await updateTask(taskId, {
        title: values.title,
        description: values.description,
      });
    } else {
      await createTask({
        title: values.title,
        description: values.description,
        completed: false,
      });
    }
    await refreshTasks();
    navigation.goBack();
  }, [taskId, values, validateForm, updateTask, createTask, refreshTasks, navigation]);

  const handleDelete = useCallback(async () => {
    if (taskId) {
      await deleteTask(taskId);
      await refreshTasks();
      navigation.goBack();
    }
  }, [taskId, deleteTask, refreshTasks, navigation]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.text }]}>
            {taskId ? i18n.t('tasks.editTask') : i18n.t('tasks.addTask')}
          </Text>

          <TextInput
            label={i18n.t('tasks.taskTitle')}
            value={values.title}
            onChangeText={text => handleChange('title', text)}
            onBlur={() => handleBlur('title')}
            error={!!(touched.title && errors.title)}
            editable={isEditing}
            accessibilityLabel={i18n.t('tasks.taskTitle')}
            style={styles.input}
          />
          {touched.title && errors.title && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.title}</Text>
          )}

          <TextInput
            label={i18n.t('tasks.taskDescription')}
            value={values.description}
            onChangeText={text => handleChange('description', text)}
            onBlur={() => handleBlur('description')}
            error={!!(touched.description && errors.description)}
            multiline
            numberOfLines={4}
            editable={isEditing}
            accessibilityLabel={i18n.t('tasks.taskDescription')}
            style={styles.input}
          />
          {touched.description && errors.description && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.description}
            </Text>
          )}

          {task && !isEditing && (
            <View
              style={[
                styles.taskInfo,
                { backgroundColor: theme.colors.surfaceVariant || theme.colors.surface },
              ]}
            >
              <Text variant="bodyMedium" style={{ color: theme.colors.text }}>
                {i18n.t('tasks.completed')}:{' '}
                {task.completed ? i18n.t('tasks.completed') : i18n.t('tasks.incomplete')}
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.dateText, { color: theme.colors.onSurface }]}
              >
                Created: {new Date(task.createdAt).toLocaleString()}
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.dateText, { color: theme.colors.onSurface }]}
              >
                Updated: {new Date(task.updatedAt).toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            {isEditing ? (
              <View>
                <Button mode="contained" onPress={handleSave} style={styles.button}>
                  {i18n.t('tasks.save')}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    if (taskId) {
                      setIsEditing(false);
                    } else {
                      navigation.goBack();
                    }
                  }}
                  style={styles.button}
                >
                  {i18n.t('tasks.cancel')}
                </Button>
              </View>
            ) : (
              <Button mode="contained" onPress={() => setIsEditing(true)} style={styles.button}>
                {i18n.t('tasks.editTask')}
              </Button>
            )}

            {taskId && (
              <Button
                mode="contained"
                buttonColor={colors.error}
                onPress={handleDelete}
                style={styles.button}
              >
                {i18n.t('tasks.delete')}
              </Button>
            )}
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.lg,
  },
  button: {
    marginTop: spacing.sm,
  },
  container: {
    flex: 1,
  },
  dateText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginLeft: 12,
  },
  input: {
    marginBottom: spacing.sm,
  },
  scrollContent: {
    padding: spacing.md,
  },
  surface: {
    borderRadius: borderRadius.md,
    elevation: elevation.medium,
    padding: spacing.lg,
  },
  taskInfo: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.lg,
  },
});
