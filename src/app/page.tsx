'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import StatCard from '@/components/StatCard';
import ConsumptionBarChart from '@/components/ConsumptionBarChart';
import DemographicPieChart from '@/components/DemographicPieChart';

export default function DashboardPage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const { descriptive, correlations, mediation } = useStatistics(respondents);

  if (!isLoaded) return <div className="text-center py-12 text-gray-500">로딩 중...</div>;

  const corXM = correlations.find((c) => c.variable1 === '문화소비' && c.variable2 === '자기효능감');
  const corXY = correlations.find((c) => c.variable1 === '문화소비' && c.variable2 === '주관적 행복감');
  const corMY = correlations.find((c) => c.variable1 === '자기효능감' && c.variable2 === '주관적 행복감');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">연구 대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">시니어 계층의 문화소비가 자기효능감과 주관적 행복감에 미치는 영향</p>
        </div>
        {respondents.length === 0 && (
          <button onClick={loadSampleData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            샘플 데이터 로드 (40건)
          </button>
        )}
      </div>

      {respondents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-400 text-lg mb-4">아직 데이터가 없습니다</p>
          <p className="text-sm text-gray-400">위의 &quot;샘플 데이터 로드&quot; 버튼을 클릭하거나,<br />&quot;데이터 입력&quot; 또는 &quot;CSV/통계 입력&quot; 메뉴에서 데이터를 추가하세요.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="응답자 수" value={respondents.length} subtitle="N" color="bg-blue-500" />
            <StatCard
              title="문화소비 평균"
              value={descriptive ? descriptive['문화소비'].mean.toFixed(2) : '-'}
              subtitle={descriptive ? `SD = ${descriptive['문화소비'].std.toFixed(2)}` : ''}
              color="bg-indigo-500"
            />
            <StatCard
              title="자기효능감 평균"
              value={descriptive ? descriptive['자기효능감'].mean.toFixed(2) : '-'}
              subtitle={descriptive ? `SD = ${descriptive['자기효능감'].std.toFixed(2)}` : ''}
              color="bg-green-500"
            />
            <StatCard
              title="행복감 평균"
              value={descriptive ? descriptive['주관적 행복감'].mean.toFixed(2) : '-'}
              subtitle={descriptive ? `SD = ${descriptive['주관적 행복감'].std.toFixed(2)}` : ''}
              color="bg-amber-500"
            />
          </div>

          {/* Correlation Summary */}
          {correlations.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <StatCard title="r (문화소비↔자기효능감)" value={corXM ? corXM.r.toFixed(3) : '-'} subtitle={corXM ? `p = ${corXM.p.toFixed(4)}` : ''} color="bg-purple-500" />
              <StatCard title="r (문화소비↔행복감)" value={corXY ? corXY.r.toFixed(3) : '-'} subtitle={corXY ? `p = ${corXY.p.toFixed(4)}` : ''} color="bg-pink-500" />
              <StatCard title="r (자기효능감↔행복감)" value={corMY ? corMY.r.toFixed(3) : '-'} subtitle={corMY ? `p = ${corMY.p.toFixed(4)}` : ''} color="bg-teal-500" />
            </div>
          )}

          {/* Mediation Quick Summary */}
          {mediation && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">매개효과 요약</h2>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">총효과 (c)</p>
                  <p className="text-xl font-bold text-blue-600">{mediation.totalEffect.toFixed(4)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">직접효과 (c&apos;)</p>
                  <p className="text-xl font-bold text-green-600">{mediation.directEffect.toFixed(4)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">간접효과 (a×b)</p>
                  <p className="text-xl font-bold text-red-600">{mediation.indirectEffect.toFixed(4)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Sobel Z</p>
                  <p className="text-xl font-bold text-gray-800">{mediation.sobelZ.toFixed(3)}</p>
                  <p className="text-xs text-gray-400">p = {mediation.sobelP.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConsumptionBarChart respondents={respondents} />
            <DemographicPieChart respondents={respondents} field="gender" title="성별 분포" />
            <DemographicPieChart respondents={respondents} field="ageGroup" title="연령대 분포" />
            <DemographicPieChart respondents={respondents} field="educationLevel" title="학력 분포" />
          </div>
        </>
      )}
    </div>
  );
}
