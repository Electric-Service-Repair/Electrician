/**
 * CalculatorButton Component
 *
 * Reusable button for calculator actions (Calculate, Reset, etc.)
 * Supports primary, secondary, and danger variants.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { spacing, borderRadius, typography } from '../theme';

const CalculatorButton = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'danger'
  color = '#1565C0',
  loading = false,
  style = {},
  textStyle = {},
  ...props
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      return [styles.button, styles.buttonDisabled, style];
    }

    switch (variant) {
      case 'secondary':
        return [styles.button, styles.buttonSecondary, style];
      case 'danger':
        return [styles.button, styles.buttonDanger, style];
      case 'primary':
      default:
        return [styles.button, { backgroundColor: color }, style];
    }
  };

  const getTextStyle = () => {
    if (disabled) {
      return [styles.buttonText, styles.buttonTextDisabled, textStyle];
    }

    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.buttonTextSecondary, textStyle];
      case 'danger':
        return [styles.buttonText, styles.buttonTextDanger, textStyle];
      case 'primary':
      default:
        return [styles.buttonText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },

  // Disabled state
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonTextDisabled: {
    color: '#fff',
  },

  // Secondary variant
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  buttonTextSecondary: {
    color: '#333',
  },

  // Danger variant
  buttonDanger: {
    backgroundColor: '#C62828',
  },
  buttonTextDanger: {
    color: '#fff',
  },
});

export default CalculatorButton;
