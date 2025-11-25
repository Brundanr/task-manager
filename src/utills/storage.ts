import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generic storage utility with TypeScript generics
 */
export class StorageService {
  /**
   * Generic method to get an item from storage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  /**
   * Generic method to set an item in storage
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove an item from storage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}