import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput, Text, Button, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFormValidation, validateRequired } from '../hooks/useFormValidation';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { TaskService } from '../services/taskService';
import i18n from '../i18n';
import { typography } from '../theme';
import { useThemeMode } from '../context/ThemeContext';

export const TaskDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { createTask, updateTask, deleteTask, refreshTasks } = useTasks(user?.id || '');
  interface TaskDetailsParams {
    taskId?: string;
  }
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
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={{color: theme.colors.text}}>{i18n.t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={[styles.surface, {backgroundColor: theme.colors.surface}]}>
          <Text variant="headlineSmall" style={[styles.title, {color: theme.colors.text}]}>
            {taskId ? i18n.t('tasks.editTask') : i18n.t('tasks.addTask')}
          </Text>

          <TextInput
            label={i18n.t('tasks.taskTitle')}
            value={values.title}
            onChangeText={(text) => handleChange('title', text)}
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
            onChangeText={(text) => handleChange('description', text)}
            onBlur={() => handleBlur('description')}
            error={!!(touched.description && errors.description)}
            multiline
            numberOfLines={4}
            editable={isEditing}
            accessibilityLabel={i18n.t('tasks.taskDescription')}
            style={styles.input}
          />
          {touched.description && errors.description && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.description}</Text>
          )}

          {task && !isEditing && (
            <View style={[styles.taskInfo, { backgroundColor: theme.colors.surfaceVariant || theme.colors.surface }]}>
              <Text variant="bodyMedium" style={{ color: theme.colors.text }}>
                {i18n.t('tasks.completed')}: {task.completed ? i18n.t('tasks.completed') : i18n.t('tasks.incomplete')}
              </Text>
              <Text variant="bodySmall" style={[styles.dateText, { color: theme.colors.onSurface }]}>
                Created: {new Date(task.createdAt).toLocaleString()}
              </Text>
              <Text variant="bodySmall" style={[styles.dateText, { color: theme.colors.onSurface }]}>
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
                buttonColor="#b00020"
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
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  taskInfo: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  dateText: {
    marginTop: 8,
  },
  actions: {
    marginTop: 24,
  },
  button: {
    marginTop: 8,
  },
});