import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, Dimensions, ActivityIndicator } from 'react-native';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMentorMode, setIsMentorMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        router.replace('/(tabs)/dashboard');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials or something went wrong.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Failed to connect to backend server. Is it running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google Login feature coming soon!');
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#0a7ea4', '#E6F4FE']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <IconSymbol name="person.2.fill" size={40} color="#0a7ea4" />
          </View>
          <ThemedText type="title" style={styles.appName}>MentorX</ThemedText>
          <ThemedText style={styles.tagline}>Elevate Your Career Journey</ThemedText>
        </View>

        <View style={[styles.formCard, { backgroundColor: themeColors.surface }]}>
          <ThemedText type="subtitle" style={[styles.loginTitle, { color: themeColors.text }]}>Welcome Back</ThemedText>
          
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
            <ThemedText style={styles.roleToggleText}>Login as Mentor</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#0a7ea4', '#055b76']}
              style={styles.gradientButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>{isMentorMode ? 'Mentor Sign In' : 'Sign In'}</ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <ThemedText style={styles.dividerText}>OR</ThemedText>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={[styles.googleButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]} onPress={handleGoogleLogin}>
            <IconSymbol name="bubble.left.fill" size={20} color={themeColors.text} style={{marginRight: 10}} />
            <ThemedText style={[styles.googleButtonText, { color: themeColors.text }]}>Continue with Google</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupLink}>
            <ThemedText style={styles.linkText}>
              Don't have an account? <ThemedText style={styles.linkHighlight}>Sign Up</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  loginTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    color: '#111',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7f9',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
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
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
  },
  signupLink: {
    marginTop: 24,
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
