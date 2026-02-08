import type { Respondent, CulturalConsumption, SelfEfficacy, SubjectiveHappiness, Gender, AgeGroup, EducationLevel, IncomeLevel } from '@/types';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function randomInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

export function generateSampleData(count: number = 40): Respondent[] {
  const rand = seededRandom(42);
  const genders: Gender[] = ['남성', '여성'];
  const ageGroups: AgeGroup[] = ['60-64', '65-69', '70-74', '75-79', '80+'];
  const educations: EducationLevel[] = ['초등학교 이하', '중학교', '고등학교', '대학교 이상'];
  const incomes: IncomeLevel[] = ['100만원 미만', '100-200만원', '200-300만원', '300만원 이상'];

  const respondents: Respondent[] = [];

  for (let i = 0; i < count; i++) {
    // 문화소비 수준 (기본 활동 수준)
    const baseActivity = rand() * 3 + 1; // 1-4

    const consumption: CulturalConsumption = {
      movies: clamp(baseActivity + rand() * 2 - 0.5, 0, 5),
      concerts: clamp(baseActivity + rand() * 2 - 1, 0, 5),
      exhibitions: clamp(baseActivity + rand() * 2 - 1, 0, 5),
      reading: clamp(baseActivity + rand() * 2, 0, 5),
      sports: clamp(baseActivity + rand() * 2 - 0.5, 0, 5),
      travel: clamp(baseActivity + rand() * 2 - 1, 0, 5),
      crafts: clamp(baseActivity + rand() * 2 - 0.5, 0, 5),
      digital: clamp(baseActivity + rand() * 2 - 1, 0, 5),
    };

    // 문화소비 평균 → 자기효능감에 양의 영향
    const consumptionMean = Object.values(consumption).reduce((a, b) => a + b, 0) / 8;
    const efficacyBase = 1.5 + consumptionMean * 0.6 + (rand() - 0.5) * 1.2;

    const selfEfficacy: SelfEfficacy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(
      () => clamp(efficacyBase + (rand() - 0.5) * 1.5, 1, 5)
    ) as SelfEfficacy;

    // 자기효능감 평균 + 문화소비 → 행복감에 양의 영향
    const efficacyMean = selfEfficacy.reduce((a, b) => a + b, 0) / 10;
    const happinessBase = 0.5 + efficacyMean * 0.5 + consumptionMean * 0.3 + (rand() - 0.5) * 0.8;

    const subjectiveHappiness: SubjectiveHappiness = [0, 0, 0, 0, 0].map(
      () => clamp(happinessBase + (rand() - 0.5) * 1.2, 1, 5)
    ) as SubjectiveHappiness;

    respondents.push({
      id: `sample-${String(i + 1).padStart(3, '0')}`,
      gender: genders[randomInt(rand, 0, 1)],
      ageGroup: ageGroups[randomInt(rand, 0, 4)],
      educationLevel: educations[randomInt(rand, 0, 3)],
      incomeLevel: incomes[randomInt(rand, 0, 3)],
      culturalConsumption: consumption,
      selfEfficacy,
      subjectiveHappiness,
      createdAt: new Date(2024, randomInt(rand, 0, 11), randomInt(rand, 1, 28)).toISOString(),
    });
  }

  return respondents;
}
