'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import { CULTURAL_CONSUMPTION_CATEGORIES } from '@/lib/constants';
import { mean, std, cronbachAlpha } from '@/lib/statistics';
import { useMemo } from 'react';
import type { PaperData } from './paperData';

import CoverAndTOC from './sections/CoverAndTOC';
import KoreanAbstract from './sections/KoreanAbstract';
import EnglishAbstract from './sections/EnglishAbstract';
import Chapter1 from './sections/Chapter1';
import Chapter2Part1 from './sections/Chapter2Part1';
import Chapter2Part2 from './sections/Chapter2Part2';
import Chapter2Part3 from './sections/Chapter2Part3';
import Chapter3 from './sections/Chapter3';
import Chapter4 from './sections/Chapter4';
import Chapter5 from './sections/Chapter5';
import References from './sections/References';
import Appendix from './sections/Appendix';

export default function PaperPage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const stats = useStatistics(respondents);

  const reliability = useMemo(() => {
    if (respondents.length < 3) return null;

    const consumptionItems = CULTURAL_CONSUMPTION_CATEGORIES.map(cat =>
      respondents.map(r => r.culturalConsumption[cat.key])
    );
    const alphaConsumption = cronbachAlpha(consumptionItems);

    const efficacyItems = Array.from({ length: 10 }, (_, i) =>
      respondents.map(r => r.selfEfficacy[i])
    );
    const alphaEfficacy = cronbachAlpha(efficacyItems);

    const happinessItems = Array.from({ length: 5 }, (_, i) =>
      respondents.map(r => r.subjectiveHappiness[i])
    );
    const alphaHappiness = cronbachAlpha(happinessItems);

    return { alphaConsumption, alphaEfficacy, alphaHappiness };
  }, [respondents]);

  if (!isLoaded) return <div className="text-center py-12 text-gray-500">로딩 중...</div>;

  if (respondents.length < 4) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">논문 생성에 데이터가 필요합니다</p>
        <button onClick={loadSampleData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          샘플 데이터 로드 (40건)
        </button>
      </div>
    );
  }

  const { descriptive, correlations, regressionXY, regressionXM, regressionMY, multipleReg, mediation } = stats;
  if (!descriptive || !mediation || !multipleReg || !regressionXY || !regressionXM || !regressionMY || !reliability) {
    return <div className="text-center py-12 text-gray-500">통계 계산 중...</div>;
  }

  const N = respondents.length;
  const corXM = correlations.find(c => c.variable1 === '문화소비' && c.variable2 === '자기효능감');
  const corXY = correlations.find(c => c.variable1 === '문화소비' && c.variable2 === '주관적 행복감');
  const corMY = correlations.find(c => c.variable1 === '자기효능감' && c.variable2 === '주관적 행복감');

  const genderCount: Record<string, number> = {};
  const ageCount: Record<string, number> = {};
  const eduCount: Record<string, number> = {};
  const incomeCount: Record<string, number> = {};
  respondents.forEach(r => {
    genderCount[r.gender] = (genderCount[r.gender] || 0) + 1;
    ageCount[r.ageGroup] = (ageCount[r.ageGroup] || 0) + 1;
    eduCount[r.educationLevel] = (eduCount[r.educationLevel] || 0) + 1;
    incomeCount[r.incomeLevel] = (incomeCount[r.incomeLevel] || 0) + 1;
  });

  const categoryStats = CULTURAL_CONSUMPTION_CATEGORIES.map(cat => {
    const vals = respondents.map(r => r.culturalConsumption[cat.key]);
    return { label: cat.label, key: cat.key, mean: mean(vals), std: std(vals) };
  });
  const sortedCategories = [...categoryStats].sort((a, b) => b.mean - a.mean);

  const paperData: PaperData = {
    N,
    genderCount,
    ageCount,
    eduCount,
    incomeCount,
    descriptive,
    correlations,
    corXM,
    corXY,
    corMY,
    regressionXY: { ...regressionXY, label: '문화소비 → 주관적 행복감' },
    regressionXM: { ...regressionXM, label: '문화소비 → 자기효능감' },
    regressionMY: { ...regressionMY, label: '자기효능감 → 주관적 행복감' },
    multipleReg,
    mediation,
    reliability,
    categoryStats,
    sortedCategories,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">학술 논문</h1>
        <button
          onClick={() => window.print()}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
        >
          인쇄 / PDF 저장
        </button>
      </div>

      <article
        className="bg-white rounded-lg shadow p-8 md:p-12 space-y-6 text-gray-800 print:shadow-none print:p-0"
        style={{ fontFamily: "'Noto Serif KR', 'Times New Roman', Georgia, serif", lineHeight: 1.8 }}
      >
        {/* 표지 + 목차 */}
        <CoverAndTOC N={N} />

        {/* 국문 초록 */}
        <KoreanAbstract data={paperData} />

        {/* I. 서론 */}
        <div className="break-before-page">
          <Chapter1 />
        </div>

        {/* II. 이론적 고찰 */}
        <section className="break-before-page">
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">Ⅱ. 이론적 고찰</h2>
          <Chapter2Part1 />
          <Chapter2Part2 />
          <Chapter2Part3 />
        </section>

        {/* III. 연구 설계 */}
        <div className="break-before-page">
          <Chapter3 data={paperData} />
        </div>

        {/* IV. 분석 결과 */}
        <div className="break-before-page">
          <Chapter4 data={paperData} />
        </div>

        {/* V. 결론 */}
        <div className="break-before-page">
          <Chapter5 data={paperData} />
        </div>

        {/* 참고문헌 */}
        <References />

        {/* 영문 초록 */}
        <EnglishAbstract data={paperData} />

        {/* 부록 */}
        <Appendix N={N} />
      </article>
    </div>
  );
}
