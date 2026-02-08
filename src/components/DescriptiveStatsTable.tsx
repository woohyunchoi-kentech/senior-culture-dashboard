'use client';

import type { DescriptiveStats } from '@/types';

interface Props {
  stats: Record<string, DescriptiveStats>;
}

export default function DescriptiveStatsTable({ stats }: Props) {
  const entries = Object.entries(stats);
  if (entries.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h3 className="text-md font-semibold text-gray-800 mb-4">기술통계량</h3>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-3 py-2 text-left text-gray-700">변수</th>
            <th className="border px-3 py-2 text-right text-gray-700">N</th>
            <th className="border px-3 py-2 text-right text-gray-700">평균</th>
            <th className="border px-3 py-2 text-right text-gray-700">표준편차</th>
            <th className="border px-3 py-2 text-right text-gray-700">최솟값</th>
            <th className="border px-3 py-2 text-right text-gray-700">최댓값</th>
            <th className="border px-3 py-2 text-right text-gray-700">중위수</th>
            <th className="border px-3 py-2 text-right text-gray-700">왜도</th>
            <th className="border px-3 py-2 text-right text-gray-700">첨도</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([name, s]) => (
            <tr key={name} className="hover:bg-gray-50">
              <td className="border px-3 py-2 font-medium text-gray-800">{name}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.n}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.mean.toFixed(3)}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.std.toFixed(3)}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.min.toFixed(2)}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.max.toFixed(2)}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.median.toFixed(3)}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.skewness.toFixed(3)}</td>
              <td className="border px-3 py-2 text-right text-gray-700">{s.kurtosis.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
