'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import DescriptiveStatsTable from '@/components/DescriptiveStatsTable';
import ConsumptionBarChart from '@/components/ConsumptionBarChart';
import DemographicPieChart from '@/components/DemographicPieChart';

export default function DescriptivePage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const { descriptive } = useStatistics(respondents);

  if (!isLoaded) return <div className="text-center py-12 text-gray-500">로딩 중...</div>;

  if (respondents.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">데이터가 없습니다</p>
        <button onClick={loadSampleData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          샘플 데이터 로드
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">기술통계 분석</h1>
        <p className="text-sm text-gray-500 mt-1">주요 변수의 기술통계량과 인구통계 분포를 확인합니다. (N = {respondents.length})</p>
      </div>

      {descriptive && <DescriptiveStatsTable stats={descriptive} />}

      <ConsumptionBarChart respondents={respondents} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DemographicPieChart respondents={respondents} field="gender" title="성별 분포" />
        <DemographicPieChart respondents={respondents} field="ageGroup" title="연령대 분포" />
        <DemographicPieChart respondents={respondents} field="educationLevel" title="학력 분포" />
        <DemographicPieChart respondents={respondents} field="incomeLevel" title="소득 수준 분포" />
      </div>
    </div>
  );
}
