'use client';

import { useState } from 'react';
import { useSurveyData } from '@/hooks/useSurveyData';
import CsvUploader from '@/components/CsvUploader';
import SummaryStatsForm from '@/components/SummaryStatsForm';

export default function DataImportPage() {
  const { importRespondents } = useSurveyData();
  const [tab, setTab] = useState<'csv' | 'summary'>('csv');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">CSV 업로드 / 요약통계 입력</h1>
      <p className="text-sm text-gray-500 mb-6">CSV 파일로 데이터를 가져오거나, 사전 분석 결과(요약통계)를 직접 입력합니다.</p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('csv')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'csv' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          CSV 업로드
        </button>
        <button
          onClick={() => setTab('summary')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          요약통계 입력
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {tab === 'csv' ? (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">CSV 파일 업로드</h2>
            <p className="text-sm text-gray-500 mb-4">
              CSV 파일 형식: id, gender, ageGroup, educationLevel, incomeLevel, cc_movies, cc_concerts, ..., se_1~se_10, sh_1~sh_5, createdAt
            </p>
            <CsvUploader onImport={importRespondents} />
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">요약통계 직접 입력</h2>
            <p className="text-sm text-gray-500 mb-4">
              SPSS 등에서 분석한 결과 (평균, 표준편차, 상관계수)를 직접 입력할 수 있습니다.
            </p>
            <SummaryStatsForm />
          </>
        )}
      </div>
    </div>
  );
}
