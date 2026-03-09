/**
 * Centralized Theme System
 *
 * Provides consistent colors, typography, spacing, and shadows across the app.
 * Supports light and dark modes.
 */

export const colors = {
  // Calculator-specific colors
  calculators: {
    ohms: '#1565C0',        // Blue
    amperes: '#6A1B9A',     // Purple
    divider: '#00796B',     // Teal
    transformers: '#283593', // Dark Blue
    residential: '#E65100',  // Orange
    voltageDrop: '#558B2F',  // Green
    ladderLogic: '#C62828',  // Red (industrial/PLC)
    conduitFill: '#37474F',  // Blue Grey (conduit/raceway)
  },

  // Light mode colors
  light: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',

    text: {
      primary: '#212121',
      secondary: '#666666',
      tertiary: '#999999',
      disabled: '#B0BEC5',
    },

    border: {
      light: '#E0E0E0',
      medium: '#BDBDBD',
      dark: '#9E9E9E',
    },

    status: {
      success: '#4CAF50',
      successBackground: '#E8F5E9',
      error: '#C62828',
      errorBackground: '#FFEBEE',
      warning: '#F57C00',
      warningBackground: '#FFF3E0',
      info: '#1976D2',
      infoBackground: '#E3F2FD',
    },

    button: {
      primary: '#1565C0',
      primaryText: '#FFFFFF',
      secondary: '#FFFFFF',
      secondaryText: '#333333',
      disabled: '#E0E0E0',
      disabledText: '#9E9E9E',
    },
  },

  // Dark mode colors
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',

    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      tertiary: '#808080',
      disabled: '#555555',
    },

    border: {
      light: '#333333',
      medium: '#444444',
      dark: '#555555',
    },

    status: {
      success: '#66BB6A',
      successBackground: '#1B5E20',
      error: '#EF5350',
      errorBackground: '#B71C1C',
      warning: '#FFA726',
      warningBackground: '#E65100',
      info: '#42A5F5',
      infoBackground: '#0D47A1',
    },

    button: {
      primary: '#42A5F5',
      primaryText: '#FFFFFF',
      secondary: '#2C2C2C',
      secondaryText: '#FFFFFF',
      disabled: '#333333',
      disabledText: '#666666',
    },
  },
};

export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const elevation = {
  none: {
    elevation: 0,
    shadowColor: 'transparent',
  },
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  xl: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
};

/**
 * Get theme colors based on current mode
 * @param {boolean} isDark - Whether dark mode is active
 * @returns {object} Theme colors
 */
export const getTheme = (isDark = false) => {
  return {
    colors: isDark ? colors.dark : colors.light,
    calculatorColors: colors.calculators,
    typography,
    spacing,
    borderRadius,
    elevation,
    isDark,
  };
};

/**
 * Common component styles that can be shared
 */
export const commonStyles = {
  // Screen container
  screen: {
    flex: 1,
  },

  // Content container with padding
  container: {
    padding: spacing.base,
  },

  // Card styles
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },

  // Header styles
  header: {
    paddingTop: 54, // Status bar offset
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.base,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },

  // Button styles
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input styles
  input: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    fontSize: typography.fontSize.base,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  elevation,
  getTheme,
  commonStyles,
};
