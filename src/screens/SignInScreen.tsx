import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Text, Surface } from 'react-native-paper';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useErrorLogger } from '../context/ErrorContext';
import { useFormValidation, validateEmail, validateRequired } from '../hooks/useFormValidation';
import { spacing, colors, elevation, borderRadius } from '../theme';

export const SignInScreen: React.FC = () => {
  const { signIn } = useAuth();
  const { logError } = useErrorLogger();
  const [backendError, setBackendError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const validate = useCallback((values: { email: string; password: string }) => {
    const errors: Record<string, string> = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    const passwordError = validateRequired(values.password, 'password');
    if (passwordError) errors.password = passwordError;
    return errors;
  }, []);

  const { values, errors, touched, handleChange, handleBlur, validateForm } =
    useFormValidation({ email: '', password: '' }, validate);

  const handleSubmit = useCallback(async () => {
    setBackendError('');
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(values.email, values.password);
      if (result.error) {
        setBackendError(result.error);
        // Simulate backend error for specific email
        if (values.email === 'error@example.com') {
          await logError(result.error, 500, 'Sign in attempt failed');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setBackendError(errorMessage);
      await logError(errorMessage, 500);
    } finally {
      setLoading(false);
    }
  }, [values, signIn, validateForm, logError]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface}>
          <Text variant="headlineMedium" style={styles.title}>
            {'Sign In'}
          </Text>

          <TextInput
            label={'Email'}
            value={values.email}
            onChangeText={(text) => handleChange('email', text)}
            onBlur={() => handleBlur('email')}
            error={!!(touched.email && errors.email)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel={'Email'}
            accessibilityHint="Enter your email address"
            style={styles.input}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <TextInput
            label={'Password'}
            value={values.password}
            onChangeText={(text) => handleChange('password', text)}
            onBlur={() => handleBlur('password')}
            error={!!(touched.password && errors.password)}
            secureTextEntry
            autoCapitalize="none"
            accessibilityLabel={'Password'}
            accessibilityHint="Enter your password"
            style={styles.input}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {backendError && (
            <Text style={styles.backendErrorText}>{backendError}</Text>
          )}

          <View style={styles.button}>
            <Button
              title={'Sign In'}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              accessibilityLabel={'Sign In Button'}
              accessibilityHint="Sign in to your account"
            />
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  surface: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    elevation: elevation.medium,
  },
  title: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginLeft: 12,
  },
  backendErrorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.sm,
  },
  hintText: {
    marginTop: spacing.md,
    fontSize: 12,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});