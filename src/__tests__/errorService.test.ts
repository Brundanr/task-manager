import { ErrorService } from '../services/errorService';
import { StorageService } from '../utills/storage';
import { ErrorLog } from '../types';

jest.mock('../utills/storage');

describe('ErrorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logError should create and save an error log', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    (StorageService.setItem as jest.Mock).mockResolvedValue(undefined);
    const error = await ErrorService.logError('msg', 400, 'user1');
    expect(error.id).toBeDefined();
    expect(error.message).toBe('msg');
    expect(StorageService.setItem).toHaveBeenCalledWith('error_logs', expect.any(Array));
  });

  it('logError should support stack param', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue([]);
    (StorageService.setItem as jest.Mock).mockResolvedValue(undefined);
    const error = await ErrorService.logError('msg2', 404, 'user2', 'STACK');
    expect(error.stack).toBe('STACK');
    expect(StorageService.setItem).toHaveBeenCalledWith('error_logs', expect.any(Array));
  });

  it('getAllErrors should return logs', async () => {
    const logs: ErrorLog[] = [{ id: '1', message: 'm', statusCode: 500, userId: '1', timestamp: 't' }];
    (StorageService.getItem as jest.Mock).mockResolvedValue(logs);
    const result = await ErrorService.getAllErrors();
    expect(result).toEqual(logs);
    expect(StorageService.getItem).toHaveBeenCalledWith('error_logs');
  });

  it('getAllErrors should return [] if storage returns null', async () => {
    (StorageService.getItem as jest.Mock).mockResolvedValue(null);
    const result = await ErrorService.getAllErrors();
    expect(result).toEqual([]);
  });

  it('clearErrors should call removeItem', async () => {
    await ErrorService.clearErrors();
    expect(StorageService.removeItem).toHaveBeenCalledWith('error_logs');
  });
});

