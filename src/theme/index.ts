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

// Spacing constants
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
} as const;

// Color constants
export const colors = {
    backgroundLight: '#f5f5f5',
    errorBackground: '#ffebee',
    textSecondary: '#666',
    textTertiary: '#999',
    error: '#b00020',
    white: '#ffffff',
} as const;

// Elevation constants
export const elevation = {
    low: 2,
    medium: 4,
    high: 8,
} as const;

// Border radius constants
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
} as const;

