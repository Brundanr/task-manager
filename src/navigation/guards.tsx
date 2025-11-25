import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

// Hook to protect routes that require admin role
export const useAdminGuard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigation.navigate('SignIn' as never);
      } else if (user?.role !== UserRole.ADMIN) {
        navigation.navigate('Tasks' as never);
      }
    }
  }, [user, isAuthenticated, loading, navigation]);
};