import { api } from './api';

export interface RoadmapStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
}

export interface CareerPath {
  goal: string;
  roadmap: RoadmapStep[];
  skills: string[];
  tasks: any[];
}

export const careerService = {
  /**
   * Get an AI-powered response from the backend
   */
  getAIResponse: async (message: string, history: any[] = []): Promise<{ answer: string; action?: string; data?: any }> => {
    try {
      const response = await api.post('/ai/chat', { 
        message, 
        history,
        context: 'MentorX Career Assistant'
      });
      
      if (response.success) {
        return {
          answer: response.answer,
          action: response.action,
          data: response.data
        };
      }
      throw new Error(response.message || 'Failed to get AI response');
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  /**
   * Detect intent asynchronously via AI (Legacy method kept for partial compatibility)
   */
  detectIntent: (input: string): string | null => {
    const text = input.toLowerCase();
    if (text.includes('blockchain') || text.includes('web3') || text.includes('solidity')) return 'web3';
    if (text.includes('ai') || text.includes('ml') || text.includes('intelligence') || text.includes('machine learning')) return 'ai';
    if (text.includes('frontend') || text.includes('web design') || text.includes('react')) return 'frontend';
    return null;
  },

  /**
   * Get career path based on a detected intent
   */
  getCareerPath: (key: string): CareerPath | null => {
    // Current hardcoded paths - in production, these would be returned by the AI in a JSON structure
    const CAREER_DATA: Record<string, CareerPath> = {
      'web3': {
        goal: 'Blockchain Engineer',
        skills: ['Solidity', 'Ethereum', 'Web3.js', 'Cryptography', 'Hardhat'],
        roadmap: [
          { id: '1', title: 'Web3 Basics', status: 'completed', description: 'Fundamentals of decentralization.' },
          { id: '2', title: 'Smart Contracts', status: 'current', description: 'Learning Solidity and EVM.' },
          { id: '3', title: 'DApp Integration', status: 'upcoming', description: 'React and Ether.js integration.' },
        ],
        tasks: [
          { id: 't1', title: 'Install Truffle/Hardhat', dueDate: 'Today', completed: false, category: 'Setup' },
          { id: 't2', title: 'Deploy Test Contract', dueDate: 'Tomorrow', completed: false, category: 'Code' },
        ]
      },
      'ai': {
        goal: 'AI/ML Engineer',
        skills: ['Python', 'PyTorch', 'Linear Algebra', 'Neural Networks', 'NLP'],
        roadmap: [
          { id: '1', title: 'Mathematics for ML', status: 'completed', description: 'Calculus and Linear Algebra.' },
          { id: '2', title: 'Python for Data Science', status: 'current', description: 'NumPy, Pandas, and Scikit-Learn.' },
          { id: '3', title: 'Deep Learning Basics', status: 'upcoming', description: 'Building your first Neural Net.' },
        ],
        tasks: [
          { id: 't1', title: 'Setup Jupyter Notebook', dueDate: 'Today', completed: false, category: 'Setup' },
          { id: 't2', title: 'Implement Gradient Descent', dueDate: 'Tomorrow', completed: false, category: 'Math' },
        ]
      },
      'frontend': {
        goal: 'Frontend Lead',
        skills: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Architecture'],
        roadmap: [
          { id: '1', title: 'Modern JS/TS', status: 'completed', description: 'ES6+ and Type safety.' },
          { id: '2', title: 'React Performance', status: 'current', description: 'Memoization and State management.' },
          { id: '3', title: 'Scalable Architecture', status: 'upcoming', description: 'Micro-frontends and Design Systems.' },
        ],
        tasks: [
          { id: 't1', title: 'Refactor Component Logic', dueDate: 'Today', completed: false, category: 'Architecture' },
          { id: 't2', title: 'Setup Unit Testing', dueDate: 'Tomorrow', completed: false, category: 'Tests' },
        ]
      }
    };
    return CAREER_DATA[key] || null;
  }
};
