import { ErrorLog } from '../types';
import { StorageService } from '../utills/storage';

const STORAGE_KEY = 'error_logs';

// Error logging service
export class ErrorService {
  // Log an error
  static async logError(
    message: string,
    statusCode: number,
    userId: string,
    stack?: string
  ): Promise<ErrorLog> {
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      message,
      statusCode,
      userId,
      timestamp: new Date().toISOString(),
      stack,
    };

    const logs = await StorageService.getItem<ErrorLog[]>(STORAGE_KEY) || [];
    logs.push(errorLog);
    await StorageService.setItem(STORAGE_KEY, logs);

    return errorLog;
  }

  // Get all error logs (admin only)
  static async getAllErrors(): Promise<ErrorLog[] | null> {
    return StorageService.getItem<ErrorLog[]>(STORAGE_KEY) || [];
  }

  // Clear all error logs
  static async clearErrors(): Promise<void> {
    await StorageService.removeItem(STORAGE_KEY);
  }
}

