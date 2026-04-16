import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Submission, INITIAL_SUBMISSIONS } from '../data/campaigns';

type SubmissionsContextType = {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => void;
  getSubmissionByCampaign: (campaignId: string) => Submission | undefined;
};

const SubmissionsContext = createContext<SubmissionsContextType | undefined>(undefined);

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);

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
    <SubmissionsContext.Provider value={{ submissions, addSubmission, getSubmissionByCampaign }}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const ctx = useContext(SubmissionsContext);
  if (!ctx) throw new Error('useSubmissions must be used within SubmissionsProvider');
  return ctx;
}
