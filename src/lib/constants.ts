import type { Gender, AgeGroup, EducationLevel, IncomeLevel } from '@/types';

export const CULTURAL_CONSUMPTION_CATEGORIES = [
  { key: 'movies' as const, label: '영화관람', icon: '🎬' },
  { key: 'concerts' as const, label: '공연/음악회', icon: '🎵' },
  { key: 'exhibitions' as const, label: '전시/미술관', icon: '🖼️' },
  { key: 'reading' as const, label: '독서', icon: '📚' },
  { key: 'sports' as const, label: '스포츠', icon: '⚽' },
  { key: 'travel' as const, label: '여행', icon: '✈️' },
  { key: 'crafts' as const, label: '공예/취미', icon: '🎨' },
  { key: 'digital' as const, label: '디지털 콘텐츠', icon: '📱' },
] as const;

export const FREQUENCY_LABELS = [
  '전혀 안 함 (0)',
  '거의 안 함 (1)',
  '가끔 (2)',
  '보통 (3)',
  '자주 (4)',
  '매우 자주 (5)',
] as const;

export const LIKERT_LABELS = [
  '전혀 그렇지 않다 (1)',
  '그렇지 않다 (2)',
  '보통이다 (3)',
  '그렇다 (4)',
  '매우 그렇다 (5)',
] as const;

export const SELF_EFFICACY_ITEMS = [
  '나는 어려운 문제에 직면해도 해결할 수 있다고 믿는다.',
  '나는 새로운 것을 배우는 데 자신이 있다.',
  '나는 예상치 못한 상황에서도 잘 대처할 수 있다.',
  '나는 내 능력으로 목표를 달성할 수 있다고 생각한다.',
  '나는 스트레스 상황에서도 침착하게 행동할 수 있다.',
  '나는 필요한 도움을 주변에서 찾을 수 있다.',
  '나는 나의 노력이 좋은 결과를 가져온다고 생각한다.',
  '나는 어떤 일이든 시작하면 끝까지 해낼 수 있다.',
  '나는 실패해도 다시 도전할 수 있다.',
  '나는 일상에서 스스로 결정을 내릴 수 있다.',
] as const;

export const HAPPINESS_ITEMS = [
  '나는 전반적으로 행복한 사람이라고 생각한다.',
  '나는 현재 생활에 만족한다.',
  '나는 미래에 대해 낙관적이다.',
  '나는 주변 사람들과의 관계에 만족한다.',
  '나는 하루하루가 의미 있다고 느낀다.',
] as const;

export const GENDER_OPTIONS: Gender[] = ['남성', '여성'];
export const AGE_GROUP_OPTIONS: AgeGroup[] = ['60-64', '65-69', '70-74', '75-79', '80+'];
export const EDUCATION_OPTIONS: EducationLevel[] = ['초등학교 이하', '중학교', '고등학교', '대학교 이상'];
export const INCOME_OPTIONS: IncomeLevel[] = ['100만원 미만', '100-200만원', '200-300만원', '300만원 이상'];

export const VARIABLE_LABELS: Record<string, string> = {
  culturalConsumption: '문화소비 (X)',
  selfEfficacy: '자기효능감 (M)',
  subjectiveHappiness: '주관적 행복감 (Y)',
};

export const STORAGE_KEY = 'senior-culture-dashboard-data';
export const SUMMARY_STATS_KEY = 'senior-culture-dashboard-summary';
