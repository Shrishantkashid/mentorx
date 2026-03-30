import React, { useState, useEffect } from 'react';
import { useColorScheme, StyleSheet, ScrollView, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Theme, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mentorService, Mentor } from '@/services/mentorService';

export default function MentorProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  const [mentor, setMentor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentor = async () => {
      if (!id) return;
      try {
        const data = await mentorService.getMentorById(id as string);
        if (data) {
          setMentor(data);
        } else {
          setError('Mentor not found');
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </ThemedView>
    );
  }

  if (error || !mentor) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error || 'Something went wrong'}</ThemedText>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: themeColors.surface }]} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={{ color: themeColors.text }}>Mentor Profile</ThemedText>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: themeColors.surface }]}>
            <IconSymbol name="paperplane.fill" size={20} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarLarge, { backgroundColor: colorScheme === 'dark' ? 'rgba(10, 126, 164, 0.2)' : '#F0F8FF', borderColor: themeColors.surface }]}>
              <IconSymbol name="person.fill" size={60} color={Theme.colors.primary} />
            </View>
            <View style={[styles.ratingBadge, { backgroundColor: themeColors.surface }]}>
              <IconSymbol name="star.fill" size={14} color="#FFD700" />
              <ThemedText style={[styles.ratingText, { color: themeColors.text }]}>{mentor.rating}</ThemedText>
            </View>
          </View>
          
          <ThemedText type="title" style={[styles.name, { color: themeColors.text }]}>{mentor.name}</ThemedText>
          <ThemedText style={[styles.role, { color: themeColors.text + '99' }]}>{mentor.role}</ThemedText>
          <View style={[styles.experienceBadge, { backgroundColor: colorScheme === 'dark' ? 'rgba(10, 126, 164, 0.2)' : '#E6F3F7' }]}>
            <ThemedText style={[styles.experienceText, { color: Theme.colors.primary }]}>{mentor.experience} Exp</ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.chatButton]}
            onPress={() => router.push(`/chat/${id}`)}
          >
            <IconSymbol name="message.fill" size={20} color="#fff" />
            <ThemedText style={styles.buttonText}>Chat</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.videoButton]}
            onPress={() => router.push(`/video/${id}`)}
          >
            <IconSymbol name="video.fill" size={20} color="#fff" />
            <ThemedText style={styles.buttonText}>Video</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.bookButton]}>
            <ThemedText style={styles.buttonText}>Book Session</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>About</ThemedText>
          <ThemedText style={styles.bioText}>{mentor.bio}</ThemedText>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: themeColors.text }]}>Skills</ThemedText>
          <View style={styles.skillsGrid}>
            {mentor.skills?.map((skill: string) => (
              <View key={skill} style={[styles.skillBadge, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                <ThemedText style={[styles.skillText, { color: themeColors.text }]}>{skill}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: themeColors.text }]}>Availability</ThemedText>
          {mentor.availability?.map((time: string) => (
            <View key={time} style={[styles.timeSlot, { backgroundColor: themeColors.surface }]}>
              <IconSymbol name="calendar" size={16} color={Theme.colors.primary} />
              <ThemedText style={[styles.timeText, { color: themeColors.text + '99' }]}>{time}</ThemedText>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: themeColors.text }]}>Reviews</ThemedText>
            <TouchableOpacity><ThemedText style={[styles.viewAll, { color: Theme.colors.primary }]}>See All</ThemedText></TouchableOpacity>
          </View>
          {mentor.reviews?.map((review: any) => (
            <View key={review.id} style={[styles.reviewCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
              <View style={styles.reviewHeader}>
                <ThemedText style={[styles.reviewUser, { color: themeColors.text }]}>{review.user}</ThemedText>
                <View style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <IconSymbol key={s} name="star.fill" size={12} color={s <= review.rating ? "#FFD700" : (colorScheme === 'dark' ? '#333' : '#EEE')} />
                  ))}
                </View>
              </View>
              <ThemedText style={[styles.reviewComment, { color: themeColors.text + '99' }]}>{review.comment}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  name: {
    fontSize: 26,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 12,
  },
  experienceBadge: {
    backgroundColor: '#E6F3F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  experienceText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  chatButton: {
    backgroundColor: '#4CAF50',
  },
  videoButton: {
    backgroundColor: '#2196F3',
  },
  bookButton: {
    backgroundColor: '#0a7ea4',
    flex: 1.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  viewAll: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.7,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillBadge: {
    backgroundColor: '#f5f7f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  skillText: {
    fontSize: 14,
    color: '#444',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    backgroundColor: '#F9FCFD',
    padding: 12,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 14,
    opacity: 0.8,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewUser: {
    fontWeight: '700',
    fontSize: 14,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
