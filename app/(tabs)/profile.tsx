import React, { useState, useCallback } from 'react';
import { useColorScheme, StyleSheet, ScrollView, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Badge } from '@/components/ui/Badge';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [sessionCount, setSessionCount] = useState(0);

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) return;
    try {
      // Fetch profile
      const profRes = await api.get(`/auth/profile/${user.id}`);
      if (profRes.success) {
        setProfileData(profRes.profile);
      }

      // Fetch sessions to count
      const sessRes = await api.get('/sessions');
      if (sessRes.success) {
        setSessionCount(sessRes.data.length);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [fetchProfileData])
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSettingPress = (name: string) => {
    Alert.alert(name, `${name} feature coming soon!`);
  };

  const STATS = [
    { label: 'Sessions', value: sessionCount.toString(), icon: 'bubble.left.fill', color: Theme.colors.secondary, lightColor: 'rgba(156, 39, 176, 0.1)' },
    { label: 'Certificates', value: profileData?.certificates_count || '0', icon: 'star.fill', color: Theme.colors.accent, lightColor: 'rgba(255, 152, 0, 0.1)' },
    { label: 'Skill Points', value: profileData?.points || '0', icon: 'bolt.fill', color: Theme.colors.success, lightColor: 'rgba(76, 175, 80, 0.1)' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <LinearGradient
          colors={colorScheme === 'dark' ? ['#0a3d4d', '#151718'] : ['#e0f2f7', '#FFFFFF']}
          style={[styles.header, { borderBottomColor: themeColors.border }]}
        >
          <View style={[styles.avatarLarge, { backgroundColor: colorScheme === 'dark' ? 'rgba(10, 126, 164, 0.2)' : '#F0F8FF', borderColor: themeColors.surface }]}>
            <IconSymbol name="person.fill" size={60} color={Theme.colors.primary} />
            <TouchableOpacity style={styles.cameraIcon}>
               <IconSymbol name="camera.fill" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={[styles.name, { color: themeColors.text }]}>{user?.name || 'User Name'}</ThemedText>
          <ThemedText style={[styles.email, { color: themeColors.text + '99' }]}>{user?.email || 'user@example.com'}</ThemedText>
          
          <TouchableOpacity style={styles.editButton} onPress={() => router.push('/profile/edit' as any)}>
            <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          {STATS.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: themeColors.surface }]}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.lightColor }]}>
                <IconSymbol name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <ThemedText style={[styles.statValue, { color: themeColors.text }]}>{stat.value}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: themeColors.text + '80' }]}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Interests & Skills */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Interests & Skills</ThemedText>
          <View style={styles.tagGrid}>
            {(profileData?.interests || profileData?.skills_to_learn || "Blockchain, Web3, React Native")
              .split(',')
              .map((skill: string) => skill.trim())
              .filter((skill: string) => skill.length > 0)
              .map((skill: string, index: number) => (
                <Badge key={`${skill}-${index}`} label={skill} variant="secondary" />
              ))}
          </View>
        </View>

        {/* Mentor Tools (Conditional) */}
        {user?.role === 'mentor' && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Mentor Tools</ThemedText>
            <View style={[styles.optionsCard, { backgroundColor: themeColors.surface }]}>
              <TouchableOpacity style={styles.optionItem}>
                <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                  <IconSymbol name="calendar" size={18} color={Theme.colors.accent} />
                </View>
                <ThemedText style={styles.optionLabel}>Manage Availability</ThemedText>
                <IconSymbol name="chevron.right" size={16} color={themeColors.text + '40'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem}>
                <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                  <IconSymbol name="person.2.fill" size={18} color={Theme.colors.success} />
                </View>
                <ThemedText style={styles.optionLabel}>My Mentees</ThemedText>
                <IconSymbol name="chevron.right" size={16} color={themeColors.text + '40'} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Account Options */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Account Settings</ThemedText>
          <View style={[styles.optionsCard, { backgroundColor: themeColors.surface }]}>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleSettingPress('Notifications')}>
              <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(10, 126, 164, 0.1)' }]}>
                <IconSymbol name="bell.fill" size={18} color={Theme.colors.primary} />
              </View>
              <ThemedText style={styles.optionLabel}>Notifications</ThemedText>
              <IconSymbol name="chevron.right" size={16} color={themeColors.text + '40'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleSettingPress('Privacy Settings')}>
              <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <IconSymbol name="paperplane.fill" size={18} color={Theme.colors.secondary} />
              </View>
              <ThemedText style={styles.optionLabel}>Privacy Settings</ThemedText>
              <IconSymbol name="chevron.right" size={16} color={themeColors.text + '40'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleSettingPress('Help & Support')}>
              <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <IconSymbol name="questionmark.circle.fill" size={18} color={Theme.colors.success} />
              </View>
              <ThemedText style={styles.optionLabel}>Help & Support</ThemedText>
              <IconSymbol name="chevron.right" size={16} color={themeColors.text + '40'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="paperplane.fill" size={20} color="#FF5252" />
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#fff',
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0a7ea4',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 20,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0a7ea4',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -30,
    zIndex: 10,
    marginBottom: 32,
  },
  statCard: {
    width: '30%',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionsCard: {
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    gap: 10,
    marginBottom: 40,
  },
  logoutText: {
    color: '#FF5252',
    fontWeight: '700',
    fontSize: 16,
  },
});
