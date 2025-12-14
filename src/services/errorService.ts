import { ErrorLog } from '../types';
import { StorageService } from '../utills/storage';
import { StorageItemsEnum } from '../constants/StorageItemsEnum';

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

      const logs = (await StorageService.getItem<ErrorLog[]>(StorageItemsEnum.ERROR_LOGS)) || [];
      logs.push(errorLog);
      await StorageService.setItem(StorageItemsEnum.ERROR_LOGS, logs);

      // console.log('Error logged successfully:', errorLog.id);
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
    const result = await StorageService.getItem<ErrorLog[]>(StorageItemsEnum.ERROR_LOGS);
    return result || [];
  }

  // Clear all error logs
  static async clearErrors(): Promise<void> {
    await StorageService.removeItem(StorageItemsEnum.ERROR_LOGS);
  }
}
