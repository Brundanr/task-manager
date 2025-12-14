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
