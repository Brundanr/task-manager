import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useTasks } from '../hooks/useTasks';
import { TaskService } from '../services/taskService';
import { StorageService } from '../utills/storage';
import { Task, FilterState } from '../types';
import { StorageItemsEnum } from '../constants/StorageItemsEnum';

jest.mock('../services/taskService');
jest.mock('../utills/storage');

describe('useTasks', () => {
    const userId = 'user1';
    const mockTasks: Task[] = [
        {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            completed: false,
            createdAt: '2025-12-13',
            updatedAt: '2025-12-13',
            userId,
        },
        {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            completed: true,
            createdAt: '2025-12-13',
            updatedAt: '2025-12-13',
            userId,
        },
    ];

    const mockPaginatedData = {
        data: mockTasks,
        total: 2,
        page: 1,
        limit: 5,
        totalPages: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (TaskService.getTasks as jest.Mock).mockResolvedValue(mockTasks);
        (TaskService.getPaginatedTasks as jest.Mock).mockResolvedValue(mockPaginatedData);
        (StorageService.getItem as jest.Mock).mockResolvedValue(null);
        (StorageService.setItem as jest.Mock).mockResolvedValue(undefined);
    });

    describe('initialization', () => {
        it('should initialize with default values', async () => {
            const { result } = renderHook(() => useTasks(userId));

            expect(result.current.tasks).toEqual([]);
            expect(result.current.loading).toBe(true);
            expect(result.current.pagination).toEqual({ page: 1, limit: 5 });
            expect(result.current.filters).toEqual({
                search: '',
                completed: null,
                sortField: 'createdAt',
                sortOrder: 'desc',
            });

            // Wait for initial load to complete
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });

        it('should load filters from storage on mount', async () => {
            const savedFilters: FilterState = {
                search: 'test',
                completed: true,
                sortField: 'title',
                sortOrder: 'asc',
            };
            (StorageService.getItem as jest.Mock).mockResolvedValue(savedFilters);

            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(StorageService.getItem).toHaveBeenCalledWith(StorageItemsEnum.TASK_FILTERS);
            });

            await waitFor(() => {
                expect(result.current.filters).toEqual(savedFilters);
            });
        });
    });

    describe('loadTasks', () => {
        it('should load tasks and paginated data', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(TaskService.getTasks).toHaveBeenCalledWith(userId);
            expect(TaskService.getPaginatedTasks).toHaveBeenCalled();
            expect(result.current.tasks).toEqual(mockTasks);
            expect(result.current.paginatedData).toEqual(mockPaginatedData);
        });

        it('should set loading to false after loading completes', async () => {
            const { result } = renderHook(() => useTasks(userId));

            expect(result.current.loading).toBe(true);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });

        it('should handle errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            (TaskService.getTasks as jest.Mock).mockRejectedValue(new Error('Failed'));

            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('createTask', () => {
        it('should create a task and refresh tasks', async () => {
            const newTask = {
                title: 'New Task',
                description: 'New Description',
                completed: false,
            };
            const createdTask: Task = {
                ...newTask,
                id: '3',
                createdAt: '2025-12-13',
                updatedAt: '2025-12-13',
                userId,
            };
            (TaskService.createTask as jest.Mock).mockResolvedValue(createdTask);

            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            let created: Task;
            await act(async () => {
                created = await result.current.createTask(newTask);
            });

            expect(TaskService.createTask).toHaveBeenCalledWith({
                ...newTask,
                userId,
            });
            expect(created!).toEqual(createdTask);
            expect(TaskService.getTasks).toHaveBeenCalledTimes(2); // Initial load + refresh
        });
    });

    describe('updateTask', () => {
        it('should update a task and refresh tasks', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await act(async () => {
                await result.current.updateTask('1', { title: 'Updated Title' });
            });

            expect(TaskService.updateTask).toHaveBeenCalledWith('1', { title: 'Updated Title' });
            expect(TaskService.getTasks).toHaveBeenCalledTimes(2);
        });
    });

    describe('deleteTask', () => {
        it('should delete a task and refresh tasks', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await act(async () => {
                await result.current.deleteTask('1');
            });

            expect(TaskService.deleteTask).toHaveBeenCalledWith('1');
            expect(TaskService.getTasks).toHaveBeenCalledTimes(2);
        });
    });

    describe('toggleTaskCompletion', () => {
        it('should toggle task completion and refresh tasks', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await act(async () => {
                await result.current.toggleTaskCompletion('1');
            });

            expect(TaskService.toggleTaskCompletion).toHaveBeenCalledWith('1');
            expect(TaskService.getTasks).toHaveBeenCalledTimes(2);
        });
    });

    describe('updateFilters', () => {
        it('should update filters and reset pagination to page 1', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.changePage(3);
            });

            await waitFor(() => {
                expect(result.current.pagination.page).toBe(3);
            });

            act(() => {
                result.current.updateFilters({ search: 'test' });
            });

            await waitFor(() => {
                expect(result.current.filters.search).toBe('test');
                expect(result.current.pagination.page).toBe(1);
            });
        });

        it('should save filters to storage', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.updateFilters({ completed: true });
            });

            await waitFor(() => {
                expect(StorageService.setItem).toHaveBeenCalledWith(
                    StorageItemsEnum.TASK_FILTERS,
                    expect.objectContaining({ completed: true })
                );
            });
        });
    });

    describe('changePage', () => {
        it('should update pagination page', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            act(() => {
                result.current.changePage(2);
            });

            await waitFor(() => {
                expect(result.current.pagination.page).toBe(2);
            });
        });
    });

    describe('filteredTasks', () => {
        it('should return paginated data', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.filteredTasks).toEqual(mockTasks);
        });

        it('should return empty array if no paginated data', async () => {
            const { result } = renderHook(() => useTasks(userId));

            // Before data loads
            expect(result.current.filteredTasks).toEqual([]);

            // Wait for async operations to complete
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });
    });

    describe('refreshTasks', () => {
        it('should reload tasks when refreshTasks is called', async () => {
            const { result } = renderHook(() => useTasks(userId));

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            const initialCallCount = (TaskService.getTasks as jest.Mock).mock.calls.length;

            await act(async () => {
                await result.current.refreshTasks();
            });

            expect(TaskService.getTasks).toHaveBeenCalledTimes(initialCallCount + 1);
        });
    });
});

