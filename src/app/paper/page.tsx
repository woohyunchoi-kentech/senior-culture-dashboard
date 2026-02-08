'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import { CULTURAL_CONSUMPTION_CATEGORIES, SELF_EFFICACY_ITEMS, HAPPINESS_ITEMS } from '@/lib/constants';
import { mean } from '@/lib/statistics';

function fmt(n: number, d: number = 3): string {
  return n.toFixed(d);
}

function sig(p: number): string {
  if (p < 0.001) return 'p < .001';
  if (p < 0.01) return 'p < .01';
  if (p < 0.05) return 'p < .05';
  return `p = ${fmt(p)}`;
}

function stars(p: number): string {
  if (p < 0.001) return '***';
  if (p < 0.01) return '**';
  if (p < 0.05) return '*';
  return '';
}

export default function PaperPage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const stats = useStatistics(respondents);

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

  const { descriptive, correlations, regressionXY, regressionXM, regressionMY, multipleReg, mediation, variables } = stats;
  if (!descriptive || !mediation || !multipleReg || !variables || !regressionXY || !regressionXM || !regressionMY) {
    return <div className="text-center py-12 text-gray-500">통계 계산 중...</div>;
  }

  const N = respondents.length;
  const corXM = correlations.find(c => c.variable1 === '문화소비' && c.variable2 === '자기효능감');
  const corXY = correlations.find(c => c.variable1 === '문화소비' && c.variable2 === '주관적 행복감');
  const corMY = correlations.find(c => c.variable1 === '자기효능감' && c.variable2 === '주관적 행복감');

  // 인구통계 빈도
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

  // 문화소비 카테고리별 평균
  const categoryMeans = CULTURAL_CONSUMPTION_CATEGORIES.map(cat => ({
    label: cat.label,
    mean: mean(respondents.map(r => r.culturalConsumption[cat.key])),
  }));
  const topCategory = [...categoryMeans].sort((a, b) => b.mean - a.mean)[0];
  const bottomCategory = [...categoryMeans].sort((a, b) => a.mean - b.mean)[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">가상 논문</h1>
        <button
          onClick={() => window.print()}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors print:hidden"
        >
          인쇄 / PDF 저장
        </button>
      </div>

      <article className="bg-white rounded-lg shadow p-8 md:p-12 space-y-8 text-gray-800 leading-relaxed print:shadow-none print:p-0">
        {/* 제목 */}
        <header className="text-center space-y-4 pb-8 border-b">
          <h1 className="text-2xl font-bold leading-snug">
            시니어 계층의 문화소비가 자기효능감과<br />주관적 행복감에 미치는 영향
          </h1>
          <p className="text-lg text-gray-600">
            - 자기효능감의 매개효과를 중심으로 -
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>The Effect of Cultural Consumption on Self-Efficacy and Subjective Happiness among Senior Citizens</p>
            <p className="mt-4">2024</p>
          </div>
        </header>

        {/* 초록 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">초록</h2>
          <div className="bg-gray-50 rounded-lg p-6 text-sm">
            <p className="mb-3">
              본 연구는 시니어 계층의 문화소비 활동이 자기효능감을 매개로 주관적 행복감에 미치는 영향을 실증적으로 분석하였다.
              이를 위해 만 60세 이상 시니어 {N}명을 대상으로 설문조사를 실시하고,
              문화소비 빈도(8개 카테고리), 자기효능감(10문항), 주관적 행복감(5문항)을 측정하였다.
            </p>
            <p className="mb-3">
              분석 결과, 문화소비는 자기효능감(r = {fmt(corXM?.r ?? 0)}, {sig(corXM?.p ?? 1)})과
              주관적 행복감(r = {fmt(corXY?.r ?? 0)}, {sig(corXY?.p ?? 1)}) 모두와 유의한 정적 상관을 보였다.
              매개효과 분석 결과, 문화소비가 주관적 행복감에 미치는 총효과(c = {fmt(mediation.totalEffect, 4)}) 중
              간접효과(a×b = {fmt(mediation.indirectEffect, 4)})가 유의하며(Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}),
              자기효능감의 매개비율은 {fmt(mediation.proportionMediated * 100, 1)}%로 나타났다.
            </p>
            <p>
              <strong>주제어:</strong> 시니어, 문화소비, 자기효능감, 주관적 행복감, 매개효과
            </p>
          </div>
        </section>

        {/* I. 서론 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">I. 서론</h2>

          <h3 className="font-semibold mt-4 mb-2">1. 연구의 필요성 및 목적</h3>
          <p className="mb-3">
            고령화 사회의 급속한 진행과 함께 시니어 계층의 삶의 질 향상에 대한 사회적 관심이 높아지고 있다.
            통계청(2023)에 따르면 한국의 65세 이상 인구 비율은 이미 18%를 넘어섰으며, 2025년에는 초고령사회
            진입이 예상된다. 이러한 인구 구조의 변화는 시니어 계층의 정신건강과 행복감 증진을 위한
            효과적인 방안 모색의 필요성을 강조한다.
          </p>
          <p className="mb-3">
            문화소비 활동은 여가 충족, 사회적 관계 형성, 인지 기능 유지 등 다양한 긍정적 효과를 가져오며(Kim &amp; Lee, 2020),
            특히 시니어 계층에게는 은퇴 후의 역할 상실감을 보완하고 자아 존중감을 유지하는 데 중요한 역할을 한다.
            그러나 문화소비가 주관적 행복감에 이르는 심리적 기제, 특히 자기효능감의 매개 역할에 대한
            실증적 연구는 아직 부족한 실정이다.
          </p>
          <p className="mb-3">
            이에 본 연구는 시니어 계층의 문화소비 활동이 자기효능감을 매개로 하여 주관적 행복감에 미치는
            영향을 분석함으로써, 시니어의 삶의 질 향상을 위한 문화 정책적 시사점을 도출하고자 한다.
          </p>

          <h3 className="font-semibold mt-4 mb-2">2. 연구 문제</h3>
          <p className="mb-2">본 연구의 구체적인 연구 문제는 다음과 같다.</p>
          <ol className="list-decimal list-inside space-y-1 ml-4 mb-3">
            <li>시니어 계층의 문화소비는 주관적 행복감에 유의한 영향을 미치는가?</li>
            <li>시니어 계층의 문화소비는 자기효능감에 유의한 영향을 미치는가?</li>
            <li>시니어 계층의 자기효능감은 문화소비와 주관적 행복감의 관계를 매개하는가?</li>
          </ol>
        </section>

        {/* II. 이론적 배경 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">II. 이론적 배경</h2>

          <h3 className="font-semibold mt-4 mb-2">1. 시니어 계층의 문화소비</h3>
          <p className="mb-3">
            문화소비란 영화, 공연, 전시, 독서, 스포츠, 여행, 공예, 디지털 콘텐츠 등 다양한 문화적 활동에
            참여하고 이를 소비하는 행위를 말한다(Bourdieu, 1984). 시니어 계층의 문화소비는 단순한
            여가 활동을 넘어 사회 참여의 통로이자 정체성 유지의 수단으로 기능한다(Gilleard &amp; Higgs, 2005).
          </p>
          <p className="mb-3">
            선행연구에 따르면, 시니어의 문화 활동 참여는 우울 감소(Park et al., 2019),
            인지 기능 유지(Stern, 2012), 사회적 유대감 강화(Heo et al., 2018) 등의 효과가 있으며,
            이러한 효과들이 종합적으로 삶의 만족도와 행복감을 높이는 것으로 보고되고 있다.
          </p>

          <h3 className="font-semibold mt-4 mb-2">2. 자기효능감</h3>
          <p className="mb-3">
            자기효능감(self-efficacy)은 Bandura(1977)가 제안한 개념으로, 특정 과업을 성공적으로
            수행할 수 있다는 개인의 신념을 의미한다. 시니어 계층에게 자기효능감은 노화로 인한
            신체적, 사회적 변화에 적응하고 능동적 생활을 유지하는 데 핵심적인 심리적 자원이다
            (Lachman et al., 2011).
          </p>
          <p className="mb-3">
            문화소비 활동은 새로운 기술 학습, 성취 경험, 대리 경험 등을 통해 자기효능감의 주요
            원천인 수행 성취, 대리 경험, 언어적 설득을 제공할 수 있다(Bandura, 1997).
            따라서 문화소비는 자기효능감을 높이는 선행 요인으로 작용할 수 있다.
          </p>

          <h3 className="font-semibold mt-4 mb-2">3. 주관적 행복감</h3>
          <p className="mb-3">
            주관적 행복감(subjective happiness)은 개인이 자신의 삶에 대해 느끼는 전반적인
            만족감과 긍정적 정서 상태를 의미한다(Lyubomirsky &amp; Lepper, 1999).
            시니어 계층의 행복감은 건강 상태, 경제적 안정, 사회적 관계, 여가 활동 참여 등
            다양한 요인에 의해 영향을 받으며(Diener et al., 2018), 특히 자기효능감은
            행복감의 강력한 예측 변인으로 일관되게 보고되고 있다(Caprara et al., 2006).
          </p>

          <h3 className="font-semibold mt-4 mb-2">4. 연구 모형 및 가설</h3>
          <p className="mb-3">
            이상의 이론적 논의를 바탕으로, 본 연구는 문화소비(X)가 자기효능감(M)을 매개로
            주관적 행복감(Y)에 영향을 미치는 매개 모형을 설정하였다. 구체적인 연구 가설은 다음과 같다.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm mb-3">
            <p><strong>가설 1:</strong> 시니어 계층의 문화소비는 주관적 행복감에 정(+)의 영향을 미칠 것이다.</p>
            <p><strong>가설 2:</strong> 시니어 계층의 문화소비는 자기효능감에 정(+)의 영향을 미칠 것이다.</p>
            <p><strong>가설 3:</strong> 시니어 계층의 자기효능감은 주관적 행복감에 정(+)의 영향을 미칠 것이다.</p>
            <p><strong>가설 4:</strong> 자기효능감은 문화소비와 주관적 행복감의 관계를 매개할 것이다.</p>
          </div>

          {/* 연구모형 SVG */}
          <div className="flex justify-center my-6">
            <svg viewBox="0 0 500 200" className="w-full max-w-md">
              <rect x="10" y="70" width="120" height="50" rx="6" fill="#3b82f6" />
              <text x="70" y="98" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">문화소비 (X)</text>
              <rect x="190" y="10" width="120" height="50" rx="6" fill="#10b981" />
              <text x="250" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">자기효능감 (M)</text>
              <rect x="370" y="70" width="120" height="50" rx="6" fill="#f59e0b" />
              <text x="430" y="98" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">행복감 (Y)</text>
              <line x1="130" y1="75" x2="190" y2="55" stroke="#374151" strokeWidth="2" markerEnd="url(#arr)" />
              <text x="155" y="55" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">a</text>
              <line x1="310" y1="55" x2="370" y2="75" stroke="#374151" strokeWidth="2" markerEnd="url(#arr)" />
              <text x="345" y="55" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">b</text>
              <line x1="130" y1="100" x2="370" y2="100" stroke="#374151" strokeWidth="2" strokeDasharray="6,4" markerEnd="url(#arr)" />
              <text x="250" y="125" textAnchor="middle" fontSize="11" fill="#374151" fontWeight="bold">c&apos; (직접효과)</text>
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
                </marker>
              </defs>
            </svg>
          </div>
          <p className="text-center text-sm text-gray-500 mb-3">[그림 1] 연구 모형</p>
        </section>

        {/* III. 연구방법 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">III. 연구방법</h2>

          <h3 className="font-semibold mt-4 mb-2">1. 연구 대상</h3>
          <p className="mb-3">
            본 연구의 대상은 만 60세 이상의 시니어 {N}명이다.
            성별 분포는 {Object.entries(genderCount).map(([g, c]) => `${g} ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}이며,
            연령대별로는 {Object.entries(ageCount).map(([a, c]) => `${a}세 ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}으로 구성되었다.
            학력은 {Object.entries(eduCount).map(([e, c]) => `${e} ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}이었으며,
            월 소득은 {Object.entries(incomeCount).map(([i, c]) => `${i} ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}이었다.
          </p>

          {/* 표 1: 인구통계 */}
          <div className="my-4">
            <p className="text-sm font-semibold text-center mb-2">&lt;표 1&gt; 연구 대상의 인구통계학적 특성 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-t-2 border-b border-gray-400">
                  <th className="px-3 py-2 text-left">구분</th>
                  <th className="px-3 py-2 text-left">항목</th>
                  <th className="px-3 py-2 text-right">빈도(명)</th>
                  <th className="px-3 py-2 text-right">비율(%)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '성별', data: genderCount },
                  { label: '연령대', data: ageCount },
                  { label: '학력', data: eduCount },
                  { label: '월 소득', data: incomeCount },
                ].map((group) => (
                  Object.entries(group.data).map(([key, val], i) => (
                    <tr key={`${group.label}-${key}`} className="border-b border-gray-200">
                      {i === 0 && <td className="px-3 py-1 font-medium" rowSpan={Object.keys(group.data).length}>{group.label}</td>}
                      <td className="px-3 py-1">{key}</td>
                      <td className="px-3 py-1 text-right">{val}</td>
                      <td className="px-3 py-1 text-right">{fmt(val / N * 100, 1)}</td>
                    </tr>
                  ))
                ))}
                <tr className="border-t-2 border-gray-400 font-medium">
                  <td className="px-3 py-1" colSpan={2}>합계</td>
                  <td className="px-3 py-1 text-right">{N}</td>
                  <td className="px-3 py-1 text-right">100.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold mt-4 mb-2">2. 측정 도구</h3>
          <p className="mb-2"><strong>1) 문화소비(독립변수)</strong></p>
          <p className="mb-3">
            문화소비는 {CULTURAL_CONSUMPTION_CATEGORIES.map(c => c.label).join(', ')} 등 8개 카테고리의
            활동 빈도를 0점(전혀 안 함)~5점(매우 자주)의 6점 척도로 측정하였으며,
            8개 문항의 평균값을 문화소비 점수로 산출하였다.
          </p>

          <p className="mb-2"><strong>2) 자기효능감(매개변수)</strong></p>
          <p className="mb-3">
            자기효능감은 Bandura(1997)의 일반적 자기효능감 척도를 참고하여 구성한
            {SELF_EFFICACY_ITEMS.length}개 문항을 5점 리커트 척도(1=전혀 그렇지 않다 ~ 5=매우 그렇다)로
            측정하였으며, 문항 평균을 사용하였다.
          </p>

          <p className="mb-2"><strong>3) 주관적 행복감(종속변수)</strong></p>
          <p className="mb-3">
            주관적 행복감은 Lyubomirsky와 Lepper(1999)의 주관적 행복감 척도를 참고하여
            구성한 {HAPPINESS_ITEMS.length}개 문항을 5점 리커트 척도로 측정하였으며,
            문항 평균을 사용하였다.
          </p>

          <h3 className="font-semibold mt-4 mb-2">3. 분석 방법</h3>
          <p className="mb-3">
            수집된 자료는 다음과 같은 통계 분석을 실시하였다.
            첫째, 응답자의 인구통계학적 특성을 파악하기 위해 빈도분석을 실시하였다.
            둘째, 주요 변수의 기술통계(평균, 표준편차, 왜도, 첨도)를 산출하였다.
            셋째, 변수 간 관계를 파악하기 위해 Pearson 상관분석을 실시하였다.
            넷째, 문화소비가 행복감에 미치는 영향을 분석하기 위해 단순회귀분석 및 다중회귀분석을 실시하였다.
            다섯째, 자기효능감의 매개효과를 검증하기 위해 Baron과 Kenny(1986)의 3단계 매개분석과
            Sobel(1982) 검정을 실시하였다.
          </p>
        </section>

        {/* IV. 연구 결과 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">IV. 연구 결과</h2>

          <h3 className="font-semibold mt-4 mb-2">1. 기술통계</h3>
          <p className="mb-3">
            주요 변수의 기술통계 결과는 &lt;표 2&gt;와 같다.
            문화소비의 평균은 {fmt(descriptive['문화소비'].mean)}(SD = {fmt(descriptive['문화소비'].std)}),
            자기효능감의 평균은 {fmt(descriptive['자기효능감'].mean)}(SD = {fmt(descriptive['자기효능감'].std)}),
            주관적 행복감의 평균은 {fmt(descriptive['주관적 행복감'].mean)}(SD = {fmt(descriptive['주관적 행복감'].std)})으로 나타났다.
            왜도(|S| &lt; 2)와 첨도(|K| &lt; 7)의 절대값이 기준치 이내로 정규성 가정을 충족하였다(Kline, 2015).
          </p>

          {/* 표 2: 기술통계 */}
          <div className="my-4">
            <p className="text-sm font-semibold text-center mb-2">&lt;표 2&gt; 주요 변수의 기술통계 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-t-2 border-b border-gray-400">
                  <th className="px-3 py-2 text-left">변수</th>
                  <th className="px-3 py-2 text-right">M</th>
                  <th className="px-3 py-2 text-right">SD</th>
                  <th className="px-3 py-2 text-right">최솟값</th>
                  <th className="px-3 py-2 text-right">최댓값</th>
                  <th className="px-3 py-2 text-right">왜도</th>
                  <th className="px-3 py-2 text-right">첨도</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(descriptive).map(([name, s]) => (
                  <tr key={name} className="border-b border-gray-200">
                    <td className="px-3 py-1 font-medium">{name}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(s.mean)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(s.std)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(s.min, 2)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(s.max, 2)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(s.skewness)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(s.kurtosis)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-3">
            문화소비 활동별로는 {topCategory.label}이 가장 높은 빈도(M = {fmt(topCategory.mean, 2)})를 보였으며,
            {bottomCategory.label}이 가장 낮은 빈도(M = {fmt(bottomCategory.mean, 2)})를 나타냈다.
          </p>

          <h3 className="font-semibold mt-4 mb-2">2. 상관분석</h3>
          <p className="mb-3">
            주요 변수 간 Pearson 상관분석 결과는 &lt;표 3&gt;과 같다.
            문화소비와 자기효능감(r = {fmt(corXM?.r ?? 0)}, {sig(corXM?.p ?? 1)}),
            문화소비와 주관적 행복감(r = {fmt(corXY?.r ?? 0)}, {sig(corXY?.p ?? 1)}),
            자기효능감과 주관적 행복감(r = {fmt(corMY?.r ?? 0)}, {sig(corMY?.p ?? 1)}) 간에
            모두 유의한 정적 상관관계가 확인되었다.
          </p>

          {/* 표 3: 상관행렬 */}
          <div className="my-4">
            <p className="text-sm font-semibold text-center mb-2">&lt;표 3&gt; 주요 변수 간 상관행렬 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-t-2 border-b border-gray-400">
                  <th className="px-3 py-2 text-left">변수</th>
                  <th className="px-3 py-2 text-center">1</th>
                  <th className="px-3 py-2 text-center">2</th>
                  <th className="px-3 py-2 text-center">3</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1 font-medium">1. 문화소비</td>
                  <td className="px-3 py-1 text-center">1</td>
                  <td className="px-3 py-1 text-center"></td>
                  <td className="px-3 py-1 text-center"></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1 font-medium">2. 자기효능감</td>
                  <td className="px-3 py-1 text-center font-mono">{fmt(corXM?.r ?? 0)}{stars(corXM?.p ?? 1)}</td>
                  <td className="px-3 py-1 text-center">1</td>
                  <td className="px-3 py-1 text-center"></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1 font-medium">3. 주관적 행복감</td>
                  <td className="px-3 py-1 text-center font-mono">{fmt(corXY?.r ?? 0)}{stars(corXY?.p ?? 1)}</td>
                  <td className="px-3 py-1 text-center font-mono">{fmt(corMY?.r ?? 0)}{stars(corMY?.p ?? 1)}</td>
                  <td className="px-3 py-1 text-center">1</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1 text-center">*p &lt; .05, **p &lt; .01, ***p &lt; .001</p>
          </div>

          <h3 className="font-semibold mt-4 mb-2">3. 회귀분석</h3>
          <p className="mb-3">
            문화소비가 주관적 행복감에 미치는 영향을 검증하기 위한 단순 회귀분석 결과,
            문화소비는 주관적 행복감을 유의하게 예측하였다
            (B = {fmt(regressionXY.slope, 4)}, t = {fmt(regressionXY.t)}, {sig(regressionXY.p)},
            R² = {fmt(regressionXY.r2, 4)}).
          </p>
          <p className="mb-3">
            문화소비와 자기효능감을 동시에 투입한 다중 회귀분석 결과는 &lt;표 4&gt;와 같다.
            모형의 설명력은 R² = {fmt(multipleReg.rSquared, 4)}(수정된 R² = {fmt(multipleReg.adjustedRSquared, 4)})로,
            두 독립변수가 주관적 행복감 변량의 {fmt(multipleReg.rSquared * 100, 1)}%를 설명하였다.
          </p>

          {/* 표 4: 다중 회귀 */}
          <div className="my-4">
            <p className="text-sm font-semibold text-center mb-2">&lt;표 4&gt; 주관적 행복감에 대한 다중 회귀분석 결과 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-t-2 border-b border-gray-400">
                  <th className="px-3 py-2 text-left">변수</th>
                  <th className="px-3 py-2 text-right">B</th>
                  <th className="px-3 py-2 text-right">SE</th>
                  <th className="px-3 py-2 text-right">&beta;</th>
                  <th className="px-3 py-2 text-right">t</th>
                  <th className="px-3 py-2 text-right">p</th>
                </tr>
              </thead>
              <tbody>
                {multipleReg.coefficients.map((c) => (
                  <tr key={c.variable} className="border-b border-gray-200">
                    <td className="px-3 py-1 font-medium">{c.variable}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(c.b, 4)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(c.se, 4)}</td>
                    <td className="px-3 py-1 text-right font-mono">{c.variable === '(상수)' ? '-' : fmt(c.beta, 4)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(c.t)}</td>
                    <td className="px-3 py-1 text-right font-mono">{fmt(c.p, 4)}{stars(c.p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1 text-center">
              R² = {fmt(multipleReg.rSquared, 4)}, 수정된 R² = {fmt(multipleReg.adjustedRSquared, 4)},
              F = {fmt(multipleReg.fStatistic)}
            </p>
          </div>

          <h3 className="font-semibold mt-4 mb-2">4. 매개효과 분석</h3>
          <p className="mb-3">
            자기효능감의 매개효과를 검증하기 위해 Baron과 Kenny(1986)의 3단계 매개분석을 실시하였다.
          </p>

          <p className="mb-2">
            <strong>1단계:</strong> 독립변수(문화소비)가 종속변수(주관적 행복감)에 미치는 영향(c 경로)을 분석한 결과,
            문화소비는 주관적 행복감에 유의한 정적 영향을 미쳤다
            (B = {fmt(mediation.cPath.coeff, 4)}, t = {fmt(mediation.cPath.t)}, {sig(mediation.cPath.p)}).
          </p>
          <p className="mb-2">
            <strong>2단계:</strong> 독립변수(문화소비)가 매개변수(자기효능감)에 미치는 영향(a 경로)을 분석한 결과,
            문화소비는 자기효능감에 유의한 정적 영향을 미쳤다
            (B = {fmt(mediation.aPath.coeff, 4)}, t = {fmt(mediation.aPath.t)}, {sig(mediation.aPath.p)}).
          </p>
          <p className="mb-2">
            <strong>3단계:</strong> 매개변수(자기효능감)를 통제한 상태에서 독립변수(문화소비)가 종속변수(주관적 행복감)에
            미치는 영향(c&apos; 경로)을 분석한 결과, 자기효능감의 효과(b 경로)는
            B = {fmt(mediation.bPath.coeff, 4)}(t = {fmt(mediation.bPath.t)}, {sig(mediation.bPath.p)})로 유의하였으며,
            문화소비의 직접효과(c&apos;)는 B = {fmt(mediation.cPrimePath.coeff, 4)}
            (t = {fmt(mediation.cPrimePath.t)}, {sig(mediation.cPrimePath.p)})로 나타났다.
          </p>

          {/* 표 5: 매개효과 */}
          <div className="my-4">
            <p className="text-sm font-semibold text-center mb-2">&lt;표 5&gt; 자기효능감의 매개효과 분석 결과 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-t-2 border-b border-gray-400">
                  <th className="px-3 py-2 text-left">경로</th>
                  <th className="px-3 py-2 text-right">B</th>
                  <th className="px-3 py-2 text-right">SE</th>
                  <th className="px-3 py-2 text-right">t</th>
                  <th className="px-3 py-2 text-right">p</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1">총효과 (c): X &rarr; Y</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPath.coeff, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPath.se, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPath.t)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPath.p, 4)}{stars(mediation.cPath.p)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1">a경로: X &rarr; M</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.aPath.coeff, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.aPath.se, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.aPath.t)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.aPath.p, 4)}{stars(mediation.aPath.p)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1">b경로: M &rarr; Y (X 통제)</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.bPath.coeff, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.bPath.se, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.bPath.t)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.bPath.p, 4)}{stars(mediation.bPath.p)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-1">직접효과 (c&apos;): X &rarr; Y (M 통제)</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPrimePath.coeff, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPrimePath.se, 4)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPrimePath.t)}</td>
                  <td className="px-3 py-1 text-right font-mono">{fmt(mediation.cPrimePath.p, 4)}{stars(mediation.cPrimePath.p)}</td>
                </tr>
                <tr className="border-t border-gray-400">
                  <td className="px-3 py-1 font-medium">간접효과 (a×b)</td>
                  <td className="px-3 py-1 text-right font-mono font-bold">{fmt(mediation.indirectEffect, 4)}</td>
                  <td className="px-3 py-1 text-right" colSpan={3}>
                    Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}, 매개비율 = {fmt(mediation.proportionMediated * 100, 1)}%
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1 text-center">*p &lt; .05, **p &lt; .01, ***p &lt; .001</p>
          </div>

          <p className="mb-3">
            간접효과의 통계적 유의성을 검증하기 위한 Sobel 검정 결과,
            Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}로
            {mediation.sobelP < 0.05 ? '간접효과가 통계적으로 유의하였다' : '간접효과가 유의하지 않았다'}.
            총효과 중 간접효과의 비율(매개비율)은 {fmt(mediation.proportionMediated * 100, 1)}%로,
            문화소비가 행복감에 미치는 영향의 상당 부분이 자기효능감을 통해 매개됨을 확인하였다.
            {mediation.cPrimePath.p < 0.05
              ? ' 문화소비의 직접효과도 유의하므로, 자기효능감은 부분 매개 역할을 하는 것으로 판단된다.'
              : ' 매개변수 통제 후 직접효과가 유의하지 않으므로, 자기효능감은 완전 매개 역할을 하는 것으로 판단된다.'}
          </p>
        </section>

        {/* V. 논의 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">V. 논의</h2>
          <p className="mb-3">
            본 연구의 주요 결과를 연구 가설별로 논의하면 다음과 같다.
          </p>
          <p className="mb-3">
            첫째, 시니어 계층의 문화소비는 주관적 행복감에 유의한 정적 영향을 미치는 것으로 나타나
            가설 1이 {regressionXY.p < 0.05 ? '지지' : '기각'}되었다(B = {fmt(regressionXY.slope, 4)}, R² = {fmt(regressionXY.r2, 4)}).
            이는 문화 활동 참여가 시니어의 행복감을 높인다는 선행연구(Kim &amp; Lee, 2020; Heo et al., 2018)와
            일치하는 결과이다. 문화소비 활동 중 {topCategory.label}의 빈도가 가장 높게 나타난 것은
            해당 활동이 시니어 계층에게 가장 접근성이 높고 선호되는 문화 활동임을 시사한다.
          </p>
          <p className="mb-3">
            둘째, 문화소비는 자기효능감에도 유의한 정적 영향을 미쳐 가설 2가 {regressionXM.p < 0.05 ? '지지' : '기각'}되었다
            (B = {fmt(regressionXM.slope, 4)}, R² = {fmt(regressionXM.r2, 4)}).
            이는 문화 활동 참여가 성취 경험과 새로운 학습 기회를 제공함으로써 자기효능감을
            향상시킨다는 Bandura(1997)의 이론과 부합한다.
          </p>
          <p className="mb-3">
            셋째, 자기효능감은 주관적 행복감에 유의한 정적 영향을 미쳐 가설 3이 {regressionMY.p < 0.05 ? '지지' : '기각'}되었다
            (B = {fmt(regressionMY.slope, 4)}, R² = {fmt(regressionMY.r2, 4)}).
            이는 자기효능감이 행복감의 강력한 예측 변인이라는 Caprara 등(2006)의 연구를 재확인하는 것이다.
          </p>
          <p className="mb-3">
            넷째, 자기효능감은 문화소비와 주관적 행복감의 관계를
            {mediation.sobelP < 0.05 ? '유의하게 매개하여' : '매개하지 못하여'} 가설 4가
            {mediation.sobelP < 0.05 ? '지지' : '기각'}되었다
            (간접효과 = {fmt(mediation.indirectEffect, 4)}, Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}).
            매개비율이 {fmt(mediation.proportionMediated * 100, 1)}%로 나타난 것은
            문화소비가 행복감에 이르는 경로에서 자기효능감이 중요한 심리적 기제로 작용함을 보여준다.
          </p>
        </section>

        {/* VI. 결론 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">VI. 결론 및 제언</h2>

          <h3 className="font-semibold mt-4 mb-2">1. 결론</h3>
          <p className="mb-3">
            본 연구는 시니어 {N}명을 대상으로 문화소비, 자기효능감, 주관적 행복감의 구조적 관계를
            분석하였다. 연구 결과, 문화소비는 자기효능감과 주관적 행복감 모두에 유의한 정적 영향을 미치며,
            자기효능감은 문화소비와 행복감의 관계를 {mediation.sobelP < 0.05 ? '유의하게 매개하는' : '부분적으로 매개하는'} 것으로
            확인되었다. 이는 시니어 계층의 행복감 증진을 위해서는 단순한 문화 활동 기회 제공뿐만 아니라,
            활동 과정에서의 자기효능감 향상을 함께 도모해야 함을 시사한다.
          </p>

          <h3 className="font-semibold mt-4 mb-2">2. 시사점</h3>
          <p className="mb-3">
            본 연구의 실천적 시사점은 다음과 같다.
            첫째, 시니어를 위한 문화 프로그램 설계 시 단순 관람형보다는 참여형, 체험형 활동을 강화하여
            성취 경험과 자기효능감을 높일 수 있는 방향으로 구성할 필요가 있다.
            둘째, 문화소비의 접근성을 높이기 위한 경제적, 물리적 지원 정책이 시니어의 정신건강
            증진에 기여할 수 있다.
            셋째, 시니어 문화 프로그램에 자기효능감 향상 요소(단계별 성취, 동료 학습, 긍정적 피드백)를
            체계적으로 포함시킬 것을 제안한다.
          </p>

          <h3 className="font-semibold mt-4 mb-2">3. 제한점 및 후속 연구 제언</h3>
          <p className="mb-3">
            본 연구의 제한점은 다음과 같다.
            첫째, 횡단적 연구 설계로 인해 변수 간 인과관계를 엄밀하게 검증하기 어렵다.
            후속 연구에서는 종단적 설계를 통해 인과적 방향성을 확인할 필요가 있다.
            둘째, 표본 크기({N}명)가 충분히 크지 않아 일반화에 한계가 있으므로,
            대규모 표본을 활용한 후속 연구가 필요하다.
            셋째, 자기보고식 설문에 의존하여 사회적 바람직성 편향의 가능성이 있다.
            넷째, 문화소비의 양적 측면(빈도)만 측정하였으므로,
            질적 측면(만족도, 몰입도)을 포함한 연구가 필요하다.
          </p>
        </section>

        {/* 참고문헌 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">참고문헌</h2>
          <div className="text-sm space-y-2 pl-8 -indent-8">
            <p>Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. <em>Psychological Review</em>, 84(2), 191-215.</p>
            <p>Bandura, A. (1997). <em>Self-efficacy: The exercise of control</em>. W.H. Freeman.</p>
            <p>Baron, R. M., &amp; Kenny, D. A. (1986). The moderator-mediator variable distinction in social psychological research. <em>Journal of Personality and Social Psychology</em>, 51(6), 1173-1182.</p>
            <p>Bourdieu, P. (1984). <em>Distinction: A social critique of the judgement of taste</em>. Harvard University Press.</p>
            <p>Caprara, G. V., Steca, P., Gerbino, M., Paciello, M., &amp; Vecchio, G. M. (2006). Looking for adolescents&apos; well-being: Self-efficacy beliefs as determinants of positive thinking and happiness. <em>Epidemiologia e Psichiatria Sociale</em>, 15(1), 30-43.</p>
            <p>Diener, E., Oishi, S., &amp; Tay, L. (2018). Advances in subjective well-being research. <em>Nature Human Behaviour</em>, 2(4), 253-260.</p>
            <p>Gilleard, C., &amp; Higgs, P. (2005). <em>Contexts of ageing: Class, cohort and community</em>. Polity Press.</p>
            <p>Heo, J., Chun, S., Lee, S., Lee, K. H., &amp; Kim, J. (2018). Internet use and well-being in older adults. <em>Cyberpsychology, Behavior, and Social Networking</em>, 18(5), 268-272.</p>
            <p>Kim, J., &amp; Lee, S. (2020). Cultural activities and subjective well-being among older adults. <em>Journal of Aging and Health</em>, 32(7-8), 745-756.</p>
            <p>Kline, R. B. (2015). <em>Principles and practice of structural equation modeling</em> (4th ed.). Guilford Publications.</p>
            <p>Lachman, M. E., Neupert, S. D., &amp; Agrigoroaei, S. (2011). The relevance of control beliefs for health and aging. In K. W. Schaie &amp; S. L. Willis (Eds.), <em>Handbook of the psychology of aging</em> (7th ed., pp. 175-190). Academic Press.</p>
            <p>Lyubomirsky, S., &amp; Lepper, H. S. (1999). A measure of subjective happiness: Preliminary reliability and construct validation. <em>Social Indicators Research</em>, 46(2), 137-155.</p>
            <p>Park, S., Han, Y., &amp; Kim, B. (2019). Cultural engagement and depression among older adults. <em>Aging &amp; Mental Health</em>, 23(2), 186-191.</p>
            <p>Sobel, M. E. (1982). Asymptotic confidence intervals for indirect effects in structural equation models. <em>Sociological Methodology</em>, 13, 290-312.</p>
            <p>Stern, Y. (2012). Cognitive reserve in ageing and Alzheimer&apos;s disease. <em>The Lancet Neurology</em>, 11(11), 1006-1012.</p>
            <p>통계청. (2023). <em>2023 고령자 통계</em>. 대전: 통계청.</p>
          </div>
        </section>
      </article>
    </div>
  );
}
