'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import type { Respondent } from '@/types';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

interface Props {
  respondents: Respondent[];
  field: 'gender' | 'ageGroup' | 'educationLevel' | 'incomeLevel';
  title: string;
}

export default function DemographicPieChart({ respondents, field, title }: Props) {
  if (respondents.length === 0) return null;

  const counts: Record<string, number> = {};
  respondents.forEach((r) => {
    const val = r[field];
    counts[val] = (counts[val] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-md font-semibold text-gray-800 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(props: PieLabelRenderProps) => `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
