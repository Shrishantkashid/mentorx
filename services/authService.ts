import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { User } from '../types';

const TOKEN_KEY = 'mentorx_auth_token';
const USER_KEY = 'mentorx_user_data';

export const authService = {
  /**
   * Log in with email and password
   */
  login: async (email: string, password: string) => {
    try {
      // Secret Admin Bypass (local only if backend doesn't have it, but BlockLearn has /admin-login)
      if (email.toLowerCase() === 'admin@mentorx.com' && password === 'admin789') {
        const adminResponse = await api.post('/auth/admin-login', { 
          email: 'admin@blocklearn.com', // Mapping to the real backend admin email
          password: 'admin' 
        });
        if (adminResponse.success) {
          api.setToken(adminResponse.token);
          await AsyncStorage.setItem(TOKEN_KEY, adminResponse.token);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(adminResponse.user));
        }
        return adminResponse;
      }

      const response = await api.post('/auth/login', { email, password });

      if (response.success && response.user) {
        // Map backend user to frontend User type
        const mappedUser: User = {
          id: response.user.id || response.user._id,
          email: response.user.email,
          name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || 'User',
          role: response.user.userType === 'learner' ? 'mentee' : response.user.userType,
          isApproved: response.user.mentorApproved
        };
        api.setToken(response.token);
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
        return { ...response, user: mappedUser };
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  signup: async (name: string, email: string, password: string) => {
    try {
      const firstName = name.split(' ')[0] || name;
      const lastName = name.split(' ').slice(1).join(' ') || '.';
      const isMentor = email.toLowerCase().includes('mentor');
      
      const response = await api.post('/auth/register', { 
        firstName, 
        lastName, 
        email, 
        password,
        userType: isMentor ? 'mentor' : 'learner'
      });

      if (response.success && response.user) {
        // Map backend user to frontend User type
        const mappedUser: User = {
          id: response.user.id || response.user._id,
          email: response.user.email,
          name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim(),
          role: response.user.userType === 'learner' ? 'mentee' : response.user.userType,
          isApproved: response.user.mentorApproved
        };
        api.setToken(response.token);
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
        return { ...response, user: mappedUser };
      }
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  /**
   * Log out and clear stored data
   */
  logout: async () => {
    try {
      api.setToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Retrieve stored session if it exists
   */
  getStoredSession: async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userJSON = await AsyncStorage.getItem(USER_KEY);
      
      if (token && userJSON) {
        api.setToken(token);
        return {
          token,
          user: JSON.parse(userJSON) as User,
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  },
};
