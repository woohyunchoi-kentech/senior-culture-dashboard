import type { DescriptiveStats, CorrelationResult, RegressionResult, MediationResult } from '@/types';

export interface PaperData {
  N: number;
  genderCount: Record<string, number>;
  ageCount: Record<string, number>;
  eduCount: Record<string, number>;
  incomeCount: Record<string, number>;
  descriptive: Record<string, DescriptiveStats>;
  correlations: CorrelationResult[];
  corXM: CorrelationResult | undefined;
  corXY: CorrelationResult | undefined;
  corMY: CorrelationResult | undefined;
  regressionXY: { slope: number; intercept: number; se: number; r2: number; t: number; p: number; fStat: number; fP: number; label: string };
  regressionXM: { slope: number; intercept: number; se: number; r2: number; t: number; p: number; fStat: number; fP: number; label: string };
  regressionMY: { slope: number; intercept: number; se: number; r2: number; t: number; p: number; fStat: number; fP: number; label: string };
  multipleReg: RegressionResult;
  mediation: MediationResult;
  reliability: { alphaConsumption: number; alphaEfficacy: number; alphaHappiness: number };
  categoryStats: { label: string; key: string; mean: number; std: number }[];
  sortedCategories: { label: string; key: string; mean: number; std: number }[];
}

// APA 스타일 테이블 클래스
export const TH = 'px-3 py-2 text-sm font-normal';
export const TD = 'px-3 py-1.5 text-sm font-mono';
export const THEAD_ROW = 'border-t-2 border-b border-black';
export const TBODY_LAST = 'border-b-2 border-black';
export const CAPTION = 'text-sm font-bold text-center mb-2';
export const P = 'mb-3 text-justify text-[13.5px] indent-[2em]';
export const H2 = 'text-base font-bold border-b-2 border-gray-400 pb-1 mb-4';
export const H3 = 'font-bold mt-6 mb-2 text-[15px]';
export const H4 = 'font-bold mt-4 mb-2 text-[14px]';
export const H5 = 'font-bold mt-3 mb-1 text-[13.5px] ml-4';

export function fmt(n: number, d: number = 3): string {
  return n.toFixed(d);
}

export function sig(p: number): string {
  if (p < 0.001) return 'p < .001';
  if (p < 0.01) return 'p < .01';
  if (p < 0.05) return 'p < .05';
  return `p = ${fmt(p)}`;
}

export function stars(p: number): string {
  if (p < 0.001) return '***';
  if (p < 0.01) return '**';
  if (p < 0.05) return '*';
  return '';
}
