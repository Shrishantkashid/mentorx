import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Theme, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/services/api';

const { width } = Dimensions.get('window');

// Real sessions will be fetched from /api/sessions

const QUICK_ACTIONS = [
  { id: '1', label: 'Find Mentor', icon: 'person.2.fill', color: Theme.colors.primary },
  { id: '2', label: 'Chat', icon: 'message.fill', color: '#4CAF50' },
  { id: '3', label: 'Roadmap', icon: 'map.fill', color: Theme.colors.secondary },
  { id: '4', label: 'Tasks', icon: 'checklist', color: Theme.colors.accent },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ lessons: 0, progress: 0, badges: 0 });

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    try {
      // Fetch sessions
      const response = await api.get('/sessions');
      if (response.success) {
        setSessions(response.data.slice(0, 3));
        
        // Count completed lessons/sessions
        const completed = response.data.filter((s: any) => s.status === 'completed' || s.status === 'confirmed').length;
        
        // Fetch profile for badges/points
        const profRes = await api.get(`/auth/profile/${user.id}`);
        const profile = profRes.profile || {};
        
        setStats({
          lessons: response.data.length,
          progress: response.data.length > 0 ? Math.round((completed / response.data.length) * 100) : 0,
          badges: profile.certificates_count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const handleQuickAction = (actionId: string) => {
    if (actionId === '1') router.push('/mentors');
    if (actionId === '2') router.push('/chat');
    if (actionId === '3') router.push('/roadmap' as any);
    if (actionId === '4') router.push('/tasks' as any);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={[styles.welcomeText, { color: themeColors.text + '99' }]}>Welcome back,</ThemedText>
            <ThemedText type="title" style={[styles.userName, { color: themeColors.text }]}>{user?.name || 'Student'} 👋</ThemedText>
          </View>
          <TouchableOpacity style={[styles.notificationBtn, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <IconSymbol name="bell.fill" size={24} color={themeColors.text} />
            <View style={[styles.notifBadge, { borderColor: themeColors.surface }]} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Card variant="flat" padding="xs" style={[styles.searchContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }] as any}>
          <IconSymbol name="magnifyingglass" size={20} color={themeColors.text + '99'} style={styles.searchIcon} />
          <TextInput
            placeholder="Search mentors, skills, or topics..."
            placeholderTextColor={themeColors.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: themeColors.text }]}
          />
        </Card>

        {/* AI Assistant Banner */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => router.push('/ai-assistant' as any)}
        >
          <LinearGradient
            colors={[Theme.colors.primary, '#005f7a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiBanner}
          >
            <View style={styles.aiBannerContent}>
              <Badge label="NEW" variant="warning" style={{ marginBottom: 8 }} />
              <ThemedText style={styles.aiBannerTitle}>AI Career Assistant</ThemedText>
              <ThemedText style={styles.aiBannerSubtitle}>Get instant guidance for your Web3 journey</ThemedText>
            </View>
            <View style={styles.aiBannerIcon}>
              <IconSymbol name="star.fill" size={28} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Quick Actions</ThemedText>
        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.actionCard}
              onPress={() => handleQuickAction(action.id)}
            >
              <Card variant="elevated" padding="md" style={[styles.actionIconContainer, { backgroundColor: themeColors.surface }] as any}>
                <IconSymbol name={action.icon as any} size={28} color={action.color} />
              </Card>
              <ThemedText style={[styles.actionLabel, { color: themeColors.text }]}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Upcoming Sessions</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        {sessions.map(session => (
          <Card key={session.id} variant="elevated" style={[styles.sessionCard, { backgroundColor: themeColors.surface }] as any}>
            <View style={styles.sessionInfo}>
              <View style={styles.sessionIcon}>
                <IconSymbol name={session.location === 'Online' ? 'video.fill' : 'message.fill'} size={20} color={Theme.colors.primary} />
              </View>
              <View>
                <ThemedText type="defaultSemiBold" style={{ color: themeColors.text }}>{session.skill?.name || 'Mentorship Session'}</ThemedText>
                <ThemedText style={[styles.sessionMentor, { color: themeColors.text + '99' }]}>
                  {session.mentor?.first_name} {session.mentor?.last_name}
                </ThemedText>
              </View>
            </View>
            <View style={styles.sessionTimeContainer}>
              <IconSymbol name="calendar" size={14} color={themeColors.text + '99'} />
              <ThemedText style={[styles.sessionTime, { color: themeColors.text + '99' }]}>
                {new Date(session.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </ThemedText>
            </View>
          </Card>
        ))}

        {sessions.length === 0 && !isLoading && (
          <Card variant="flat" style={[styles.sessionCard, { backgroundColor: themeColors.surface, justifyContent: 'center', padding: 20 }] as any}>
            <ThemedText style={{ color: themeColors.text + '80', textAlign: 'center' }}>No upcoming sessions</ThemedText>
          </Card>
        )}

        {/* Stats Card */}
        {/* TODO: Fetch real user stats from backend profile */}
        <LinearGradient
          colors={[Theme.colors.secondary, '#673AB7']}
          style={styles.statsCard}
        >
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.lessons}</ThemedText>
            <ThemedText style={styles.statLabel}>Sessions</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.progress}%</ThemedText>
            <ThemedText style={styles.statLabel}>Completion</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{stats.badges}</ThemedText>
            <ThemedText style={styles.statLabel}>Certificates</ThemedText>
          </View>
        </LinearGradient>

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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.error,
    borderWidth: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 44,
  },
  aiBanner: {
    borderRadius: Theme.borderRadius.xl,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    ...Theme.shadows.medium,
  },
  aiBannerContent: {
    flex: 1,
  },
  aiBannerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  aiBannerSubtitle: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    lineHeight: 20,
  },
  aiBannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionCard: {
    alignItems: 'center',
    width: (width - 40 - 48) / 4,
  },
  actionIconContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionMentor: {
    fontSize: 13,
  },
  sessionTimeContainer: {
    alignItems: 'flex-end',
  },
  sessionTime: {
    fontSize: 12,
    marginTop: 4,
  },
  statsCard: {
    marginTop: 20,
    borderRadius: Theme.borderRadius.xl,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
