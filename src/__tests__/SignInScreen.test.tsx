import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SignInScreen } from '../screens/SignInScreen';
import * as AuthContext from '../context/AuthContext';
import * as ErrorContext from '../context/ErrorContext';
import * as LocalizationProvider from '../localization/LocalizationProvider';
import * as FeatureFlagsContext from '../context/FeatureFlagsContext';
import i18n from '../i18n';
import { FeatureFlagKey } from '../types';

describe('SignInScreen', () => {
  const signInMock = jest.fn();
  const logErrorMock = jest.fn();
  const setLocaleMock = jest.fn();

  interface SetupOptions {
    locale?: string;
    signInReturn?: { error?: string };
    isLanguageEnabled?: boolean;
  }

  function setup({
    locale = 'en',
    signInReturn = {},
    isLanguageEnabled = true,
  }: SetupOptions = {}) {
    // Force i18n locale and always load English for all tests regardless of 'locale' to keep stable labels for queries
    i18n.setLocale('en');
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      signIn: signInMock.mockImplementation(() => Promise.resolve(signInReturn)),
      signOut: jest.fn(),
      isAuthenticated: false,
    });
    jest.spyOn(ErrorContext, 'useErrorLogger').mockReturnValue({
      logError: logErrorMock,
    });
    jest.spyOn(LocalizationProvider, 'useLocalization').mockReturnValue({
      locale,
      setLocale: setLocaleMock,
      t: (key: string) => key,
    });
    jest.spyOn(FeatureFlagsContext, 'useFeatureFlags').mockReturnValue({
      flags: {
        theme: true,
        language: isLanguageEnabled,
        search: true,
        sort: true,
        filter: true,
      },
      isEnabled: (key: FeatureFlagKey) => {
        if (key === 'language') return isLanguageEnabled;
        return true;
      },
      setFlag: jest.fn(),
      setFlags: jest.fn(),
      resetToDefaults: jest.fn(),
      refreshFromRemote: jest.fn(),
      loading: false,
    });
    return render(<SignInScreen />);
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial state correctly (English)', () => {
    const { toJSON } = setup();
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders initial state correctly (Spanish)', () => {
    const { toJSON } = setup({ locale: 'es' });
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows validation errors if input is empty and Sign In is pressed', async () => {
    const { getByLabelText, toJSON } = setup();
    const signInBtn = getByLabelText('auth.signIn');
    await act(async () => {
      fireEvent.press(signInBtn);
    });
    // expect(getByText('Please enter a valid email address')).toBeTruthy();
    // expect(getByText('This field is required')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows loading state on submit', async () => {
    const { getByLabelText, toJSON } = setup();
    const emailInput = getByLabelText('auth.email');
    const pwdInput = getByLabelText('auth.password');
    const signInBtn = getByLabelText('auth.signIn');
    await act(async () => {
      fireEvent.changeText(emailInput, 'foo@bar.com');
      fireEvent.changeText(pwdInput, 'foobar');
    });
    await act(async () => {
      signInMock.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve({}), 500))
      );
      fireEvent.press(signInBtn);
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows backend error returned from signIn', async () => {
    const { getByLabelText, getByText, toJSON } = setup({
      signInReturn: { error: 'Invalid email or password' },
    });
    const emailInput = getByLabelText('auth.email');
    const pwdInput = getByLabelText('auth.password');
    const signInBtn = getByLabelText('auth.signIn');
    await act(async () => {
      fireEvent.changeText(emailInput, 'foo@bar.com');
      fireEvent.changeText(pwdInput, 'foobar');
    });
    await act(async () => {
      fireEvent.press(signInBtn);
    });
    expect(getByText('Invalid email or password')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('changes locale when language toggle is pressed', () => {
    const { getByText } = setup({ locale: 'en' });
    const espBtn = getByText('Español');
    fireEvent.press(espBtn);
    expect(setLocaleMock).toHaveBeenCalledWith('es');
  });
});
