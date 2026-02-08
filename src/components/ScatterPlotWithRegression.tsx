'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

interface Props {
  xData: number[];
  yData: number[];
  xLabel: string;
  yLabel: string;
  slope: number;
  intercept: number;
  r2: number;
  title: string;
}

export default function ScatterPlotWithRegression({ xData, yData, xLabel, yLabel, slope, intercept, r2, title }: Props) {
  if (xData.length === 0) return null;

  const scatterData = xData.map((x, i) => ({ x, y: yData[i] }));
  const xMin = Math.min(...xData);
  const xMax = Math.max(...xData);

  // Regression line points
  const lineData = Array.from({ length: 20 }, (_, i) => {
    const x = xMin + (i / 19) * (xMax - xMin);
    return { x, y: slope * x + intercept };
  });

  // Merge for ComposedChart
  const allData = scatterData.map((d) => ({ ...d, lineY: undefined as number | undefined }));
  lineData.forEach((d) => allData.push({ x: d.x, y: undefined as unknown as number, lineY: d.y }));
  allData.sort((a, b) => a.x - b.x);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-md font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-xs text-gray-500 mb-3">R² = {r2.toFixed(4)}, Y = {slope.toFixed(3)}X + {intercept.toFixed(3)}</p>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            name={xLabel}
            label={{ value: xLabel, position: 'bottom', offset: 0, style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            name={yLabel}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(val) => typeof val === 'number' ? val.toFixed(3) : val} />
          <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.6} />
          <Line data={lineData} dataKey="y" stroke="#ef4444" strokeWidth={2} dot={false} type="linear" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
