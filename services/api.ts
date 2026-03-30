import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the backend URL based on the environment and platform
// For Android emulator, localhost is 10.0.2.2
// For iOS and Web, it's localhost or the machine's IP address
const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  const devServerPort = 5000; // your backend port

  if (__DEV__) {
    // debuggerHost is the IP of the machine running the Expo CLI
    if (debuggerHost) {
      return `http://${debuggerHost}:${devServerPort}/api`;
    }
    // Fallback for Android emulator if debuggerHost is somehow missing
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${devServerPort}/api`;
    }
    // Fallback for Web/iOS
    return `http://localhost:${devServerPort}/api`;
  }
  
  // Replace with your production URL
  return 'https://mentorx-api.vercel.app/api';
};

const BASE_URL = getBaseUrl();

let authToken: string | null = null;

export const api = {
  setToken: (token: string | null) => {
    authToken = token;
  },
  get: async (endpoint: string) => {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }
    return response.json();
  },
  post: async (endpoint: string, data: any) => {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }
    return response.json();
  },
  put: async (endpoint: string, data: any) => {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }
    return response.json();
  },
};
