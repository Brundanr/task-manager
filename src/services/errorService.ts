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
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      message,
      statusCode,
      userId,
      timestamp: new Date().toISOString(),
      stack,
    };

    const logs = await StorageService.getItem<ErrorLog[]>(StorageItemsEnum.ERROR_LOGS) || [];
    logs.push(errorLog);
    await StorageService.setItem(StorageItemsEnum.ERROR_LOGS, logs);

    return errorLog;
  }

  // Get all error logs (admin only)
  static async getAllErrors(): Promise<ErrorLog[] | null> {
    return StorageService.getItem<ErrorLog[]>(StorageItemsEnum.ERROR_LOGS) || [];
  }

  // Clear all error logs
  static async clearErrors(): Promise<void> {
    await StorageService.removeItem(StorageItemsEnum.ERROR_LOGS);
  }
}

