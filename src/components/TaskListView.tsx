import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Chip, Menu, Searchbar } from 'react-native-paper';
import { Task, PaginationParams, PaginatedResponse, FilterState } from '../types';
import { Card } from './Card';
import { Pagination } from './Pagination';
import { spacing, colors, typography } from '../theme';
import i18n from '../i18n';
import { useThemeMode } from '../context/ThemeContext';
import { ThemeToggleButton } from './ThemeToggleButton';

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
  const { theme } = useThemeMode();
  
  const renderTask = useCallback(
    ({ item }: { item: Task }) => (
      <Card
        onPress={() => onTaskPress(item)}
        accessibilityLabel={`${item.title}, ${item.completed ? 'completed' : 'incomplete'}`}
        accessibilityHint="Double tap to view task details"
      >
        <View style={styles.taskHeader}>
          <Text variant="titleMedium"  style={[styles.taskTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Chip
            selected={item.completed}
            onPress={() => onToggleComplete(item.id)}
            accessibilityLabel={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {item.completed ? i18n.t('tasks.completed') : i18n.t('tasks.incomplete')}
          </Chip>
        </View>
        <Text variant="bodyMedium" numberOfLines={2}  style={[styles.taskDescription, { color: theme.colors.onSurface }]}>
          {item.description}
        </Text>
        <Text variant="bodySmall" style={[styles.taskDate, { color: theme.colors.onSurface }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </Card>
    ),
    [onTaskPress, onToggleComplete, theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16 }}>
        {/* <Searchbar
          placeholder={i18n.t('tasks.search')}
          onChangeText={handleSearch}
          value={searchQuery}
          style={[styles.searchbar, { flex: 1 }]}
          accessibilityLabel={i18n.t('tasks.search')}
        /> */}
        <Searchbar
          placeholder={i18n.t('tasks.search')}
          onChangeText={onSearch}
          value={searchQuery}
          style={[styles.searchbar, { flex: 1 }]}
          accessibilityLabel={i18n.t('tasks.search')}
        />
        <ThemeToggleButton />
      </View>
      <View style={styles.filters}>
        <View style={styles.filterChip}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => onSortMenuToggle(false)}
            anchor={
              <Chip onPress={() => onSortMenuToggle(true)}>
                {i18n.t('tasks.sort')}
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
                {i18n.t('tasks.filter')}
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ completed: null });
                onFilterMenuToggle(false);
              }}
              title={i18n.t('tasks.all')}
            />
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ completed: true });
                onFilterMenuToggle(false);
              }}
              title={i18n.t('tasks.completed')}
            />
            <Menu.Item
              onPress={() => {
                onUpdateFilters({ completed: false });
                onFilterMenuToggle(false);
              }}
              title={i18n.t('tasks.incomplete')}
            />
          </Menu>
        </View>
      </View>

      <Text style={[typography.h1, { color: theme.colors.text, margin: 16 }]}>Task Manager</Text>

      {loading ? (
        <Text style={[styles.loading, { color: theme.colors.text }]}>{i18n.t('common.loading')}</Text>
      ) : tasks.length === 0 ? (
        <Text style={[styles.empty, { color: theme.colors.onSurface }]}>{i18n.t('tasks.noTasks')}</Text>
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
        accessibilityLabel={i18n.t('tasks.addTask')}
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

