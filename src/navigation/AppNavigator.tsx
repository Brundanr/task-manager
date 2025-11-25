import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { SignInScreen } from '../screens/SignInScreen';
import ErrorsScreen from '../screens/ErrorsScreen';
import { TabIcon } from '../components/TabIcon';
import { LoadingScreen } from '../components/LoadingScreen';
import { TasksListScreen } from '../screens/TasksListScreen';
import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { SignOutScreen } from '../screens/SignOutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TasksStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TasksList"
        component={TasksListScreen}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
      />
    </Stack.Navigator>
  );
};

const AuthenticatedTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => null,
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Tasks"
        component={TasksStack}
        options={{ headerShown: false }}
      />
      {user?.role === UserRole.ADMIN && (
        <Tab.Screen
          name="Errors"
          component={ErrorsScreen}
        />
      )}
      <Tab.Screen
        name="SignOut"
        component={SignOutScreen}
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
              component={ErrorsScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};