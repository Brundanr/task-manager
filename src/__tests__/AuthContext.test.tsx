import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { User, UserRole } from '../types';

jest.mock('../services/authService');

describe('AuthContext', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('should load user on mount', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(AuthService.getCurrentUser).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should set loading to false when no user exists', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should sign in user successfully', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      (AuthService.signIn as jest.Mock).mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { error?: string };
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'password');
      });

      expect(AuthService.signIn).toHaveBeenCalledWith('test@example.com', 'password');
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(signInResult!.error).toBeUndefined();
    });

    it('should handle sign in error', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      (AuthService.signIn as jest.Mock).mockResolvedValue({
        user: null as unknown as User,
        error: 'Invalid credentials',
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult: { error?: string };
      await act(async () => {
        signInResult = await result.current.signIn('test@example.com', 'wrong');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(signInResult!.error).toBe('Invalid credentials');
    });

    it('should sign out user', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.signOut as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(AuthService.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('useAuth', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});

