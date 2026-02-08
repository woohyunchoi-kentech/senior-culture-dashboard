import { H2 } from '../paperData';

export default function CoverAndTOC({ N }: { N: number }) {
  return (
    <>
      {/* ========== 표지 ========== */}
      <header className="text-center space-y-4 pb-10 border-b-2 border-black min-h-[600px] flex flex-col items-center justify-center">
        <p className="text-sm text-gray-500 tracking-widest">문화전문석사 학위논문</p>
        <h1 className="text-[22px] font-bold leading-relaxed tracking-tight mt-8">
          시니어 계층의 문화소비가 자기효능감과<br />
          주관적 행복감에 미치는 영향
        </h1>
        <p className="text-base text-gray-600 leading-relaxed mt-2">
          — 자기효능감의 매개효과를 중심으로 —
        </p>
        <div className="text-sm text-gray-500 space-y-1 mt-8">
          <p className="italic leading-relaxed">
            The Effect of Cultural Consumption on Self-Efficacy and<br />
            Subjective Happiness among Senior Citizens:<br />
            Focusing on the Mediating Role of Self-Efficacy
          </p>
        </div>
        <div className="mt-12 space-y-1 text-sm text-gray-600">
          <p>전남대학교 문화전문대학원</p>
          <p>문화경영관광전공</p>
          <p className="mt-6 text-base font-bold tracking-[0.5em]">최 지 은</p>
          <p className="mt-6">2026년 2월</p>
        </div>
      </header>

      {/* ========== 목차 ========== */}
      <section className="break-before-page">
        <h2 className={H2}>목 차</h2>
        <div className="text-[13px] leading-loose space-y-0.5">
          <p className="font-bold">국문초록</p>
          <p className="font-bold mt-3">Ⅰ. 서론</p>
          <div className="ml-4">
            <p>1. 연구배경 및 연구목적</p>
            <div className="ml-4">
              <p>가. 연구배경</p>
              <p>나. 연구목적</p>
            </div>
            <p>2. 연구의 방법 및 범위</p>
          </div>

          <p className="font-bold mt-3">Ⅱ. 이론적 고찰</p>
          <div className="ml-4">
            <p>1. 시니어 계층의 문화소비</p>
            <div className="ml-4">
              <p>가. 시니어 계층의 문화소비 개념과 유형</p>
              <div className="ml-4">
                <p>1) 시니어 개념</p>
                <p>2) 시니어 문화 및 특징</p>
              </div>
              <p>나. 문화소비 개념과 특성</p>
              <div className="ml-4">
                <p>1) 문화소비의 개념</p>
                <p>2) 문화소비 특성</p>
                <p>3) 문화소비 유형</p>
              </div>
              <p>다. 시니어 계층의 문화소비 선행연구</p>
            </div>
            <p>2. 자기효능감</p>
            <div className="ml-4">
              <p>가. 자기효능감</p>
              <div className="ml-4">
                <p>1) 자기효능감 개념</p>
                <p>2) 자기효능감 특성</p>
              </div>
              <p>나. 자기효능감 구성 방법(유형)</p>
              <div className="ml-4">
                <p>1) 자신감</p>
                <p>2) 자기조절효능감</p>
              </div>
              <p>다. 자기효능감 관련 선행연구</p>
            </div>
            <p>3. 주관적 행복감</p>
            <div className="ml-4">
              <p>가. 주관적 행복감</p>
              <div className="ml-4">
                <p>1) 주관적 행복감 개념</p>
                <p>2) 주관적 행복감 측정(선행연구)</p>
                <p>3) 자기효능감과 주관적 행복감의 관계</p>
              </div>
            </div>
          </div>

          <p className="font-bold mt-3">Ⅲ. 연구 설계</p>
          <div className="ml-4">
            <p>1. 연구 대상 분석</p>
            <div className="ml-4">
              <p>가. 연구 대상지 소개: 광산구 노인복지회관(더불어樂)</p>
              <p>나. 시니어 계층의 인구통계학적 특성</p>
            </div>
            <p>2. 연구 모형 및 가설 설정</p>
            <div className="ml-4">
              <p>가. 연구 모형</p>
              <p>나. 연구 가설</p>
            </div>
            <p>3. 조사 설계</p>
            <div className="ml-4">
              <p>가. 변수의 조작적 정의와 측정</p>
              <div className="ml-4">
                <p>1) 문화소비</p>
                <p>2) 자기효능감</p>
                <p>3) 주관적 행복감</p>
              </div>
              <p>나. 자료수집 및 분석방법</p>
            </div>
          </div>

          <p className="font-bold mt-3">Ⅳ. 분석 결과</p>
          <div className="ml-4">
            <p>1. 표본의 일반적 특성</p>
            <div className="ml-4">
              <p>가. 인구통계학적 특성</p>
              <p>나. 문화소비 이용 특성</p>
            </div>
            <p>2. 측정척도의 타당성 및 신뢰도 분석</p>
            <div className="ml-4">
              <p>가. 신뢰도 분석</p>
              <p>나. 상관관계 분석</p>
            </div>
            <p>3. 연구 모형에 따른 가설 검증</p>
            <div className="ml-4">
              <p>가. 가설 1: 문화소비가 자기효능감에 미치는 영향</p>
              <p>나. 가설 2: 문화소비가 주관적 행복감에 미치는 영향</p>
              <p>다. 가설 3: 자기효능감이 주관적 행복감에 미치는 영향</p>
              <p>라. 가설 4: 자기효능감의 매개효과</p>
            </div>
            <p>4. 가설 검증 결과 및 논의</p>
            <div className="ml-4">
              <p>가. 가설 검증 결과 요약</p>
              <p>나. 결과에 따른 통합적 논의</p>
            </div>
          </div>

          <p className="font-bold mt-3">Ⅴ. 결론</p>
          <div className="ml-4">
            <p>1. 연구 결과 및 시사점</p>
            <p>2. 연구의 한계 및 향후 과제</p>
          </div>

          <p className="font-bold mt-3">참고문헌</p>
          <p className="font-bold mt-1">Abstract</p>
          <p className="font-bold mt-1">부록</p>
        </div>
      </section>

      {/* ========== 표 목차 ========== */}
      <section className="mt-8">
        <h2 className={H2}>표 목차</h2>
        <div className="text-[13px] leading-loose space-y-0.5">
          <p>&lt;표 1&gt; 연구 대상의 인구통계학적 특성</p>
          <p>&lt;표 2&gt; 문화소비 카테고리별 이용 빈도</p>
          <p>&lt;표 3&gt; 측정도구의 신뢰도 분석 결과</p>
          <p>&lt;표 4&gt; 주요 변수의 기술통계</p>
          <p>&lt;표 5&gt; 주요 변수 간 상관행렬</p>
          <p>&lt;표 6&gt; 문화소비가 자기효능감에 미치는 영향</p>
          <p>&lt;표 7&gt; 문화소비가 주관적 행복감에 미치는 영향</p>
          <p>&lt;표 8&gt; 주관적 행복감에 대한 다중회귀분석 결과</p>
          <p>&lt;표 9&gt; 자기효능감의 매개효과 분석 결과</p>
          <p>&lt;표 10&gt; 연구 가설 검증 결과 요약</p>
        </div>
      </section>

      {/* ========== 그림 목차 ========== */}
      <section className="mt-6">
        <h2 className={H2}>그림 목차</h2>
        <div className="text-[13px] leading-loose space-y-0.5">
          <p>[그림 1] 연구 구성도</p>
          <p>[그림 2] 연구 모형</p>
        </div>
      </section>
    </>
  );
}
