import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#6200ee',
        secondary: '#03dac4',
        error: '#b00020',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#000000',
        onPrimary: '#ffffff',
        onSecondary: '#000000',
        onError: '#ffffff',
        onBackground: '#000000',
        onSurface: '#000000',
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#bb86fc',
        secondary: '#03dac4',
        error: '#cf6679',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
        onPrimary: '#000000',
        onSecondary: '#000000',
        onError: '#000000',
        onBackground: '#ffffff',
        onSurface: '#ffffff',
    },
};

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body1: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    body2: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
};

export type Theme = typeof lightTheme;

