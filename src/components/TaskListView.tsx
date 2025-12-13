import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Chip, Menu, Searchbar } from 'react-native-paper';
import { Task, PaginationParams, PaginatedResponse, FilterState } from '../types';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { spacing, colors } from '../theme';

interface TaskListViewProps {
  tasks: Task[];
  loading: boolean;
  pagination: PaginationParams;
  paginatedData: PaginatedResponse<Task> | null;
  searchQuery: string;
  sortMenuVisible: boolean;
  filterMenuVisible: boolean;
  onTaskPress: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onAddTask: () => void;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onUpdateFilters: (filters: Partial<FilterState>) => void;
  onSortMenuToggle: (visible: boolean) => void;
  onFilterMenuToggle: (visible: boolean) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  loading,
  pagination,
  paginatedData,
  searchQuery,
  sortMenuVisible,
  filterMenuVisible,
  onTaskPress,
  onToggleComplete,
  onAddTask,
  onSearch,
  onPageChange,
  onUpdateFilters,
  onSortMenuToggle,
  onFilterMenuToggle,
}) => {
  const renderTask = useCallback(
    ({ item }: { item: Task }) => (
      <Card
        onPress={() => onTaskPress(item)}
        accessibilityLabel={`${item.title}, ${item.completed ? 'completed' : 'incomplete'}`}
        accessibilityHint="Double tap to view task details"
      >
        <View style={styles.taskHeader}>
          <Text variant="titleMedium" style={styles.taskTitle}>
            {item.title}
          </Text>
          <Chip
            selected={item.completed}
            onPress={() => onToggleComplete(item.id)}
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
    [onTaskPress, onToggleComplete]
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={'Search tasks...'}
        onChangeText={onSearch}
        value={searchQuery}
        style={styles.searchbar}
        accessibilityLabel={'Search tasks...'}
      />
      <View style={styles.filters}>
        <View style={styles.filterChip}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => onSortMenuToggle(false)}
            anchor={
              <Chip onPress={() => onSortMenuToggle(true)}>
                {'Sort'}
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ sortField: 'title', sortOrder: 'asc' });
                onSortMenuToggle(false);
              }}
              title="Title A-Z"
            />
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ sortField: 'title', sortOrder: 'desc' });
                onSortMenuToggle(false);
              }}
              title="Title Z-A"
            />
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ sortField: 'createdAt', sortOrder: 'desc' });
                onSortMenuToggle(false);
              }}
              title="Newest First"
            />
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ sortField: 'createdAt', sortOrder: 'asc' });
                onSortMenuToggle(false);
              }}
              title="Oldest First"
            />
          </Menu>
        </View>
        <View style={styles.filterChip}>
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => onFilterMenuToggle(false)}
            anchor={
              <Chip onPress={() => onFilterMenuToggle(true)}>
                {'Filter'}
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ completed: null });
                onFilterMenuToggle(false);
              }}
              title={'All'}
            />
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ completed: true });
                onFilterMenuToggle(false);
              }}
              title={'Completed'}
            />
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ completed: false });
                onFilterMenuToggle(false);
              }}
              title={'Incomplete'}
            />
          </Menu>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>{'Loading...'}</Text>
      ) : tasks.length === 0 ? (
        <Text style={styles.empty}>{'No tasks found'}</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          accessibilityLabel="Tasks list"
        />
      )}

      <Pagination
        pagination={pagination}
        paginatedData={paginatedData}
        onPageChange={onPageChange}
      />

      <FAB
        style={styles.fab}
        onPress={onAddTask}
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
  filterChip: {
    marginRight: spacing.sm,
  },
});

