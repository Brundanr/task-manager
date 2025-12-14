module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'jsdom', // optional: react-native tests usually work with the react-native env from jest-expo;
                             // if you need DOM apis (e.g. for web parts) you can set jsdom.
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|expo|@expo|expo-modules-core|@react-navigation|my-allowed-module)/)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    // Optional: map static assets if you import images
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
    }
};
  