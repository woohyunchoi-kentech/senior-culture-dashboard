'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import CorrelationMatrix from '@/components/CorrelationMatrix';
import ScatterPlotWithRegression from '@/components/ScatterPlotWithRegression';

export default function CorrelationPage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const { variables, correlations, regressionXY, regressionXM, regressionMY } = useStatistics(respondents);

  if (!isLoaded) return <div className="text-center py-12 text-gray-500">로딩 중...</div>;

  if (respondents.length < 3) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">상관분석에는 최소 3건의 데이터가 필요합니다</p>
        <button onClick={loadSampleData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          샘플 데이터 로드
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">상관관계 분석</h1>
        <p className="text-sm text-gray-500 mt-1">주요 변수 간 Pearson 상관계수와 산점도를 확인합니다. (N = {respondents.length})</p>
      </div>

      <CorrelationMatrix correlations={correlations} />

      {variables && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regressionXM && (
            <ScatterPlotWithRegression
              xData={variables.consumption}
              yData={variables.efficacy}
              xLabel="문화소비"
              yLabel="자기효능감"
              slope={regressionXM.slope}
              intercept={regressionXM.intercept}
              r2={regressionXM.r2}
              title="문화소비 × 자기효능감"
            />
          )}
          {regressionXY && (
            <ScatterPlotWithRegression
              xData={variables.consumption}
              yData={variables.happiness}
              xLabel="문화소비"
              yLabel="주관적 행복감"
              slope={regressionXY.slope}
              intercept={regressionXY.intercept}
              r2={regressionXY.r2}
              title="문화소비 × 주관적 행복감"
            />
          )}
          {regressionMY && (
            <ScatterPlotWithRegression
              xData={variables.efficacy}
              yData={variables.happiness}
              xLabel="자기효능감"
              yLabel="주관적 행복감"
              slope={regressionMY.slope}
              intercept={regressionMY.intercept}
              r2={regressionMY.r2}
              title="자기효능감 × 주관적 행복감"
            />
          )}
        </div>
      )}
    </div>
  );
}
