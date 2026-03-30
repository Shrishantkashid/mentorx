import React, { useState, useEffect } from 'react';
import { useColorScheme, StyleSheet, ScrollView, View, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Theme, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mentorService, Mentor } from '@/services/mentorService';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminDashboardScreen() {
  const { logout } = useAuth();
  const [pendingMentors, setPendingMentors] = useState<Mentor[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setIsLoading(true);
    try {
      const all = await mentorService.getMentors(undefined, undefined, true);
      setPendingMentors(all.filter(m => !m.isApproved));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, name: string) => {
    const success = await mentorService.approveMentor(id);
    if (success) {
      Alert.alert('Approved', `${name} has been approved and is now visible to students.`);
      loadPending();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#065f46', '#151718'] : ['#ecfdf5', '#FFFFFF']}
          style={styles.header}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <ThemedText style={styles.headerLabel}>Admin Console</ThemedText>
              <ThemedText type="title">System Overview</ThemedText>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <IconSymbol name="paperplane.fill" size={20} color="#FF5252" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>128</ThemedText>
              <ThemedText style={styles.metricLabel}>Total Users</ThemedText>
            </View>
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>42</ThemedText>
              <ThemedText style={styles.metricLabel}>Mentors</ThemedText>
            </View>
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>{pendingMentors.length}</ThemedText>
              <ThemedText style={styles.metricLabel}>Pending</ThemedText>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Mentor Approvals</ThemedText>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={Theme.colors.primary} style={{ marginTop: 40 }} />
          ) : pendingMentors.length === 0 ? (
            <Card variant="flat" style={styles.emptyCard}>
              <IconSymbol name="checkmark.circle.fill" size={48} color={Theme.colors.success} />
              <ThemedText style={styles.emptyText}>All mentor applications processed!</ThemedText>
            </Card>
          ) : (
            pendingMentors.map(mentor => (
              <Card key={mentor.id} variant="elevated" style={styles.mentorCard}>
                <View style={styles.mentorHeader}>
                  <View style={styles.avatar}>
                    <IconSymbol name="person.fill" size={24} color={Theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold">{mentor.name}</ThemedText>
                    <ThemedText style={styles.roleText}>{mentor.role} • {mentor.category}</ThemedText>
                  </View>
                  <Badge label="Pending" variant="warning" />
                </View>
                
                <View style={styles.skillsRow}>
                   {mentor.skills.map(s => <Badge key={s} label={s} variant="neutral" />)}
                </View>

                <View style={[styles.actionRow, { marginTop: 12 }]}>
                  <TouchableOpacity 
                    style={[styles.inspectButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
                    onPress={() => setExpandedId(expandedId === mentor.id ? null : mentor.id)}
                  >
                    <ThemedText style={{ color: themeColors.text }}>{expandedId === mentor.id ? 'Hide Info' : 'Inspect'}</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton}>
                    <ThemedText style={styles.rejectText}>Decline</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => handleApprove(mentor.id, mentor.name)}
                  >
                    <ThemedText style={styles.approveText}>Approve</ThemedText>
                  </TouchableOpacity>
                </View>

                {expandedId === mentor.id && (
                  <View style={styles.expandedInfo}>
                    <ThemedText type="defaultSemiBold" style={{ marginTop: 10 }}>Verification Details:</ThemedText>
                    <ThemedText style={styles.infoText}>• Experience: {mentor.onboardingData?.yearsExperience || 'Not provided'} years</ThemedText>
                    <ThemedText style={styles.infoText}>• Focus: {mentor.onboardingData?.specialization || 'Not provided'}</ThemedText>
                    <TouchableOpacity onPress={() => mentor.onboardingData?.linkedin && Linking.openURL(mentor.onboardingData.linkedin)}>
                      <ThemedText style={[styles.linkText, { color: Theme.colors.primary }]}>🔗 LinkedIn Profile</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => mentor.onboardingData?.portfolio && Linking.openURL(mentor.onboardingData.portfolio)}>
                      <ThemedText style={[styles.linkText, { color: Theme.colors.primary }]}>🌐 Portfolio Website</ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            ))
          )}
        </View>
      </ScrollView>
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
  headerLabel: { fontSize: 14, opacity: 0.6, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 32,
  },
  metric: { alignItems: 'flex-start' },
  metricValue: { fontSize: 24, fontWeight: '800' },
  metricLabel: { fontSize: 12, opacity: 0.6 },
  content: { padding: 20 },
  sectionTitle: { marginBottom: 16 },
  mentorCard: { padding: 16, marginBottom: 16 },
  mentorHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' },
  roleText: { fontSize: 12, opacity: 0.6 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 8 },
  approveButton: { flex: 2, backgroundColor: Theme.colors.success, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  approveText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  rejectButton: { flex: 1, backgroundColor: 'rgba(255,82,82,0.1)', padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: '#FF5252', fontWeight: '600', fontSize: 13 },
  inspectButton: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, justifyContent: 'center' },
  logoutBtn: { backgroundColor: 'rgba(255,82,82,0.1)', padding: 10, borderRadius: 12 },
  expandedInfo: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  infoText: { fontSize: 13, opacity: 0.8, marginTop: 4 },
  linkText: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  emptyCard: { padding: 40, alignItems: 'center', gap: 16, borderStyle: 'dotted', borderWidth: 2, borderColor: '#ddd' },
  emptyText: { opacity: 0.5, textAlign: 'center' },
});
