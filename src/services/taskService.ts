import { FilterState, PaginatedResponse, PaginationParams, Task } from "../types";
import { createPaginatedResponse, filterItems } from "../utills/generics";
import { StorageService } from "../utills/storage";
import { StorageItemsEnum } from "../constants/StorageItemsEnum";

/**
 * Task service for managing tasks locally
 */
export class TaskService {
  /**
   * Get all tasks for a user
   */
  static async getTasks(userId: string): Promise<Task[]> {
    const tasks = await StorageService.getItem<Task[]>(StorageItemsEnum.TASKS) || [];
    return tasks.filter((task) => task.userId === userId);
  }

  /**
   * Get paginated tasks with filters and sorting
   */
  static async getPaginatedTasks(
    userId: string,
    params: PaginationParams,
    filters: FilterState
  ): Promise<PaginatedResponse<Task>> {
    let tasks = await this.getTasks(userId);

    // Apply search filter
    if (filters.search) {
      tasks = filterItems(tasks, (task) =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply completed filter
    if (filters.completed !== null) {
      tasks = filterItems(tasks, (task) => task.completed === filters.completed);
    }

    // Apply sorting
    tasks.sort((a, b) => {
      let aValue: string | number = a[filters.sortField];
      let bValue: string | number = b[filters.sortField];

      if (filters.sortField === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      } else if (filters.sortField === 'createdAt' || filters.sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return createPaginatedResponse(tasks, params.page, params.limit);
  }

  /**
   * Get a single task by ID
   */
  static async getTaskById(taskId: string): Promise<Task | null> {
    const tasks = await StorageService.getItem<Task[]>(StorageItemsEnum.TASKS) || [];
    return tasks.find((task) => task.id === taskId) || null;
  }

  /**
   * Create a new task
   */
  static async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const tasks = await StorageService.getItem<Task[]>(StorageItemsEnum.TASKS) || [];
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    await StorageService.setItem(StorageItemsEnum.TASKS, tasks);
    return newTask;
  }

  /**
   * Update a task
   */
  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const tasks = await StorageService.getItem<Task[]>(StorageItemsEnum.TASKS) || [];
    const index = tasks.findIndex((task) => task.id === taskId);
    
    if (index === -1) {
      return null;
    }

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await StorageService.setItem(StorageItemsEnum.TASKS, tasks);
    return tasks[index];
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string): Promise<boolean> {
    const tasks = await StorageService.getItem<Task[]>(StorageItemsEnum.TASKS) || [];
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    
    if (filteredTasks.length === tasks.length) {
      return false; // Task not found
    }

    await StorageService.setItem(StorageItemsEnum.TASKS, filteredTasks);
    return true;
  }

  /**
   * Toggle task completion
   */
  static async toggleTaskCompletion(taskId: string): Promise<Task | null> {
    const task = await this.getTaskById(taskId);
    if (!task) {
      return null;
    }
    return this.updateTask(taskId, { completed: !task.completed });
  }
}

