import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ScreenHeader } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';

const RESOURCES = [
  {
    title: 'Voltage Drop Explained',
    description: 'A deep dive into NEC standards, calculation methods, and why voltage drop matters for safety and efficiency.',
    url: 'https://www.youtube.com/watch?v=3t5hK96Qaco',
    type: 'Video',
  },
  // Add more resources here later
];

const ResourcesScreen = ({ onBack }) => {
  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Learning Resources" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.introText}>
          Enhance your electrical knowledge with these curated guides and videos.
        </Text>
        
        {RESOURCES.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.card}
            onPress={() => handleOpenLink(item.url)}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.linkText}>Watch on YouTube →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.m },
  introText: { 
    ...typography.body, 
    color: colors.textSecondary, 
    marginBottom: spacing.l 
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: borderRadius.m,
    marginBottom: spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    elevation: 2,
  },
  badge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.s,
    borderRadius: borderRadius.s,
    marginBottom: spacing.s,
  },
  badgeText: { ...typography.caption, color: '#fff', fontWeight: 'bold' },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.s },
  cardDescription: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.s },
  linkText: { ...typography.body, color: colors.primary, fontWeight: 'bold' },
});

export default ResourcesScreen;
