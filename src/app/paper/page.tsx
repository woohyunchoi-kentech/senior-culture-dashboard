'use client';

import { useSurveyData } from '@/hooks/useSurveyData';
import { useStatistics } from '@/hooks/useStatistics';
import { CULTURAL_CONSUMPTION_CATEGORIES, SELF_EFFICACY_ITEMS, HAPPINESS_ITEMS } from '@/lib/constants';
import { mean, std, cronbachAlpha } from '@/lib/statistics';
import { useMemo } from 'react';

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

// APA 스타일 테이블 클래스
const TH = 'px-3 py-2 text-sm font-normal';
const TD = 'px-3 py-1.5 text-sm font-mono';
const THEAD_ROW = 'border-t-2 border-b border-black';
const TBODY_LAST = 'border-b-2 border-black';
const CAPTION = 'text-sm font-bold text-center mb-2';

export default function PaperPage() {
  const { respondents, isLoaded, loadSampleData } = useSurveyData();
  const stats = useStatistics(respondents);

  // Cronbach's Alpha 계산
  const reliability = useMemo(() => {
    if (respondents.length < 3) return null;

    // 문화소비: 8개 카테고리
    const consumptionItems = CULTURAL_CONSUMPTION_CATEGORIES.map(cat =>
      respondents.map(r => r.culturalConsumption[cat.key])
    );
    const alphaConsumption = cronbachAlpha(consumptionItems);

    // 자기효능감: 10문항
    const efficacyItems = Array.from({ length: 10 }, (_, i) =>
      respondents.map(r => r.selfEfficacy[i])
    );
    const alphaEfficacy = cronbachAlpha(efficacyItems);

    // 주관적 행복감: 5문항
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

  const { descriptive, correlations, regressionXY, regressionXM, regressionMY, multipleReg, mediation, variables } = stats;
  if (!descriptive || !mediation || !multipleReg || !variables || !regressionXY || !regressionXM || !regressionMY || !reliability) {
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

  // 문화소비 카테고리별 통계
  const categoryStats = CULTURAL_CONSUMPTION_CATEGORIES.map(cat => {
    const vals = respondents.map(r => r.culturalConsumption[cat.key]);
    return { label: cat.label, key: cat.key, mean: mean(vals), std: std(vals) };
  });
  const sortedCategories = [...categoryStats].sort((a, b) => b.mean - a.mean);

  // 자기효능감 문항별 통계
  const efficacyItemStats = SELF_EFFICACY_ITEMS.map((item, i) => {
    const vals = respondents.map(r => r.selfEfficacy[i]);
    return { item: item.slice(0, 30) + (item.length > 30 ? '...' : ''), mean: mean(vals), std: std(vals) };
  });

  // 행복감 문항별 통계
  const happinessItemStats = HAPPINESS_ITEMS.map((item, i) => {
    const vals = respondents.map(r => r.subjectiveHappiness[i]);
    return { item: item.slice(0, 30) + (item.length > 30 ? '...' : ''), mean: mean(vals), std: std(vals) };
  });

  const mediationType = mediation.cPrimePath.p < 0.05 ? '부분 매개' : '완전 매개';

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
        {/* ========== 제목 ========== */}
        <header className="text-center space-y-5 pb-8 border-b-2 border-black">
          <h1 className="text-[22px] font-bold leading-relaxed tracking-tight">
            시니어 계층의 문화소비가 자기효능감과<br />
            주관적 행복감에 미치는 영향
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            — 자기효능감의 매개효과를 중심으로 —
          </p>
          <div className="text-sm text-gray-500 space-y-2 mt-4">
            <p className="italic leading-relaxed">
              The Effect of Cultural Consumption on Self-Efficacy and<br />
              Subjective Happiness among Senior Citizens:<br />
              Focusing on the Mediating Role of Self-Efficacy
            </p>
          </div>
        </header>

        {/* ========== 국문 초록 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">초 록</h2>
          <div className="bg-gray-50 rounded p-6 text-[13px] leading-relaxed">
            <p className="mb-3 text-justify">
              본 연구는 시니어 계층의 문화소비 활동이 자기효능감을 매개로 주관적 행복감에 미치는 영향을
              실증적으로 분석하는 것을 목적으로 한다. 활동이론(Activity Theory)과 Bandura의 자기효능감 이론을
              이론적 기반으로 하여, 만 60세 이상 시니어 {N}명을 대상으로 구조화된 설문조사를 실시하였다.
              문화소비는 영화관람, 공연/음악회, 전시/미술관, 독서, 스포츠, 여행, 공예/취미, 디지털 콘텐츠의
              8개 카테고리 빈도(0-5점)로 측정하였으며, 자기효능감은 일반적 자기효능감 척도 10문항,
              주관적 행복감은 5문항의 리커트 5점 척도로 측정하였다.
              측정도구의 신뢰도는 Cronbach&apos;s &alpha;가 문화소비 {fmt(reliability.alphaConsumption)},
              자기효능감 {fmt(reliability.alphaEfficacy)}, 주관적 행복감 {fmt(reliability.alphaHappiness)}으로
              모두 수용 가능한 수준이었다.
            </p>
            <p className="mb-3 text-justify">
              분석 결과, 첫째, 문화소비는 자기효능감(r = {fmt(corXM?.r ?? 0)}, {sig(corXM?.p ?? 1)})과
              주관적 행복감(r = {fmt(corXY?.r ?? 0)}, {sig(corXY?.p ?? 1)}) 모두와 유의한 정적 상관을 보였다.
              둘째, 다중회귀분석 결과, 문화소비와 자기효능감은 주관적 행복감 변량의
              {fmt(multipleReg.rSquared * 100, 1)}%를 설명하였다(R&sup2; = {fmt(multipleReg.rSquared, 4)},
              수정된 R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)}).
              셋째, Baron과 Kenny(1986)의 매개분석과 Sobel(1982) 검정 결과,
              자기효능감의 간접효과(a&times;b = {fmt(mediation.indirectEffect, 4)})가 유의하며
              (Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}),
              매개비율은 {fmt(mediation.proportionMediated * 100, 1)}%로 나타나
              자기효능감이 {mediationType} 역할을 하는 것으로 확인되었다.
              이러한 결과는 시니어의 행복감 증진을 위해 문화소비 기회 확대와 함께
              자기효능감을 강화하는 프로그램 설계가 필요함을 시사한다.
            </p>
            <p>
              <strong>주제어:</strong> 시니어, 문화소비, 자기효능감, 주관적 행복감, 매개효과, 활동이론
            </p>
          </div>
        </section>

        {/* ========== 영문 초록 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">Abstract</h2>
          <div className="bg-gray-50 rounded p-6 text-[13px] leading-relaxed italic">
            <p className="mb-3 text-justify">
              This study examines the mediating role of self-efficacy in the relationship between cultural
              consumption and subjective happiness among senior citizens. Based on Activity Theory and
              Bandura&apos;s self-efficacy theory, a structured survey was conducted with {N} adults aged 60 and
              over. Cultural consumption was measured across eight categories, self-efficacy with a 10-item
              scale, and subjective happiness with a 5-item Likert scale. Cronbach&apos;s &alpha; values indicated
              acceptable reliability (&alpha; = {fmt(reliability.alphaConsumption)}–{fmt(reliability.alphaHappiness)}).
              Results showed significant positive correlations among all variables.
              Multiple regression revealed that cultural consumption and self-efficacy explained
              {fmt(multipleReg.rSquared * 100, 1)}% of variance in happiness. Mediation analysis using
              Baron and Kenny&apos;s (1986) approach and Sobel&apos;s (1982) test confirmed that self-efficacy
              significantly mediated the relationship (indirect effect = {fmt(mediation.indirectEffect, 4)},
              Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}, mediation ratio = {fmt(mediation.proportionMediated * 100, 1)}%).
              These findings suggest that enhancing cultural participation opportunities alongside
              self-efficacy development programs can promote senior well-being.
            </p>
            <p className="not-italic">
              <strong>Keywords:</strong> senior citizens, cultural consumption, self-efficacy, subjective happiness, mediation effect, activity theory
            </p>
          </div>
        </section>

        {/* ========== I. 서론 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">I. 서론</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 연구의 필요성 및 목적</h3>
          <p className="mb-3 text-justify text-[14px]">
            고령화 사회의 급속한 진행은 전 세계적으로 주요한 사회적 도전 과제로 부상하고 있다. 한국은
            특히 고령화 속도가 빨라 2000년 고령화사회, 2018년 고령사회에 진입하였으며, 2025년에는
            초고령사회(65세 이상 인구 비율 20%)에 도달할 것으로 전망된다(통계청, 2023). 이러한
            인구 구조의 급변은 시니어 계층의 삶의 질과 정신건강에 대한 사회적 관심을 크게 높이고 있으며,
            성공적 노화(successful aging)의 요건으로서 주관적 행복감의 중요성이 강조되고 있다
            (Rowe &amp; Kahn, 1997; 김동배·권중돈, 2020).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            최근 시니어 계층의 여가 활동 양상이 수동적 형태에서 능동적·참여적 형태로 변화하면서,
            문화소비 활동에 대한 학술적 관심이 높아지고 있다(정경희 외, 2021). 문화소비는 영화, 공연,
            전시, 독서 등의 문화예술 향유 활동뿐만 아니라 스포츠, 여행, 공예, 디지털 콘텐츠 이용 등을
            포괄하는 개념으로(Bourdieu, 1984), 시니어 계층에게 인지적 자극, 사회적 교류, 정서적 만족을
            제공하는 것으로 알려져 있다(Gilleard &amp; Higgs, 2005; 이소정·정경희, 2018).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            활동이론(Activity Theory)에 따르면, 노년기에도 사회적 활동 수준을 유지하는 것이 삶의 만족도와
            행복감을 높이는 핵심 요인이다(Havighurst, 1961; Lemon, Bengtson, &amp; Peterson, 1972).
            이 관점에서 문화소비 활동은 은퇴 후 축소되는 사회적 역할을 보완하고, 새로운 의미 있는
            활동을 통해 삶의 목적의식을 유지하게 하는 중요한 기능을 한다. 그러나 문화소비가
            행복감에 이르는 심리적 경로, 특히 어떤 매개 기제를 통해 행복감을 향상시키는지에 대한
            실증적 연구는 상대적으로 부족한 실정이다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            Bandura(1977, 1997)의 자기효능감(self-efficacy) 이론은 이러한 매개 기제를 설명하는 데
            유용한 이론적 틀을 제공한다. 자기효능감은 특정 과업을 성공적으로 수행할 수 있다는 개인의
            신념으로서, 수행 성취(enactive mastery experience), 대리 경험(vicarious experience),
            언어적 설득(verbal persuasion), 생리적·정서적 상태(physiological and affective states)의
            네 가지 원천으로부터 형성된다(Bandura, 1997). 문화소비 활동은 이 네 가지 원천 모두에
            영향을 미칠 수 있다는 점에서 자기효능감의 선행 요인으로 기능할 가능성이 높다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            이에 본 연구는 시니어 계층의 문화소비 활동이 자기효능감을 매개로 하여 주관적 행복감에
            미치는 영향을 분석함으로써, 시니어의 삶의 질 향상을 위한 이론적·실천적 시사점을
            도출하고자 한다. 이를 통해 시니어 문화 정책 및 프로그램 개발에 기여하고,
            성공적 노화 담론에 실증적 근거를 제공하고자 한다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 연구 문제</h3>
          <p className="mb-2 text-[14px]">본 연구의 구체적인 연구 문제는 다음과 같다.</p>
          <div className="ml-6 space-y-1 mb-4 text-[14px]">
            <p>연구문제 1. 시니어 계층의 문화소비, 자기효능감, 주관적 행복감의 수준은 어떠한가?</p>
            <p>연구문제 2. 시니어 계층의 문화소비, 자기효능감, 주관적 행복감 간의 상관관계는 어떠한가?</p>
            <p>연구문제 3. 시니어 계층의 문화소비는 주관적 행복감에 유의한 영향을 미치는가?</p>
            <p>연구문제 4. 자기효능감은 문화소비와 주관적 행복감의 관계를 유의하게 매개하는가?</p>
          </div>
        </section>

        {/* ========== II. 이론적 배경 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">II. 이론적 배경</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 활동이론과 시니어의 문화소비</h3>
          <p className="mb-3 text-justify text-[14px]">
            활동이론(Activity Theory)은 Havighurst(1961)에 의해 체계화된 노년학의 대표적 이론으로,
            노년기에도 중년기와 유사한 수준의 사회적 활동을 유지하는 것이 높은 생활 만족도와 긍정적
            자아 개념의 핵심 조건임을 주장한다. 이 이론에 따르면, 은퇴나 신체적 제약으로 인해 상실된
            역할(role loss)은 새로운 활동으로 대체되어야 하며, 그 대체 활동의 질과 양이 노년기
            삶의 질을 결정짓는 중요한 요인이 된다(Lemon et al., 1972).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비(cultural consumption)는 Bourdieu(1984)의 문화자본(cultural capital) 개념에 기반한 것으로,
            영화, 공연, 전시, 독서, 스포츠, 여행, 공예, 디지털 콘텐츠 등 다양한 문화적 활동에 참여하고
            이를 향유하는 행위를 말한다. 시니어 계층에게 문화소비는 단순한 여가 활동을 넘어 사회
            참여의 통로이자 정체성 유지의 수단으로 기능한다(Gilleard &amp; Higgs, 2005; 이소정·정경희, 2018).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            선행연구들은 시니어의 문화 활동 참여가 다양한 긍정적 효과를 가져옴을 보고하고 있다.
            Park, Han과 Kim(2019)은 문화예술 참여가 노인의 우울 증상을 유의하게 감소시킨다는 것을
            확인하였고, Stern(2012)은 인지적으로 자극적인 문화 활동이 인지 예비력(cognitive reserve)을
            높여 치매 위험을 낮출 수 있다고 하였다. 또한 Heo, Chun, Lee, Lee와 Kim(2018)은
            디지털 콘텐츠 이용을 포함한 문화 활동이 사회적 유대감과 안녕감(well-being)을
            향상시키는 것을 확인하였다. 국내 연구에서도 김미혜와 신경림(2005)은 노인의 여가 활동
            참여가 생활 만족도에 유의한 정적 영향을 미친다고 보고하였다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            Csikszentmihalyi(1990)의 몰입(flow) 이론은 문화소비와 행복의 관계를 설명하는 또 다른
            이론적 틀을 제공한다. 이 이론에 따르면, 개인의 기술 수준과 도전의 수준이 적절히 조화를
            이룰 때 최적의 경험, 즉 몰입이 발생하며, 이러한 몰입 경험이 반복되면 삶의 만족도와
            행복감이 증가한다. 문화소비 활동 중 공예, 악기 연주, 독서, 스포츠 등은 이러한
            몰입 경험을 제공할 수 있는 대표적인 활동이다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 자기효능감과 시니어의 심리적 적응</h3>
          <p className="mb-3 text-justify text-[14px]">
            자기효능감(self-efficacy)은 Bandura(1977)가 사회학습이론(Social Learning Theory)의
            핵심 개념으로 제안한 것으로, &ldquo;특정 과업을 성공적으로 수행할 수 있다는 개인의
            신념&rdquo;으로 정의된다. 이후 사회인지이론(Social Cognitive Theory)으로 확장되면서,
            자기효능감은 인간 행동의 동기, 사고 패턴, 정서적 반응을 결정짓는 핵심적인
            인지적 기제로 자리 잡았다(Bandura, 1997).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            Bandura(1997)는 자기효능감이 네 가지 원천으로부터 형성된다고 하였다.
            첫째, 수행 성취(enactive mastery experience)는 직접적인 성공 경험으로 가장 강력한
            효능감 원천이다. 둘째, 대리 경험(vicarious experience)은 유사한 타인의 성공을
            관찰함으로써 &ldquo;나도 할 수 있다&rdquo;는 신념을 형성하는 것이다. 셋째, 언어적
            설득(verbal persuasion)은 타인으로부터의 격려와 긍정적 피드백이다. 넷째,
            생리적·정서적 상태(physiological and affective states)는 활동 수행 시 경험하는
            신체적·심리적 각성 수준이다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            시니어 계층에게 자기효능감은 특히 중요한 심리적 자원으로 기능한다.
            Lachman, Neupert와 Agrigoroaei(2011)에 따르면, 노화에 수반되는 신체적, 인지적, 사회적
            변화에 적응하고 능동적 생활을 유지하는 데 자기효능감이 결정적 역할을 한다.
            높은 자기효능감을 가진 노인은 건강 행동에 더 적극적이며(Stretcher et al., 1986),
            스트레스 상황에서 더 효과적으로 대처하고(Jerusalem &amp; Schwarzer, 1992),
            사회적 관계를 더 잘 유지한다(Benight &amp; Bandura, 2004).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비 활동은 자기효능감의 네 가지 원천 모두에 기여할 수 있다. 예를 들어,
            공예 활동이나 악기 연주에서의 성취는 수행 성취 경험을 제공하고, 문화 동호회에서의
            동료 학습은 대리 경험과 언어적 설득의 기회를 만들며, 문화 활동 참여 시 느끼는
            즐거움과 활력은 긍정적인 정서적 상태를 형성한다(김정숙·한경혜, 2019).
            따라서 문화소비는 자기효능감을 높이는 선행 요인으로 기능할 수 있으며,
            이는 궁극적으로 행복감 증진에 기여할 수 있다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">3. 주관적 행복감</h3>
          <p className="mb-3 text-justify text-[14px]">
            주관적 행복감(subjective happiness)은 개인이 자신의 삶에 대해 느끼는 전반적인 만족감과
            긍정적 정서 상태를 의미한다(Lyubomirsky &amp; Lepper, 1999). 이는 삶의 인지적 평가인
            삶의 만족도(life satisfaction)와 정서적 차원인 긍정적·부정적 정서(positive and negative
            affect)를 포괄하는 개념으로, 주관적 안녕감(subjective well-being)과 밀접하게 관련된다
            (Diener, 1984; Diener, Oishi, &amp; Tay, 2018).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            시니어 계층의 행복감에 영향을 미치는 요인에 대한 연구들은 건강 상태, 경제적 안정,
            사회적 관계, 여가 활동 참여, 자아 존중감, 자기효능감 등을 주요 예측 변인으로
            보고하고 있다(Diener et al., 2018; 박경숙·서이종, 2019). 특히 자기효능감은
            행복감의 강력한 예측 변인으로 일관되게 보고되고 있다.
            Caprara, Steca, Gerbino, Paciello와 Vecchio(2006)는 자기효능감이 긍정적 사고와
            행복감을 결정짓는 핵심 요인임을 확인하였고, Lachman 등(2011)은 노년기에 통제감과
            효능감이 높을수록 건강과 안녕감이 양호하다고 보고하였다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            성공적 노화(successful aging) 이론의 관점에서, Rowe와 Kahn(1997)은 질병의 부재,
            높은 인지적·신체적 기능, 능동적 사회 참여를 성공적 노화의 세 가지 구성 요소로 제시하였다.
            이 중 능동적 사회 참여는 문화소비 활동과 직결되며, 이러한 참여가 자기효능감을 높이고
            궁극적으로 행복감에 기여한다는 것이 본 연구의 이론적 전제이다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">4. 연구 모형 및 가설</h3>
          <p className="mb-3 text-justify text-[14px]">
            이상의 이론적 논의를 종합하면, 활동이론의 관점에서 문화소비 활동은 시니어의 행복감에
            직접적으로 기여하며, 동시에 Bandura의 자기효능감 이론에 근거하여 자기효능감을 매개로
            간접적으로도 행복감에 영향을 미칠 수 있다. 이에 본 연구는 문화소비(X)가 자기효능감(M)을
            매개로 주관적 행복감(Y)에 영향을 미치는 매개 모형을 설정하였으며, 다음과 같은
            구체적 가설을 수립하였다.
          </p>

          <div className="bg-gray-50 rounded p-5 space-y-2 text-[13px] mb-4 border-l-4 border-gray-400">
            <p><strong>가설 1.</strong> 시니어 계층의 문화소비는 주관적 행복감에 유의한 정(+)의 영향을 미칠 것이다.</p>
            <p><strong>가설 2.</strong> 시니어 계층의 문화소비는 자기효능감에 유의한 정(+)의 영향을 미칠 것이다.</p>
            <p><strong>가설 3.</strong> 시니어 계층의 자기효능감은 주관적 행복감에 유의한 정(+)의 영향을 미칠 것이다.</p>
            <p><strong>가설 4.</strong> 자기효능감은 문화소비와 주관적 행복감의 관계를 유의하게 매개할 것이다.</p>
          </div>

          {/* 연구모형 SVG */}
          <div className="flex justify-center my-8">
            <svg viewBox="0 0 520 220" className="w-full max-w-lg">
              <defs>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2937" />
                </marker>
              </defs>
              {/* Boxes */}
              <rect x="10" y="80" width="130" height="55" rx="4" fill="#1e40af" />
              <text x="75" y="105" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">문화소비</text>
              <text x="75" y="122" textAnchor="middle" fill="#93c5fd" fontSize="10">(독립변수, X)</text>

              <rect x="195" y="10" width="130" height="55" rx="4" fill="#047857" />
              <text x="260" y="35" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">자기효능감</text>
              <text x="260" y="52" textAnchor="middle" fill="#6ee7b7" fontSize="10">(매개변수, M)</text>

              <rect x="380" y="80" width="130" height="55" rx="4" fill="#b45309" />
              <text x="445" y="105" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">주관적 행복감</text>
              <text x="445" y="122" textAnchor="middle" fill="#fcd34d" fontSize="10">(종속변수, Y)</text>

              {/* a path */}
              <line x1="140" y1="85" x2="195" y2="60" stroke="#1f2937" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="155" y="62" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight="bold">
                a = {fmt(mediation.aPath.coeff, 3)}
              </text>

              {/* b path */}
              <line x1="325" y1="60" x2="380" y2="85" stroke="#1f2937" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="365" y="62" textAnchor="middle" fontSize="12" fill="#1f2937" fontWeight="bold">
                b = {fmt(mediation.bPath.coeff, 3)}
              </text>

              {/* c' path (dashed) */}
              <line x1="140" y1="110" x2="380" y2="110" stroke="#1f2937" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead)" />
              <text x="260" y="145" textAnchor="middle" fontSize="11" fill="#6b7280">
                c&apos; = {fmt(mediation.directEffect, 3)} (직접효과)
              </text>
              <text x="260" y="163" textAnchor="middle" fontSize="11" fill="#6b7280">
                c = {fmt(mediation.totalEffect, 3)} (총효과)
              </text>

              {/* Indirect effect */}
              <text x="260" y="195" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="bold">
                간접효과(a&times;b) = {fmt(mediation.indirectEffect, 4)}{stars(mediation.sobelP)}
              </text>
            </svg>
          </div>
          <p className="text-center text-[13px] text-gray-500 mb-3">[그림 1] 연구 모형</p>
        </section>

        {/* ========== III. 연구방법 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">III. 연구방법</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 연구 대상 및 자료 수집</h3>
          <p className="mb-3 text-justify text-[14px]">
            본 연구는 만 60세 이상의 시니어를 대상으로 구조화된 설문조사를 실시하였다.
            표집 방법은 편의표집(convenience sampling)을 사용하였으며, 노인복지관, 평생교육원,
            문화센터 등을 통해 참여자를 모집하였다. 설문은 자기기입식(self-administered)으로
            실시하였으며, 연구 목적, 자발적 참여, 개인정보 보호 등에 대해 사전 안내를 제공하였다.
            총 {N}부의 유효 설문지를 최종 분석에 사용하였다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            연구 대상의 인구통계학적 특성은 &lt;표 1&gt;과 같다.
            성별은 {Object.entries(genderCount).map(([g, c]) => `${g} ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}이었다.
            연령대별로는 {Object.entries(ageCount).map(([a, c]) => `${a}세 ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}으로 구성되었다.
            학력은 {Object.entries(eduCount).map(([e, c]) => `${e} ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}이었으며,
            월 소득은 {Object.entries(incomeCount).map(([i, c]) => `${i} ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}이었다.
          </p>

          {/* 표 1: 인구통계 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 1&gt; 연구 대상의 인구통계학적 특성 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left w-24`}>구분</th>
                  <th className={`${TH} text-left`}>항목</th>
                  <th className={`${TH} text-right w-20`}>빈도(명)</th>
                  <th className={`${TH} text-right w-20`}>비율(%)</th>
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
                    <tr key={`${group.label}-${key}`} className={i === Object.entries(group.data).length - 1 ? 'border-b border-gray-300' : ''}>
                      {i === 0 && <td className="px-3 py-1 text-sm" rowSpan={Object.keys(group.data).length}>{group.label}</td>}
                      <td className="px-3 py-1 text-sm">{key}</td>
                      <td className={`${TD} text-right`}>{val}</td>
                      <td className={`${TD} text-right`}>{fmt(val / N * 100, 1)}</td>
                    </tr>
                  ))
                ))}
                <tr className={TBODY_LAST}>
                  <td className="px-3 py-1.5 text-sm font-bold" colSpan={2}>합계</td>
                  <td className={`${TD} text-right font-bold`}>{N}</td>
                  <td className={`${TD} text-right font-bold`}>100.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 측정 도구</h3>

          <p className="mb-2 text-[14px]"><strong>1) 문화소비(독립변수)</strong></p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비는 선행연구(김미혜·신경림, 2005; 정경희 외, 2021)를 참고하여
            {CULTURAL_CONSUMPTION_CATEGORIES.map(c => c.label).join(', ')} 등 8개 카테고리의
            활동 빈도를 측정하였다. 각 카테고리는 0점(&ldquo;전혀 안 함&rdquo;)에서 5점(&ldquo;매우 자주&rdquo;)의
            6점 척도로 측정하였으며, 8개 문항의 평균값을 문화소비 점수로 산출하였다.
            본 연구에서의 Cronbach&apos;s &alpha;는 {fmt(reliability.alphaConsumption)}이었다.
          </p>

          <p className="mb-2 text-[14px]"><strong>2) 자기효능감(매개변수)</strong></p>
          <p className="mb-3 text-justify text-[14px]">
            자기효능감은 Schwarzer와 Jerusalem(1995)의 일반적 자기효능감 척도(General Self-Efficacy Scale)와
            Bandura(1997)의 이론을 참고하여 한국 시니어 맥락에 맞게 수정한 {SELF_EFFICACY_ITEMS.length}개
            문항을 사용하였다. 5점 리커트 척도(1=&ldquo;전혀 그렇지 않다&rdquo; ~ 5=&ldquo;매우 그렇다&rdquo;)로
            측정하였으며, 문항 평균을 사용하였다.
            본 연구에서의 Cronbach&apos;s &alpha;는 {fmt(reliability.alphaEfficacy)}이었다.
          </p>

          <p className="mb-2 text-[14px]"><strong>3) 주관적 행복감(종속변수)</strong></p>
          <p className="mb-3 text-justify text-[14px]">
            주관적 행복감은 Lyubomirsky와 Lepper(1999)의 주관적 행복감 척도(Subjective Happiness Scale)를
            참고하여 한국 시니어 맥락에 맞게 수정한 {HAPPINESS_ITEMS.length}개 문항을 사용하였다.
            5점 리커트 척도로 측정하였으며, 문항 평균을 사용하였다.
            본 연구에서의 Cronbach&apos;s &alpha;는 {fmt(reliability.alphaHappiness)}이었다.
          </p>

          {/* 표 2: 신뢰도 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 2&gt; 측정도구의 신뢰도 분석 결과</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left`}>변수</th>
                  <th className={`${TH} text-right w-20`}>문항 수</th>
                  <th className={`${TH} text-right w-24`}>척도 범위</th>
                  <th className={`${TH} text-right w-28`}>Cronbach&apos;s &alpha;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-1.5 text-sm">문화소비</td>
                  <td className={`${TD} text-right`}>8</td>
                  <td className={`${TD} text-right`}>0-5</td>
                  <td className={`${TD} text-right`}>{fmt(reliability.alphaConsumption)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm">자기효능감</td>
                  <td className={`${TD} text-right`}>10</td>
                  <td className={`${TD} text-right`}>1-5</td>
                  <td className={`${TD} text-right`}>{fmt(reliability.alphaEfficacy)}</td>
                </tr>
                <tr className={TBODY_LAST}>
                  <td className="px-3 py-1.5 text-sm">주관적 행복감</td>
                  <td className={`${TD} text-right`}>5</td>
                  <td className={`${TD} text-right`}>1-5</td>
                  <td className={`${TD} text-right`}>{fmt(reliability.alphaHappiness)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">3. 분석 방법</h3>
          <p className="mb-3 text-justify text-[14px]">
            수집된 자료는 다음과 같은 통계 분석을 실시하였다.
            첫째, 응답자의 인구통계학적 특성을 파악하기 위해 빈도분석을 실시하였다.
            둘째, 측정도구의 신뢰도를 검증하기 위해 Cronbach&apos;s &alpha; 계수를 산출하였다.
            셋째, 주요 변수의 기술통계(평균, 표준편차, 왜도, 첨도)를 산출하고, 왜도와 첨도를
            기준으로 정규성 가정을 검토하였다(Kline, 2015).
            넷째, 변수 간 관계를 파악하기 위해 Pearson 적률상관분석을 실시하였다.
            다섯째, 문화소비가 행복감에 미치는 영향을 검증하기 위해 단순회귀분석 및
            다중회귀분석(OLS)을 실시하였다.
            여섯째, 자기효능감의 매개효과를 검증하기 위해 Baron과 Kenny(1986)의 3단계 매개분석
            절차를 적용하고, 간접효과의 통계적 유의성은 Sobel(1982) 검정으로 확인하였다.
          </p>
        </section>

        {/* ========== IV. 연구 결과 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">IV. 연구 결과</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 주요 변수의 기술통계</h3>
          <p className="mb-3 text-justify text-[14px]">
            주요 변수의 기술통계 결과는 &lt;표 3&gt;과 같다.
            문화소비의 평균은 {fmt(descriptive['문화소비'].mean)}(SD = {fmt(descriptive['문화소비'].std)})으로
            6점 척도의 중간값(2.5)보다 {descriptive['문화소비'].mean > 2.5 ? '높아' : '낮아'},
            시니어 응답자들의 문화소비 빈도가 {descriptive['문화소비'].mean > 2.5 ? '보통 이상' : '보통 이하'}인
            것으로 나타났다.
            자기효능감은 평균 {fmt(descriptive['자기효능감'].mean)}(SD = {fmt(descriptive['자기효능감'].std)})으로
            5점 척도 기준 {descriptive['자기효능감'].mean > 3 ? '보통 이상' : '보통 이하'} 수준이었으며,
            주관적 행복감은 평균 {fmt(descriptive['주관적 행복감'].mean)}(SD = {fmt(descriptive['주관적 행복감'].std)})으로
            나타났다.
            모든 변수의 왜도(|S| &lt; 2)와 첨도(|K| &lt; 7)의 절대값이
            정규성 기준치 이내로(Kline, 2015), 모수적 통계 분석의 가정을 충족하였다.
          </p>

          {/* 표 3: 기술통계 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 3&gt; 주요 변수의 기술통계 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left`}>변수</th>
                  <th className={`${TH} text-right`}>M</th>
                  <th className={`${TH} text-right`}>SD</th>
                  <th className={`${TH} text-right`}>Min</th>
                  <th className={`${TH} text-right`}>Max</th>
                  <th className={`${TH} text-right`}>왜도</th>
                  <th className={`${TH} text-right`}>첨도</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(descriptive).map(([name, s], idx) => (
                  <tr key={name} className={idx === Object.entries(descriptive).length - 1 ? TBODY_LAST : ''}>
                    <td className="px-3 py-1.5 text-sm">{name}</td>
                    <td className={`${TD} text-right`}>{fmt(s.mean)}</td>
                    <td className={`${TD} text-right`}>{fmt(s.std)}</td>
                    <td className={`${TD} text-right`}>{fmt(s.min, 2)}</td>
                    <td className={`${TD} text-right`}>{fmt(s.max, 2)}</td>
                    <td className={`${TD} text-right`}>{fmt(s.skewness)}</td>
                    <td className={`${TD} text-right`}>{fmt(s.kurtosis)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 표 4: 카테고리별 기술통계 */}
          <p className="mb-3 text-justify text-[14px]">
            문화소비의 카테고리별 기술통계를 살펴보면(&lt;표 4&gt;), {sortedCategories[0].label}이
            가장 높은 빈도(M = {fmt(sortedCategories[0].mean, 2)}, SD = {fmt(sortedCategories[0].std, 2)})를 보였으며,
            {sortedCategories[sortedCategories.length - 1].label}이 가장 낮은 빈도
            (M = {fmt(sortedCategories[sortedCategories.length - 1].mean, 2)},
            SD = {fmt(sortedCategories[sortedCategories.length - 1].std, 2)})를 나타냈다.
          </p>

          <div className="my-6">
            <p className={CAPTION}>&lt;표 4&gt; 문화소비 카테고리별 기술통계 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left`}>카테고리</th>
                  <th className={`${TH} text-right`}>M</th>
                  <th className={`${TH} text-right`}>SD</th>
                  <th className={`${TH} text-right`}>순위</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map((cat, idx) => (
                  <tr key={cat.key} className={idx === sortedCategories.length - 1 ? TBODY_LAST : ''}>
                    <td className="px-3 py-1.5 text-sm">{cat.label}</td>
                    <td className={`${TD} text-right`}>{fmt(cat.mean, 2)}</td>
                    <td className={`${TD} text-right`}>{fmt(cat.std, 2)}</td>
                    <td className={`${TD} text-right`}>{idx + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 상관분석</h3>
          <p className="mb-3 text-justify text-[14px]">
            주요 변수 간 Pearson 적률상관분석 결과는 &lt;표 5&gt;와 같다.
            분석 결과, 문화소비와 자기효능감(r = {fmt(corXM?.r ?? 0)}, {sig(corXM?.p ?? 1)}),
            문화소비와 주관적 행복감(r = {fmt(corXY?.r ?? 0)}, {sig(corXY?.p ?? 1)}),
            자기효능감과 주관적 행복감(r = {fmt(corMY?.r ?? 0)}, {sig(corMY?.p ?? 1)}) 간에
            모두 통계적으로 유의한 정적 상관관계가 확인되었다. 이는 세 변수 간에 이론적으로
            예상한 방향의 관계가 존재함을 의미하며, 매개효과 분석의 기본 전제 조건이 충족되었음을 나타낸다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            상관계수의 크기를 Cohen(1988)의 기준(|r| = .10 작은 효과, .30 중간 효과, .50 큰 효과)에 따라 해석하면,
            {corXM?.r && Math.abs(corXM.r) >= 0.5 ? '문화소비와 자기효능감의 상관은 큰 효과 크기를 보였다.' :
             corXM?.r && Math.abs(corXM.r) >= 0.3 ? '문화소비와 자기효능감의 상관은 중간 효과 크기를 보였다.' :
             '문화소비와 자기효능감의 상관은 작은 효과 크기를 보였다.'}
          </p>

          {/* 표 5: 상관행렬 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 5&gt; 주요 변수 간 상관행렬 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left`}>변수</th>
                  <th className={`${TH} text-right`}>M</th>
                  <th className={`${TH} text-right`}>SD</th>
                  <th className={`${TH} text-center w-24`}>1</th>
                  <th className={`${TH} text-center w-24`}>2</th>
                  <th className={`${TH} text-center w-24`}>3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-1.5 text-sm">1. 문화소비</td>
                  <td className={`${TD} text-right`}>{fmt(descriptive['문화소비'].mean)}</td>
                  <td className={`${TD} text-right`}>{fmt(descriptive['문화소비'].std)}</td>
                  <td className={`${TD} text-center`}>—</td>
                  <td className={`${TD} text-center`}></td>
                  <td className={`${TD} text-center`}></td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm">2. 자기효능감</td>
                  <td className={`${TD} text-right`}>{fmt(descriptive['자기효능감'].mean)}</td>
                  <td className={`${TD} text-right`}>{fmt(descriptive['자기효능감'].std)}</td>
                  <td className={`${TD} text-center`}>{fmt(corXM?.r ?? 0)}{stars(corXM?.p ?? 1)}</td>
                  <td className={`${TD} text-center`}>—</td>
                  <td className={`${TD} text-center`}></td>
                </tr>
                <tr className={TBODY_LAST}>
                  <td className="px-3 py-1.5 text-sm">3. 주관적 행복감</td>
                  <td className={`${TD} text-right`}>{fmt(descriptive['주관적 행복감'].mean)}</td>
                  <td className={`${TD} text-right`}>{fmt(descriptive['주관적 행복감'].std)}</td>
                  <td className={`${TD} text-center`}>{fmt(corXY?.r ?? 0)}{stars(corXY?.p ?? 1)}</td>
                  <td className={`${TD} text-center`}>{fmt(corMY?.r ?? 0)}{stars(corMY?.p ?? 1)}</td>
                  <td className={`${TD} text-center`}>—</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1 text-center">*p &lt; .05, **p &lt; .01, ***p &lt; .001</p>
          </div>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">3. 회귀분석</h3>
          <p className="mb-3 text-justify text-[14px]">
            문화소비가 주관적 행복감에 미치는 영향을 검증하기 위한 단순회귀분석 결과(&lt;표 6&gt;),
            회귀모형은 통계적으로 유의하였으며(F = {fmt(regressionXY.fStat)}, {sig(regressionXY.p)}),
            문화소비는 주관적 행복감의 {fmt(regressionXY.r2 * 100, 1)}%를 설명하는 것으로 나타났다
            (R&sup2; = {fmt(regressionXY.r2, 4)}). 문화소비의 회귀계수는
            B = {fmt(regressionXY.slope, 4)}(t = {fmt(regressionXY.t)}, {sig(regressionXY.p)})로
            {regressionXY.p < 0.05 ? '유의한 정적 영향을 미치는 것으로 확인되어 가설 1이 지지되었다.' :
             '유의하지 않아 가설 1이 기각되었다.'}
          </p>

          {/* 표 6: 단순회귀 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 6&gt; 문화소비가 주관적 행복감에 미치는 영향: 단순회귀분석 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left`}>변수</th>
                  <th className={`${TH} text-right`}>B</th>
                  <th className={`${TH} text-right`}>SE</th>
                  <th className={`${TH} text-right`}>t</th>
                  <th className={`${TH} text-right`}>p</th>
                  <th className={`${TH} text-right`}>R&sup2;</th>
                  <th className={`${TH} text-right`}>F</th>
                </tr>
              </thead>
              <tbody>
                <tr className={TBODY_LAST}>
                  <td className="px-3 py-1.5 text-sm">문화소비</td>
                  <td className={`${TD} text-right`}>{fmt(regressionXY.slope, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(regressionXY.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(regressionXY.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(regressionXY.p, 4)}{stars(regressionXY.p)}</td>
                  <td className={`${TD} text-right`}>{fmt(regressionXY.r2, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(regressionXY.fStat)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1 text-center">종속변수: 주관적 행복감. *p &lt; .05, **p &lt; .01, ***p &lt; .001</p>
          </div>

          <p className="mb-3 text-justify text-[14px]">
            문화소비와 자기효능감을 동시에 투입한 다중회귀분석 결과는 &lt;표 7&gt;과 같다.
            모형의 전체 설명력은 R&sup2; = {fmt(multipleReg.rSquared, 4)}
            (수정된 R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)})로,
            두 독립변수가 주관적 행복감 변량의 {fmt(multipleReg.rSquared * 100, 1)}%를 설명하였다.
            이는 문화소비만 투입한 단순회귀모형(R&sup2; = {fmt(regressionXY.r2, 4)})에 비해
            {fmt((multipleReg.rSquared - regressionXY.r2) * 100, 1)}%p 증가한 것으로,
            자기효능감의 추가적인 설명력이 확인되었다.
          </p>

          {/* 표 7: 다중회귀 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 7&gt; 주관적 행복감에 대한 다중회귀분석 결과 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left`}>변수</th>
                  <th className={`${TH} text-right`}>B</th>
                  <th className={`${TH} text-right`}>SE</th>
                  <th className={`${TH} text-right`}>&beta;</th>
                  <th className={`${TH} text-right`}>t</th>
                  <th className={`${TH} text-right`}>p</th>
                </tr>
              </thead>
              <tbody>
                {multipleReg.coefficients.map((c, idx) => (
                  <tr key={c.variable} className={idx === multipleReg.coefficients.length - 1 ? TBODY_LAST : ''}>
                    <td className="px-3 py-1.5 text-sm">{c.variable}</td>
                    <td className={`${TD} text-right`}>{fmt(c.b, 4)}</td>
                    <td className={`${TD} text-right`}>{fmt(c.se, 4)}</td>
                    <td className={`${TD} text-right`}>{c.variable === '(상수)' ? '—' : fmt(c.beta, 4)}</td>
                    <td className={`${TD} text-right`}>{fmt(c.t)}</td>
                    <td className={`${TD} text-right`}>{fmt(c.p, 4)}{stars(c.p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1 text-center">
              종속변수: 주관적 행복감. R&sup2; = {fmt(multipleReg.rSquared, 4)},
              수정된 R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)},
              F = {fmt(multipleReg.fStatistic)}.
              *p &lt; .05, **p &lt; .01, ***p &lt; .001
            </p>
          </div>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">4. 매개효과 분석</h3>
          <p className="mb-3 text-justify text-[14px]">
            자기효능감의 매개효과를 검증하기 위해 Baron과 Kenny(1986)의 3단계 매개분석 절차를
            적용하였다. 매개효과가 성립하기 위해서는 (1) 독립변수가 종속변수에 유의한 영향을 미치고(c 경로),
            (2) 독립변수가 매개변수에 유의한 영향을 미치며(a 경로), (3) 매개변수를 통제한 상태에서
            매개변수가 종속변수에 유의한 영향을 미쳐야(b 경로) 한다.
          </p>

          <p className="mb-3 text-justify text-[14px]">
            <strong>1단계(c 경로):</strong> 독립변수(문화소비)가 종속변수(주관적 행복감)에 미치는 총효과를
            분석한 결과, 문화소비는 주관적 행복감에 유의한 정적 영향을 미쳤다
            (B = {fmt(mediation.cPath.coeff, 4)}, SE = {fmt(mediation.cPath.se, 4)},
            t = {fmt(mediation.cPath.t)}, {sig(mediation.cPath.p)}).
            {mediation.cPath.p < 0.05 ? ' 따라서 1단계 조건이 충족되었다.' : ' 1단계 조건이 충족되지 않았다.'}
          </p>
          <p className="mb-3 text-justify text-[14px]">
            <strong>2단계(a 경로):</strong> 독립변수(문화소비)가 매개변수(자기효능감)에 미치는 영향을
            분석한 결과, 문화소비는 자기효능감에 유의한 정적 영향을 미쳤다
            (B = {fmt(mediation.aPath.coeff, 4)}, SE = {fmt(mediation.aPath.se, 4)},
            t = {fmt(mediation.aPath.t)}, {sig(mediation.aPath.p)}).
            {mediation.aPath.p < 0.05 ? ' 따라서 2단계 조건이 충족되었다.' : ' 2단계 조건이 충족되지 않았다.'}
          </p>
          <p className="mb-3 text-justify text-[14px]">
            <strong>3단계(b 경로, c&apos; 경로):</strong> 매개변수(자기효능감)를 통제한 상태에서의 분석 결과,
            자기효능감의 주관적 행복감에 대한 효과(b 경로)는
            B = {fmt(mediation.bPath.coeff, 4)}(SE = {fmt(mediation.bPath.se, 4)},
            t = {fmt(mediation.bPath.t)}, {sig(mediation.bPath.p)})로 {mediation.bPath.p < 0.05 ? '유의하였다' : '유의하지 않았다'}.
            문화소비의 직접효과(c&apos; 경로)는
            B = {fmt(mediation.cPrimePath.coeff, 4)}(SE = {fmt(mediation.cPrimePath.se, 4)},
            t = {fmt(mediation.cPrimePath.t)}, {sig(mediation.cPrimePath.p)})로 나타났다.
            {mediation.cPrimePath.p < 0.05
              ? ` 매개변수 통제 후에도 직접효과가 유의하므로 자기효능감은 부분 매개(partial mediation) 역할을 하는 것으로 판단된다.`
              : ` 매개변수 통제 후 직접효과가 유의하지 않으므로 자기효능감은 완전 매개(full mediation) 역할을 하는 것으로 판단된다.`}
          </p>

          {/* 표 8: 매개효과 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 8&gt; 자기효능감의 매개효과 분석 결과 (N = {N})</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left w-56`}>분석 단계 및 경로</th>
                  <th className={`${TH} text-right`}>B</th>
                  <th className={`${TH} text-right`}>SE</th>
                  <th className={`${TH} text-right`}>t</th>
                  <th className={`${TH} text-right`}>p</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-1.5 text-sm font-bold" colSpan={5}>1단계: X &rarr; Y (총효과)</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1.5 text-sm pl-6">문화소비 &rarr; 주관적 행복감 (c)</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.coeff, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.p, 4)}{stars(mediation.cPath.p)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm font-bold" colSpan={5}>2단계: X &rarr; M</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1.5 text-sm pl-6">문화소비 &rarr; 자기효능감 (a)</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.coeff, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.p, 4)}{stars(mediation.aPath.p)}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm font-bold" colSpan={5}>3단계: X, M &rarr; Y</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm pl-6">자기효능감 &rarr; 주관적 행복감 (b)</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.coeff, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.p, 4)}{stars(mediation.bPath.p)}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1.5 text-sm pl-6">문화소비 &rarr; 주관적 행복감 (c&apos;)</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.coeff, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.p, 4)}{stars(mediation.cPrimePath.p)}</td>
                </tr>
                <tr className={TBODY_LAST}>
                  <td className="px-3 py-1.5 text-sm font-bold">간접효과 (a &times; b)</td>
                  <td className={`${TD} text-right font-bold`}>{fmt(mediation.indirectEffect, 4)}</td>
                  <td className="px-3 py-1.5 text-sm text-right" colSpan={3}>
                    Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}, 매개비율 = {fmt(mediation.proportionMediated * 100, 1)}%
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-1 text-center">*p &lt; .05, **p &lt; .01, ***p &lt; .001</p>
          </div>

          <p className="mb-3 text-justify text-[14px]">
            간접효과의 통계적 유의성을 검증하기 위한 Sobel(1982) 검정 결과,
            Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}로
            {mediation.sobelP < 0.05 ? ' 간접효과가 통계적으로 유의하여 가설 4가 지지되었다' : ' 간접효과가 통계적으로 유의하지 않아 가설 4가 기각되었다'}.
            총효과(c = {fmt(mediation.totalEffect, 4)}) 대비 간접효과(a&times;b = {fmt(mediation.indirectEffect, 4)})의
            비율, 즉 매개비율은 {fmt(mediation.proportionMediated * 100, 1)}%로 나타났다.
            이는 문화소비가 주관적 행복감에 미치는 영향의 상당 부분이 자기효능감이라는
            심리적 기제를 경유하여 전달됨을 의미한다.
          </p>

          {/* 표 9: 가설 검증 요약 */}
          <div className="my-6">
            <p className={CAPTION}>&lt;표 9&gt; 연구 가설 검증 결과 요약</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className={THEAD_ROW}>
                  <th className={`${TH} text-left w-12`}>가설</th>
                  <th className={`${TH} text-left`}>내용</th>
                  <th className={`${TH} text-center w-16`}>결과</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-1.5 text-sm text-center">H1</td>
                  <td className="px-3 py-1.5 text-sm">문화소비 &rarr; 주관적 행복감 (+)</td>
                  <td className="px-3 py-1.5 text-sm text-center font-bold">{regressionXY.p < 0.05 ? '지지' : '기각'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm text-center">H2</td>
                  <td className="px-3 py-1.5 text-sm">문화소비 &rarr; 자기효능감 (+)</td>
                  <td className="px-3 py-1.5 text-sm text-center font-bold">{regressionXM.p < 0.05 ? '지지' : '기각'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm text-center">H3</td>
                  <td className="px-3 py-1.5 text-sm">자기효능감 &rarr; 주관적 행복감 (+)</td>
                  <td className="px-3 py-1.5 text-sm text-center font-bold">{regressionMY.p < 0.05 ? '지지' : '기각'}</td>
                </tr>
                <tr className={TBODY_LAST}>
                  <td className="px-3 py-1.5 text-sm text-center">H4</td>
                  <td className="px-3 py-1.5 text-sm">자기효능감의 매개효과</td>
                  <td className="px-3 py-1.5 text-sm text-center font-bold">{mediation.sobelP < 0.05 ? '지지' : '기각'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========== V. 논의 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">V. 논의</h2>

          <p className="mb-3 text-justify text-[14px]">
            본 연구는 시니어 계층의 문화소비가 자기효능감을 매개로 주관적 행복감에 미치는 영향을
            실증적으로 분석하였다. 주요 연구 결과를 가설별로 논의하면 다음과 같다.
          </p>

          <p className="mb-3 text-justify text-[14px]">
            <strong>첫째,</strong> 시니어 계층의 문화소비는 주관적 행복감에 유의한 {regressionXY.p < 0.05 ? '정적' : ''} 영향을
            미치는 것으로 나타나 가설 1이 {regressionXY.p < 0.05 ? '지지' : '기각'}되었다
            (B = {fmt(regressionXY.slope, 4)}, R&sup2; = {fmt(regressionXY.r2, 4)}).
            이는 문화 활동 참여가 시니어의 행복감을 높인다는 선행연구(Kim &amp; Lee, 2020;
            Heo et al., 2018; 김미혜·신경림, 2005)와 일치하는 결과이다.
            활동이론(Havighurst, 1961)의 관점에서, 문화소비 활동은 은퇴 후 축소되는 사회적 역할을
            대체하고, Csikszentmihalyi(1990)의 몰입 이론에서 강조하는 최적 경험을 제공함으로써
            삶의 만족도와 행복감을 높이는 것으로 해석된다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비 카테고리 중 {sortedCategories[0].label}(M = {fmt(sortedCategories[0].mean, 2)})의
            빈도가 가장 높게 나타난 것은 해당 활동이 시니어 계층에게 가장 접근성이 높고
            선호되는 문화 활동임을 시사한다. 반면 {sortedCategories[sortedCategories.length - 1].label}
            (M = {fmt(sortedCategories[sortedCategories.length - 1].mean, 2)})은 가장 낮은 빈도를 보여,
            해당 영역에 대한 시니어의 참여를 촉진하기 위한 정책적 노력이 필요함을 나타낸다.
          </p>

          <p className="mb-3 text-justify text-[14px]">
            <strong>둘째,</strong> 문화소비는 자기효능감에 유의한 정적 영향을 미쳐 가설 2가
            {regressionXM.p < 0.05 ? ' 지지' : ' 기각'}되었다
            (B = {fmt(regressionXM.slope, 4)}, R&sup2; = {fmt(regressionXM.r2, 4)}).
            이는 Bandura(1997)의 자기효능감 이론과 부합하는 결과로, 문화소비 활동이
            자기효능감의 네 가지 원천 — 수행 성취, 대리 경험, 언어적 설득, 긍정적 정서 상태 — 에
            기여함을 시사한다. 예를 들어, 공예 활동이나 스포츠 참여에서의 성취 경험은
            수행 성취를 통한 효능감 향상을, 문화 동호회에서의 동료 학습은 대리 경험과
            언어적 설득을 통한 효능감 향상을 촉진할 수 있다(김정숙·한경혜, 2019).
          </p>

          <p className="mb-3 text-justify text-[14px]">
            <strong>셋째,</strong> 자기효능감은 주관적 행복감에 유의한 정적 영향을 미쳐 가설 3이
            {regressionMY.p < 0.05 ? ' 지지' : ' 기각'}되었다
            (B = {fmt(regressionMY.slope, 4)}, R&sup2; = {fmt(regressionMY.r2, 4)}).
            이는 자기효능감이 행복감의 강력한 예측 변인이라는 Caprara 등(2006)과
            Lachman 등(2011)의 연구를 재확인하는 것이다. 성공적 노화 이론(Rowe &amp; Kahn, 1997)의
            관점에서, 자기효능감은 능동적 사회 참여와 건강 행동을 촉진하는 심리적 기반으로 작용하여
            궁극적으로 행복감에 기여하는 것으로 해석된다.
          </p>

          <p className="mb-3 text-justify text-[14px]">
            <strong>넷째,</strong> 자기효능감은 문화소비와 주관적 행복감의 관계를
            {mediation.sobelP < 0.05 ? ' 유의하게 매개하여' : ' 매개하지 못하여'} 가설 4가
            {mediation.sobelP < 0.05 ? ' 지지' : ' 기각'}되었다
            (간접효과 = {fmt(mediation.indirectEffect, 4)}, Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}).
            매개비율이 {fmt(mediation.proportionMediated * 100, 1)}%로 나타난 것은
            문화소비가 행복감에 이르는 경로에서 자기효능감이 중요한 심리적 기제로 작용함을 보여준다.
            {mediation.cPrimePath.p < 0.05
              ? ` 직접효과 또한 유의하므로(B = ${fmt(mediation.cPrimePath.coeff, 4)}, ${sig(mediation.cPrimePath.p)}),
                  자기효능감은 부분 매개 역할을 하며, 문화소비가 행복감에 영향을 미치는 데는
                  자기효능감 외에도 다른 경로(예: 사회적 관계, 몰입 경험 등)가 존재함을 시사한다.`
              : ` 직접효과가 유의하지 않으므로(B = ${fmt(mediation.cPrimePath.coeff, 4)}, ${sig(mediation.cPrimePath.p)}),
                  자기효능감은 완전 매개 역할을 하며, 문화소비의 행복감에 대한 영향이
                  주로 자기효능감이라는 심리적 기제를 통해 전달됨을 의미한다.`}
          </p>
          <p className="mb-3 text-justify text-[14px]">
            이러한 매개효과 결과는 사회인지이론(Bandura, 1997)의 관점에서 문화소비 활동이
            자기효능감이라는 인지적 평가를 거쳐 행복감에 영향을 미치는 심리적 과정을 실증적으로
            확인한 것이라 할 수 있다. 이는 시니어 대상 문화 프로그램 설계 시 단순한 활동 기회
            제공을 넘어 자기효능감 향상 요소를 체계적으로 포함시킬 필요가 있음을 강조한다.
          </p>
        </section>

        {/* ========== VI. 결론 및 제언 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">VI. 결론 및 제언</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 결론</h3>
          <p className="mb-3 text-justify text-[14px]">
            본 연구는 시니어 {N}명을 대상으로 문화소비, 자기효능감, 주관적 행복감의 구조적 관계를
            분석하였다. 연구 결과를 요약하면 다음과 같다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            첫째, 시니어 계층의 문화소비는 주관적 행복감에 유의한 정적 영향을 미치는 것으로 확인되었다.
            둘째, 문화소비는 자기효능감에도 유의한 정적 영향을 미쳤다.
            셋째, 자기효능감은 주관적 행복감에 유의한 정적 영향을 미쳤다.
            넷째, 자기효능감은 문화소비와 주관적 행복감의 관계를
            {mediation.sobelP < 0.05 ? ' 유의하게 매개하는' : ' 부분적으로 매개하는'} 것으로 확인되었으며,
            매개비율은 {fmt(mediation.proportionMediated * 100, 1)}%였다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            이러한 결과는 활동이론, 자기효능감 이론, 성공적 노화 이론을 통합적으로 지지하며,
            시니어 계층의 행복감 증진을 위해서는 문화소비 기회의 확대와 함께 활동 과정에서의
            자기효능감 향상을 도모하는 것이 효과적임을 시사한다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 실천적 시사점</h3>
          <p className="mb-3 text-justify text-[14px]">
            본 연구의 결과에 기초한 실천적 시사점은 다음과 같다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            첫째, 시니어 대상 문화 프로그램 설계 시 단순 관람형(수동적 소비)보다는
            참여형·체험형 활동(능동적 소비)을 강화할 필요가 있다. 직접적인 참여와 성취 경험은
            자기효능감의 가장 강력한 원천인 수행 성취(enactive mastery)를 제공하므로,
            단계별 성취 목표를 설정하고, 점진적으로 난이도를 높여가는 프로그램 구성이 효과적일 것이다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            둘째, 문화소비의 접근성을 높이기 위한 다층적 지원 정책이 필요하다.
            경제적 부담을 줄이기 위한 시니어 할인제도 확대, 물리적 접근성을 높이기 위한
            지역 문화시설 확충 및 이동 지원, 디지털 리터러시 교육을 통한 온라인 문화 콘텐츠
            접근성 향상 등의 다각적 접근이 요구된다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            셋째, 시니어 문화 프로그램에 자기효능감 향상 요소를 체계적으로 포함시킬 것을 제안한다.
            구체적으로, (1) 단계별 성취 경험 제공, (2) 동료 학습(peer learning)을 통한 대리 경험,
            (3) 지도자와 동료의 긍정적 피드백을 통한 언어적 설득, (4) 즐겁고 편안한
            학습 환경 조성을 통한 긍정적 정서 상태 유도 등의 요소를 프로그램에 통합할 수 있다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            넷째, 문화소비 카테고리 중 참여 빈도가 낮게 나타난 영역에 대한 시니어 친화적 프로그램
            개발이 필요하다. 본 연구에서 {sortedCategories[sortedCategories.length - 1].label}의
            빈도가 가장 낮은 것으로 나타났는데, 이 영역에 대한 진입 장벽을 낮추고
            시니어의 흥미를 유발할 수 있는 프로그램 개발이 요구된다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">3. 연구의 제한점 및 후속 연구 제언</h3>
          <p className="mb-3 text-justify text-[14px]">
            본 연구의 제한점과 이에 따른 후속 연구 제언은 다음과 같다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            첫째, 본 연구는 횡단적(cross-sectional) 연구 설계를 사용하여 변수 간 시간적
            선후 관계를 확인하기 어렵다는 한계가 있다. 문화소비가 자기효능감과 행복감을
            향상시키는 것인지, 아니면 행복한 사람이 더 많은 문화소비를 하는 것인지에 대한
            인과적 방향성을 엄밀하게 검증하기 위해서는 종단적(longitudinal) 연구 설계나
            실험 설계를 활용한 후속 연구가 필요하다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            둘째, 표본 크기({N}명)가 상대적으로 작고 편의표집을 사용하여 연구 결과의 일반화에
            한계가 있다. 후속 연구에서는 대규모 표본과 확률표집 방법을 활용하여 결과의
            일반화 가능성을 높일 필요가 있다. 또한 지역, 거주 형태(독거/동거) 등을 고려한
            층화표집 방법을 적용하면 더욱 대표성 있는 결과를 도출할 수 있을 것이다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            셋째, 자기보고식(self-report) 설문에 의존하여 사회적 바람직성 편향(social desirability bias)의
            가능성을 배제할 수 없다. 후속 연구에서는 행동 관찰, 경험 표집법(Experience Sampling Method)
            등의 다양한 측정 방법을 병행하여 측정의 타당성을 높일 필요가 있다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            넷째, 본 연구는 문화소비의 양적 측면(빈도)만 측정하였으나, 활동의 질적 측면
            (만족도, 몰입도, 자발성)이 행복감에 미치는 영향이 다를 수 있다.
            후속 연구에서는 문화소비의 양적·질적 측면을 모두 포함한 포괄적인 측정이 이루어질 필요가 있다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            다섯째, 자기효능감 외에도 사회적 지지(social support), 생활 만족도(life satisfaction),
            사회적 자본(social capital) 등 다른 잠재적 매개 변인이나 조절 변인의 역할을 탐색하는
            후속 연구가 필요하다. 구조방정식 모형(SEM)을 활용하여 보다 복잡한 매개 모형이나
            조절된 매개 모형을 검증하는 것도 의미 있을 것이다.
          </p>
        </section>

        {/* ========== 참고문헌 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">참고문헌</h2>

          <h3 className="font-bold mt-4 mb-3 text-[13px] text-gray-500">국내 문헌</h3>
          <div className="text-[13px] space-y-2 pl-8 -indent-8 leading-relaxed">
            <p>김동배·권중돈 (2020). <em>인간행동이론과 사회복지실천</em> (4판). 학지사.</p>
            <p>김미혜·신경림 (2005). 한국 노인의 성공적 노화 모형. <em>한국노년학</em>, 25(2), 127-140.</p>
            <p>김정숙·한경혜 (2019). 중·노년기 문화예술활동 참여와 주관적 안녕감의 관계: 자기효능감의 매개효과. <em>한국노년학</em>, 39(3), 455-474.</p>
            <p>박경숙·서이종 (2019). 한국 노인의 주관적 안녕감 결정요인. <em>한국사회학</em>, 53(2), 1-36.</p>
            <p>이소정·정경희 (2018). 노인의 문화예술 참여와 삶의 만족도. <em>보건사회연구</em>, 38(2), 318-349.</p>
            <p>정경희·오영희·강은나·김경래·이윤경·오미애·황남희·김세진·이선희·이석구·홍송이 (2021). <em>2020년도 노인실태조사</em>. 보건복지부·한국보건사회연구원.</p>
            <p>통계청 (2023). <em>2023 고령자 통계</em>. 대전: 통계청.</p>
          </div>

          <h3 className="font-bold mt-6 mb-3 text-[13px] text-gray-500">국외 문헌</h3>
          <div className="text-[13px] space-y-2 pl-8 -indent-8 leading-relaxed">
            <p>Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. <em>Psychological Review</em>, 84(2), 191-215.</p>
            <p>Bandura, A. (1997). <em>Self-efficacy: The exercise of control</em>. W.H. Freeman.</p>
            <p>Baron, R. M., &amp; Kenny, D. A. (1986). The moderator-mediator variable distinction in social psychological research: Conceptual, strategic, and statistical considerations. <em>Journal of Personality and Social Psychology</em>, 51(6), 1173-1182.</p>
            <p>Benight, C. C., &amp; Bandura, A. (2004). Social cognitive theory of posttraumatic recovery: The role of perceived self-efficacy. <em>Behaviour Research and Therapy</em>, 42(10), 1129-1148.</p>
            <p>Bourdieu, P. (1984). <em>Distinction: A social critique of the judgement of taste</em>. Harvard University Press.</p>
            <p>Caprara, G. V., Steca, P., Gerbino, M., Paciello, M., &amp; Vecchio, G. M. (2006). Looking for adolescents&apos; well-being: Self-efficacy beliefs as determinants of positive thinking and happiness. <em>Epidemiologia e Psichiatria Sociale</em>, 15(1), 30-43.</p>
            <p>Cohen, J. (1988). <em>Statistical power analysis for the behavioral sciences</em> (2nd ed.). Lawrence Erlbaum Associates.</p>
            <p>Csikszentmihalyi, M. (1990). <em>Flow: The psychology of optimal experience</em>. Harper &amp; Row.</p>
            <p>Diener, E. (1984). Subjective well-being. <em>Psychological Bulletin</em>, 95(3), 542-575.</p>
            <p>Diener, E., Oishi, S., &amp; Tay, L. (2018). Advances in subjective well-being research. <em>Nature Human Behaviour</em>, 2(4), 253-260.</p>
            <p>Gilleard, C., &amp; Higgs, P. (2005). <em>Contexts of ageing: Class, cohort and community</em>. Polity Press.</p>
            <p>Havighurst, R. J. (1961). Successful aging. <em>The Gerontologist</em>, 1(1), 8-13.</p>
            <p>Heo, J., Chun, S., Lee, S., Lee, K. H., &amp; Kim, J. (2018). Internet use and well-being in older adults. <em>Cyberpsychology, Behavior, and Social Networking</em>, 18(5), 268-272.</p>
            <p>Jerusalem, M., &amp; Schwarzer, R. (1992). Self-efficacy as a resource factor in stress appraisal processes. In R. Schwarzer (Ed.), <em>Self-efficacy: Thought control of action</em> (pp. 195-213). Hemisphere.</p>
            <p>Kim, J., &amp; Lee, S. (2020). Cultural activities and subjective well-being among older adults. <em>Journal of Aging and Health</em>, 32(7-8), 745-756.</p>
            <p>Kline, R. B. (2015). <em>Principles and practice of structural equation modeling</em> (4th ed.). Guilford Publications.</p>
            <p>Lachman, M. E., Neupert, S. D., &amp; Agrigoroaei, S. (2011). The relevance of control beliefs for health and aging. In K. W. Schaie &amp; S. L. Willis (Eds.), <em>Handbook of the psychology of aging</em> (7th ed., pp. 175-190). Academic Press.</p>
            <p>Lemon, B. W., Bengtson, V. L., &amp; Peterson, J. A. (1972). An exploration of the activity theory of aging: Activity types and life satisfaction among in-movers to a retirement community. <em>Journal of Gerontology</em>, 27(4), 511-523.</p>
            <p>Lyubomirsky, S., &amp; Lepper, H. S. (1999). A measure of subjective happiness: Preliminary reliability and construct validation. <em>Social Indicators Research</em>, 46(2), 137-155.</p>
            <p>Park, S., Han, Y., &amp; Kim, B. (2019). Cultural engagement and depression among older adults: Evidence from a longitudinal study. <em>Aging &amp; Mental Health</em>, 23(2), 186-191.</p>
            <p>Rowe, J. W., &amp; Kahn, R. L. (1997). Successful aging. <em>The Gerontologist</em>, 37(4), 433-440.</p>
            <p>Schwarzer, R., &amp; Jerusalem, M. (1995). Generalized self-efficacy scale. In J. Weinman, S. Wright, &amp; M. Johnston (Eds.), <em>Measures in health psychology: A user&apos;s portfolio</em> (pp. 35-37). NFER-NELSON.</p>
            <p>Sobel, M. E. (1982). Asymptotic confidence intervals for indirect effects in structural equation models. <em>Sociological Methodology</em>, 13, 290-312.</p>
            <p>Stern, Y. (2012). Cognitive reserve in ageing and Alzheimer&apos;s disease. <em>The Lancet Neurology</em>, 11(11), 1006-1012.</p>
            <p>Stretcher, V. J., DeVellis, B. M., Becker, M. H., &amp; Rosenstock, I. M. (1986). The role of self-efficacy in achieving health behavior change. <em>Health Education Quarterly</em>, 13(1), 73-92.</p>
          </div>
        </section>

        {/* 부록 정보 */}
        <section className="mt-8 pt-6 border-t-2 border-gray-300">
          <p className="text-xs text-gray-400 text-center">
            본 논문은 대시보드 내 샘플 데이터({N}건)를 기반으로 자동 생성된 가상 논문입니다.
            실제 학술 논문으로 사용할 수 없으며, 통계 수치는 입력된 데이터에 따라 동적으로 변경됩니다.
          </p>
        </section>
      </article>
    </div>
  );
}
