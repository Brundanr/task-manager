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
    try {
      const errorLog: ErrorLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message,
        statusCode,
        userId,
        timestamp: new Date().toISOString(),
        stack,
      };

      const logs = await StorageService.getItem<ErrorLog[]>(STORAGE_KEY) || [];
      logs.push(errorLog);
      await StorageService.setItem(STORAGE_KEY, logs);

      console.log('Error logged successfully:', errorLog.id);
      return errorLog;
    } catch (error) {
      console.error('Failed to log error:', error);
      // Return a minimal error log even if storage fails
      return {
        id: Date.now().toString(),
        message,
        statusCode,
        userId,
        timestamp: new Date().toISOString(),
        stack,
      };
    }
  }

  // Get all error logs (admin only)
  static async getAllErrors(): Promise<ErrorLog[]> {
    try {
      const logs = await StorageService.getItem<ErrorLog[]>(STORAGE_KEY) || [];
      console.log(`Retrieved ${logs.length} error logs from storage`);
      return logs;
    } catch (error) {
      console.error('Failed to retrieve error logs:', error);
      return [];
    }
  }

  // Clear all error logs
  static async clearErrors(): Promise<void> {
    await StorageService.removeItem(STORAGE_KEY);
  }
}

