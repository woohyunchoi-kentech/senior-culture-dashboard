import type { Respondent, SummaryStatsInput } from '@/types';
import { STORAGE_KEY, SUMMARY_STATS_KEY } from './constants';

export function loadRespondents(): Respondent[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRespondents(respondents: Respondent[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(respondents));
}

export function addRespondent(respondent: Respondent): Respondent[] {
  const current = loadRespondents();
  current.push(respondent);
  saveRespondents(current);
  return current;
}

export function deleteRespondent(id: string): Respondent[] {
  const current = loadRespondents().filter((r) => r.id !== id);
  saveRespondents(current);
  return current;
}

export function clearAllRespondents(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function loadSummaryStats(): SummaryStatsInput | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SUMMARY_STATS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveSummaryStats(stats: SummaryStatsInput): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUMMARY_STATS_KEY, JSON.stringify(stats));
}

export function clearSummaryStats(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SUMMARY_STATS_KEY);
}
