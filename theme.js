import { DefaultTheme } from 'react-native-paper';

// Colors
export const colors = {
  primary: '#0d6efd',
  secondary: '#fd7e14',
  background: '#f8f9fa',
  surface: '#ffffff',
  error: '#dc3545',
  text: '#212529',
  subtext: '#6c757d',
  border: '#dee2e6',
  success: '#198754',
  info: '#0dcaf0',
  warning: '#ffc107',
  light: '#f8f9fa',
  dark: '#212529',
  cardBg: '#ffffff',
  highlight: '#e8f4fc',
  primaryLight: '#cfe2ff',
  secondaryLight: '#fff3cd',
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSizes: {
    xs: 12,
    small: 14,
    medium: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

// Spacing
export const spacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 40,
};

// Border radius
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  round: 50,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Paper theme
export const paperTheme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    onSurface: colors.text,
    disabled: colors.subtext,
    placeholder: colors.subtext,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: colors.secondary,
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: typography.fontWeights.regular,
    },
    medium: {
      fontFamily: typography.fontFamily.medium,
      fontWeight: typography.fontWeights.medium,
    },
    light: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: typography.fontWeights.light,
    },
    thin: {
      fontFamily: typography.fontFamily.regular,
      fontWeight: typography.fontWeights.light,
    },
  },
  animation: {
    scale: 1.0,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  paperTheme,
}; 