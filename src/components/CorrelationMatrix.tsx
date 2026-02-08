'use client';

import type { CorrelationResult } from '@/types';

interface Props {
  correlations: CorrelationResult[];
}

function getColor(r: number): string {
  const absR = Math.abs(r);
  if (r >= 0) {
    // Positive: blue
    const intensity = Math.floor(absR * 255);
    return `rgb(${255 - intensity}, ${255 - intensity * 0.3}, 255)`;
  } else {
    // Negative: red
    const intensity = Math.floor(absR * 255);
    return `rgb(255, ${255 - intensity * 0.7}, ${255 - intensity})`;
  }
}

function getSignificance(p: number): string {
  if (p < 0.001) return '***';
  if (p < 0.01) return '**';
  if (p < 0.05) return '*';
  return '';
}

export default function CorrelationMatrix({ correlations }: Props) {
  if (correlations.length === 0) return null;

  const variables = Array.from(new Set(correlations.flatMap((c) => [c.variable1, c.variable2])));

  // Build matrix
  const matrix: Record<string, Record<string, { r: number; p: number }>> = {};
  variables.forEach((v) => {
    matrix[v] = {};
    variables.forEach((v2) => {
      matrix[v][v2] = { r: v === v2 ? 1 : 0, p: 0 };
    });
  });

  correlations.forEach((c) => {
    matrix[c.variable1][c.variable2] = { r: c.r, p: c.p };
    matrix[c.variable2][c.variable1] = { r: c.r, p: c.p };
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h3 className="text-md font-semibold text-gray-800 mb-4">상관행렬 (Pearson r)</h3>
      <table className="text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-gray-700"></th>
            {variables.map((v) => (
              <th key={v} className="border px-4 py-2 text-gray-700 font-medium">{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variables.map((v1) => (
            <tr key={v1}>
              <td className="border px-4 py-2 font-medium bg-gray-50 text-gray-700">{v1}</td>
              {variables.map((v2) => {
                const { r, p } = matrix[v1][v2];
                const isOne = v1 === v2;
                return (
                  <td
                    key={v2}
                    className="border px-4 py-2 text-center font-mono"
                    style={{ backgroundColor: isOne ? '#f3f4f6' : getColor(r) }}
                  >
                    <span className={isOne ? 'text-gray-400' : 'text-gray-900 font-medium'}>
                      {r.toFixed(3)}
                    </span>
                    {!isOne && (
                      <span className="text-red-600 text-xs ml-0.5">{getSignificance(p)}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">* p&lt;.05, ** p&lt;.01, *** p&lt;.001</p>
    </div>
  );
}
