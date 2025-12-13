import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskListView } from '../components/TaskListView';

type TasksListNavigationProp = NativeStackNavigationProp<{
  TaskDetails: { taskId: string | null };
}>;

export const TasksListScreen: React.FC<{ navigation: TasksListNavigationProp }> = ({ navigation }) => {
  const { user } = useAuth();
  const {
    filteredTasks,
    loading,
    pagination,
    paginatedData,
    filters,
    updateFilters,
    changePage,
    toggleTaskCompletion,
    refreshTasks,
  } = useTasks(user?.id || '');

  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search);

  useFocusEffect(
    useCallback(() => {
      refreshTasks();
    }, [refreshTasks])
  );

  const handleTaskPress = useCallback(
    (task: Task) => {
      navigation.push('TaskDetails', { taskId: task.id });
    },
    [navigation]
  );

  const handleAddTask = useCallback(() => {
    navigation.push('TaskDetails', { taskId: null });
  }, [navigation]);

  const handleToggleComplete = useCallback(
    async (taskId: string) => {
      await toggleTaskCompletion(taskId);
    },
    [toggleTaskCompletion]
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query });
  }, [updateFilters]);

  return (
    <TaskListView
      tasks={filteredTasks}
      loading={loading}
      pagination={pagination}
      paginatedData={paginatedData}
      searchQuery={searchQuery}
      sortMenuVisible={sortMenuVisible}
      filterMenuVisible={filterMenuVisible}
      onTaskPress={handleTaskPress}
      onToggleComplete={handleToggleComplete}
      onAddTask={handleAddTask}
      onSearch={handleSearch}
      onPageChange={changePage}
      onUpdateFilters={updateFilters}
      onSortMenuToggle={setSortMenuVisible}
      onFilterMenuToggle={setFilterMenuVisible}
    />
  );
};