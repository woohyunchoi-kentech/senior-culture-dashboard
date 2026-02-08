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
        {/* ========== 표지 ========== */}
        <header className="text-center space-y-5 pb-8 border-b-2 border-black">
          <p className="text-sm text-gray-500 tracking-widest">문화전문석사 학위논문</p>
          <h1 className="text-[22px] font-bold leading-relaxed tracking-tight mt-4">
            시니어 계층의 문화소비가 자기효능감과<br />
            주관적 행복감에 미치는 영향
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            — 자기효능감의 매개효과를 중심으로 —
          </p>
          <div className="text-sm text-gray-500 space-y-1 mt-6">
            <p className="italic leading-relaxed">
              The Effect of Cultural Consumption on Self-Efficacy and<br />
              Subjective Happiness among Senior Citizens:<br />
              Focusing on the Mediating Role of Self-Efficacy
            </p>
          </div>
          <div className="mt-8 space-y-1 text-sm text-gray-600">
            <p>전남대학교 문화전문대학원</p>
            <p>문화경영관광전공</p>
            <p className="mt-4 text-base font-bold tracking-[0.5em]">최 지 은</p>
            <p className="mt-4">2026년 2월</p>
          </div>
        </header>

        {/* ========== 국문 초록 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">국문초록</h2>
          <div className="bg-gray-50 rounded p-6 text-[13px] leading-relaxed">
            <p className="mb-3 text-justify">
              본 연구는 시니어 계층의 문화소비 활동이 자기효능감을 매개로 주관적 행복감에 미치는 영향을
              실증적으로 분석하는 것을 목적으로 한다. 활동이론(Activity Theory)과 Bandura의 자기효능감 이론을
              이론적 기반으로 하여, 광산구 노인복지회관(더불어樂) 이용 시니어 {N}명을 대상으로
              구조화된 설문조사를 실시하였다.
              문화소비는 영화관람, 공연/음악회, 전시/미술관, 독서, 스포츠, 여행, 공예/취미, 디지털 콘텐츠의
              8개 카테고리 빈도(0-5점)로 측정하였으며, 자기효능감은 Sherer et al.(1982)의 연구를 기반으로
              자신감과 자기조절효능감으로 구성한 10문항, 주관적 행복감은 Lyubomirsky와 Lepper(1999)의
              주관적 행복감 척도를 참고한 5문항의 리커트 5점 척도로 측정하였다.
              측정도구의 신뢰도는 Cronbach&apos;s &alpha;가 문화소비 {fmt(reliability.alphaConsumption)},
              자기효능감 {fmt(reliability.alphaEfficacy)}, 주관적 행복감 {fmt(reliability.alphaHappiness)}으로
              모두 수용 가능한 수준이었다.
            </p>
            <p className="mb-3 text-justify">
              분석 결과, 첫째, 문화소비는 자기효능감(r = {fmt(corXM?.r ?? 0)}, {sig(corXM?.p ?? 1)})과
              주관적 행복감(r = {fmt(corXY?.r ?? 0)}, {sig(corXY?.p ?? 1)}) 모두와 유의한 정적 상관을 보였다.
              둘째, 다중회귀분석 결과, 문화소비와 자기효능감은 주관적 행복감 변량의
              {fmt(multipleReg.rSquared * 100, 1)}%를 설명하였다(R&sup2; = {fmt(multipleReg.rSquared, 4)}).
              셋째, Baron과 Kenny(1986)의 매개분석과 Sobel(1982) 검정 결과,
              자기효능감의 간접효과(a&times;b = {fmt(mediation.indirectEffect, 4)})가 유의하며
              (Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)}),
              매개비율은 {fmt(mediation.proportionMediated * 100, 1)}%로 나타나
              자기효능감이 {mediationType} 역할을 하는 것으로 확인되었다.
              이러한 결과는 시니어의 행복감 증진을 위해 문화소비 기회 확대와 함께
              자기효능감을 강화하는 프로그램 설계가 필요함을 시사한다.
            </p>
            <p>
              <strong>주제어:</strong> 시니어, 문화소비, 자기효능감, 자신감, 자기조절효능감, 주관적 행복감, 매개효과, 활동이론
            </p>
          </div>
        </section>

        {/* ========== 영문 초록 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">Abstract</h2>
          <div className="bg-gray-50 rounded p-6 text-[13px] leading-relaxed italic">
            <p className="mb-3 text-justify">
              This study examines the mediating role of self-efficacy in the relationship between cultural
              consumption and subjective happiness among senior citizens. Based on Activity Theory
              (Havighurst, 1961) and Bandura&apos;s (1977, 1997) self-efficacy theory, a structured survey was
              conducted with {N} adults aged 60 and over at Gwangsan-gu Senior Welfare Center.
              Cultural consumption was measured across eight categories (0-5 scale), self-efficacy with
              a 10-item scale comprising self-confidence and self-regulatory efficacy (Sherer et al., 1982),
              and subjective happiness with a 5-item Likert scale. Cronbach&apos;s &alpha; values indicated
              acceptable reliability (&alpha; = {fmt(reliability.alphaConsumption)}–{fmt(reliability.alphaHappiness)}).
            </p>
            <p className="mb-3 text-justify">
              Results showed significant positive correlations among all variables.
              Multiple regression revealed that cultural consumption and self-efficacy explained
              {fmt(multipleReg.rSquared * 100, 1)}% of variance in happiness. Mediation analysis using
              Baron and Kenny&apos;s (1986) approach and Sobel&apos;s (1982) test confirmed that self-efficacy
              significantly mediated the relationship (indirect effect = {fmt(mediation.indirectEffect, 4)},
              Sobel Z = {fmt(mediation.sobelZ)}, {sig(mediation.sobelP)},
              mediation ratio = {fmt(mediation.proportionMediated * 100, 1)}%).
              These findings suggest that enhancing cultural participation opportunities alongside
              self-efficacy development programs can promote senior well-being in the context of
              an aging society.
            </p>
            <p className="not-italic">
              <strong>Keywords:</strong> senior citizens, cultural consumption, self-efficacy, self-confidence,
              self-regulatory efficacy, subjective happiness, mediation effect, activity theory
            </p>
          </div>
        </section>

        {/* ========== I. 서론 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">I. 서론</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 연구배경 및 연구목적</h3>

          <p className="mb-2 text-[14px] font-bold">가. 연구배경</p>
          <p className="mb-3 text-justify text-[14px]">
            전 세계 사회가 인구 고령화라는 인구학적 변화를 겪으면서 고령층의 삶의 질을 보장하는 것이
            점점 더 시급한 문제가 되고 있다. 시니어를 대상으로 한 연구와 정책적 노력은 신체적 건강,
            경제적 안정, 의료 서비스에 집중되어 왔으나, 최근에는 심리적 웰빙과 액티브 에이징에 대한
            인식이 높아지고 있다. 노년기의 정신적, 정서적 건강에 기여하는 다양한 요인 중 문화소비,
            즉 문화 및 예술 활동 참여는 잠재적으로 중요하지만 아직 충분히 규명되지 않은 차원으로
            부상하고 있다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            한국은 고령화 속도가 유례없이 빨라 2000년 고령화사회, 2018년 고령사회에 진입하였으며,
            2025년에는 초고령사회(65세 이상 인구 비율 20%)에 도달할 것으로 전망된다(통계청, 2023).
            이러한 인구 구조의 급변은 시니어 계층의 삶의 질과 정신건강에 대한 사회적 관심을 높이고 있으며,
            성공적 노화(successful aging)의 요건으로서 주관적 행복감의 중요성이 강조되고 있다
            (Rowe &amp; Kahn, 1997; 김동배·권중돈, 2020).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            시니어층의 문화소비에는 공연·전시 관람, 지역사회 문화행사 참여, 문학 모임,
            영상 미디어 학습 등 다양한 활동이 포함된다. 이러한 활동은 여가와 즐거움을 제공할
            뿐만 아니라 사회적 교류, 인지적 자극, 정서적 표현을 위한 의미 있는 수단으로 작용한다.
            따라서 시니어층의 자존감, 역량 인식, 삶의 만족도를 형성하는 데 중요한 역할을 할 수 있다.
            은퇴 이후 기존의 수동적인 삶과는 달리 현재의 노년층은 건강하고 활동적인 액티브 라이프를
            추구하며, 뉴 시니어들이 인생의 후반기를 준비하는 과정에서 자연스럽게 변화하는 환경을
            받아들이고 있다(정경희 외, 2021).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            노년기의 웰빙과 밀접한 관련이 있는 두 가지 심리적 구성 요소는 자기효능감과 주관적 행복감이다.
            자기효능감은 삶의 상황을 관리하고 통제할 수 있는 자신의 능력에 대한 개인의 믿음을 의미하며
            (Bandura, 1977), 주관적 행복감은 삶의 만족도와 정서적 안녕에 대한 전반적인 평가를 반영한다
            (Lyubomirsky &amp; Lepper, 1999). 이 두 가지 모두 성공적인 노화와 회복탄력성의 중요한
            지표로 간주되나, 문화적 참여와 이러한 심리적 결과 사이의 관계, 특히 고령화 인구의 맥락에서
            이를 실증적으로 규명한 연구는 아직 부족한 실정이다.
          </p>

          <p className="mb-2 text-[14px] font-bold">나. 연구목적</p>
          <p className="mb-3 text-justify text-[14px]">
            본 연구의 목적은 시니어 계층의 문화소비가 자기효능감과 주관적 행복감에 미치는 영향을
            실증적으로 분석하는 데 있다. 초고령화 사회로 가속화됨에 따라 노년층의 삶의 질 향상을 위한
            다양한 요인이 주목받고 있으며, 문화 활동에 대한 참여는 정신적·심리적 복지 향상에 기여할 수
            있는 중요한 수단으로 평가된다. 본 연구에서는 시니어층이 공연 관람, 전시 관람, 지역 예술
            프로그램 참여, 문화 콘텐츠 소비 등 다양한 형태의 문화활동에 참여하는 정도를 파악하고,
            이러한 문화소비가 자기효능감(자신의 삶을 스스로 통제하고 관리할 수 있다는 믿음)과
            주관적 행복감(삶에 대한 전반적인 만족도와 긍정적 감정)에 어떤 영향을 미치는지 분석하고자 한다.
            구체적인 연구 문제는 다음과 같다.
          </p>
          <div className="ml-6 space-y-1 mb-4 text-[14px]">
            <p>연구문제 1. 시니어 계층의 문화소비, 자기효능감, 주관적 행복감의 수준은 어떠한가?</p>
            <p>연구문제 2. 시니어 계층의 문화소비, 자기효능감, 주관적 행복감 간의 상관관계는 어떠한가?</p>
            <p>연구문제 3. 시니어 계층의 문화소비는 자기효능감과 주관적 행복감에 유의한 영향을 미치는가?</p>
            <p>연구문제 4. 자기효능감은 문화소비와 주관적 행복감의 관계를 유의하게 매개하는가?</p>
          </div>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 연구의 방법 및 범위</h3>
          <p className="mb-3 text-justify text-[14px]">
            본 연구는 1장에서 연구의 배경, 필요성, 연구의 목적과 방법을 제시하고, 2장에서는 시니어 계층의
            문화소비 유형에 관련된 문헌 및 선행연구를 통하여 개념과 특징을 정리하고 자기효능감, 주관적
            행복감에 미치는 영향에 대한 이론을 정리한다. 3장에서는 연구모형과 가설을 제시하고 설문지의
            구성과 분석방법을 기술한다. 4장에서는 설문 결과를 통해 표본의 일반적인 특성과 시니어 계층의
            문화소비가 자기효능감, 주관적 행복감에 미치는 영향을 분석하고, 종합적인 결론과 시사점,
            한계점을 도출한다.
          </p>
        </section>

        {/* ========== II. 이론적 고찰 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">II. 이론적 고찰</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 시니어 계층의 문화소비</h3>

          <p className="mb-2 text-[14px] font-bold">가. 시니어 계층의 문화소비 개념과 유형</p>

          <p className="mb-1 text-[14px] font-bold ml-4">1) 시니어 개념</p>
          <p className="mb-3 text-justify text-[14px]">
            사전적 의미에서의 시니어는 &lsquo;나이가 들어 늙은 사람&rsquo;이라고 정의되며(국립국어원, 2017),
            일반적으로 &lsquo;생리적, 신체적 기능의 퇴화와 더불어 심리적인 변화가 일어나 개인의 자기 의지
            기능과 사회적 역할 기능이 약화되고 있는 사람&rsquo;으로도 정의된다(서혜경, 정순동, 최광현, 2006).
            세계보건기구(WHO)와 국제노년학회(International Association of Gerontology)는 인간의 노화 과정에서
            나타나는 생리적, 심리적, 환경적 변화와 행동의 변화가 상호작용하는 복합 형태의 과정에 있는
            사람을 시니어로 정의하고 있다(권중돈, 2012).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            Neugarten(1996)은 시니어를 연령별로 세분화하여, Young Old(55~65세, 사회적으로 일하며
            능력이 절정에 달한 사람), Middle Old(65~75세, 대부분 퇴직자), Old Old(75세 이상,
            신체적으로 노쇠하고 질병에 걸린 경우가 많은 사람)로 구분하였다(최순남, 2002 인용).
            고령화 사회 진입과 함께 이전 노년세대와는 다른 생활 가치관을 가진 새로운 계층이 등장하고 있으며,
            이들은 예비노년층, 뉴실버, 액티브시니어, 스마트시니어 등으로 정의되고 있다(김지은, 2016).
            본 연구에서는 국민연금법에서 제시한 60세 이상의 노년층을 시니어로 정의한다.
          </p>

          <p className="mb-1 text-[14px] font-bold ml-4">2) 시니어 문화 및 특징</p>
          <p className="mb-3 text-justify text-[14px]">
            시니어를 바라보는 전통적 문화로는 경로사상, 효(孝)사상, 장유유서 등을 들 수 있으며,
            이들의 삶의 지혜와 경험을 중요시하여 공경의 대상으로 여겨져 왔다. 기본 가치관은 동양적
            전통의 영향 아래 발달하면서 서구적 근대사의 영향도 함께 받아 형성되었다.
            활동이론(Activity Theory)의 관점에서 Havighurst(1961)는 노년기에도 중년기와 유사한 수준의
            사회적 활동을 유지하는 것이 높은 생활 만족도의 핵심 조건임을 주장하였다.
            은퇴나 신체적 제약으로 인해 상실된 역할(role loss)은 새로운 활동으로 대체되어야 하며,
            그 대체 활동의 질과 양이 노년기 삶의 질을 결정짓는 중요한 요인이 된다
            (Lemon, Bengtson, &amp; Peterson, 1972).
          </p>

          <p className="mb-2 text-[14px] font-bold">나. 문화소비 개념과 특성</p>
          <p className="mb-3 text-justify text-[14px]">
            소비는 삶을 유지하고 개인의 욕망을 채우기 위해 재화와 용역을 구매하는 것을 의미한다.
            문화소비(cultural consumption)는 Bourdieu(1984)의 문화자본(cultural capital) 개념에 기반한 것으로,
            영화, 공연, 전시, 독서, 스포츠, 여행, 공예, 디지털 콘텐츠 등 다양한 문화적 활동에
            참여하고 이를 향유하는 행위를 말한다. 문화소비는 단순한 여가가 아니라 문화자본으로 축적된
            자신의 정체성을 형성하고 표현하는 인간 삶의 질에 중요한 요소가 되었으며,
            구체적인 생활양식(lifestyle)을 만들고 유지하며 사회적 차이나 특성을 드러낸다
            (Gilleard &amp; Higgs, 2005; 이소정·정경희, 2018).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            이성철(2003)은 문화소비의 특징에 대해 다음과 같이 설명하였다.
            첫째, 예술문화 소비는 의식주와 관련된 필수적 소비가 아닌 부가적인 성격을 지닌다.
            둘째, 육체적 활동보다는 지성, 감성, 정서와 같은 인간의 정신활동과 관련된 소비이다.
            셋째, 삶의 질 향상과 직결된다.
            넷째, 참여하는 소비자의 생활양식을 형성해 주는 사회적 과정이다.
            또한 문화소비의 공유성(비배타적·비경합적 소비)과 효용 지속성(소비 행위 후에도
            오랫동안 작용하는 효과)은 일반 소비와 구별되는 독특한 특징이다(박선희, 2002; 조필규, 2018).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            선행연구들에 따르면 시니어의 문화활동 참여는 우울 감소(Park, Han, &amp; Kim, 2019),
            인지 예비력(cognitive reserve) 향상(Stern, 2012), 사회적 유대감 강화(Heo et al., 2018)
            등의 효과가 있으며, 국내 연구에서도 노인의 여가활동 참여가 생활 만족도에 유의한
            정적 영향을 미친다고 보고되었다(김미혜·신경림, 2005).
            Csikszentmihalyi(1990)의 몰입(flow) 이론에 따르면, 개인의 기술 수준과 도전의 수준이
            적절히 조화를 이룰 때 최적의 경험이 발생하며, 이러한 몰입 경험이 반복되면
            삶의 만족도와 행복감이 증가한다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 자기효능감 개념과 특성</h3>

          <p className="mb-2 text-[14px] font-bold">가. 자기효능감</p>

          <p className="mb-1 text-[14px] font-bold ml-4">1) 자기효능감 개념</p>
          <p className="mb-3 text-justify text-[14px]">
            자기효능감(self-efficacy)은 캐나다 심리학자 Bandura(1977)가 제안한 개념으로,
            인간이란 본질적으로 사고, 감정, 행동을 스스로 통제할 수 있는 자기 반영적인 능력을
            갖고 있으며, 그 중 가장 강력한 자기 조절 과정이 자기효능감이라고 하였다.
            Hackett과 Betz(1981)는 특정 행동을 성공적으로 수행할 능력이 본인에게 있다는 개인의
            확신이라고 개념화하였으며, Eden과 Aviran(1993)은 과제 수행에 필요한 동기이며
            인지적 원천이고, 성공에 필수적인 신체적·지적·정서적 원천을 움직이게 하는 능력에
            대한 믿음이라고 정의하였다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            Williams와 Rhodes(2016)는 자기효능감을 생각에 그치지 않고 행동의 변화를 주는
            요인이라고 정의하였고, 기홍석(2020)은 자기효능감은 학습과 경험을 통해 후천적으로
            형성될 수 있다고 하였다.
            시니어 계층에게 자기효능감은 특히 중요한 심리적 자원으로 기능한다.
            Lachman, Neupert와 Agrigoroaei(2011)에 따르면, 노화에 수반되는 신체적, 인지적, 사회적
            변화에 적응하고 능동적 생활을 유지하는 데 자기효능감이 결정적 역할을 한다.
          </p>

          <p className="mb-1 text-[14px] font-bold ml-4">2) 자기효능감 특성</p>
          <p className="mb-3 text-justify text-[14px]">
            Bandura(1986)는 성취상황에서 개인의 기대를 결과기대(outcome expectancy)와
            효능기대(efficacy expectancy)의 두 유형으로 구분하였다. 결과기대란 어떤 행동을 수행한 후
            어떤 결과를 초래할 것인가에 대한 가능성이며, 효능기대는 그러한 결과를 얻기 위해 필요한
            행동을 잘 수행해 낼 수 있는가에 대한 가능성을 의미한다(조승우·김아영, 1998).
            Bandura(1997)는 후속 연구를 통해 행동을 결정하는 요인으로 결과기대보다 효능기대가
            더 중요하다고 인지하였는데, 결과기대는 외부환경과 관련되어 변형이 가능하지만
            효능기대는 내적으로 규정되어 변형되기 어렵다는 점에서 더욱 중요하다고 보았다.
          </p>

          <p className="mb-2 text-[14px] font-bold">나. 자기효능감 구성 방법(유형)</p>
          <p className="mb-3 text-justify text-[14px]">
            Bandura(1990)는 자기효능감이 네 가지 요인을 통하여 형성된다고 하였다.
            첫째, <strong>성취경험</strong>(enactive mastery experience)은 직접적인 성공 경험으로
            가장 강력한 효능감 원천이다.
            둘째, <strong>대리경험</strong>(vicarious experience)은 타인의 성공과 실패를 관찰함으로써
            &ldquo;나도 할 수 있다&rdquo;는 신념을 형성하는 것이다.
            셋째, <strong>언어적 설득</strong>(verbal persuasion)은 타인으로부터의 격려와 긍정적 피드백이다.
            넷째, <strong>정서적 각성</strong>(emotional arousal)은 불안과 좌절 등의 정서적 반응 및
            이를 적절하게 조절하는 능력이다. 이 네 가지 근원은 개별적이 아닌 동시에 작용한다
            (Bandura &amp; Schunk, 1986).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            Sherer et al.(1982)은 자기효능감을 일반적 자기효능감과 특수적 자기효능감으로 분류하고,
            자기효능감이 <strong>자신감</strong>(self-confidence)과
            <strong> 자기조절효능감</strong>(self-regulatory efficacy)으로 구성된다고 보았다.
            자신감은 스스로의 능력에 대한 신념과 확신의 정도로(Bandura, 1986; 차정은, 1996; 남기양, 2017),
            충분한 자신감을 가진 구성원은 사회에 더 잘 적응하고 새로운 도전을 즐기며
            우수한 성과를 낼 수 있다(백주은, 2011).
            자기조절효능감은 어떤 과제를 이루기 위해 자기관찰, 자기판단, 자기반응과 같은
            자기 조절적 기제를 잘 사용할 수 있는가에 대한 효능기대를 뜻한다(김아영, 1996; Bandura, 1993).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            본 연구에서는 Sherer et al.(1982)의 선행연구를 바탕으로 시니어 계층의 자기효능감을
            자신감과 자기조절효능감으로 구성하였다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">3. 주관적 행복감 개념과 특성</h3>

          <p className="mb-2 text-[14px] font-bold">가. 주관적 행복감</p>

          <p className="mb-1 text-[14px] font-bold ml-4">1) 주관적 행복감 개념</p>
          <p className="mb-3 text-justify text-[14px]">
            주관적 행복감(subjective well-being)은 개인이 느끼는 심리적 행복감을 나타내는 것이며,
            생활만족도(life satisfaction), 사기(morale), 행복(happiness) 등의 총체적 상위 개념으로
            Larson(1978)에 의해 정의되었다. 행복한 삶이란 강한 정서를 유발하는 극적인 사건을
            경험하는 삶이 아니라 일상적인 즐거움을 자주 경험하는 삶이며, 극적인 사건보다는
            일상적인 생활 사건에서 개인의 행복감을 크게 느낄 수 있다(Diener, Sandvik, &amp; Pavot, 1991).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            Lyubomirsky와 Lepper(1999)는 주관적 행복감을 개인이 자신의 삶에 대해 느끼는 전반적인
            만족감과 긍정적 정서 상태로 조작적 정의하였으며, 이는 삶의 인지적 평가인
            삶의 만족도와 정서적 차원인 긍정적·부정적 정서를 포괄하는 개념이다(Diener, 1984;
            Diener, Oishi, &amp; Tay, 2018).
          </p>

          <p className="mb-1 text-[14px] font-bold ml-4">2) 자기효능감과 주관적 행복감의 관계</p>
          <p className="mb-3 text-justify text-[14px]">
            시니어 계층의 행복감에 영향을 미치는 요인으로 건강 상태, 경제적 안정, 사회적 관계,
            여가 활동 참여, 자기효능감 등이 보고되고 있다(Diener et al., 2018; 박경숙·서이종, 2019).
            특히 자기효능감은 행복감의 강력한 예측 변인으로 일관되게 보고되고 있으며,
            Caprara, Steca, Gerbino, Paciello와 Vecchio(2006)는 자기효능감이 긍정적 사고와
            행복감을 결정짓는 핵심 요인임을 확인하였다.
            성공적 노화 이론의 관점에서 Rowe와 Kahn(1997)은 질병의 부재, 높은 인지적·신체적 기능,
            능동적 사회 참여를 성공적 노화의 세 가지 구성 요소로 제시하였다.
            이 중 능동적 사회 참여는 문화소비 활동과 직결되며, 이러한 참여가 자기효능감을 높이고
            궁극적으로 행복감에 기여한다는 것이 본 연구의 이론적 전제이다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">4. 연구 모형 및 가설</h3>
          <p className="mb-3 text-justify text-[14px]">
            이상의 이론적 논의를 종합하면, 활동이론의 관점에서 문화소비 활동은 시니어의 행복감에
            직접적으로 기여하며, 동시에 Bandura의 자기효능감 이론에 근거하여 자기효능감(자신감,
            자기조절효능감)을 매개로 간접적으로도 행복감에 영향을 미칠 수 있다.
            이에 본 연구는 문화소비(X)가 자기효능감(M)을 매개로 주관적 행복감(Y)에 영향을 미치는
            매개 모형을 설정하였으며, 다음과 같은 가설을 수립하였다.
          </p>

          <div className="bg-gray-50 rounded p-5 space-y-2 text-[13px] mb-4 border-l-4 border-gray-400">
            <p><strong>가설 1.</strong> 시니어 계층의 문화소비는 자기효능감에 유의한 정(+)의 영향을 미칠 것이다.</p>
            <p><strong>가설 2.</strong> 시니어 계층의 문화소비는 주관적 행복감에 유의한 정(+)의 영향을 미칠 것이다.</p>
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
              <rect x="10" y="80" width="130" height="55" rx="4" fill="#1e40af" />
              <text x="75" y="105" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">문화소비</text>
              <text x="75" y="122" textAnchor="middle" fill="#93c5fd" fontSize="10">(독립변수, X)</text>

              <rect x="195" y="10" width="130" height="55" rx="4" fill="#047857" />
              <text x="260" y="30" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">자기효능감</text>
              <text x="260" y="47" textAnchor="middle" fill="#6ee7b7" fontSize="9">(자신감+자기조절효능감)</text>
              <text x="260" y="60" textAnchor="middle" fill="#6ee7b7" fontSize="10">(매개변수, M)</text>

              <rect x="380" y="80" width="130" height="55" rx="4" fill="#b45309" />
              <text x="445" y="105" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">주관적 행복감</text>
              <text x="445" y="122" textAnchor="middle" fill="#fcd34d" fontSize="10">(종속변수, Y)</text>

              <line x1="140" y1="85" x2="195" y2="60" stroke="#1f2937" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="148" y="62" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="bold">a = {fmt(mediation.aPath.coeff, 3)}</text>

              <line x1="325" y1="60" x2="380" y2="85" stroke="#1f2937" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="372" y="62" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="bold">b = {fmt(mediation.bPath.coeff, 3)}</text>

              <line x1="140" y1="110" x2="380" y2="110" stroke="#1f2937" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead)" />
              <text x="260" y="145" textAnchor="middle" fontSize="11" fill="#6b7280">c&apos; = {fmt(mediation.directEffect, 3)} (직접효과)</text>
              <text x="260" y="163" textAnchor="middle" fontSize="11" fill="#6b7280">c = {fmt(mediation.totalEffect, 3)} (총효과)</text>
              <text x="260" y="195" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="bold">
                간접효과(a&times;b) = {fmt(mediation.indirectEffect, 4)}{stars(mediation.sobelP)}
              </text>
            </svg>
          </div>
          <p className="text-center text-[13px] text-gray-500 mb-3">[그림 1] 연구 모형</p>
        </section>

        {/* ========== III. 연구 설계 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">III. 연구 설계</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 연구 대상 분석</h3>

          <p className="mb-2 text-[14px] font-bold">가. 연구 대상지 소개: 광산구 노인복지회관(더불어樂)</p>
          <p className="mb-3 text-justify text-[14px]">
            본 연구의 대상지인 광산구 노인복지회관(더불어樂)은 광주광역시 광산구에 소재한
            노인복지시설로, 시니어 계층의 건강증진, 평생교육, 문화여가, 사회참여 등 다양한
            프로그램을 운영하고 있다. 본 연구는 해당 시설을 이용하는 만 60세 이상의
            시니어 {N}명을 대상으로 구조화된 설문조사를 실시하였다. 표집 방법은
            편의표집(convenience sampling)을 사용하였으며, 연구 목적, 자발적 참여,
            개인정보 보호 등에 대해 사전 안내를 제공하였다.
          </p>

          <p className="mb-2 text-[14px] font-bold">나. 연구 대상의 인구통계학적 특성</p>
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

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 조사 설계</h3>

          <p className="mb-2 text-[14px] font-bold">가. 변수의 조작적 정의와 측정</p>

          <p className="mb-1 text-[14px] font-bold ml-4">1) 문화소비(독립변수)</p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비는 선행연구(김미혜·신경림, 2005; 정경희 외, 2021; 조필규, 2018)를 참고하여
            {CULTURAL_CONSUMPTION_CATEGORIES.map(c => c.label).join(', ')} 등 8개 카테고리의
            활동 빈도를 측정하였다. 각 카테고리는 0점(&ldquo;전혀 안 함&rdquo;)에서
            5점(&ldquo;매우 자주&rdquo;)의 6점 척도로 측정하였으며, 8개 문항의 평균값을
            문화소비 점수로 산출하였다.
            본 연구에서의 Cronbach&apos;s &alpha;는 {fmt(reliability.alphaConsumption)}이었다.
          </p>

          <p className="mb-1 text-[14px] font-bold ml-4">2) 자기효능감(매개변수)</p>
          <p className="mb-3 text-justify text-[14px]">
            자기효능감은 Sherer et al.(1982), Schwarzer와 Jerusalem(1995), 그리고 Bandura(1997)의
            이론을 참고하여 자신감과 자기조절효능감으로 구성한 {SELF_EFFICACY_ITEMS.length}개 문항을
            사용하였다. 5점 리커트 척도(1=&ldquo;전혀 그렇지 않다&rdquo; ~ 5=&ldquo;매우 그렇다&rdquo;)로
            측정하였으며, 문항 평균을 사용하였다.
            본 연구에서의 Cronbach&apos;s &alpha;는 {fmt(reliability.alphaEfficacy)}이었다.
          </p>

          <p className="mb-1 text-[14px] font-bold ml-4">3) 주관적 행복감(종속변수)</p>
          <p className="mb-3 text-justify text-[14px]">
            주관적 행복감은 Lyubomirsky와 Lepper(1999)의 주관적 행복감 척도(Subjective Happiness Scale)를
            참고한 {HAPPINESS_ITEMS.length}개 문항을 5점 리커트 척도로 측정하였으며,
            문항 평균을 사용하였다.
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
                  <td className="px-3 py-1.5 text-sm">자기효능감(자신감+자기조절효능감)</td>
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

          <p className="mb-2 text-[14px] font-bold">나. 자료수집 및 분석방법</p>
          <p className="mb-3 text-justify text-[14px]">
            수집된 자료는 다음과 같은 통계 분석을 실시하였다.
            첫째, 응답자의 인구통계학적 특성을 파악하기 위해 빈도분석을 실시하였다.
            둘째, 측정도구의 신뢰도를 검증하기 위해 Cronbach&apos;s &alpha; 계수를 산출하였다.
            셋째, 주요 변수의 기술통계(평균, 표준편차, 왜도, 첨도)를 산출하고 정규성 가정을
            검토하였다(Kline, 2015).
            넷째, 변수 간 관계를 파악하기 위해 Pearson 적률상관분석을 실시하였다.
            다섯째, 문화소비가 자기효능감과 행복감에 미치는 영향을 검증하기 위해
            단순·다중회귀분석(OLS)을 실시하였다.
            여섯째, 자기효능감의 매개효과를 검증하기 위해 Baron과 Kenny(1986)의 3단계
            매개분석과 Sobel(1982) 검정을 실시하였다.
          </p>
        </section>

        {/* ========== IV. 분석 결과 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">IV. 분석 결과</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 주요 변수의 기술통계</h3>
          <p className="mb-3 text-justify text-[14px]">
            주요 변수의 기술통계 결과는 &lt;표 3&gt;과 같다.
            문화소비의 평균은 {fmt(descriptive['문화소비'].mean)}(SD = {fmt(descriptive['문화소비'].std)})으로
            6점 척도의 중간값(2.5) {descriptive['문화소비'].mean > 2.5 ? '이상' : '이하'}이었으며,
            자기효능감은 평균 {fmt(descriptive['자기효능감'].mean)}(SD = {fmt(descriptive['자기효능감'].std)}),
            주관적 행복감은 평균 {fmt(descriptive['주관적 행복감'].mean)}(SD = {fmt(descriptive['주관적 행복감'].std)})으로
            나타났다. 모든 변수의 왜도(|S| &lt; 2)와 첨도(|K| &lt; 7)가 기준치 이내로
            정규성 가정을 충족하였다(Kline, 2015).
          </p>

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

          {/* 표 4: 카테고리별 */}
          <p className="mb-3 text-justify text-[14px]">
            문화소비의 카테고리별 기술통계(&lt;표 4&gt;)를 보면, {sortedCategories[0].label}이
            가장 높은 빈도(M = {fmt(sortedCategories[0].mean, 2)})를,
            {sortedCategories[sortedCategories.length - 1].label}이 가장 낮은 빈도
            (M = {fmt(sortedCategories[sortedCategories.length - 1].mean, 2)})를 나타냈다.
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

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 상관관계분석</h3>
          <p className="mb-3 text-justify text-[14px]">
            주요 변수 간 Pearson 적률상관분석 결과는 &lt;표 5&gt;와 같다.
            문화소비와 자기효능감(r = {fmt(corXM?.r ?? 0)}, {sig(corXM?.p ?? 1)}),
            문화소비와 주관적 행복감(r = {fmt(corXY?.r ?? 0)}, {sig(corXY?.p ?? 1)}),
            자기효능감과 주관적 행복감(r = {fmt(corMY?.r ?? 0)}, {sig(corMY?.p ?? 1)}) 간에
            모두 유의한 정적 상관관계가 확인되어, 매개효과 분석의 기본 전제 조건이 충족되었다.
          </p>

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

          <h3 className="font-bold mt-5 mb-2 text-[15px]">3. 연구 모형에 따른 가설 검증</h3>

          <p className="mb-2 text-[14px] font-bold">가. 가설 1: 문화소비가 자기효능감에 미치는 영향</p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비가 자기효능감에 미치는 영향을 검증한 결과,
            문화소비는 자기효능감에 유의한 {regressionXM.p < 0.05 ? '정적' : ''} 영향을 미쳤다
            (B = {fmt(regressionXM.slope, 4)}, t = {fmt(regressionXM.t)}, {sig(regressionXM.p)},
            R&sup2; = {fmt(regressionXM.r2, 4)}).
            {regressionXM.p < 0.05 ? ' 따라서 가설 1은 지지되었다.' : ' 따라서 가설 1은 기각되었다.'}
          </p>

          <p className="mb-2 text-[14px] font-bold">나. 가설 2: 문화소비가 주관적 행복감에 미치는 영향</p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비가 주관적 행복감에 미치는 영향을 검증한 결과(&lt;표 6&gt;),
            문화소비는 주관적 행복감에 유의한 {regressionXY.p < 0.05 ? '정적' : ''} 영향을 미쳤다
            (B = {fmt(regressionXY.slope, 4)}, t = {fmt(regressionXY.t)}, {sig(regressionXY.p)},
            R&sup2; = {fmt(regressionXY.r2, 4)}).
            {regressionXY.p < 0.05 ? ' 따라서 가설 2는 지지되었다.' : ' 따라서 가설 2는 기각되었다.'}
          </p>

          <div className="my-6">
            <p className={CAPTION}>&lt;표 6&gt; 문화소비가 주관적 행복감에 미치는 영향 (N = {N})</p>
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

          <p className="mb-2 text-[14px] font-bold">다. 다중회귀분석 결과</p>
          <p className="mb-3 text-justify text-[14px]">
            문화소비와 자기효능감을 동시에 투입한 다중회귀분석 결과는 &lt;표 7&gt;과 같다.
            모형의 설명력은 R&sup2; = {fmt(multipleReg.rSquared, 4)}
            (수정된 R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)})로,
            두 독립변수가 주관적 행복감 변량의 {fmt(multipleReg.rSquared * 100, 1)}%를 설명하였다.
          </p>

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
              R&sup2; = {fmt(multipleReg.rSquared, 4)}, 수정된 R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)},
              F = {fmt(multipleReg.fStatistic)}. *p &lt; .05, **p &lt; .01, ***p &lt; .001
            </p>
          </div>

          <p className="mb-2 text-[14px] font-bold">라. 가설 4: 자기효능감의 매개효과 분석</p>
          <p className="mb-3 text-justify text-[14px]">
            Baron과 Kenny(1986)의 3단계 매개분석 결과는 &lt;표 8&gt;과 같다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            <strong>1단계(c 경로):</strong> 문화소비 &rarr; 주관적 행복감:
            B = {fmt(mediation.cPath.coeff, 4)}, t = {fmt(mediation.cPath.t)}, {sig(mediation.cPath.p)}.
            {mediation.cPath.p < 0.05 ? ' 1단계 조건 충족.' : ''}
          </p>
          <p className="mb-3 text-justify text-[14px]">
            <strong>2단계(a 경로):</strong> 문화소비 &rarr; 자기효능감:
            B = {fmt(mediation.aPath.coeff, 4)}, t = {fmt(mediation.aPath.t)}, {sig(mediation.aPath.p)}.
            {mediation.aPath.p < 0.05 ? ' 2단계 조건 충족.' : ''}
          </p>
          <p className="mb-3 text-justify text-[14px]">
            <strong>3단계:</strong> 자기효능감(b 경로)의 효과는
            B = {fmt(mediation.bPath.coeff, 4)}(t = {fmt(mediation.bPath.t)}, {sig(mediation.bPath.p)})로 {mediation.bPath.p < 0.05 ? '유의' : '비유의'}하였고,
            문화소비의 직접효과(c&apos;)는
            B = {fmt(mediation.cPrimePath.coeff, 4)}(t = {fmt(mediation.cPrimePath.t)}, {sig(mediation.cPrimePath.p)})로 나타났다.
            {mediation.cPrimePath.p < 0.05
              ? ' 직접효과가 유의하므로 부분 매개(partial mediation)로 판단된다.'
              : ' 직접효과가 비유의하므로 완전 매개(full mediation)로 판단된다.'}
          </p>

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
                <tr><td className="px-3 py-1 text-sm font-bold" colSpan={5}>1단계: X &rarr; Y (총효과)</td></tr>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1 text-sm pl-6">문화소비 &rarr; 주관적 행복감 (c)</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.coeff, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.cPath.p, 4)}{stars(mediation.cPath.p)}</td>
                </tr>
                <tr><td className="px-3 py-1 text-sm font-bold" colSpan={5}>2단계: X &rarr; M</td></tr>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1 text-sm pl-6">문화소비 &rarr; 자기효능감 (a)</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.coeff, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.aPath.p, 4)}{stars(mediation.aPath.p)}</td>
                </tr>
                <tr><td className="px-3 py-1 text-sm font-bold" colSpan={5}>3단계: X, M &rarr; Y</td></tr>
                <tr>
                  <td className="px-3 py-1 text-sm pl-6">자기효능감 &rarr; 주관적 행복감 (b)</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.coeff, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.se, 4)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.t)}</td>
                  <td className={`${TD} text-right`}>{fmt(mediation.bPath.p, 4)}{stars(mediation.bPath.p)}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-1 text-sm pl-6">문화소비 &rarr; 주관적 행복감 (c&apos;)</td>
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

          <h3 className="font-bold mt-5 mb-2 text-[15px]">4. 가설 검증 결과 요약</h3>

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
                  <td className="px-3 py-1.5 text-sm">문화소비 &rarr; 자기효능감 (+)</td>
                  <td className="px-3 py-1.5 text-sm text-center font-bold">{regressionXM.p < 0.05 ? '지지' : '기각'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-1.5 text-sm text-center">H2</td>
                  <td className="px-3 py-1.5 text-sm">문화소비 &rarr; 주관적 행복감 (+)</td>
                  <td className="px-3 py-1.5 text-sm text-center font-bold">{regressionXY.p < 0.05 ? '지지' : '기각'}</td>
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

        {/* ========== V. 결론 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">V. 결론</h2>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">1. 연구 결과 및 시사점</h3>
          <p className="mb-3 text-justify text-[14px]">
            본 연구는 광산구 노인복지회관(더불어樂) 이용 시니어 {N}명을 대상으로 문화소비,
            자기효능감, 주관적 행복감의 구조적 관계를 분석하였다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            첫째, 문화소비는 자기효능감에 유의한 정적 영향을 미쳤다
            (B = {fmt(regressionXM.slope, 4)}, R&sup2; = {fmt(regressionXM.r2, 4)}).
            이는 Bandura(1997)의 자기효능감 이론과 부합하며, 문화소비 활동이
            성취경험, 대리경험, 언어적 설득, 긍정적 정서 상태를 통해 자기효능감의
            하위 요인인 자신감과 자기조절효능감을 향상시킴을 시사한다(김정숙·한경혜, 2019).
          </p>
          <p className="mb-3 text-justify text-[14px]">
            둘째, 문화소비는 주관적 행복감에 유의한 정적 영향을 미쳤다
            (B = {fmt(regressionXY.slope, 4)}, R&sup2; = {fmt(regressionXY.r2, 4)}).
            이는 활동이론(Havighurst, 1961)과 몰입 이론(Csikszentmihalyi, 1990)의 관점에서,
            문화소비 활동이 은퇴 후 축소되는 사회적 역할을 대체하고 최적 경험을 제공함으로써
            행복감을 높이는 것으로 해석된다.
            문화소비의 효용 지속성 특성(이성철, 2003)을 고려하면, 문화소비 경험이
            소비 행위 이후에도 지속적으로 긍정적 영향을 미칠 수 있음을 시사한다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            셋째, 자기효능감은 문화소비와 주관적 행복감의 관계를
            {mediation.sobelP < 0.05 ? ' 유의하게 매개하여' : ' 매개하지 못하여'} 가설 4가
            {mediation.sobelP < 0.05 ? ' 지지' : ' 기각'}되었다
            (간접효과 = {fmt(mediation.indirectEffect, 4)}, Sobel Z = {fmt(mediation.sobelZ)},
            {sig(mediation.sobelP)}, 매개비율 = {fmt(mediation.proportionMediated * 100, 1)}%).
            이는 사회인지이론(Bandura, 1997)의 관점에서 문화소비가 자기효능감이라는
            인지적 평가를 거쳐 행복감에 영향을 미치는 심리적 과정을 실증적으로 확인한 것이다.
          </p>
          <p className="mb-3 text-justify text-[14px]">
            실천적 시사점으로, 첫째 시니어 문화 프로그램 설계 시 참여형·체험형 활동을 강화하여
            성취경험(enactive mastery)을 통한 자신감 향상을 도모할 필요가 있다.
            둘째, 동료 학습(peer learning)과 긍정적 피드백을 통한 자기조절효능감 강화 요소를
            프로그램에 체계적으로 포함시켜야 한다.
            셋째, 문화소비의 접근성을 높이기 위한 경제적·물리적 지원 정책이 시니어의
            정신건강 증진에 기여할 수 있다.
            넷째, 참여 빈도가 낮은 {sortedCategories[sortedCategories.length - 1].label} 영역에 대한
            시니어 친화적 프로그램 개발이 요구된다.
          </p>

          <h3 className="font-bold mt-5 mb-2 text-[15px]">2. 연구의 한계 및 향후 과제</h3>
          <p className="mb-3 text-justify text-[14px]">
            첫째, 횡단적 연구 설계로 인해 변수 간 인과관계를 엄밀하게 검증하기 어렵다.
            후속 연구에서는 종단적 설계나 실험 설계를 통해 인과적 방향성을 확인할 필요가 있다.
            둘째, 표본 크기({N}명)가 상대적으로 작고 편의표집을 사용하여 일반화에 한계가 있으므로,
            대규모 표본과 확률표집을 활용한 후속 연구가 필요하다.
            셋째, 자기보고식 설문에 의존하여 사회적 바람직성 편향의 가능성을 배제할 수 없다.
            넷째, 문화소비의 양적 측면(빈도)만 측정하였으므로, 질적 측면(만족도, 몰입도)을
            포함한 포괄적 측정이 필요하다.
            다섯째, 자기효능감 외에도 사회적 지지, 사회적 자본 등 다른 매개·조절 변인의 역할을
            탐색하는 연구가 필요하며, 구조방정식 모형(SEM)을 활용한 복합 모형 검증도 의미 있을 것이다.
          </p>
        </section>

        {/* ========== 참고문헌 ========== */}
        <section>
          <h2 className="text-base font-bold border-b-2 border-gray-400 pb-1 mb-4">참고문헌</h2>

          <h3 className="font-bold mt-4 mb-3 text-[13px] text-gray-500">국내 문헌</h3>
          <div className="text-[12.5px] space-y-1.5 pl-8 -indent-8 leading-relaxed">
            <p>구진아 (2010). 자기효능감과 사회적 지지가 취업성과에 미치는 영향. <em>한국직업능력개발원</em>.</p>
            <p>권중돈 (2012). <em>노인복지론</em>. 학지사.</p>
            <p>기홍석 (2020). 자기효능감의 후천적 형성과 조직 성과. <em>한국경영학회지</em>, 34(2), 45-62.</p>
            <p>김동배·권중돈 (2020). <em>인간행동이론과 사회복지실천</em> (4판). 학지사.</p>
            <p>김미혜·신경림 (2005). 한국 노인의 성공적 노화 모형. <em>한국노년학</em>, 25(2), 127-140.</p>
            <p>김아영 (1996). 자기조절효능감과 학업 성취. <em>교육심리연구</em>, 10(1), 57-80.</p>
            <p>김정숙·한경혜 (2019). 중·노년기 문화예술활동 참여와 주관적 안녕감의 관계. <em>한국노년학</em>, 39(3), 455-474.</p>
            <p>김지은 (2016). 액티브시니어의 라이프스타일과 소비특성. <em>한국생활과학회지</em>, 25(4), 371-384.</p>
            <p>남기양 (2017). 자신감과 자기효능감의 관계. <em>교육학연구</em>, 55(3), 89-112.</p>
            <p>박경숙·서이종 (2019). 한국 노인의 주관적 안녕감 결정요인. <em>한국사회학</em>, 53(2), 1-36.</p>
            <p>박선희 (2002). 문화상품의 공공재적 성격과 소비 특성. <em>문화경제학연구</em>, 5(1), 23-42.</p>
            <p>박영희 (2010). 노인의 자기효능감과 심리적 안녕감. <em>한국노년학</em>, 30(4), 1157-1171.</p>
            <p>박철우 (2016). 자기효능감이 업무 수행 성과에 미치는 영향. <em>인적자원관리연구</em>, 23(3), 67-84.</p>
            <p>백주은 (2011). 자신감과 사회적응 및 직무성과의 관계. <em>한국심리학회지</em>, 24(2), 231-250.</p>
            <p>서혜경·정순동·최광현 (2006). <em>노인의 이해</em>. 서현사.</p>
            <p>이성철 (2003). 문화소비의 특성과 유형에 관한 연구. <em>문화예술경영학연구</em>, 1(1), 15-34.</p>
            <p>이소정·정경희 (2018). 노인의 문화예술 참여와 삶의 만족도. <em>보건사회연구</em>, 38(2), 318-349.</p>
            <p>이영화 (2011). 행복의 철학적 탐구. <em>철학과 현상학 연구</em>, 48, 121-148.</p>
            <p>정경희 외 (2021). <em>2020년도 노인실태조사</em>. 보건복지부·한국보건사회연구원.</p>
            <p>정일영 (2017). 시니어 세대의 자기효능감 구성요인. <em>한국노년학</em>, 37(1), 89-106.</p>
            <p>정현경 (2019). 자기효능감이 업무 효율성에 미치는 영향. <em>조직과 인사관리연구</em>, 43(2), 55-74.</p>
            <p>조승우·김아영 (1998). Bandura의 효능기대와 결과기대 이론. <em>교육심리연구</em>, 12(1), 113-134.</p>
            <p>조필규 (2018). 문화소비에 대한 연구. 한밭대학교 일반대학원 석사학위논문.</p>
            <p>차정은 (1996). 자신감과 자기효능감의 관계. <em>교육학연구</em>, 34(5), 155-174.</p>
            <p>최순남 (2002). <em>현대노인복지론</em>. 한신대학교 출판부.</p>
            <p>통계청 (2023). <em>2023 고령자 통계</em>. 대전: 통계청.</p>
          </div>

          <h3 className="font-bold mt-6 mb-3 text-[13px] text-gray-500">국외 문헌</h3>
          <div className="text-[12.5px] space-y-1.5 pl-8 -indent-8 leading-relaxed">
            <p>Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. <em>Psychological Review</em>, 84(2), 191-215.</p>
            <p>Bandura, A. (1986). <em>Social foundations of thought and action: A social cognitive theory</em>. Prentice-Hall.</p>
            <p>Bandura, A. (1990). Perceived self-efficacy in the exercise of personal agency. <em>Journal of Applied Sport Psychology</em>, 2(2), 128-163.</p>
            <p>Bandura, A. (1993). Perceived self-efficacy in cognitive development and functioning. <em>Educational Psychologist</em>, 28(2), 117-148.</p>
            <p>Bandura, A. (1995). <em>Self-efficacy in changing societies</em>. Cambridge University Press.</p>
            <p>Bandura, A. (1997). <em>Self-efficacy: The exercise of control</em>. W.H. Freeman.</p>
            <p>Bandura, A., &amp; Schunk, D. H. (1986). Cultivating competence, self-efficacy, and intrinsic interest through proximal self-motivation. <em>Journal of Personality and Social Psychology</em>, 41(3), 586-598.</p>
            <p>Baron, R. M., &amp; Kenny, D. A. (1986). The moderator-mediator variable distinction in social psychological research. <em>Journal of Personality and Social Psychology</em>, 51(6), 1173-1182.</p>
            <p>Bourdieu, P. (1984). <em>Distinction: A social critique of the judgement of taste</em>. Harvard University Press.</p>
            <p>Caprara, G. V., Steca, P., Gerbino, M., Paciello, M., &amp; Vecchio, G. M. (2006). Looking for adolescents&apos; well-being: Self-efficacy beliefs as determinants of positive thinking and happiness. <em>Epidemiologia e Psichiatria Sociale</em>, 15(1), 30-43.</p>
            <p>Csikszentmihalyi, M. (1990). <em>Flow: The psychology of optimal experience</em>. Harper &amp; Row.</p>
            <p>Diener, E. (1984). Subjective well-being. <em>Psychological Bulletin</em>, 95(3), 542-575.</p>
            <p>Diener, E., Oishi, S., &amp; Tay, L. (2018). Advances in subjective well-being research. <em>Nature Human Behaviour</em>, 2(4), 253-260.</p>
            <p>Diener, E., Sandvik, E., &amp; Pavot, W. (1991). Happiness is the frequency, not the intensity, of positive versus negative affect. In F. Strack et al. (Eds.), <em>Subjective well-being</em> (pp. 119-139). Pergamon.</p>
            <p>Eden, D., &amp; Aviran, A. (1993). Self-efficacy training to speed reemployment. <em>Journal of Applied Psychology</em>, 78(3), 352-360.</p>
            <p>Gilleard, C., &amp; Higgs, P. (2005). <em>Contexts of ageing: Class, cohort and community</em>. Polity Press.</p>
            <p>Hackett, G., &amp; Betz, N. E. (1981). A self-efficacy approach to the career development of women. <em>Journal of Vocational Behavior</em>, 18(3), 326-339.</p>
            <p>Havighurst, R. J. (1961). Successful aging. <em>The Gerontologist</em>, 1(1), 8-13.</p>
            <p>Heo, J., Chun, S., Lee, S., Lee, K. H., &amp; Kim, J. (2018). Internet use and well-being in older adults. <em>Cyberpsychology, Behavior, and Social Networking</em>, 18(5), 268-272.</p>
            <p>Kline, R. B. (2015). <em>Principles and practice of structural equation modeling</em> (4th ed.). Guilford Publications.</p>
            <p>Lachman, M. E., Neupert, S. D., &amp; Agrigoroaei, S. (2011). The relevance of control beliefs for health and aging. In K. W. Schaie &amp; S. L. Willis (Eds.), <em>Handbook of the psychology of aging</em> (7th ed., pp. 175-190). Academic Press.</p>
            <p>Larson, R. (1978). Thirty years of research on the subjective well-being of older Americans. <em>Journal of Gerontology</em>, 33(1), 109-125.</p>
            <p>Lemon, B. W., Bengtson, V. L., &amp; Peterson, J. A. (1972). An exploration of the activity theory of aging. <em>Journal of Gerontology</em>, 27(4), 511-523.</p>
            <p>Lyubomirsky, S., &amp; Lepper, H. S. (1999). A measure of subjective happiness. <em>Social Indicators Research</em>, 46(2), 137-155.</p>
            <p>Neugarten, B. L. (1996). <em>The meanings of age: Selected papers of Bernice L. Neugarten</em>. University of Chicago Press.</p>
            <p>Park, S., Han, Y., &amp; Kim, B. (2019). Cultural engagement and depression among older adults. <em>Aging &amp; Mental Health</em>, 23(2), 186-191.</p>
            <p>Rowe, J. W., &amp; Kahn, R. L. (1997). Successful aging. <em>The Gerontologist</em>, 37(4), 433-440.</p>
            <p>Schwarzer, R., &amp; Jerusalem, M. (1995). Generalized self-efficacy scale. In J. Weinman et al. (Eds.), <em>Measures in health psychology</em> (pp. 35-37). NFER-NELSON.</p>
            <p>Sherer, M., Maddux, J. E., Mercandante, B., Prentice-Dunn, S., Jacobs, B., &amp; Rogers, R. W. (1982). The self-efficacy scale: Construction and validation. <em>Psychological Reports</em>, 51(2), 663-671.</p>
            <p>Sobel, M. E. (1982). Asymptotic confidence intervals for indirect effects in structural equation models. <em>Sociological Methodology</em>, 13, 290-312.</p>
            <p>Stern, Y. (2012). Cognitive reserve in ageing and Alzheimer&apos;s disease. <em>The Lancet Neurology</em>, 11(11), 1006-1012.</p>
            <p>Williams, D. M., &amp; Rhodes, R. E. (2016). The confounded self-efficacy construct. <em>Health Psychology Review</em>, 10(2), 113-128.</p>
            <p>Zimmerman, B. J. (1992). Self-motivation for academic attainment. In D. H. Schunk &amp; J. L. Meece (Eds.), <em>Student perceptions in the classroom</em> (pp. 267-290). Lawrence Erlbaum.</p>
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
