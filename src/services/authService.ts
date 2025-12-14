import { User, UserRole } from '../types';
import { StorageService } from '../utills/storage';
import { StorageItemsEnum } from '../constants/StorageItemsEnum';

// Mock authentication service
export class AuthService {
  // Mock users
  private static mockUsers: (User & { password: string })[] = [
    {
      id: '1',
      email: 'admin@example.com',
      password: 'admin123',
      role: UserRole.ADMIN,
      name: 'Admin User',
    },
    {
      id: '2',
      email: 'member@example.com',
      password: 'member123',
      role: UserRole.MEMBER,
      name: 'Member User',
    },
  ];

  // Sign in with email and password

  static async signIn(email: string, password: string): Promise<{ user: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock backend error for specific email
    if (email === 'error@example.com') {
      return {
        user: null as unknown as User,
        error: 'Backend error: Invalid credentials',
      };
    }

    const user = this.mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return {
        user: null as unknown as User,
        error: 'Invalid email or password',
      };
    }

    // Remove password before storing
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    await StorageService.setItem(StorageItemsEnum.USER_SESSION, userWithoutPassword);

    return { user: userWithoutPassword };
  }

  // Sign out

  static async signOut(): Promise<void> {
    await StorageService.removeItem(StorageItemsEnum.USER_SESSION);
  }

  // Get current user from storage

  static async getCurrentUser(): Promise<User | null> {
    return StorageService.getItem<User>(StorageItemsEnum.USER_SESSION);
  }

  // Check if user is authenticated

  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}
