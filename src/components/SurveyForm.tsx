'use client';

import { useState } from 'react';
import type { Respondent, CulturalConsumption, SelfEfficacy, SubjectiveHappiness, Gender, AgeGroup, EducationLevel, IncomeLevel } from '@/types';
import { CULTURAL_CONSUMPTION_CATEGORIES, SELF_EFFICACY_ITEMS, HAPPINESS_ITEMS, LIKERT_LABELS, FREQUENCY_LABELS, GENDER_OPTIONS, AGE_GROUP_OPTIONS, EDUCATION_OPTIONS, INCOME_OPTIONS } from '@/lib/constants';
import LikertScaleInput from './LikertScaleInput';

interface SurveyFormProps {
  onSubmit: (respondent: Respondent) => void;
}

export default function SurveyForm({ onSubmit }: SurveyFormProps) {
  const [gender, setGender] = useState<Gender>('남성');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('65-69');
  const [education, setEducation] = useState<EducationLevel>('고등학교');
  const [income, setIncome] = useState<IncomeLevel>('100-200만원');

  const [consumption, setConsumption] = useState<CulturalConsumption>({
    movies: 2, concerts: 1, exhibitions: 1, reading: 2, sports: 2, travel: 1, crafts: 1, digital: 1,
  });

  const [efficacy, setEfficacy] = useState<SelfEfficacy>([3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  const [happiness, setHappiness] = useState<SubjectiveHappiness>([3, 3, 3, 3, 3]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const respondent: Respondent = {
      id: `resp-${Date.now()}`,
      gender,
      ageGroup,
      educationLevel: education,
      incomeLevel: income,
      culturalConsumption: consumption,
      selfEfficacy: efficacy,
      subjectiveHappiness: happiness,
      createdAt: new Date().toISOString(),
    };
    onSubmit(respondent);
    alert('응답이 저장되었습니다!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 인구통계 */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">인구통계 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as Gender)} className="w-full border rounded-md p-2 text-gray-900">
              {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연령대</label>
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as AgeGroup)} className="w-full border rounded-md p-2 text-gray-900">
              {AGE_GROUP_OPTIONS.map((a) => <option key={a} value={a}>{a}세</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학력</label>
            <select value={education} onChange={(e) => setEducation(e.target.value as EducationLevel)} className="w-full border rounded-md p-2 text-gray-900">
              {EDUCATION_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월 소득</label>
            <select value={income} onChange={(e) => setIncome(e.target.value as IncomeLevel)} className="w-full border rounded-md p-2 text-gray-900">
              {INCOME_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* 문화소비 */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">문화소비 활동 빈도 (최근 1년)</h3>
        <div className="space-y-3">
          {CULTURAL_CONSUMPTION_CATEGORIES.map((cat) => (
            <LikertScaleInput
              key={cat.key}
              label={`${cat.icon} ${cat.label}`}
              value={consumption[cat.key]}
              onChange={(val) => setConsumption({ ...consumption, [cat.key]: val })}
              min={0}
              max={5}
              labels={FREQUENCY_LABELS}
            />
          ))}
        </div>
      </section>

      {/* 자기효능감 */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">자기효능감</h3>
        <div className="space-y-3">
          {SELF_EFFICACY_ITEMS.map((item, idx) => (
            <LikertScaleInput
              key={idx}
              label={`${idx + 1}. ${item}`}
              value={efficacy[idx]}
              onChange={(val) => {
                const newEff = [...efficacy] as SelfEfficacy;
                newEff[idx] = val;
                setEfficacy(newEff);
              }}
              min={1}
              max={5}
              labels={LIKERT_LABELS}
            />
          ))}
        </div>
      </section>

      {/* 주관적 행복감 */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">주관적 행복감</h3>
        <div className="space-y-3">
          {HAPPINESS_ITEMS.map((item, idx) => (
            <LikertScaleInput
              key={idx}
              label={`${idx + 1}. ${item}`}
              value={happiness[idx]}
              onChange={(val) => {
                const newHap = [...happiness] as SubjectiveHappiness;
                newHap[idx] = val;
                setHappiness(newHap);
              }}
              min={1}
              max={5}
              labels={LIKERT_LABELS}
            />
          ))}
        </div>
      </section>

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        응답 저장
      </button>
    </form>
  );
}
