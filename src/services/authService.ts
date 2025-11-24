import { User, UserRole } from '../types';
import { StorageService } from '../utills/storage';

const STORAGE_KEY = 'user_session';

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
      role: UserRole.MEMEBR,
      name: 'Member User',
    },
  ];

  // Sign in with email and password
   
  static async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock backend error for specific email
    if (email === 'error@example.com') {
      return {
        user: null as unknown as User,
        error: 'Backend error: Invalid credentials',
      };
    }

    const user = this.mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return {
        user: null as unknown as User,
        error: 'Invalid email or password',
      };
    }

    // Remove password before storing

    const { password: _, ...userWithoutPassword } = user;
    await StorageService.setItem(STORAGE_KEY, userWithoutPassword);

    return { user: userWithoutPassword };
  }

  // Sign out
   
  static async signOut(): Promise<void> {
    await StorageService.removeItem(STORAGE_KEY);
  }

  // Get current user from storage
   
  static async getCurrentUser(): Promise<User | null> {
    return StorageService.getItem<User>(STORAGE_KEY);
  }

  // Check if user is authenticated

  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}

