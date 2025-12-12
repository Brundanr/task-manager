import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Chip, Menu, Button, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '../components/Card';
import { spacing, colors } from '../theme';

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
            {item.completed ? 'Compleated' : 'Incomplete'}
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
          {'Page'} {pagination.page} {'of'} {paginatedData.totalPages}
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
        placeholder={'Search tasks...'}
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
        accessibilityLabel={'Search tasks...'}
      />
      <View style={styles.filters}>
        <View style={styles.filterChip}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Chip onPress={() => setSortMenuVisible(true)}>
                {'Sort'}
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
                {'Filter'}
              </Chip>
            }
          >
          <Menu.Item
            onPress={() => {
              updateFilters({ completed: null });
              setFilterMenuVisible(false);
            }}
            title={'All'}
          />
          <Menu.Item
            onPress={() => {
              updateFilters({ completed: true });
              setFilterMenuVisible(false);
            }}
            title={'Completed'}
          />
          <Menu.Item
            onPress={() => {
              updateFilters({ completed: false });
              setFilterMenuVisible(false);
            }}
            title={'Incomplete'}
          />
          </Menu>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>{'Loading...'}</Text>
      ) : filteredTasks.length === 0 ? (
        <Text style={styles.empty}>{'No tasks found'}</Text>
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
        accessibilityLabel={'Add Task'}
        accessibilityHint="Add a new task"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  searchbar: {
    margin: spacing.md,
    marginBottom: spacing.sm,
  },
  filters: {
    flexDirection: 'row',
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  list: {
    paddingBottom: 80,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  taskDescription: {
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  taskDate: {
    color: colors.textTertiary,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
  loading: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  filterChip: {
    marginRight: spacing.sm,
  },
  pageText: {
    marginHorizontal: spacing.md,
  },
  paginationButton: {
    marginHorizontal: spacing.sm,
  },
});