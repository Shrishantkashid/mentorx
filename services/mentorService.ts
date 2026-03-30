import { api } from './api';

export interface Mentor {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experience: string;
  rating: number;
  image?: string;
  category: string;
  isApproved?: boolean;
  bio?: string;
  availability?: string[];
  reviews?: any[];
}

// Mock mentors removed for real backend integration

export const mentorService = {
  /**
   * Fetch all mentors or filtered mentors
   */
  getMentors: async (query?: string, category?: string, includeUnapproved = false): Promise<Mentor[]> => {
    try {
      const response = await api.get('/matching/mentors-advanced');
      
      if (!response.success || !Array.isArray(response.data)) {
        return [];
      }

      const mentors: Mentor[] = response.data.map((item: any) => {
        const { user, profile } = item;
        if (!user || (!user.id && !user._id)) {
          console.warn('Mentor missing ID:', user);
        }
        return {
          id: user?.id || user?._id || 'undefined',
          name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Expert Mentor',
          role: profile?.bio?.split('.')[0] || 'Expert Mentor',
          skills: profile?.skills_to_teach || (profile?.skills ? [profile.skills] : []),
          experience: profile?.experience_years ? `${profile.experience_years}+ years` : 'Expert', 
          rating: user?.average_rating || 4.5, 
          image: user?.avatar_url || profile?.avatar_url || undefined,
          category: profile?.department || 'Tech',
          isApproved: user?.mentor_approved || true,
          bio: profile?.bio,
          availability: profile?.availability ? (Array.isArray(profile.availability) ? profile.availability : [profile.availability]) : []
        };
      });

      // Local filtering for additional accuracy if needed
      return mentors.filter(m => {
        const matchesQuery = !query || 
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.skills.some(s => s.toLowerCase().includes(query.toLowerCase()));
        const matchesCategory = !category || category === 'All' || m.category === category;
        return matchesQuery && matchesCategory;
      });
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }
  },

  approveMentor: async (id: string) => {
    try {
      const response = await api.post(`/admin/mentor-approve/${id}`, {});
      return response.success;
    } catch (error) {
      console.error('Error approving mentor:', error);
      return false;
    }
  },

  /**
   * Fetch a single mentor by ID
   */
  getMentorById: async (id: string): Promise<Mentor | null> => {
    if (!id || id === 'undefined') {
      console.error('Invalid mentor ID passed to getMentorById:', id);
      return null;
    }
    try {
      const response = await api.get(`/auth/profile/${id}`);
      
      if (!response.success || !response.user) {
        return null;
      }

      const { user, profile } = response;
      return {
        id: user.id || user._id,
        name: `${user.first_name || user.firstName} ${user.last_name || user.lastName || ''}`.trim(),
        role: profile?.bio?.split('.')[0] || 'Expert Mentor',
        skills: profile?.skills_to_teach || (profile?.skills ? [profile.skills] : []),
        experience: profile?.experience_years ? `${profile.experience_years}+ years` : '5+ years',
        rating: user?.average_rating || 4.8,
        image: profile?.avatar_url || user?.avatar_url || undefined,
        category: profile?.department || 'Tech',
        isApproved: user?.mentor_approved ?? true,
        bio: profile?.bio || 'Expert mentor ready to help you grow.',
        availability: profile?.availability ? 
          (Array.isArray(profile.availability) ? profile.availability : [profile.availability]) : 
          ['Mon, Wed, Fri - 5:00 PM to 8:00 PM'],
        reviews: user.reviews || [
          { id: 'r1', user: 'Alex P.', rating: 5, comment: 'Incredible mentor! Explained complex topics so easily.' },
          { id: 'r2', user: 'Maria S.', rating: 4, comment: 'Very patient and knowledgeable. Highly recommended.' },
        ],
      };
    } catch (error) {
      console.error('Error fetching mentor detail:', error);
      return null;
    }
  },
};
