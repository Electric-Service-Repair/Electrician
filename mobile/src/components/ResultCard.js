/**
 * ResultCard Component
 *
 * Reusable card for displaying calculation results with proper formatting.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, borderRadius, elevation, typography } from '../theme';

const ResultCard = ({
  title,
  results = [],
  color = '#4CAF50',
  style = {},
  visible = true
}) => {
  if (!visible || results.length === 0) {
    return null;
  }

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Results for ${title}`}
    >
      <Text style={styles.title}>{title}</Text>

      {results.map((result, index) => (
        <ResultItem
          key={index}
          label={result.label}
          value={result.value}
          unit={result.unit}
          color={color}
          isLast={index === results.length - 1}
        />
      ))}
    </View>
  );
};

/**
 * ResultItem - Individual result row within ResultCard
 */
const ResultItem = ({ label, value, unit, color, isLast }) => (
  <View
    style={[
      styles.resultItem,
      !isLast && styles.resultItemBorder,
      { borderLeftColor: color }
    ]}
  >
    <Text style={styles.resultLabel}>{label}</Text>
    <View style={styles.resultValueContainer}>
      <Text style={[styles.resultValue, { color }]}>{value}</Text>
      {unit && <Text style={styles.resultUnit}>{unit}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: '#4CAF50',
    ...elevation.sm,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#2E7D32',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    borderLeftWidth: 4,
  },
  resultItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  resultLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#333',
    flex: 1,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  resultValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.xs,
  },
  resultUnit: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#666',
  },
});

export default ResultCard;
