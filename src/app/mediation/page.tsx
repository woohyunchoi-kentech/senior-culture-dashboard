'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import PathAnalysisDiagram from '@/components/PathAnalysisDiagram';
import MediationEffectChart from '@/components/MediationEffectChart';

export default function MediationPage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const { mediation } = useStatistics(respondents);

  if (!isLoaded) return <div className="text-center py-12 text-gray-500">로딩 중...</div>;

  if (respondents.length < 4) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">매개효과 분석에는 최소 4건의 데이터가 필요합니다</p>
        <button onClick={loadSampleData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          샘플 데이터 로드
        </button>
      </div>
    );
  }

  if (!mediation) return <div className="text-center py-12 text-gray-500">분석 중...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">매개효과 분석</h1>
        <p className="text-sm text-gray-500 mt-1">
          문화소비(X) → 자기효능감(M) → 주관적 행복감(Y) 매개 모델 분석 결과 (N = {respondents.length})
        </p>
      </div>

      <PathAnalysisDiagram result={mediation} />
      <MediationEffectChart result={mediation} />

      {/* 상세 결과 표 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">매개효과 상세 결과</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2 text-left text-gray-700">경로</th>
                <th className="border px-4 py-2 text-right text-gray-700">계수 (B)</th>
                <th className="border px-4 py-2 text-right text-gray-700">SE</th>
                <th className="border px-4 py-2 text-right text-gray-700">t</th>
                <th className="border px-4 py-2 text-right text-gray-700">p</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium text-gray-800">a (X → M): 문화소비 → 자기효능감</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.aPath.coeff.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.aPath.se.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.aPath.t.toFixed(3)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.aPath.p.toFixed(4)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium text-gray-800">b (M → Y): 자기효능감 → 행복감 (X 통제)</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.bPath.coeff.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.bPath.se.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.bPath.t.toFixed(3)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.bPath.p.toFixed(4)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium text-gray-800">c (X → Y): 총효과</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPath.coeff.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPath.se.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPath.t.toFixed(3)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPath.p.toFixed(4)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium text-gray-800">c&apos; (X → Y): 직접효과 (M 통제)</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPrimePath.coeff.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPrimePath.se.toFixed(4)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPrimePath.t.toFixed(3)}</td>
                <td className="border px-4 py-2 text-right font-mono text-gray-700">{mediation.cPrimePath.p.toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">Sobel 검정</h3>
            <p className="text-2xl font-bold text-red-700">Z = {mediation.sobelZ.toFixed(3)}</p>
            <p className="text-sm text-red-600">p = {mediation.sobelP.toFixed(4)}</p>
            <p className="text-xs text-red-500 mt-1">
              {mediation.sobelP < 0.05 ? '간접효과가 통계적으로 유의합니다.' : '간접효과가 통계적으로 유의하지 않습니다.'}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">매개비율</h3>
            <p className="text-2xl font-bold text-blue-700">{(mediation.proportionMediated * 100).toFixed(1)}%</p>
            <p className="text-sm text-blue-600">간접효과 / 총효과</p>
            <p className="text-xs text-blue-500 mt-1">
              총효과 중 {(mediation.proportionMediated * 100).toFixed(1)}%가 자기효능감을 통해 매개됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
