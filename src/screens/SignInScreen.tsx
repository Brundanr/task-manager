import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Text, Surface } from 'react-native-paper';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useErrorLogger } from '../context/ErrorContext';
import { useFormValidation, validateEmail, validateRequired } from '../hooks/useFormValidation';
import { useLocalization } from '../localization/LocalizationProvider';
import i18n from '../i18n';

export const SignInScreen: React.FC = () => {
  const { signIn } = useAuth();
  const { logError } = useErrorLogger();
  const [backendError, setBackendError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { locale, setLocale } = useLocalization();

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
      {/* Language Toggle Buttons */}
          <View style={styles.languageToggle}>
            <Button
              title="English"
              onPress={() => setLocale('en')}
              disabled={locale === 'en'}
            />
            <Button
              title="Español"
              onPress={() => setLocale('es')}
              disabled={locale === 'es'}
            />
          </View>
        <Surface style={styles.surface}>
          <Text variant="headlineMedium" style={styles.title}>
            {i18n.t('auth.signIn')}
          </Text>

          <TextInput
            label={i18n.t('auth.email')}
            value={values.email}
            onChangeText={(text) => handleChange('email', text)}
            onBlur={() => handleBlur('email')}
            error={!!(touched.email && errors.email)}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel={i18n.t('auth.email')}
            accessibilityHint={'Enter your email address'}
            style={styles.input}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <TextInput
            label={i18n.t('auth.password')}
            value={values.password}
            onChangeText={(text) => handleChange('password', text)}
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

          {backendError && (
            <Text style={styles.backendErrorText}>{backendError}</Text>
          )}

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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  languageToggle: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16 
  },
  surface: {
    padding: 24,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#b00020',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
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
  hintText: {
    marginTop: 16,
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
});