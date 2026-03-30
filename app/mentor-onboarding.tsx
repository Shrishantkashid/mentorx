import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Theme, Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

export default function MentorOnboardingScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!linkedin || !yearsExperience || !specialization) {
      Alert.alert('Required Fields', 'Please fill in LinkedIn, Experience, and Specialization.');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would be an API call to update the mentor's profile
      const onboardingData = {
        linkedin,
        portfolio,
        yearsExperience,
        specialization,
        appliedAt: new Date().toISOString(),
      };

      // Mock update
      if (updateUser) {
        updateUser({ ...user!, onboardingData });
      }

      Alert.alert(
        'Application Submitted',
        'Thank you! Your application is now pending admin approval. You will be notified once you are approved to mentor students.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/mentor-dashboard') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit onboarding data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient colors={['#2E1065', '#4C1D95']} style={styles.header}>
         <ThemedText type="title" style={styles.headerTitle}>Professional Verification</ThemedText>
         <ThemedText style={styles.headerSubtitle}>Complete your profile to get approved</ThemedText>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <ThemedText type="defaultSemiBold" style={styles.inputLabel}>LinkedIn Profile *</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="https://linkedin.com/in/yourprofile"
            value={linkedin}
            onChangeText={setLinkedin}
            placeholderTextColor="#999"
          />

          <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Portfolio or Website</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="https://yourportfolio.com"
            value={portfolio}
            onChangeText={setPortfolio}
            placeholderTextColor="#999"
          />

          <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Years of Experience *</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5"
            value={yearsExperience}
            onChangeText={setYearsExperience}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />

          <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Specialization *</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Blockchain Security, Mobile Dev"
            value={specialization}
            onChangeText={setSpecialization}
            placeholderTextColor="#999"
          />

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.submitText}>Submit for Review</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: { color: '#fff' },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', marginTop: 8 },
  scrollContent: { padding: 20 },
  form: { marginTop: 10 },
  inputLabel: { marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: '#f5f7f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  submitText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
