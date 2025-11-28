import { filterItems, createPaginatedResponse } from '../utills/generics';
import { StorageService } from '../utills/storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');

describe('filterItems', () => {
  it('filters items correctly', () => {
    const arr = [1, 2, 3, 4];
    const result = filterItems(arr, n => n > 2);
    expect(result).toEqual([3, 4]);
  });
});

describe('createPaginatedResponse', () => {
  it('returns paginated data correctly', () => {
    const data = [1, 2, 3, 4, 5];
    const resp = createPaginatedResponse(data, 2, 2);
    expect(resp.data).toEqual([3, 4]);
    expect(resp.page).toBe(2);
    expect(resp.limit).toBe(2);
    expect(resp.total).toBe(5);
    expect(resp.totalPages).toBe(3);
  });

  it('handles empty data', () => {
    const resp = createPaginatedResponse([], 1, 5);
    expect(resp.data).toEqual([]);
    expect(resp.totalPages).toBe(0);
  });
});

describe('StorageService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getItem', () => {
    it('should return parsed value on success', async () => {
      AsyncStorage.getItem.mockResolvedValue('{"a":1}');
      const result = await StorageService.getItem('key');
      expect(result).toEqual({ a: 1 });
    });
    it('should return null when no value', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      const result = await StorageService.getItem('key');
      expect(result).toBeNull();
    });
    it('should handle and log error, return null', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      AsyncStorage.getItem.mockRejectedValue(new Error('fail'));
      const result = await StorageService.getItem('key');
      expect(result).toBeNull();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('setItem', () => {
    it('should serialize and store value', async () => {
      await StorageService.setItem('key', { b: 2 });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify({ b: 2 }));
    });
    it('should handle and log error, throw', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('fail'));
      await expect(StorageService.setItem('k', 5)).rejects.toThrow('fail');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('should remove item', async () => {
      await StorageService.removeItem('key');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('key');
    });
    it('should handle error, log and throw', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      AsyncStorage.removeItem.mockRejectedValueOnce(new Error('fail'));
      await expect(StorageService.removeItem('x')).rejects.toThrow('fail');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should clear storage', async () => {
      await StorageService.clear();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
    it('should handle and log error, throw', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      AsyncStorage.clear.mockRejectedValueOnce(new Error('fail'));
      await expect(StorageService.clear()).rejects.toThrow('fail');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});

