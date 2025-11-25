import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export const SignOutScreen = () => {
  const { signOut, user } = useAuth();

  return (
    <View>
      <Text style={styles.text}>Hello {user?.name}</Text>
      <View style={styles.button}>
        <Button
            title={'Sign Out'}
            onPress={signOut}
            accessibilityLabel={'Sign out Button'}
            accessibilityHint="Sign out to your account"
        />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    margin: 16,
  },
  button: {
    padding: 16
  },
});
