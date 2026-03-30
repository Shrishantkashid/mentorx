import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CareerPath, RoadmapStep } from '@/services/careerService';
import { api } from '@/services/api';

interface CareerContextType {
  goal: string;
  roadmap: RoadmapStep[];
  skills: string[];
  tasks: any[];
  updateCareer: (path: CareerPath) => void;
  updateTaskStatus: (taskId: string, completed: boolean) => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goal, setGoal] = useState('Explore Careers');
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    // Load persisted career data on start
    const loadState = async () => {
      try {
        // Try backend first
        const response = await api.get('/roadmap');
        if (response.success && response.data) {
          const { goal, roadmap, skills, tasks } = response.data;
          setGoal(goal);
          setRoadmap(roadmap);
          setSkills(skills);
          setTasks(tasks || []);
          return;
        }
      } catch (err) {
        console.log('Backend roadmap fetch failed, falling back to local storage');
      }

      // Fallback to local storage
      const saved = await AsyncStorage.getItem('mentorx_career_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        setGoal(parsed.goal);
        setRoadmap(parsed.roadmap);
        setSkills(parsed.skills);
        setTasks(parsed.tasks);
      }
    };
    loadState();
  }, []);

  const persist = async (data: any) => {
    // Local persistence
    AsyncStorage.setItem('mentorx_career_state', JSON.stringify(data));

    // Backend persistence
    try {
      await api.post('/roadmap/update', data);
    } catch (err) {
      console.error('Failed to sync roadmap to backend:', err);
    }
  };

  const updateCareer = (path: CareerPath) => {
    setGoal(path.goal);
    setRoadmap(path.roadmap);
    setSkills(path.skills);
    setTasks(path.tasks || []);
    persist(path);
  };

  const updateTaskStatus = (taskId: string, completed: boolean) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === taskId ? { ...t, completed } : t);
      const newState = { goal, roadmap, skills, tasks: updated };
      persist(newState);
      return updated;
    });
  };

  return (
    <CareerContext.Provider value={{ goal, roadmap, skills, tasks, updateCareer, updateTaskStatus }}>
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) throw new Error('useCareer must be used within CareerProvider');
  return context;
};
