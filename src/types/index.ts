// 문화소비 카테고리별 빈도 (0: 없음 ~ 5: 매우 자주)
export interface CulturalConsumption {
  movies: number;        // 영화관람
  concerts: number;      // 공연/음악회
  exhibitions: number;   // 전시/미술관
  reading: number;       // 독서
  sports: number;        // 스포츠 관람/참여
  travel: number;        // 여행
  crafts: number;        // 공예/취미활동
  digital: number;       // 디지털 콘텐츠
}

// 자기효능감 (10문항, 각 1-5 리커트)
export type SelfEfficacy = [number, number, number, number, number, number, number, number, number, number];

// 주관적 행복감 (5문항, 각 1-5 리커트)
export type SubjectiveHappiness = [number, number, number, number, number];

export type Gender = '남성' | '여성';
export type AgeGroup = '60-64' | '65-69' | '70-74' | '75-79' | '80+';
export type EducationLevel = '초등학교 이하' | '중학교' | '고등학교' | '대학교 이상';
export type IncomeLevel = '100만원 미만' | '100-200만원' | '200-300만원' | '300만원 이상';

export interface Respondent {
  id: string;
  gender: Gender;
  ageGroup: AgeGroup;
  educationLevel: EducationLevel;
  incomeLevel: IncomeLevel;
  culturalConsumption: CulturalConsumption;
  selfEfficacy: SelfEfficacy;
  subjectiveHappiness: SubjectiveHappiness;
  createdAt: string;
}

// 기술통계
export interface DescriptiveStats {
  n: number;
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
  skewness: number;
  kurtosis: number;
}

// 상관분석
export interface CorrelationResult {
  variable1: string;
  variable2: string;
  r: number;
  p: number;
  n: number;
}

// 회귀분석
export interface RegressionResult {
  dependent: string;
  independent: string[];
  coefficients: { variable: string; b: number; se: number; beta: number; t: number; p: number }[];
  rSquared: number;
  adjustedRSquared: number;
  fStatistic: number;
  fP: number;
  n: number;
}

// 매개효과
export interface MediationResult {
  totalEffect: number;     // c path: X → Y
  directEffect: number;    // c' path: X → Y (M 통제)
  indirectEffect: number;  // a*b: X → M → Y
  aPath: { coeff: number; se: number; t: number; p: number };  // X → M
  bPath: { coeff: number; se: number; t: number; p: number };  // M → Y
  cPath: { coeff: number; se: number; t: number; p: number };  // X → Y (총)
  cPrimePath: { coeff: number; se: number; t: number; p: number }; // X → Y (직접)
  sobelZ: number;
  sobelP: number;
  proportionMediated: number;
}

// 사전 분석 결과 입력
export interface SummaryStatsInput {
  n: number;
  variables: string[];
  means: number[];
  standardDeviations: number[];
  correlations: number[][];
  regressionCoefficients?: {
    model: string;
    coefficients: { variable: string; b: number; se: number; beta: number; t: number; p: number }[];
    rSquared: number;
    fStatistic: number;
  }[];
}
