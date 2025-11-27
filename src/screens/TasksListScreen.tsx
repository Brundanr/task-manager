import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Chip, Menu, Button, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '../components/Card';
import i18n from '../i18n';

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

  const renderTask = useCallback(
    ({ item }: { item: Task }) => (
      <Card
        onPress={() => handleTaskPress(item)}
        accessibilityLabel={`${item.title}, ${item.completed ? 'completed' : 'incomplete'}`}
        accessibilityHint="Double tap to view task details"
      >
        <View style={styles.taskHeader}>
          <Text variant="titleMedium" style={styles.taskTitle}>
            {item.title}
          </Text>
          <Chip
            selected={item.completed}
            onPress={() => handleToggleComplete(item.id)}
            accessibilityLabel={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {item.completed ? i18n.t('tasks.completed') : i18n.t('tasks.incomplete')}
          </Chip>
        </View>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.taskDescription}>
          {item.description}
        </Text>
        <Text variant="bodySmall" style={styles.taskDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </Card>
    ),
    [handleTaskPress, handleToggleComplete]
  );

  const renderPagination = useMemo(() => {
    if (!paginatedData || paginatedData.totalPages <= 1) return null;

    return (
      <View style={styles.pagination}>
        <View style={styles.paginationButton}>
          <Button
            mode="outlined"
            onPress={() => changePage(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
          >
            &lt;
          </Button>
        </View>
        <Text style={styles.pageText}>
          {i18n.t('tasks.page')} {pagination.page} {i18n.t('tasks.of')} {paginatedData.totalPages}
        </Text>
        <View style={styles.paginationButton}>
          <Button
            mode="outlined"
            onPress={() => changePage(Math.min(paginatedData.totalPages, pagination.page + 1))}
            disabled={pagination.page === paginatedData.totalPages}
          >
            &gt;
          </Button>
        </View>
      </View>
    );
  }, [paginatedData, pagination, changePage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    updateFilters({ search: query });
  }, [updateFilters]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={i18n.t('tasks.search')}
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        accessibilityLabel={i18n.t('tasks.search')}
      />
      <View style={styles.filters}>
        <View style={styles.filterChip}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Chip onPress={() => setSortMenuVisible(true)}>
                {i18n.t('tasks.sort')}
              </Chip>
            }
          >
          <Menu.Item
            onPress={() => {
              updateFilters({ sortField: 'title', sortOrder: 'asc' });
              setSortMenuVisible(false);
            }}
            title="Title A-Z"
          />
          <Menu.Item
            onPress={() => {
              updateFilters({ sortField: 'title', sortOrder: 'desc' });
              setSortMenuVisible(false);
            }}
            title="Title Z-A"
          />
          <Menu.Item
            onPress={() => {
              updateFilters({ sortField: 'createdAt', sortOrder: 'desc' });
              setSortMenuVisible(false);
            }}
            title="Newest First"
          />
          <Menu.Item
            onPress={() => {
              updateFilters({ sortField: 'createdAt', sortOrder: 'asc' });
              setSortMenuVisible(false);
            }}
            title="Oldest First"
          />
          </Menu>
        </View>
        <View style={styles.filterChip}>
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <Chip onPress={() => setFilterMenuVisible(true)}>
                {i18n.t('tasks.filter')}
              </Chip>
            }
          >
          <Menu.Item
            onPress={() => {
              updateFilters({ completed: null });
              setFilterMenuVisible(false);
            }}
            title={i18n.t('tasks.all')}
          />
          <Menu.Item
            onPress={() => {
              updateFilters({ completed: true });
              setFilterMenuVisible(false);
            }}
            title={i18n.t('tasks.completed')}
          />
          <Menu.Item
            onPress={() => {
              updateFilters({ completed: false });
              setFilterMenuVisible(false);
            }}
            title={i18n.t('tasks.incomplete')}
          />
          </Menu>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>{i18n.t('common.loading')}</Text>
      ) : filteredTasks.length === 0 ? (
        <Text style={styles.empty}>{i18n.t('tasks.noTasks')}</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          accessibilityLabel="Tasks list"
        />
      )}

      {renderPagination}

      <FAB
        style={styles.fab}
        onPress={handleAddTask}
        icon="plus"
        accessibilityLabel={i18n.t('tasks.addTask')}
        accessibilityHint="Add a new task"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  filters: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
  },
  list: {
    paddingBottom: 80,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    marginRight: 8,
  },
  taskDescription: {
    marginBottom: 8,
    color: '#666',
  },
  taskDate: {
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loading: {
    textAlign: 'center',
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  pageText: {
    marginHorizontal: 16,
  },
  paginationButton: {
    marginHorizontal: 8,
  },
});