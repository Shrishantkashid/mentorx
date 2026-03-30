import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail } from '@/utils/validators';
import { authService } from '@/services/authService';
import { Theme, Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMentorMode, setIsMentorMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  const handleSignup = async () => {
    if (name.length < 2) {
      Alert.alert('Invalid Name', 'Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.signup(name, email, password);
      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Signup Failed', 'Something went wrong during registration.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Failed to connect to backend server. Is it running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#0a7ea4', '#E6F4FE']}
        style={styles.background}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <IconSymbol name="person.2.fill" size={35} color="#0a7ea4" />
          </View>
          <ThemedText type="title" style={styles.appName}>MentorX</ThemedText>
          <ThemedText style={styles.tagline}>Start Your Success Story</ThemedText>
        </View>

        <View style={[styles.formCard, { backgroundColor: themeColors.surface }]}>
          <ThemedText type="subtitle" style={[styles.signupTitle, { color: themeColors.text }]}>Create Account</ThemedText>
          
          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f7f9', borderColor: themeColors.border }]}>
            <IconSymbol name="person.fill" size={20} color={themeColors.text + '80'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Full Name"
              placeholderTextColor={themeColors.text + '80'}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f7f9', borderColor: themeColors.border }]}>
            <IconSymbol name="envelope.fill" size={20} color={themeColors.text + '80'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Email Address"
              placeholderTextColor={themeColors.text + '80'}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f7f9', borderColor: themeColors.border }]}>
            <IconSymbol name="lock.fill" size={20} color={themeColors.text + '80'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Password"
              placeholderTextColor={themeColors.text + '80'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f7f9', borderColor: themeColors.border }]}>
            <IconSymbol name="lock.fill" size={20} color={themeColors.text + '80'} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={themeColors.text + '80'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.roleToggle, { borderColor: isMentorMode ? Theme.colors.primary : themeColors.border }]} 
            onPress={() => {
              setIsMentorMode(!isMentorMode);
              if (!isMentorMode && !email.includes('mentor')) {
                const parts = email.split('@');
                setEmail(parts.length === 2 ? `${parts[0]}.mentor@${parts[1]}` : 'expert.mentor@mentorx.com');
              }
            }}
          >
            <View style={[styles.toggleCircle, { backgroundColor: isMentorMode ? Theme.colors.primary : 'transparent', borderColor: isMentorMode ? Theme.colors.primary : themeColors.border }]} />
            <ThemedText style={styles.roleToggleText}>Join as Mentor</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#0a7ea4', '#055b76']}
              style={styles.gradientButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>{isMentorMode ? 'Join as Mentor' : 'Join MentorX'}</ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
            <ThemedText style={styles.linkText}>
              Already have an account? <ThemedText style={styles.linkHighlight}>Log In</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  signupTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: '#111',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7f9',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  roleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  roleToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signupButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkHighlight: {
    color: '#0a7ea4',
    fontWeight: '700',
  },
});
