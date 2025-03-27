import { DefaultTheme } from 'react-native-paper';

// Theme constants
export const colors = {
  primary: '#0d6efd',
  accent: '#2962ff',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#212529',
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Custom colors
  light: '#ffffff',
  dark: '#212529',
  primaryLight: '#e3f2fd',
  secondary: '#ff9800',
  secondaryLight: '#fff3e0',
  subtext: '#6c757d',
};

export const typography = {
  fontSizes: {
    xs: 12,
    small: 14,
    medium: 16,
    large: 18,
    xl: 24,
    xxl: 32,
  },
};

export const spacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  round: 24,
};

// Create paper theme for backward compatibility
export const paperTheme = {
  ...DefaultTheme,
  roundness: borderRadius.medium,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
}; 