'use client';

import type { MediationResult } from '@/types';

interface Props {
  result: MediationResult;
}

function formatCoeff(val: number): string {
  return val.toFixed(3);
}

function sigLabel(p: number): string {
  if (p < 0.001) return '***';
  if (p < 0.01) return '**';
  if (p < 0.05) return '*';
  return 'ns';
}

export default function PathAnalysisDiagram({ result }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-md font-semibold text-gray-800 mb-4">경로분석 다이어그램 (매개효과 모델)</h3>
      <svg viewBox="0 0 700 320" className="w-full max-w-2xl mx-auto">
        {/* Background */}
        <rect x="0" y="0" width="700" height="320" fill="#fafafa" rx="8" />

        {/* X Box: 문화소비 */}
        <rect x="40" y="130" width="160" height="60" rx="8" fill="#3b82f6" />
        <text x="120" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">문화소비</text>
        <text x="120" y="175" textAnchor="middle" fill="#bfdbfe" fontSize="11">(독립변수, X)</text>

        {/* M Box: 자기효능감 */}
        <rect x="270" y="20" width="160" height="60" rx="8" fill="#10b981" />
        <text x="350" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">자기효능감</text>
        <text x="350" y="65" textAnchor="middle" fill="#a7f3d0" fontSize="11">(매개변수, M)</text>

        {/* Y Box: 주관적 행복감 */}
        <rect x="500" y="130" width="160" height="60" rx="8" fill="#f59e0b" />
        <text x="580" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">주관적 행복감</text>
        <text x="580" y="175" textAnchor="middle" fill="#fef3c7" fontSize="11">(종속변수, Y)</text>

        {/* a path: X → M */}
        <line x1="200" y1="135" x2="270" y2="75" stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />
        <rect x="195" y="85" width="90" height="36" rx="4" fill="white" stroke="#d1d5db" />
        <text x="240" y="100" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">
          a = {formatCoeff(result.aPath.coeff)}
        </text>
        <text x="240" y="115" textAnchor="middle" fontSize="10" fill={result.aPath.p < 0.05 ? '#dc2626' : '#9ca3af'}>
          p = {result.aPath.p.toFixed(3)} {sigLabel(result.aPath.p)}
        </text>

        {/* b path: M → Y */}
        <line x1="430" y1="75" x2="500" y2="135" stroke="#374151" strokeWidth="2" markerEnd="url(#arrow)" />
        <rect x="415" y="85" width="90" height="36" rx="4" fill="white" stroke="#d1d5db" />
        <text x="460" y="100" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">
          b = {formatCoeff(result.bPath.coeff)}
        </text>
        <text x="460" y="115" textAnchor="middle" fontSize="10" fill={result.bPath.p < 0.05 ? '#dc2626' : '#9ca3af'}>
          p = {result.bPath.p.toFixed(3)} {sigLabel(result.bPath.p)}
        </text>

        {/* c' path: X → Y (direct) */}
        <line x1="200" y1="165" x2="500" y2="165" stroke="#374151" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#arrow)" />
        <rect x="290" y="195" width="120" height="52" rx="4" fill="white" stroke="#d1d5db" />
        <text x="350" y="211" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">
          {"c' = "}{formatCoeff(result.cPrimePath.coeff)}
        </text>
        <text x="350" y="226" textAnchor="middle" fontSize="10" fill={result.cPrimePath.p < 0.05 ? '#dc2626' : '#9ca3af'}>
          (직접효과) {sigLabel(result.cPrimePath.p)}
        </text>
        <text x="350" y="241" textAnchor="middle" fontSize="10" fill="#6b7280">
          c(총) = {formatCoeff(result.cPath.coeff)}
        </text>

        {/* Indirect effect label */}
        <rect x="250" y="265" width="200" height="42" rx="6" fill="#fef2f2" stroke="#fecaca" />
        <text x="350" y="282" textAnchor="middle" fontSize="11" fill="#991b1b" fontWeight="bold">
          간접효과 (a×b) = {formatCoeff(result.indirectEffect)}
        </text>
        <text x="350" y="298" textAnchor="middle" fontSize="10" fill="#991b1b">
          Sobel Z = {result.sobelZ.toFixed(3)}, p = {result.sobelP.toFixed(3)}
        </text>

        {/* Arrow marker */}
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
