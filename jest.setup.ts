import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock i18n
jest.mock('./src/i18n', () => ({
  __esModule: true,
  default: {
    t: (key: string) => key,
    setLocale: jest.fn(),
    locale: 'en',
  },
}));

// Mock expo-localization
jest.mock('expo-localization');

// Suppress console warnings for missing icon libraries in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Tried to use the icon') &&
      args[0].includes('react-native-paper')
    ) {
      // Suppress icon library warnings
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const ActualRN = jest.requireActual('react-native-paper');
  return {
    ...ActualRN,
    TextInput: ActualRN.TextInput,
    Button: ActualRN.Button,
    Surface: ActualRN.Surface,
    IconButton: ActualRN.IconButton,
  };
});
