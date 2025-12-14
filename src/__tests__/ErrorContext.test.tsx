import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { ErrorProvider, useErrorLogger } from '../context/ErrorContext';
import { AuthProvider } from '../context/AuthContext';
import { ErrorService } from '../services/errorService';
import { AuthService } from '../services/authService';
import { User, UserRole } from '../types';

jest.mock('../services/errorService');
jest.mock('../services/authService');

describe('ErrorContext', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <ErrorProvider>{children}</ErrorProvider>
    </AuthProvider>
  );

  describe('logError', () => {
    it('should log error when statusCode >= 500 and user exists', async () => {
      const { result } = renderHook(() => useErrorLogger(), { wrapper });

      // Wait for AuthContext to load the user
      await waitFor(() => {
        expect(AuthService.getCurrentUser).toHaveBeenCalled();
      });

      // Wait for React to process the state update from AuthContext
      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      // Wait for the user to be available in ErrorContext by retrying logError
      await waitFor(
        async () => {
          await act(async () => {
            await result.current.logError('Test error', 500, 'stack trace');
          });
          expect(ErrorService.logError).toHaveBeenCalledWith('Test error', 500, '1', 'stack trace');
        },
        { timeout: 3000 }
      );
    });

    it('should not log error when statusCode < 500', async () => {
      const { result } = renderHook(() => useErrorLogger(), { wrapper });

      // Wait for AuthContext to load the user
      await waitFor(() => {
        expect(AuthService.getCurrentUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      await act(async () => {
        await result.current.logError('Test error', 400);
      });

      expect(ErrorService.logError).not.toHaveBeenCalled();
    });

    it('should not log error when user is null', async () => {
      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useErrorLogger(), { wrapper });

      // Wait for AuthContext to load (user will be null)
      await waitFor(() => {
        expect(AuthService.getCurrentUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      await act(async () => {
        await result.current.logError('Test error', 500);
      });

      expect(ErrorService.logError).not.toHaveBeenCalled();
    });

    it('should log error for statusCode 500', async () => {
      const { result } = renderHook(() => useErrorLogger(), { wrapper });

      // Wait for AuthContext to load the user
      await waitFor(() => {
        expect(AuthService.getCurrentUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      // Wait for the user to be available in ErrorContext
      await waitFor(
        async () => {
          await act(async () => {
            await result.current.logError('Server error', 500);
          });
          expect(ErrorService.logError).toHaveBeenCalledWith('Server error', 500, '1', undefined);
        },
        { timeout: 3000 }
      );
    });

    it('should log error for statusCode > 500', async () => {
      const { result } = renderHook(() => useErrorLogger(), { wrapper });

      // Wait for AuthContext to load the user
      await waitFor(() => {
        expect(AuthService.getCurrentUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      // Wait for the user to be available in ErrorContext
      await waitFor(
        async () => {
          await act(async () => {
            await result.current.logError('Server error', 503);
          });
          expect(ErrorService.logError).toHaveBeenCalledWith('Server error', 503, '1', undefined);
        },
        { timeout: 3000 }
      );
    });

    it('should include stack trace when provided', async () => {
      const { result } = renderHook(() => useErrorLogger(), { wrapper });

      // Wait for AuthContext to load the user
      await waitFor(() => {
        expect(AuthService.getCurrentUser).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      // Wait for the user to be available in ErrorContext
      await waitFor(
        async () => {
          await act(async () => {
            await result.current.logError('Error', 500, 'Stack trace here');
          });
          expect(ErrorService.logError).toHaveBeenCalledWith('Error', 500, '1', 'Stack trace here');
        },
        { timeout: 3000 }
      );
    });
  });

  describe('useErrorLogger', () => {
    it('should throw error when used outside ErrorProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useErrorLogger());
      }).toThrow('useErrorLogger must be used within ErrorProvider');

      consoleSpy.mockRestore();
    });
  });
});
