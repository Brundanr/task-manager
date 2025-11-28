import { TaskService } from '../services/taskService';
import { StorageService } from '../utills/storage';
import { Task } from '../types';

jest.mock('../utills/storage');

describe('TaskService', () => {
  const userId = 'user1';
  const tasksMock: Task[] = [
    { id: '1', title: 'Task 1', description: 'Desc', completed: false, createdAt: '2023-01-01', updatedAt: '2023-01-01', userId },
    { id: '2', title: 'Task 2', description: 'Desc', completed: true, createdAt: '2023-01-02', updatedAt: '2023-01-02', userId },
    { id: '3', title: 'Other', description: 'Other', completed: false, createdAt: '2023-01-05', updatedAt: '2023-01-05', userId: 'other' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (StorageService.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'tasks') return Promise.resolve([...tasksMock]);
      return Promise.resolve(null);
    });
    (StorageService.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('getTasks returns tasks for userId', async () => {
    const result = await TaskService.getTasks(userId);
    expect(result.length).toBe(2);
    expect(result[0].userId).toBe(userId);
  });

  it('getTaskById returns correct task', async () => {
    const task = await TaskService.getTaskById('1');
    expect(task).toBeDefined();
    expect(task?.id).toBe('1');
  });

  it('getPaginatedTasks applies filters and pagination', async () => {
    const filter = { search: 'Task', completed: null, sortField: 'createdAt', sortOrder: 'asc' };
    const result = await TaskService.getPaginatedTasks(userId, { page: 1, limit: 1 }, filter);
    expect(result.data.length).toBe(1);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(1);
    expect(result.totalPages).toBe(2);
  });

  it('createTask adds new task', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    const newTask = await TaskService.createTask({ title: 'New', description: 'Y', completed: false, userId });
    expect(newTask.id).toBeDefined();
    expect(StorageService.setItem).toHaveBeenCalled();
  });

  it('updateTask updates the specified task', async () => {
    const newTitle = 'Updated Title';
    const updated = await TaskService.updateTask('1', { title: newTitle });
    expect(updated?.title).toBe(newTitle);
    expect(StorageService.setItem).toHaveBeenCalledWith('tasks', expect.any(Array));
  });

  it('deleteTask removes the task', async () => {
    const result = await TaskService.deleteTask('1');
    expect(result).toBe(true);
    expect(StorageService.setItem).toHaveBeenCalledWith('tasks', expect.any(Array));
  });

  it('deleteTask returns false if task not found', async () => {
    const result = await TaskService.deleteTask('non-existent');
    expect(result).toBe(false);
  });

  it('toggleTaskCompletion toggles the completed state', async () => {
    const updated = await TaskService.toggleTaskCompletion('1');
    expect(updated?.completed).toBe(true);
  });

  it('getPaginatedTasks filters by completed', async () => {
    const filter = { search: '', completed: true, sortField: 'createdAt', sortOrder: 'asc' };
    const result = await TaskService.getPaginatedTasks(userId, { page: 1, limit: 10 }, filter);
    expect(result.data.length).toBe(1);
    expect(result.data[0].completed).toBe(true);
  });

  it('getPaginatedTasks sorts case-insensitively by title', async () => {
    const lowerUpper = [
      { ...tasksMock[0], title: 'zebra' },
      { ...tasksMock[1], title: 'Alpha' },
    ];
    (StorageService.getItem as jest.Mock).mockResolvedValue(lowerUpper);
    const filter = { search: '', completed: null, sortField: 'title', sortOrder: 'asc' };
    const result = await TaskService.getPaginatedTasks(userId, { page: 1, limit: 10 }, filter);
    expect(result.data[0].title.toLowerCase()).toBe('alpha');
    expect(result.data[1].title.toLowerCase()).toBe('zebra');
  });

  it('updateTask returns null if not found', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    const result = await TaskService.updateTask('nope', { title: 'New' });
    expect(result).toBeNull();
  });

  it('getTaskById returns null if not found', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    const result = await TaskService.getTaskById('x');
    expect(result).toBeNull();
  });

  it('toggleTaskCompletion returns null if task not found', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    const result = await TaskService.toggleTaskCompletion('missing');
    expect(result).toBeNull();
  });

  it('getPaginatedTasks returns empty if no tasks', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    const filter = { search: '', completed: null, sortField: 'title', sortOrder: 'asc' };
    const result = await TaskService.getPaginatedTasks('any', { page: 1, limit: 5 }, filter);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('getPaginatedTasks sorts with equal values for branch', async () => {
    const equalTitle = [
      { ...tasksMock[0], title: 'same' },
      { ...tasksMock[1], title: 'same' },
    ];
    (StorageService.getItem as jest.Mock).mockResolvedValue(equalTitle);
    const filter = { search: '', completed: null, sortField: 'title', sortOrder: 'asc' };
    const result = await TaskService.getPaginatedTasks(userId, { page: 1, limit: 10 }, filter);
    expect(result.data.length).toBeGreaterThanOrEqual(1);
  });

  it('toggleTaskCompletion toggles false to true and back', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([tasksMock[0]]);
    (StorageService.setItem as jest.Mock).mockResolvedValue(undefined);
    await TaskService.toggleTaskCompletion('1'); // first toggle false->true
    (StorageService.getItem as jest.Mock).mockResolvedValue([{ ...tasksMock[0], completed: true }]);
    const updated = await TaskService.toggleTaskCompletion('1'); // second toggle true->false
    expect(updated?.completed).toBe(false);
  });

  it('updateTask works with partial fields', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([tasksMock[0]]);
    const updated = await TaskService.updateTask('1', { description: 'Changed' });
    expect(updated?.description).toBe('Changed');
  });

  it('deleteTask with no tasks returns false', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    const result = await TaskService.deleteTask('x');
    expect(result).toBe(false);
  });
});

