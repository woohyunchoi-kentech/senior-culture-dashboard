'use client';

import { useState } from 'react';
import type { SummaryStatsInput } from '@/types';
import { saveSummaryStats } from '@/lib/storage';

const DEFAULT_VARS = ['문화소비', '자기효능감', '주관적 행복감'];

export default function SummaryStatsForm() {
  const [n, setN] = useState(200);
  const [means, setMeans] = useState([3.2, 3.5, 3.4]);
  const [sds, setSds] = useState([0.85, 0.72, 0.78]);
  const [correlations, setCorrelations] = useState<number[][]>([
    [1.0, 0.45, 0.52],
    [0.45, 1.0, 0.58],
    [0.52, 0.58, 1.0],
  ]);

  const handleSave = () => {
    const stats: SummaryStatsInput = {
      n,
      variables: DEFAULT_VARS,
      means,
      standardDeviations: sds,
      correlations,
    };
    saveSummaryStats(stats);
    alert('요약통계가 저장되었습니다!');
  };

  const updateCorrelation = (i: number, j: number, val: number) => {
    const newCorr = correlations.map((row) => [...row]);
    newCorr[i][j] = val;
    newCorr[j][i] = val; // symmetric
    setCorrelations(newCorr);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">표본 크기 (N)</label>
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="border rounded-md p-2 w-32 text-gray-900"
          min={1}
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">평균 / 표준편차</h4>
        <table className="text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-gray-700">변수</th>
              <th className="border px-3 py-2 text-gray-700">평균 (M)</th>
              <th className="border px-3 py-2 text-gray-700">표준편차 (SD)</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_VARS.map((v, i) => (
              <tr key={v}>
                <td className="border px-3 py-2 font-medium text-gray-700">{v}</td>
                <td className="border px-3 py-1">
                  <input
                    type="number"
                    step="0.01"
                    value={means[i]}
                    onChange={(e) => {
                      const newM = [...means];
                      newM[i] = Number(e.target.value);
                      setMeans(newM);
                    }}
                    className="border rounded p-1 w-20 text-gray-900"
                  />
                </td>
                <td className="border px-3 py-1">
                  <input
                    type="number"
                    step="0.01"
                    value={sds[i]}
                    onChange={(e) => {
                      const newSD = [...sds];
                      newSD[i] = Number(e.target.value);
                      setSds(newSD);
                    }}
                    className="border rounded p-1 w-20 text-gray-900"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">상관행렬</h4>
        <table className="text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-gray-700"></th>
              {DEFAULT_VARS.map((v) => (
                <th key={v} className="border px-3 py-2 text-gray-700">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEFAULT_VARS.map((v, i) => (
              <tr key={v}>
                <td className="border px-3 py-2 font-medium bg-gray-50 text-gray-700">{v}</td>
                {DEFAULT_VARS.map((_, j) => (
                  <td key={j} className="border px-2 py-1">
                    {i === j ? (
                      <span className="text-gray-400 block text-center">1.00</span>
                    ) : i < j ? (
                      <input
                        type="number"
                        step="0.01"
                        min="-1"
                        max="1"
                        value={correlations[i][j]}
                        onChange={(e) => updateCorrelation(i, j, Number(e.target.value))}
                        className="border rounded p-1 w-16 text-gray-900"
                      />
                    ) : (
                      <span className="text-gray-400 block text-center">{correlations[i][j].toFixed(2)}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        요약통계 저장
      </button>
    </div>
  );
}
