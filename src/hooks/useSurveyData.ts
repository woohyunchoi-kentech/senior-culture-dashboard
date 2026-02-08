'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Respondent } from '@/types';
import { loadRespondents, saveRespondents, addRespondent as addToStorage, deleteRespondent as deleteFromStorage, clearAllRespondents } from '@/lib/storage';
import { generateSampleData } from '@/lib/sampleData';

export function useSurveyData() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = loadRespondents();
    setRespondents(data);
    setIsLoaded(true);
  }, []);

  const addRespondent = useCallback((respondent: Respondent) => {
    const updated = addToStorage(respondent);
    setRespondents(updated);
  }, []);

  const deleteRespondent = useCallback((id: string) => {
    const updated = deleteFromStorage(id);
    setRespondents(updated);
  }, []);

  const importRespondents = useCallback((newRespondents: Respondent[]) => {
    const current = loadRespondents();
    const merged = [...current, ...newRespondents];
    saveRespondents(merged);
    setRespondents(merged);
  }, []);

  const replaceAll = useCallback((newRespondents: Respondent[]) => {
    saveRespondents(newRespondents);
    setRespondents(newRespondents);
  }, []);

  const clearAll = useCallback(() => {
    clearAllRespondents();
    setRespondents([]);
  }, []);

  const loadSampleData = useCallback(() => {
    const sample = generateSampleData(40);
    saveRespondents(sample);
    setRespondents(sample);
  }, []);

  return {
    respondents,
    isLoaded,
    addRespondent,
    deleteRespondent,
    importRespondents,
    replaceAll,
    clearAll,
    loadSampleData,
  };
}
