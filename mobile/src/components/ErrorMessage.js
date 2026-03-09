/**
 * ErrorMessage Component
 *
 * Reusable component for displaying validation errors and warnings.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, borderRadius, typography } from '../theme';

const ErrorMessage = ({
  message,
  type = 'error', // 'error', 'warning', 'info'
  visible = true,
  style = {}
}) => {
  if (!visible || !message) {
    return null;
  }

  const getContainerStyle = () => {
    switch (type) {
      case 'warning':
        return [styles.container, styles.warningContainer, style];
      case 'info':
        return [styles.container, styles.infoContainer, style];
      case 'error':
      default:
        return [styles.container, styles.errorContainer, style];
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'warning':
        return [styles.text, styles.warningText];
      case 'info':
        return [styles.text, styles.infoText];
      case 'error':
      default:
        return [styles.text, styles.errorText];
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'error':
      default:
        return '⚠️';
    }
  };

  return (
    <View
      style={getContainerStyle()}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={getTextStyle()}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  // Error variant
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#C62828',
  },

  // Warning variant
  warningContainer: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  warningText: {
    color: '#E65100',
  },

  // Info variant
  infoContainer: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  infoText: {
    color: '#1565C0',
  },

  icon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});

export default ErrorMessage;
