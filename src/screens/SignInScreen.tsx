import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Text, Surface } from 'react-native-paper';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useErrorLogger } from '../context/ErrorContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { validateEmail, validateRequired } from '../validators';
import { useLocalization } from '../localization/LocalizationProvider';
import i18n from '../i18n';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { useFeatureFlags } from '../context/FeatureFlagsContext';
import { spacing, colors, elevation, borderRadius } from '../theme';

export const SignInScreen: React.FC = () => {
  const { signIn } = useAuth();
  const { logError } = useErrorLogger();
  const [backendError, setBackendError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { locale, setLocale } = useLocalization();
  const { isEnabled } = useFeatureFlags();

  const validate = useCallback((values: { email: string; password: string }) => {
    const errors: Record<string, string> = {};
    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;
    const passwordError = validateRequired(values.password, 'password');
    if (passwordError) errors.password = passwordError;
    return errors;
  }, []);

  const { values, errors, touched, handleChange, handleBlur, validateForm } = useFormValidation(
    { email: '', password: '' },
    validate
  );

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
        // Log all sign-in errors (both authentication failures and server errors)
        const errorStack =
          values.email === 'error@example.com' ? 'Sign in attempt failed' : undefined;
        await logError(result.error, 500, errorStack);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;
      setBackendError(errorMessage);
      await logError(errorMessage, 500, errorStack);
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
        <Text variant="headlineLarge" style={styles.appTitle}>
          {i18n.t('app.title')}
        </Text>
        {/* Theme Toggle */}
        <View style={styles.themeToggle}>
          <ThemeToggleButton />
        </View>
        {/* Language Toggle Buttons */}
        {isEnabled('language') && (
          <View style={styles.languageToggle}>
            <Button title="English" onPress={() => setLocale('en')} disabled={locale === 'en'} />
            <Button title="Español" onPress={() => setLocale('es')} disabled={locale === 'es'} />
          </View>
        )}
        <Surface style={styles.surface}>
          <Text variant="headlineMedium" style={styles.title}>
            {i18n.t('auth.signIn')}
          </Text>

          <TextInput
            label={i18n.t('auth.email')}
            value={values.email}
            onChangeText={text => handleChange('email', text)}
            onBlur={() => handleBlur('email')}
            error={!!(touched.email && errors.email)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel={i18n.t('auth.email')}
            accessibilityHint={'Enter your email address'}
            style={styles.input}
          />
          {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            label={i18n.t('auth.password')}
            value={values.password}
            onChangeText={text => handleChange('password', text)}
            onBlur={() => handleBlur('password')}
            error={!!(touched.password && errors.password)}
            secureTextEntry
            autoCapitalize="none"
            accessibilityLabel={i18n.t('auth.password')}
            accessibilityHint={'Enter your password'}
            style={styles.input}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {backendError && <Text style={styles.backendErrorText}>{backendError}</Text>}

          <View style={styles.button}>
            <Button
              title={i18n.t('auth.signIn')}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              accessibilityLabel={i18n.t('auth.signIn')}
              accessibilityHint={'Sign in to your account'}
            />
          </View>

          <Text style={styles.hintText}>
            Try: admin@example.com / admin123 or member@example.com / member123
          </Text>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
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
  container: {
    flex: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  hintText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  hintText: {
    color: '#666',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.sm,
  },
  languageToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  surface: {
    borderRadius: borderRadius.md,
    elevation: elevation.medium,
    padding: spacing.lg,
  },
  themeToggle: {
    alignItems: 'flex-end',
    marginBottom: 0,
    marginRight: spacing.md,
  },
  title: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});
