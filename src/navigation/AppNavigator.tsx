import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import i18n from '../i18n';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TasksStack = () => {
  return (
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
};

const AuthenticatedTabs = () => {
  const { user } = useAuth();

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

          // Ensure size and color are valid
          const iconSize = typeof size === 'number' ? size : 24;
          const iconColor = typeof color === 'string' ? color : '#6200ee';

          return <TabIcon name={iconName} size={iconSize} color={iconColor} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
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

const SignOutPlaceholder: React.FC = () => {
  const { signOut } = useAuth();
  React.useEffect(() => {
    signOut();
  }, [signOut]);
  return null;
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};