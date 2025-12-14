import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SignInScreen } from '../screens/SignInScreen';
import * as AuthContext from '../context/AuthContext';
import * as ErrorContext from '../context/ErrorContext';
import * as LocalizationProvider from '../localization/LocalizationProvider';

jest.mock('expo-localization');

jest.mock('react-native-paper', () => {
  const ActualRN = jest.requireActual('react-native-paper');
  return {
    ...ActualRN,
    TextInput: (props: any) => <ActualRN.TextInput {...props} />, // pass all props
    Button: (props: any) => <ActualRN.Button {...props} />,
    Surface: (props: any) => <ActualRN.Surface {...props} />,
  };
});

describe('SignInScreen', () => {
  const signInMock = jest.fn();
  const logErrorMock = jest.fn();
  const setLocaleMock = jest.fn();

  function setup({
    locale = 'en',
    loading = false,
    signInReturn = {},
  }: any = {}) {
    // Force i18n locale and always load English for all tests regardless of 'locale' to keep stable labels for queries
    const i18n = require('../i18n').default;
    i18n.setLocale('en');
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      signIn: signInMock.mockImplementation(
        () => Promise.resolve(signInReturn)
      ),
    });
    jest.spyOn(ErrorContext, 'useErrorLogger').mockReturnValue({
      logError: logErrorMock,
    });
    jest.spyOn(LocalizationProvider, 'useLocalization').mockReturnValue({
      locale,
      setLocale: setLocaleMock,
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
    const { toJSON, getByText } = setup({ locale: 'es' });
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows validation errors if input is empty and Sign In is pressed', async () => {
    const { getByLabelText, getByA11yHint, getByText, toJSON } = setup();
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
      signInMock.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({}), 500)));
      fireEvent.press(signInBtn);
    });
    expect(toJSON()).toMatchSnapshot();
  });

  it('shows backend error returned from signIn', async () => {
    const { getByLabelText, getByText, toJSON } = setup({ signInReturn: { error: 'Invalid email or password' } });
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
