'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import type { MediationResult } from '@/types';

interface Props {
  result: MediationResult;
}

export default function MediationEffectChart({ result }: Props) {
  const data = [
    { name: '총효과 (c)', value: result.totalEffect, color: '#3b82f6' },
    { name: '직접효과 (c\')', value: result.directEffect, color: '#10b981' },
    { name: '간접효과 (a×b)', value: result.indirectEffect, color: '#ef4444' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-md font-semibold text-gray-800 mb-4">매개효과 비교</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(val) => typeof val === 'number' ? val.toFixed(4) : val} />
          <Legend />
          <Bar dataKey="value" name="효과 크기" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="bg-blue-50 rounded p-3 text-center">
          <p className="text-blue-600 font-medium">총효과</p>
          <p className="text-lg font-bold text-blue-800">{result.totalEffect.toFixed(4)}</p>
        </div>
        <div className="bg-green-50 rounded p-3 text-center">
          <p className="text-green-600 font-medium">직접효과</p>
          <p className="text-lg font-bold text-green-800">{result.directEffect.toFixed(4)}</p>
        </div>
        <div className="bg-red-50 rounded p-3 text-center">
          <p className="text-red-600 font-medium">간접효과</p>
          <p className="text-lg font-bold text-red-800">{result.indirectEffect.toFixed(4)}</p>
          <p className="text-xs text-red-500">매개비율: {(result.proportionMediated * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
