'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Respondent } from '@/types';
import { CULTURAL_CONSUMPTION_CATEGORIES } from '@/lib/constants';
import { mean } from '@/lib/statistics';

interface Props {
  respondents: Respondent[];
}

export default function ConsumptionBarChart({ respondents }: Props) {
  if (respondents.length === 0) return <p className="text-gray-400 text-center py-8">데이터 없음</p>;

  const data = CULTURAL_CONSUMPTION_CATEGORIES.map((cat) => ({
    name: cat.label,
    평균: Number(mean(respondents.map((r) => r.culturalConsumption[cat.key])).toFixed(2)),
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-md font-semibold text-gray-800 mb-4">문화소비 활동별 평균 빈도</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="평균" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
