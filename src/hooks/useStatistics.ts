'use client';

import { useMemo } from 'react';
import type { Respondent, DescriptiveStats, CorrelationResult, RegressionResult, MediationResult } from '@/types';
import { descriptiveStats, extractVariables, correlationMatrix, simpleRegression, multipleRegression } from '@/lib/statistics';
import { mediationAnalysis } from '@/lib/mediation';

export function useStatistics(respondents: Respondent[]) {
  const variables = useMemo(() => {
    if (respondents.length === 0) return null;
    return extractVariables(respondents);
  }, [respondents]);

  const descriptive = useMemo((): Record<string, DescriptiveStats> | null => {
    if (!variables) return null;
    return {
      '문화소비': descriptiveStats(variables.consumption),
      '자기효능감': descriptiveStats(variables.efficacy),
      '주관적 행복감': descriptiveStats(variables.happiness),
    };
  }, [variables]);

  const correlations = useMemo((): CorrelationResult[] => {
    if (respondents.length < 3) return [];
    return correlationMatrix(respondents);
  }, [respondents]);

  const regressionXY = useMemo(() => {
    if (!variables || variables.consumption.length < 3) return null;
    const reg = simpleRegression(variables.consumption, variables.happiness);
    return { ...reg, label: '문화소비 → 주관적 행복감' };
  }, [variables]);

  const regressionXM = useMemo(() => {
    if (!variables || variables.consumption.length < 3) return null;
    const reg = simpleRegression(variables.consumption, variables.efficacy);
    return { ...reg, label: '문화소비 → 자기효능감' };
  }, [variables]);

  const regressionMY = useMemo(() => {
    if (!variables || variables.efficacy.length < 3) return null;
    const reg = simpleRegression(variables.efficacy, variables.happiness);
    return { ...reg, label: '자기효능감 → 주관적 행복감' };
  }, [variables]);

  const multipleReg = useMemo((): RegressionResult | null => {
    if (!variables || variables.consumption.length < 4) return null;
    return multipleRegression(variables.consumption, variables.efficacy, variables.happiness);
  }, [variables]);

  const mediation = useMemo((): MediationResult | null => {
    if (!variables || variables.consumption.length < 4) return null;
    return mediationAnalysis(variables.consumption, variables.efficacy, variables.happiness);
  }, [variables]);

  return {
    variables,
    descriptive,
    correlations,
    regressionXY,
    regressionXM,
    regressionMY,
    multipleReg,
    mediation,
  };
}
