import React from 'react';
import { useColorScheme, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Theme, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { useRouter } from 'expo-router';

interface MentorCardProps {
  id: string;
  name: string;
  role: string;
  rating: number;
  experience?: string;
  skills?: string[];
  image?: string;
  fullWidth?: boolean;
}

export const MentorCard: React.FC<MentorCardProps> = ({ 
  id, name, role, rating, experience, skills, image, fullWidth 
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  const handlePress = () => {
    router.push(`/mentor/${id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }, fullWidth && styles.fullWidthCard] as any}
      onPress={handlePress}
    >
      <View style={styles.topSection}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colorScheme === 'dark' ? 'rgba(10, 126, 164, 0.2)' : '#F0F8FF' }]}>
          <IconSymbol name="person.fill" size={fullWidth ? 40 : 30} color={Theme.colors.primary} />
        </View>
        <View style={styles.info}>
          <ThemedText type="defaultSemiBold" style={[styles.name, { color: themeColors.text }]}>{name}</ThemedText>
          <ThemedText style={[styles.role, { color: themeColors.text + '99' }]}>{role}</ThemedText>
          {fullWidth && experience && (
            <ThemedText style={styles.experience}>{experience} experience</ThemedText>
          )}
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={12} color="#FFD700" />
            <ThemedText style={[styles.ratingText, { color: themeColors.text }]}>{rating}</ThemedText>
          </View>
        </View>
      </View>

      {fullWidth && skills && (
        <View style={styles.skillsContainer}>
          {skills.slice(0, 3).map(skill => (
            <View key={skill} style={[styles.skillBadge, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#F5F7F9' }]}>
              <ThemedText style={[styles.skillText, { color: themeColors.text + '80' }]}>{skill}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {fullWidth && (
        <TouchableOpacity style={styles.connectButton}>
          <ThemedText style={styles.connectButtonText}>Connect / Book</ThemedText>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fullWidthCard: {
    width: '100%',
    marginRight: 0,
    marginBottom: 16,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
  },
  role: {
    fontSize: 12,
    opacity: 0.6,
  },
  experience: {
    fontSize: 12,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  skillBadge: {
    backgroundColor: '#F5F7F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 11,
    color: '#666',
  },
  connectButton: {
    backgroundColor: '#0a7ea4',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
