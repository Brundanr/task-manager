import React, { createContext, useContext, useCallback } from 'react';
import { ErrorService } from '../services/errorService';
import { useAuth } from './AuthContext';

interface ErrorContextType {
  logError: (message: string, statusCode: number, stack?: string) => Promise<void>;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const logError = useCallback(
    async (message: string, statusCode: number, stack?: string) => {
      if (user && statusCode >= 500) {
        await ErrorService.logError(message, statusCode, user.id, stack);
      }
    },
    [user]
  );

  return (
    <ErrorContext.Provider value={{ logError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorLogger = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorLogger must be used within ErrorProvider');
  }
  return context;
};

