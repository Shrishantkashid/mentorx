import React from 'react';
import { useColorScheme, StyleSheet, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useCareer } from '@/context/CareerContext';
import { Theme, Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const { width } = Dimensions.get('window');

// Removed DEFAULT_STEPS fallback to respect user preference

export default function CareerRoadmapScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  const { goal, roadmap, skills } = useCareer();

  const activeRoadmap = roadmap || [];
  const activeSkills = skills.length > 0 ? skills : ['General Guidance', 'Career Planning'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Theme.colors.secondary, '#673AB7']}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>Career Roadmap</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Goal: {goal}</ThemedText>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '33%' }]} />
            </View>
            <ThemedText style={styles.progressText}>Step 2 of {activeRoadmap.length}</ThemedText>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Timeline */}
          <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: themeColors.text }]}>Your Learning Path</ThemedText>
          <View style={styles.timeline}>
            {activeRoadmap.length > 0 ? activeRoadmap.map((step: any, index: number) => (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineDot,
                    { backgroundColor: themeColors.border },
                    step.status === 'completed' && styles.dotCompleted,
                    step.status === 'current' && styles.dotCurrent,
                  ]}>
                    {step.status === 'completed' && <IconSymbol name="checklist" size={14} color="#fff" />}
                  </View>
                  {index !== activeRoadmap.length - 1 && <View style={[styles.timelineLine, { backgroundColor: themeColors.border }]} />}
                </View>
                <Card 
                  variant={step.status === 'current' ? 'elevated' : 'flat'} 
                  style={[styles.timelineContent, { backgroundColor: themeColors.surface }, step.status === 'upcoming' && styles.upcomingContent] as any}
                >
                  <View style={styles.stepHeader}>
                    <ThemedText type="defaultSemiBold" style={[styles.stepTitle, { color: themeColors.text }]}>{step.title}</ThemedText>
                    {step.status === 'current' && <Badge label="ACTIVE" variant="primary" />}
                  </View>
                  <ThemedText style={[styles.stepDescription, { color: themeColors.text + '99' }]}>{step.description}</ThemedText>
                </Card>
              </View>
            )) : (
              <Card variant="flat" style={[styles.emptyRoadmap, { backgroundColor: themeColors.surface, borderColor: themeColors.border }] as any}>
                <IconSymbol name="map.fill" size={40} color={themeColors.text + '20'} />
                <ThemedText style={[styles.emptyText, { color: themeColors.text + '60' }]}>No roadmap generated yet.</ThemedText>
                <TouchableOpacity style={styles.createButton} onPress={() => router.push('/ai-assistant' as any)}>
                   <ThemedText style={styles.createButtonText}>Generate with AI Assistant</ThemedText>
                </TouchableOpacity>
              </Card>
            )}
          </View>

          {/* Recommended Skills */}
          <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: themeColors.text }]}>Recommended Skills</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.skillsScroll}>
            {activeSkills.map(skill => (
              <Card key={skill} variant="elevated" padding="sm" style={[styles.skillCard, { backgroundColor: themeColors.surface }] as any}>
                <IconSymbol name="star.fill" size={16} color={Theme.colors.secondary} />
                <ThemedText style={[styles.skillText, { color: themeColors.text }]}>{skill}</ThemedText>
              </Card>
            ))}
          </ScrollView>

          {/* Mentors Section */}
          <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: themeColors.text }]}>Mentor Support</ThemedText>
          <Card variant="glass" style={[styles.mentorCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(156, 39, 176, 0.05)' }] as any}>
            <View style={styles.mentorAvatar}>
              <IconSymbol name="person.2.fill" size={24} color={Theme.colors.secondary} />
            </View>
            <View style={styles.mentorInfo}>
              <ThemedText type="defaultSemiBold" style={{ color: themeColors.text }}>Connected Learning</ThemedText>
              <ThemedText style={[styles.mentorBio, { color: themeColors.text + '99' }]}>Find experts specialized in {goal || 'your career goal'} to accelerate your progress.</ThemedText>
            </View>
            <TouchableOpacity style={styles.connectBtn} onPress={() => router.push('/mentors')}>
              <IconSymbol name="chevron.right" size={20} color={Theme.colors.secondary} />
            </TouchableOpacity>
          </Card>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 16,
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  content: {
    padding: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    marginTop: 8,
  },
  timeline: {
    marginBottom: 32,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 30,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dotCompleted: {
    backgroundColor: Theme.colors.success,
  },
  dotCurrent: {
    backgroundColor: Theme.colors.secondary,
    borderWidth: 3,
    borderColor: 'rgba(156, 39, 176, 0.2)',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
  },
  upcomingContent: {
    opacity: 0.7,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  skillsScroll: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 16,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text,
    marginLeft: 8,
  },
  mentorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mentorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorBio: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
  connectBtn: {
    padding: 8,
  },
  emptyRoadmap: {
    alignItems: 'center',
    padding: 30,
    gap: 12,
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
