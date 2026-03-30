import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Theme, Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    interests: '',
    skillsToLearn: '',
    skillsToTeach: '',
    schoolName: '',
    grade: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/auth/profile/${user.id}`);
        if (response.success) {
          const p = response.profile || {};
          setFormData({
            fullName: user.name || '',
            bio: p.bio || '',
            interests: p.interests || '',
            skillsToLearn: p.skills_to_learn || '',
            skillsToTeach: p.skills_to_teach || '',
            schoolName: p.school_name || '',
            grade: p.grade || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await api.put('/auth/profile', {
        userId: user?.id,
        ...formData
      });

      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>Edit Profile</ThemedText>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : (
            <ThemedText style={styles.saveText}>Save</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Your full name"
            placeholderTextColor={themeColors.text + '40'}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Bio</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline
            numberOfLines={4}
            placeholder="Tell us about yourself..."
            placeholderTextColor={themeColors.text + '40'}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Interests (comma separated)</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
            value={formData.interests}
            onChangeText={(text) => setFormData({ ...formData, interests: text })}
            placeholder="e.g. Blockchain, AI, Design"
            placeholderTextColor={themeColors.text + '40'}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Skills to Learn</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
            value={formData.skillsToLearn}
            onChangeText={(text) => setFormData({ ...formData, skillsToLearn: text })}
            placeholder="What do you want to learn?"
            placeholderTextColor={themeColors.text + '40'}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Skills to Teach</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
            value={formData.skillsToTeach}
            onChangeText={(text) => setFormData({ ...formData, skillsToTeach: text })}
            placeholder="What can you teach others?"
            placeholderTextColor={themeColors.text + '40'}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>School / Organization</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
            value={formData.schoolName}
            onChangeText={(text) => setFormData({ ...formData, schoolName: text })}
            placeholder="Where do you study/work?"
            placeholderTextColor={themeColors.text + '40'}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.label}>Grade / Level</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.surface }]}
            value={formData.grade}
            onChangeText={(text) => setFormData({ ...formData, grade: text })}
            placeholder="e.g. Sophomore, Year 3"
            placeholderTextColor={themeColors.text + '40'}
          />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  saveText: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});
