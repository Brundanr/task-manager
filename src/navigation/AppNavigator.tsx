import React from 'react';
import { NavigationContainer, Theme as NavigationTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { SignInScreen } from '../screens/SignInScreen';
import { ErrorScreen } from '../screens/ErrorScreen';
import { TabIcon } from '../components/TabIcon';
import { LoadingScreen } from '../components/LoadingScreen';
import { TasksListScreen } from '../screens/TasksListScreen';
import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { SignOutScreen } from '../screens/SignOutScreen';
import { ErrorLogsScreen } from '../screens/ErrorLogsScreen';
import { useThemeMode } from '../context/ThemeContext';
import i18n from '../i18n';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TasksStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TasksList"
      component={TasksListScreen}
      options={{ title: i18n.t('tasks.title') }}
    />
    <Stack.Screen
      name="TaskDetails"
      component={TaskDetailsScreen}
      options={{ title: i18n.t('tasks.editTask') }}
    />
  </Stack.Navigator>
);

const AuthenticatedTabs = () => {
  const { user } = useAuth();
  const { theme, mode } = useThemeMode();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          if (route.name === 'Tasks') {
            iconName = 'check-circle';
          } else if (route.name === 'Errors') {
            iconName = 'alert-circle';
          } else {
            iconName = 'logout';
          }
          const iconSize = typeof size === 'number' ? size : 24;
          const iconColor = typeof color === 'string' ? color : theme.colors.primary;
          return <TabIcon name={iconName} size={iconSize} color={iconColor} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface || '#999',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline || '#ccc',
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
        tabBarLabelStyle: {
          color: theme.colors.text,
        },
      })}
    >
      <Tab.Screen
        name="Tasks"
        component={TasksStack}
        options={{ headerShown: false, title: i18n.t('tasks.title') }}
      />
      {user?.role === UserRole.ADMIN && (
        <Tab.Screen
          name="Errors"
          component={ErrorLogsScreen}
          options={{ title: i18n.t('errors.title') }}
        />
      )}
      <Tab.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{ title: i18n.t('auth.signOut') }}
      />
    </Tab.Navigator>
  );
};

// Wrapper component to safely use theme hook for NavigationContainer
const NavigationContainerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, mode } = useThemeMode();

  const navigationTheme: NavigationTheme = {
    dark: mode === 'dark',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.outline || '#ccc',
      notification: theme.colors.error,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '800' as const,
      },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {children}
    </NavigationContainer>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainerWrapper>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={AuthenticatedTabs} />
            <Stack.Screen
              name="Error"
              component={ErrorScreen}
              options={{ presentation: 'modal', title: i18n.t('common.error') }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainerWrapper>
  );
};