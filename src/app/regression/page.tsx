'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import RegressionResultsTable from '@/components/RegressionResultsTable';
import ScatterPlotWithRegression from '@/components/ScatterPlotWithRegression';

export default function RegressionPage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const { variables, regressionXY, regressionXM, regressionMY, multipleReg } = useStatistics(respondents);

  if (!isLoaded) return <div className="text-center py-12 text-gray-500">로딩 중...</div>;

  if (respondents.length < 4) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">회귀분석에는 최소 4건의 데이터가 필요합니다</p>
        <button onClick={loadSampleData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          샘플 데이터 로드
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">회귀분석</h1>
        <p className="text-sm text-gray-500 mt-1">단순 회귀 및 다중 회귀분석 결과를 확인합니다. (N = {respondents.length})</p>
      </div>

      {/* 단순 회귀 요약 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">단순 회귀분석 요약</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2 text-left text-gray-700">모형</th>
                <th className="border px-4 py-2 text-right text-gray-700">B (기울기)</th>
                <th className="border px-4 py-2 text-right text-gray-700">SE</th>
                <th className="border px-4 py-2 text-right text-gray-700">R²</th>
                <th className="border px-4 py-2 text-right text-gray-700">t</th>
                <th className="border px-4 py-2 text-right text-gray-700">p</th>
              </tr>
            </thead>
            <tbody>
              {regressionXM && (
                <tr className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-medium text-gray-800">문화소비 → 자기효능감</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXM.slope.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXM.se.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXM.r2.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXM.t.toFixed(3)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXM.p.toFixed(4)}</td>
                </tr>
              )}
              {regressionXY && (
                <tr className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-medium text-gray-800">문화소비 → 주관적 행복감</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXY.slope.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXY.se.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXY.r2.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXY.t.toFixed(3)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionXY.p.toFixed(4)}</td>
                </tr>
              )}
              {regressionMY && (
                <tr className="hover:bg-gray-50">
                  <td className="border px-4 py-2 font-medium text-gray-800">자기효능감 → 주관적 행복감</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionMY.slope.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionMY.se.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionMY.r2.toFixed(4)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionMY.t.toFixed(3)}</td>
                  <td className="border px-4 py-2 text-right font-mono text-gray-700">{regressionMY.p.toFixed(4)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 다중 회귀 */}
      {multipleReg && (
        <RegressionResultsTable
          result={multipleReg}
          title="다중 회귀분석: 문화소비 + 자기효능감 → 주관적 행복감"
        />
      )}

      {/* 산점도 */}
      {variables && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regressionXY && (
            <ScatterPlotWithRegression
              xData={variables.consumption}
              yData={variables.happiness}
              xLabel="문화소비"
              yLabel="주관적 행복감"
              slope={regressionXY.slope}
              intercept={regressionXY.intercept}
              r2={regressionXY.r2}
              title="문화소비 → 주관적 행복감"
            />
          )}
          {regressionXM && (
            <ScatterPlotWithRegression
              xData={variables.consumption}
              yData={variables.efficacy}
              xLabel="문화소비"
              yLabel="자기효능감"
              slope={regressionXM.slope}
              intercept={regressionXM.intercept}
              r2={regressionXM.r2}
              title="문화소비 → 자기효능감"
            />
          )}
        </div>
      )}
    </div>
  );
}
