import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, PaginationParams, PaginatedResponse, FilterState } from '../types';
import { StorageService } from '../utills/storage';
import { TaskService } from '../services/taskService';
import { FeatureFlagsService } from '../services/featureFlagsService';

const FILTER_STORAGE_KEY = 'task_filters';

export const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 5 });
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    completed: null,
    sortField: 'createdAt',
    sortOrder: 'desc',
  });
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Task> | null>(null);

  // Load filters from storage
  useEffect(() => {
    const loadFilters = async () => {
      const savedFilters = await StorageService.getItem<FilterState>(FILTER_STORAGE_KEY);
      if (savedFilters) {
        setFilters(savedFilters);
      }
    };
    loadFilters();
  }, []);

  // Save filters to storage when they change
  useEffect(() => {
    StorageService.setItem(FILTER_STORAGE_KEY, filters);
  }, [filters]);

  // Load tasks
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const allTasks = await TaskService.getTasks(userId);
      setTasks(allTasks);
      
      // Respect feature flags - disable features if flags are off
      const searchEnabled = FeatureFlagsService.isEnabled('search');
      const sortEnabled = FeatureFlagsService.isEnabled('sort');
      const filterEnabled = FeatureFlagsService.isEnabled('filter');
      
      const effectiveFilters = {
        ...filters,
        // Clear search if disabled
        search: searchEnabled ? filters.search : '',
        // Reset sort to default if disabled
        sortField: sortEnabled ? filters.sortField : 'createdAt',
        sortOrder: sortEnabled ? filters.sortOrder : 'desc',
        // Clear filter if disabled
        completed: filterEnabled ? filters.completed : null,
      };
      
      const paginated = await TaskService.getPaginatedTasks(userId, pagination, effectiveFilters);
      setPaginatedData(paginated);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, pagination, filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(
    async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
      const newTask = await TaskService.createTask({
        ...task,
        userId,
      });
      await loadTasks();
      return newTask;
    },
    [userId, loadTasks]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      await TaskService.updateTask(taskId, updates);
      await loadTasks();
    },
    [loadTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      await TaskService.deleteTask(taskId);
      await loadTasks();
    },
    [loadTasks]
  );

  const toggleTaskCompletion = useCallback(
    async (taskId: string) => {
      await TaskService.toggleTaskCompletion(taskId);
      await loadTasks();
    },
    [loadTasks]
  );

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination({ page: 1, limit: 5 }); // Reset to first page when filters change
  }, []);

  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  // Memoized filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return paginatedData?.data || [];
  }, [paginatedData]);

  return {
    tasks,
    filteredTasks,
    loading,
    pagination,
    paginatedData,
    filters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    updateFilters,
    changePage,
    refreshTasks: loadTasks,
  };
};

