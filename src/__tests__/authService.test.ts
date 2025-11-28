import { AuthService } from '../services/authService';
import { StorageService } from '../utills/storage';
import { UserRole } from '../types';

jest.mock('../utills/storage');

describe('AuthService', () => {
  const adminUser = {
    id: '1',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    name: 'Admin User',
  };

  const memberUser = {
    id: '2',
    email: 'member@example.com',
    role: UserRole.MEMBER,
    name: 'Member User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return a user for valid credentials', async () => {
      const result = await AuthService.signIn('admin@example.com', 'admin123');
      expect(result.user).toEqual(expect.objectContaining(adminUser));
      expect(result.error).toBeUndefined();
    });

    it('should fail for invalid credentials', async () => {
      const result = await AuthService.signIn('admin@example.com', 'wrongpassword');
      expect(result.user).toBeNull();
      expect(result.error).toEqual('Invalid email or password');
    });

    it('should return backend error for error@example.com', async () => {
      const result = await AuthService.signIn('error@example.com', 'any');
      expect(result.user).toBeNull();
      expect(result.error).toContain('Backend error');
    });
  });

  describe('signOut', () => {
    it('should call StorageService.removeItem', async () => {
      await AuthService.signOut();
      expect(StorageService.removeItem).toHaveBeenCalledWith('user_session');
    });
  });

  describe('getCurrentUser', () => {
    it('should get user from StorageService', async () => {
      (StorageService.getItem as jest.Mock).mockResolvedValue(adminUser);
      const user = await AuthService.getCurrentUser();
      expect(StorageService.getItem).toHaveBeenCalledWith('user_session');
      expect(user).toEqual(adminUser);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user exists', async () => {
      (StorageService.getItem as jest.Mock).mockResolvedValue(adminUser);
      const result = await AuthService.isAuthenticated();
      expect(result).toBe(true);
    });
    it('should return false when user does not exist', async () => {
      (StorageService.getItem as jest.Mock).mockResolvedValue(null);
      const result = await AuthService.isAuthenticated();
      expect(result).toBe(false);
    });
  });
});

