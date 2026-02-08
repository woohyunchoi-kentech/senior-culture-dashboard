'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import SurveyForm from '@/components/SurveyForm';

export default function DataEntryPage() {
  const { respondents, addRespondent } = useSurveyData();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">설문 데이터 입력</h1>
          <p className="text-sm text-gray-500 mt-1">개별 응답자의 설문 결과를 입력합니다.</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
          현재 {respondents.length}건
        </span>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <SurveyForm onSubmit={addRespondent} />
      </div>
    </div>
  );
}
