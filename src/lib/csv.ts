import Papa from 'papaparse';
import type { Respondent, CulturalConsumption, SelfEfficacy, SubjectiveHappiness } from '@/types';
import { CULTURAL_CONSUMPTION_CATEGORIES } from './constants';

export function respondentsToCSV(respondents: Respondent[]): string {
  const headers = [
    'id', 'gender', 'ageGroup', 'educationLevel', 'incomeLevel',
    ...CULTURAL_CONSUMPTION_CATEGORIES.map((c) => `cc_${c.key}`),
    ...Array.from({ length: 10 }, (_, i) => `se_${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `sh_${i + 1}`),
    'createdAt',
  ];

  const rows = respondents.map((r) => [
    r.id, r.gender, r.ageGroup, r.educationLevel, r.incomeLevel,
    ...CULTURAL_CONSUMPTION_CATEGORIES.map((c) => r.culturalConsumption[c.key]),
    ...r.selfEfficacy,
    ...r.subjectiveHappiness,
    r.createdAt,
  ]);

  return Papa.unparse({ fields: headers, data: rows });
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export interface ParsedCSVResult {
  respondents: Respondent[];
  errors: string[];
}

export function parseCSVToRespondents(csvText: string): ParsedCSVResult {
  const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const errors: string[] = [];
  const respondents: Respondent[] = [];

  if (result.errors.length > 0) {
    errors.push(...result.errors.map((e) => `행 ${e.row}: ${e.message}`));
  }

  for (let i = 0; i < result.data.length; i++) {
    const row = result.data[i] as Record<string, string>;
    try {
      const consumption: CulturalConsumption = {
        movies: Number(row['cc_movies']) || 0,
        concerts: Number(row['cc_concerts']) || 0,
        exhibitions: Number(row['cc_exhibitions']) || 0,
        reading: Number(row['cc_reading']) || 0,
        sports: Number(row['cc_sports']) || 0,
        travel: Number(row['cc_travel']) || 0,
        crafts: Number(row['cc_crafts']) || 0,
        digital: Number(row['cc_digital']) || 0,
      };

      const selfEfficacy = Array.from({ length: 10 }, (_, j) =>
        Math.max(1, Math.min(5, Number(row[`se_${j + 1}`]) || 3))
      ) as SelfEfficacy;

      const subjectiveHappiness = Array.from({ length: 5 }, (_, j) =>
        Math.max(1, Math.min(5, Number(row[`sh_${j + 1}`]) || 3))
      ) as SubjectiveHappiness;

      respondents.push({
        id: row['id'] || `imported-${Date.now()}-${i}`,
        gender: (row['gender'] as Respondent['gender']) || '남성',
        ageGroup: (row['ageGroup'] as Respondent['ageGroup']) || '65-69',
        educationLevel: (row['educationLevel'] as Respondent['educationLevel']) || '고등학교',
        incomeLevel: (row['incomeLevel'] as Respondent['incomeLevel']) || '100-200만원',
        culturalConsumption: consumption,
        selfEfficacy,
        subjectiveHappiness,
        createdAt: row['createdAt'] || new Date().toISOString(),
      });
    } catch {
      errors.push(`행 ${i + 1}: 파싱 오류`);
    }
  }

  return { respondents, errors };
}
