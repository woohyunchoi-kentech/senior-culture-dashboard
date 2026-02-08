'use client';

import type { RegressionResult } from '@/types';

interface Props {
  result: RegressionResult;
  title?: string;
}

function significance(p: number): string {
  if (p < 0.001) return '***';
  if (p < 0.01) return '**';
  if (p < 0.05) return '*';
  return '';
}

export default function RegressionResultsTable({ result, title = '다중 회귀분석 결과' }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h3 className="text-md font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded p-3">
          <p className="text-gray-500">R²</p>
          <p className="text-lg font-bold text-gray-900">{result.rSquared.toFixed(4)}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-gray-500">수정된 R²</p>
          <p className="text-lg font-bold text-gray-900">{result.adjustedRSquared.toFixed(4)}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-gray-500">F</p>
          <p className="text-lg font-bold text-gray-900">{result.fStatistic.toFixed(3)}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-gray-500">N</p>
          <p className="text-lg font-bold text-gray-900">{result.n}</p>
        </div>
      </div>

      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-3 py-2 text-left text-gray-700">변수</th>
            <th className="border px-3 py-2 text-right text-gray-700">B</th>
            <th className="border px-3 py-2 text-right text-gray-700">SE</th>
            <th className="border px-3 py-2 text-right text-gray-700">Beta</th>
            <th className="border px-3 py-2 text-right text-gray-700">t</th>
            <th className="border px-3 py-2 text-right text-gray-700">p</th>
            <th className="border px-3 py-2 text-center text-gray-700">유의</th>
          </tr>
        </thead>
        <tbody>
          {result.coefficients.map((c) => (
            <tr key={c.variable} className="hover:bg-gray-50">
              <td className="border px-3 py-2 font-medium text-gray-800">{c.variable}</td>
              <td className="border px-3 py-2 text-right font-mono text-gray-700">{c.b.toFixed(4)}</td>
              <td className="border px-3 py-2 text-right font-mono text-gray-700">{c.se.toFixed(4)}</td>
              <td className="border px-3 py-2 text-right font-mono text-gray-700">{c.beta.toFixed(4)}</td>
              <td className="border px-3 py-2 text-right font-mono text-gray-700">{c.t.toFixed(3)}</td>
              <td className="border px-3 py-2 text-right font-mono text-gray-700">{c.p.toFixed(4)}</td>
              <td className="border px-3 py-2 text-center text-red-600 font-medium">{significance(c.p)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">* p&lt;.05, ** p&lt;.01, *** p&lt;.001</p>
    </div>
  );
}
