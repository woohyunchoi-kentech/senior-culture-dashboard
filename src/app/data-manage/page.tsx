'use client';

import { useState } from 'react';
import { useSurveyData } from '@/hooks/useSurveyData';
import { respondentsToCSV, downloadCSV } from '@/lib/csv';
import { getConsumptionMean, getEfficacyMean, getHappinessMean } from '@/lib/statistics';

export default function DataManagePage() {
  const { respondents, isLoaded, deleteRespondent, clearAll, loadSampleData } = useSurveyData();
  const [search, setSearch] = useState('');

  if (!isLoaded) return <div className="text-center py-12 text-gray-500">로딩 중...</div>;

  const filtered = respondents.filter((r) =>
    r.id.includes(search) || r.gender.includes(search) || r.ageGroup.includes(search)
  );

  const handleExport = () => {
    if (respondents.length === 0) return;
    const csv = respondentsToCSV(respondents);
    downloadCSV(csv, `senior-culture-data-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleClearAll = () => {
    if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      clearAll();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">데이터 관리</h1>
          <p className="text-sm text-gray-500 mt-1">데이터 조회, 삭제, 내보내기</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadSampleData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            샘플 데이터 로드
          </button>
          <button onClick={handleExport} disabled={respondents.length === 0} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 transition-colors">
            CSV 내보내기
          </button>
          <button onClick={handleClearAll} disabled={respondents.length === 0} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 transition-colors">
            전체 삭제
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="검색 (ID, 성별, 연령대)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm w-64 text-gray-900"
        />
        <span className="text-sm text-gray-500">총 {respondents.length}건 / 검색 결과 {filtered.length}건</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-400">데이터가 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2 text-left text-gray-700">ID</th>
                <th className="border px-3 py-2 text-gray-700">성별</th>
                <th className="border px-3 py-2 text-gray-700">연령대</th>
                <th className="border px-3 py-2 text-gray-700">학력</th>
                <th className="border px-3 py-2 text-gray-700">소득</th>
                <th className="border px-3 py-2 text-right text-gray-700">문화소비 (M)</th>
                <th className="border px-3 py-2 text-right text-gray-700">자기효능감 (M)</th>
                <th className="border px-3 py-2 text-right text-gray-700">행복감 (M)</th>
                <th className="border px-3 py-2 text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-mono text-xs text-gray-700">{r.id}</td>
                  <td className="border px-3 py-2 text-center text-gray-700">{r.gender}</td>
                  <td className="border px-3 py-2 text-center text-gray-700">{r.ageGroup}</td>
                  <td className="border px-3 py-2 text-center text-gray-700">{r.educationLevel}</td>
                  <td className="border px-3 py-2 text-center text-gray-700">{r.incomeLevel}</td>
                  <td className="border px-3 py-2 text-right font-mono text-gray-700">{getConsumptionMean(r).toFixed(2)}</td>
                  <td className="border px-3 py-2 text-right font-mono text-gray-700">{getEfficacyMean(r).toFixed(2)}</td>
                  <td className="border px-3 py-2 text-right font-mono text-gray-700">{getHappinessMean(r).toFixed(2)}</td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`응답자 ${r.id}를 삭제하시겠습니까?`)) {
                          deleteRespondent(r.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 100 && (
            <p className="text-center py-2 text-sm text-gray-400">... 외 {filtered.length - 100}건 (최대 100건 표시)</p>
          )}
        </div>
      )}
    </div>
  );
}
