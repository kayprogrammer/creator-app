import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Submission, INITIAL_SUBMISSIONS } from '../data/campaigns';

const STORAGE_KEY = '@creator_submissions_v1';

type SubmissionsContextType = {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => void;
  getSubmissionByCampaign: (campaignId: string) => Submission | undefined;
  isLoading: boolean;
};

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Load submissions from storage on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSubmissions(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading submissions from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedData();
  }, []);

  // Save submissions to storage whenever they change
  useEffect(() => {
    const savePersistedData = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        } catch (error) {
          console.error('Error saving submissions to storage:', error);
        }
      }
    };

    savePersistedData();
  }, [submissions, isLoading]);

  const addSubmission = (data: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: Submission = {
      ...data,
      id: `s${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const getSubmissionByCampaign = (campaignId: string) => {
    return submissions.find((s) => s.campaignId === campaignId);
  };

  return (
    <SubmissionsContext.Provider value={{ submissions, addSubmission, getSubmissionByCampaign, isLoading }}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const ctx = useContext(SubmissionsContext);
  if (!ctx) throw new Error('useSubmissions must be used within SubmissionsProvider');
  return ctx;
}
