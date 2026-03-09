/**
 * InfoSection Component
 *
 * Reusable section for displaying reference materials, formulas, and educational content.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing, borderRadius, elevation, typography } from '../theme';

const InfoSection = ({
  title,
  children,
  collapsible = false,
  defaultExpanded = true,
  backgroundColor = '#fff',
  style = {}
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <TouchableOpacity
        onPress={toggleExpanded}
        disabled={!collapsible}
        activeOpacity={collapsible ? 0.7 : 1}
        accessible={true}
        accessibilityRole={collapsible ? "button" : "none"}
        accessibilityState={collapsible ? { expanded } : {}}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {collapsible && (
            <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

/**
 * InfoItem - For displaying individual info items within InfoSection
 */
export const InfoItem = ({ label, value, style = {} }) => (
  <View style={[styles.infoItem, style]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/**
 * InfoText - For displaying formatted text within InfoSection
 */
export const InfoText = ({ children, style = {} }) => (
  <Text style={[styles.infoText, style]}>{children}</Text>
);

/**
 * InfoFormula - For displaying formulas within InfoSection
 */
export const InfoFormula = ({ formula, style = {} }) => (
  <View style={[styles.formulaContainer, style]}>
    <Text style={styles.formulaText}>{formula}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
    ...elevation.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#333',
    flex: 1,
  },
  chevron: {
    fontSize: typography.fontSize.base,
    color: '#666',
    marginLeft: spacing.sm,
  },
  content: {
    marginTop: spacing.md,
  },

  // InfoItem styles
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#666',
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: '#333',
  },

  // InfoText styles
  infoText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
    color: '#666',
    marginBottom: spacing.sm,
  },

  // InfoFormula styles
  formulaContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  formulaText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#1565C0',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default InfoSection;
