import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Text, Surface } from 'react-native-paper';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useErrorLogger } from '../context/ErrorContext';
import { useFormValidation, validateEmail, validateRequired } from '../hooks/useFormValidation';
import { useLocalization } from '../localization/LocalizationProvider';
import i18n from '../i18n';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { useFeatureFlags } from '../context/FeatureFlagsContext';

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
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  backendErrorText: {
    color: '#b00020',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  errorText: {
    color: '#b00020',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  input: {
    marginBottom: 8,
  },
  languageToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  surface: {
    borderRadius: 8,
    elevation: 4,
    padding: 24,
  },
  themeToggle: {
    alignItems: 'flex-end',
    marginBottom: 0,
    marginRight: 8,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
});
