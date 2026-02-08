import { CULTURAL_CONSUMPTION_CATEGORIES, SELF_EFFICACY_ITEMS, HAPPINESS_ITEMS } from '@/lib/constants';
import type { PaperData } from '../paperData';
import { P, H2, H3, H4, H5, TH, TD, THEAD_ROW, TBODY_LAST, CAPTION, fmt, sig, stars } from '../paperData';

export default function Chapter3({ data }: { data: PaperData }) {
  const { N, genderCount, ageCount, eduCount, incomeCount, reliability, mediation } = data;

  return (
    <section>
      <h2 className={H2}>Ⅲ. 연구 설계</h2>

      {/* === 1. 연구 대상 분석 === */}
      <h3 className={H3}>1. 연구 대상 분석</h3>

      <h4 className={H4}>가. 연구 대상지 소개: 광산구 노인복지회관(더불어樂)</h4>
      <p className={P}>
        본 연구의 대상지인 광산구 노인복지회관(더불어樂)은 광주광역시 광산구에 소재한 노인복지시설로서,
        노인복지법 제36조에 근거하여 설립·운영되고 있다. 해당 시설은 시니어 계층의 건강증진, 평생교육,
        문화여가, 사회참여, 정서지원 등 다양한 복지 프로그램을 운영하고 있으며, 지역사회 시니어의
        삶의 질 향상을 위한 종합적인 서비스를 제공하고 있다. 특히 문화예술 프로그램(서예, 그림,
        풍물놀이, 합창 등), 건강증진 프로그램(요가, 체조, 건강체조 등), 평생교육 프로그램(한글교실,
        컴퓨터교실, 스마트폰 활용교육 등) 등 다양한 문화소비 활동을 제공하고 있어
        본 연구의 대상지로 적합하다고 판단하였다.
      </p>
      <p className={P}>
        광산구는 광주광역시 5개 구 중 인구가 가장 많은 자치구로서, 65세 이상 고령인구 비율이
        지속적으로 증가하고 있다. 광산구 노인복지회관은 지역 내 시니어들의 주요 문화활동
        거점으로서 기능하고 있으며, 일일 평균 이용자 수가 상당하여 다양한 인구통계학적 배경을
        가진 시니어 표본을 확보할 수 있는 장점이 있다.
      </p>
      <p className={P}>
        본 연구는 해당 시설을 이용하는 만 60세 이상의 시니어를 대상으로 하였다. 표집 방법은
        편의표집(convenience sampling)을 사용하였으며, 설문 실시에 앞서 연구의 목적, 자발적 참여 원칙,
        개인정보 보호 방침, 설문 소요시간 등에 대해 충분히 안내하였다. 설문은 자기기입식
        (self-administered)으로 진행하되, 시력이 좋지 않거나 글을 읽기 어려운 응답자의 경우
        조사원이 문항을 읽어주고 응답을 기록하는 면접조사 방식을 병행하였다.
        총 {N}부의 유효 설문지를 최종 분석에 사용하였다.
      </p>

      <h4 className={H4}>나. 시니어 계층의 인구통계학적 특성</h4>
      <p className={P}>
        연구 대상의 인구통계학적 특성은 &lt;표 1&gt;에 제시된 바와 같다.
        성별 분포를 살펴보면 {Object.entries(genderCount).map(([g, c]) => `${g}이 ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}으로
        나타났다.
        연령대별로는 {Object.entries(ageCount).map(([a, c]) => `${a}세가 ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}으로
        구성되었다. Neugarten(1996)의 분류에 따르면 본 연구의 대상자는 Young Old(55-65세)에서
        Old Old(75세 이상)까지 다양한 연령대를 포괄하고 있으며, 이는 시니어 계층의 다양성을
        반영한 표본 구성이라 할 수 있다.
      </p>
      <p className={P}>
        학력 수준은 {Object.entries(eduCount).map(([e, c]) => `${e}이 ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}으로
        나타났다. 월 소득 수준은 {Object.entries(incomeCount).map(([i, c]) => `${i}이 ${c}명(${fmt(c / N * 100, 1)}%)`).join(', ')}이었다.
        이러한 인구통계학적 분포는 광산구 노인복지회관 이용 시니어의 전반적인 특성을 반영하고 있으며,
        다양한 사회경제적 배경을 가진 응답자가 포함되어 있어 연구 결과의 다양성을 확보할 수 있었다.
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

      {/* === 2. 연구 모형 및 가설 설정 === */}
      <h3 className={H3}>2. 연구 모형 및 가설 설정</h3>

      <h4 className={H4}>가. 연구 모형</h4>
      <p className={P}>
        본 연구는 앞서 살펴본 이론적 고찰을 바탕으로, 시니어 계층의 문화소비(독립변수)가
        자기효능감(매개변수)을 매개로 하여 주관적 행복감(종속변수)에 미치는 영향을 분석하기 위한
        매개 모형을 설정하였다. 구체적으로 활동이론(Havighurst, 1961)에 근거하여 문화소비 활동이
        시니어의 행복감에 직접적으로 기여하는 경로(c 경로)와, Bandura(1977, 1997)의 자기효능감 이론에
        근거하여 문화소비가 자기효능감을 향상시키는 경로(a 경로), 그리고 자기효능감이 행복감에
        기여하는 경로(b 경로)를 포함한 매개 모형을 [그림 2]와 같이 설정하였다.
      </p>
      <p className={P}>
        본 연구의 독립변수인 문화소비는 영화관람, 공연/음악회, 전시/미술관, 독서, 스포츠, 여행,
        공예/취미, 디지털 콘텐츠 등 8개 카테고리의 활동 빈도 평균으로 측정한다. 매개변수인
        자기효능감은 Sherer et al.(1982)의 연구를 기반으로 자신감(self-confidence)과
        자기조절효능감(self-regulatory efficacy)을 포괄하는 10개 문항의 평균으로 측정한다.
        종속변수인 주관적 행복감은 Lyubomirsky와 Lepper(1999)의 주관적 행복감 척도를 참고한
        5개 문항의 평균으로 측정한다.
      </p>

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
          <text x="148" y="62" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="bold">a경로</text>
          <line x1="325" y1="60" x2="380" y2="85" stroke="#1f2937" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <text x="372" y="62" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="bold">b경로</text>
          <line x1="140" y1="110" x2="380" y2="110" stroke="#1f2937" strokeWidth="2" strokeDasharray="8,4" markerEnd="url(#arrowhead)" />
          <text x="260" y="145" textAnchor="middle" fontSize="11" fill="#6b7280">c&apos; (직접효과)</text>
          <text x="260" y="163" textAnchor="middle" fontSize="11" fill="#6b7280">c (총효과)</text>
          <text x="260" y="195" textAnchor="middle" fontSize="11" fill="#1f2937" fontWeight="bold">
            간접효과(a&times;b) = 매개효과
          </text>
        </svg>
      </div>
      <p className="text-center text-[12px] text-gray-500 mb-4">[그림 2] 연구 모형</p>

      <h4 className={H4}>나. 연구 가설</h4>
      <p className={P}>
        이론적 배경에서 고찰한 선행연구들을 종합적으로 검토한 결과, 문화소비와 자기효능감,
        주관적 행복감 사이에는 이론적으로 유의미한 관계가 존재할 것으로 예상된다.
        활동이론(Havighurst, 1961)에 따르면 문화소비 활동은 시니어의 사회적 역할을 대체하고
        삶의 만족도를 높이며, Bandura(1997)의 자기효능감 이론에 따르면 문화소비 활동은
        성취경험, 대리경험, 언어적 설득, 정서적 각성을 통해 자기효능감을 향상시킬 수 있다.
        또한 자기효능감은 행복감의 강력한 예측 변인으로 일관되게 보고되고 있다
        (Caprara et al., 2006; Lachman et al., 2011). 이에 다음과 같은 연구 가설을 설정하였다.
      </p>
      <div className="bg-gray-50 rounded p-5 space-y-3 text-[13px] mb-4 border-l-4 border-gray-400">
        <p><strong>가설 1.</strong> 시니어 계층의 문화소비는 자기효능감에 유의한 정(+)의 영향을 미칠 것이다.</p>
        <p><strong>가설 2.</strong> 시니어 계층의 문화소비는 주관적 행복감에 유의한 정(+)의 영향을 미칠 것이다.</p>
        <p><strong>가설 3.</strong> 시니어 계층의 자기효능감은 주관적 행복감에 유의한 정(+)의 영향을 미칠 것이다.</p>
        <p><strong>가설 4.</strong> 자기효능감은 문화소비와 주관적 행복감의 관계를 유의하게 매개할 것이다.</p>
      </div>
      <p className={P}>
        가설 1은 문화소비 활동 참여가 성취경험과 새로운 학습 기회를 제공함으로써 자기효능감의
        하위 요소인 자신감과 자기조절효능감을 향상시킬 것이라는 이론적 근거에 기반한다.
        가설 2는 활동이론과 몰입 이론에 근거하여 문화소비가 직접적으로 행복감에 기여할 것이라는
        가정이다. 가설 3은 Caprara et al.(2006)과 Lachman et al.(2011)의 선행연구에 근거한다.
        가설 4는 문화소비의 행복감에 대한 효과가 자기효능감이라는 심리적 기제를 통해
        간접적으로도 전달된다는 매개 가설이다.
      </p>

      {/* === 3. 조사 설계 === */}
      <h3 className={H3}>3. 조사 설계</h3>

      <h4 className={H4}>가. 변수의 조작적 정의와 측정</h4>

      <h5 className={H5}>1) 문화소비(독립변수)</h5>
      <p className={P}>
        본 연구에서 문화소비는 &ldquo;시니어 계층이 다양한 문화적 활동에 참여하고 이를 향유하는
        행위의 빈도&rdquo;로 조작적 정의한다. Bourdieu(1984)의 문화자본 개념과 선행연구
        (김미혜·신경림, 2005; 정경희 외, 2021; 조필규, 2018; 이성철, 2003)를 참고하여,
        문화소비를 {CULTURAL_CONSUMPTION_CATEGORIES.map(c => c.label).join(', ')} 등
        8개 카테고리로 구분하여 측정하였다. 각 카테고리는 &ldquo;전혀 안 함&rdquo;(0점)에서
        &ldquo;매우 자주&rdquo;(5점)까지의 6점 척도로 측정하였으며, 8개 문항의 평균값을
        문화소비 점수로 산출하였다. 이러한 측정 방식은 시니어의 문화소비 활동을 관람형(영화, 공연, 전시),
        참여형(스포츠, 공예), 체험형(여행), 지적형(독서), 디지털형(디지털 콘텐츠)으로 포괄적으로
        파악할 수 있다는 장점이 있다.
      </p>

      <h5 className={H5}>2) 자기효능감(매개변수)</h5>
      <p className={P}>
        본 연구에서 자기효능감은 &ldquo;자신에게 주어진 상황에서 신체적, 사회적, 감성적 원천을 가지고
        성공적으로 대처할 수 있는 자기 능력에 대한 신념&rdquo;으로 조작적 정의한다.
        Sherer et al.(1982)의 선행연구를 바탕으로, 자기효능감을 자신감(self-confidence)과
        자기조절효능감(self-regulatory efficacy)으로 구성하였다.
        구체적으로 Schwarzer와 Jerusalem(1995)의 일반적 자기효능감 척도(General Self-Efficacy Scale)와
        Bandura(1997)의 이론을 참고하여 한국 시니어 맥락에 맞게 수정한 {SELF_EFFICACY_ITEMS.length}개
        문항을 사용하였다. 5점 리커트 척도(1=&ldquo;전혀 그렇지 않다&rdquo; ~ 5=&ldquo;매우 그렇다&rdquo;)로
        측정하였으며, {SELF_EFFICACY_ITEMS.length}개 문항의 평균을 자기효능감 점수로 사용하였다.
      </p>
      <p className={P}>
        자신감 관련 문항은 자신의 능력에 대한 확신과 신뢰 수준을 측정하는 문항들로 구성되었으며
        (예: &ldquo;{SELF_EFFICACY_ITEMS[0]}&rdquo;, &ldquo;{SELF_EFFICACY_ITEMS[3]}&rdquo;),
        자기조절효능감 관련 문항은 자기관찰, 자기판단, 자기반응과 같은 자기조절적 기제의
        활용 능력을 측정하는 문항들로 구성되었다
        (예: &ldquo;{SELF_EFFICACY_ITEMS[4]}&rdquo;, &ldquo;{SELF_EFFICACY_ITEMS[8]}&rdquo;).
      </p>

      <h5 className={H5}>3) 주관적 행복감(종속변수)</h5>
      <p className={P}>
        본 연구에서 주관적 행복감은 &ldquo;개인이 자신의 삶에 대해 느끼는 전반적인 만족감과
        긍정적 정서 상태&rdquo;로 조작적 정의한다. Lyubomirsky와 Lepper(1999)의
        주관적 행복감 척도(Subjective Happiness Scale)를 참고하여 한국 시니어 맥락에 맞게
        수정한 {HAPPINESS_ITEMS.length}개 문항을 사용하였다.
        5점 리커트 척도(1=&ldquo;전혀 그렇지 않다&rdquo; ~ 5=&ldquo;매우 그렇다&rdquo;)로
        측정하였으며, {HAPPINESS_ITEMS.length}개 문항의 평균을 주관적 행복감 점수로 사용하였다.
      </p>
      <p className={P}>
        측정 문항은 전반적인 행복감 인식(예: &ldquo;{HAPPINESS_ITEMS[0]}&rdquo;),
        현재 생활 만족도(예: &ldquo;{HAPPINESS_ITEMS[1]}&rdquo;),
        미래에 대한 낙관성, 사회적 관계 만족도, 일상의 의미 부여 등을 포괄적으로 측정하도록
        구성하였다. 이는 Larson(1978)이 제시한 주관적 행복감의 상위개념적 특성
        (생활만족도, 사기, 행복)을 반영한 것이다.
      </p>

      {/* 측정도구 요약 표 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 3&gt; 측정도구의 신뢰도 분석 결과</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`${TH} text-left`}>변수</th>
              <th className={`${TH} text-left`}>구성</th>
              <th className={`${TH} text-right w-20`}>문항 수</th>
              <th className={`${TH} text-right w-24`}>척도 범위</th>
              <th className={`${TH} text-right w-28`}>Cronbach&apos;s &alpha;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-1.5 text-sm">문화소비</td>
              <td className="px-3 py-1.5 text-sm text-gray-500">8개 카테고리 빈도</td>
              <td className={`${TD} text-right`}>8</td>
              <td className={`${TD} text-right`}>0-5</td>
              <td className={`${TD} text-right`}>{fmt(reliability.alphaConsumption)}</td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 text-sm">자기효능감</td>
              <td className="px-3 py-1.5 text-sm text-gray-500">자신감+자기조절효능감</td>
              <td className={`${TD} text-right`}>10</td>
              <td className={`${TD} text-right`}>1-5</td>
              <td className={`${TD} text-right`}>{fmt(reliability.alphaEfficacy)}</td>
            </tr>
            <tr className={TBODY_LAST}>
              <td className="px-3 py-1.5 text-sm">주관적 행복감</td>
              <td className="px-3 py-1.5 text-sm text-gray-500">전반적 행복감</td>
              <td className={`${TD} text-right`}>5</td>
              <td className={`${TD} text-right`}>1-5</td>
              <td className={`${TD} text-right`}>{fmt(reliability.alphaHappiness)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Cronbach&apos;s &alpha; &ge; .60 이상이면 수용 가능한 수준(Nunnally, 1978)
        </p>
      </div>

      <h4 className={H4}>나. 자료수집 및 분석방법</h4>
      <p className={P}>
        자료 수집은 광산구 노인복지회관(더불어樂)을 이용하는 만 60세 이상 시니어를 대상으로
        구조화된 설문지를 배포하여 실시하였다. 설문 기간은 2025년 10월~11월이며,
        설문 실시 전 연구의 목적, 자발적 참여 원칙, 개인정보 보호, 연구 결과의 학술적 목적
        이용 등에 대해 서면으로 안내하고 동의를 받았다. 설문 소요시간은 약 15-20분이었다.
      </p>
      <p className={P}>
        수집된 자료는 다음과 같은 통계 분석 절차를 거쳤다.
        첫째, 응답자의 인구통계학적 특성을 파악하기 위해 빈도분석(frequency analysis)을 실시하였다.
        둘째, 측정도구의 내적 일관성 신뢰도를 검증하기 위해 Cronbach&apos;s &alpha; 계수를 산출하였다.
        일반적으로 Cronbach&apos;s &alpha;가 .60 이상이면 수용 가능한 수준으로 판단한다(Nunnally, 1978).
        셋째, 주요 변수의 기술통계(평균, 표준편차, 최솟값, 최댓값, 왜도, 첨도)를 산출하고,
        왜도(|S| &lt; 2)와 첨도(|K| &lt; 7)를 기준으로 정규성 가정을 검토하였다(Kline, 2015).
        넷째, 변수 간 관계를 파악하기 위해 Pearson 적률상관분석을 실시하였다.
        다섯째, 문화소비가 자기효능감과 주관적 행복감에 미치는 영향을 검증하기 위해
        단순회귀분석(simple regression) 및 다중회귀분석(multiple regression, OLS)을 실시하였다.
        여섯째, 자기효능감의 매개효과를 검증하기 위해 Baron과 Kenny(1986)의 3단계 매개분석
        절차를 적용하고, 간접효과의 통계적 유의성은 Sobel(1982) 검정으로 확인하였다.
      </p>
      <p className={P}>
        Baron과 Kenny(1986)의 매개효과 검증 절차는 다음의 세 단계로 구성된다.
        1단계에서는 독립변수(문화소비)가 종속변수(주관적 행복감)에 유의한 영향을 미치는지
        검증한다(c 경로). 2단계에서는 독립변수(문화소비)가 매개변수(자기효능감)에 유의한
        영향을 미치는지 검증한다(a 경로). 3단계에서는 매개변수(자기효능감)를 통제한 상태에서
        독립변수가 종속변수에 미치는 직접효과(c&apos; 경로)와 매개변수가 종속변수에 미치는
        효과(b 경로)를 동시에 검증한다. 매개효과가 성립하면 3단계에서 독립변수의 직접효과(c&apos;)가
        1단계의 총효과(c)보다 감소하며, 직접효과가 유의하지 않으면 완전 매개(full mediation),
        유의하면 부분 매개(partial mediation)로 판단한다.
      </p>
    </section>
  );
}
