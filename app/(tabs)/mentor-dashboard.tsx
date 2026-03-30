import React, { useEffect } from 'react';
import { useColorScheme, StyleSheet, ScrollView, View, TouchableOpacity, ViewStyle, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LinearGradient } from 'expo-linear-gradient';

export default function MentorDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  useEffect(() => {
    if (user && !user.onboardingData) {
      router.replace('/mentor-onboarding');
    }
  }, [user]);

  const isPending = user?.isApproved === false;
 
  // TODO: Fetch real upcoming sessions from backend
  const UPCOMING_SESSIONS = [
    { id: '1', mentee: 'Alex Johnson', topic: 'Blockchain Architecture', time: 'Today, 5:30 PM', type: 'Video Call' },
    { id: '2', mentee: 'Sarah Miller', topic: 'UI Design Review', time: 'Tomorrow, 10:00 AM', type: 'Chat' },
  ];
 
  // TODO: Fetch real mentee list from /api/mentor/connections
  const MENTEES = [
    { id: '1', name: 'Alex Johnson', progress: 85, focus: 'Blockchain' },
    { id: '2', name: 'Sarah Miller', progress: 45, focus: 'UX Design' },
    { id: '3', name: 'David Chen', progress: 20, focus: 'React Native' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#2E1065', '#151718'] : ['#F3E8FF', '#FFFFFF']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
              <ThemedText type="title" style={styles.name}>{user?.name || 'Mentor'}</ThemedText>
            </View>
            <TouchableOpacity style={[styles.profileButton, { backgroundColor: themeColors.surface }]}>
              <IconSymbol name="bell.fill" size={24} color={Theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <Card variant="flat" style={styles.statCard}>
              <ThemedText style={styles.statValue}>12</ThemedText>
              <ThemedText style={styles.statLabel}>Active Mentees</ThemedText>
            </Card>
            <Card variant="flat" style={styles.statCard}>
              <ThemedText style={styles.statValue}>24</ThemedText>
              <ThemedText style={styles.statLabel}>Total Hours</ThemedText>
            </Card>
            <Card variant="flat" style={styles.statCard}>
              <ThemedText style={styles.statValue}>4.9</ThemedText>
              <ThemedText style={styles.statLabel}>Rating</ThemedText>
            </Card>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Upcoming Sessions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">Upcoming Sessions</ThemedText>
              <TouchableOpacity><ThemedText style={{ color: Theme.colors.primary }}>View All</ThemedText></TouchableOpacity>
            </View>
            {UPCOMING_SESSIONS.map(session => (
              <Card key={session.id} variant="elevated" style={styles.sessionCard}>
                <View style={styles.sessionInfo}>
                  <View style={[styles.typeIcon, { backgroundColor: session.type === 'Video Call' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(10, 126, 164, 0.1)' }]}>
                    <IconSymbol 
                      name={session.type === 'Video Call' ? 'video.fill' : 'message.fill'} 
                      size={20} 
                      color={session.type === 'Video Call' ? Theme.colors.success : Theme.colors.primary} 
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold">{session.mentee}</ThemedText>
                    <ThemedText style={styles.sessionTime}>{session.topic} • {session.time}</ThemedText>
                  </View>
                  <TouchableOpacity style={styles.joinButton}>
                    <ThemedText style={styles.joinText}>Join</ThemedText>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>

          {/* My Mentees */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">My Mentees</ThemedText>
            </View>
            {MENTEES.map(mentee => (
              <TouchableOpacity key={mentee.id}>
                <Card variant="flat" style={styles.menteeCard}>
                  <View style={styles.menteeRow}>
                    <View style={[styles.avatarSmall, { backgroundColor: themeColors.border }]}>
                      <IconSymbol name="person.fill" size={20} color={themeColors.text + '60'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText type="defaultSemiBold">{mentee.name}</ThemedText>
                      <ThemedText style={styles.menteeFocus}>{mentee.focus}</ThemedText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <ThemedText style={styles.progressText}>{mentee.progress}%</ThemedText>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${mentee.progress}%` }]} />
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Pending Approval Overlay */}
      {isPending && (
        <View style={[styles.pendingOverlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)' }]}>
          <IconSymbol name="hourglass" size={60} color={Theme.colors.warning} />
          <ThemedText type="subtitle" style={styles.pendingTitle}>Application Pending</ThemedText>
          <ThemedText style={styles.pendingText}>
            Your profile is currently being reviewed by our administrators. You'll be visible to students once approved.
          </ThemedText>
          <TouchableOpacity style={styles.supportButton}>
            <ThemedText style={{ color: Theme.colors.primary, fontWeight: '600' }}>Contact Support</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: { fontSize: 16, opacity: 0.7 },
  name: { fontSize: 28, fontWeight: '700' },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 10, opacity: 0.6, marginTop: 2 },
  content: { padding: 20 },
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionCard: {
    padding: 16,
    marginBottom: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionTime: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  joinButton: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  joinText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  menteeCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  menteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menteeFocus: { fontSize: 12, opacity: 0.6 },
  progressText: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  progressBarBg: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.success,
  },
  pendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    zIndex: 1000,
  },
  pendingTitle: { marginTop: 24, marginBottom: 12 },
  pendingText: { textAlign: 'center', opacity: 0.6, lineHeight: 20 },
  supportButton: { marginTop: 32, padding: 12 },
});
