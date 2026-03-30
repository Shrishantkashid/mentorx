/**
 * Global API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * User Interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'mentor' | 'mentee' | 'admin';
  skills?: string[];
  bio?: string;
  avatarUrl?: string;
  isApproved?: boolean;
  onboardingData?: {
    linkedin?: string;
    portfolio?: string;
    yearsExperience?: string;
    specialization?: string;
    appliedAt: string;
  };
}

/**
 * Auth State Interface
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
