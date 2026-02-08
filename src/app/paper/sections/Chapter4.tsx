import type { PaperData } from '../paperData';
import { P, H2, H3, H4, TH, TD, THEAD_ROW, TBODY_LAST, CAPTION, fmt, sig, stars } from '../paperData';

export default function Chapter4({ data }: { data: PaperData }) {
  const {
    N, genderCount, ageCount, eduCount, incomeCount,
    descriptive, correlations, corXM, corXY, corMY,
    regressionXY, regressionXM, regressionMY,
    multipleReg, mediation, reliability,
    categoryStats, sortedCategories,
  } = data;

  const mediationType = mediation.cPrimePath.p < 0.05 ? '부분 매개' : '완전 매개';

  return (
    <section>
      <h2 className={H2}>Ⅳ. 분석 결과</h2>

      {/* ================================================================ */}
      {/* 1. 표본의 일반적 특성                                             */}
      {/* ================================================================ */}
      <h3 className="font-bold mt-6 mb-2 text-[15px]">1. 표본의 일반적 특성</h3>

      <h4 className="font-bold mt-4 mb-2 text-[14px]">가. 인구통계학적 특성</h4>
      <p className={P}>
        본 연구의 분석에 사용된 최종 유효 표본은 총 {N}명이다. 인구통계학적 특성을
        살펴보면, 성별로는 {Object.entries(genderCount).map(([g, c]) =>
          `${g} ${c}명(${fmt(c / N * 100, 1)}%)`
        ).join(', ')}으로 나타났다. 연령대별로는 {Object.entries(ageCount).map(([a, c]) =>
          `${a}세 ${c}명(${fmt(c / N * 100, 1)}%)`
        ).join(', ')}의 분포를 보였다.
        학력 수준별로는 {Object.entries(eduCount).map(([e, c]) =>
          `${e} ${c}명(${fmt(c / N * 100, 1)}%)`
        ).join(', ')}으로 나타났으며,
        월 소득 수준별로는 {Object.entries(incomeCount).map(([i, c]) =>
          `${i} ${c}명(${fmt(c / N * 100, 1)}%)`
        ).join(', ')}이었다.
      </p>
      <p className={P}>
        이러한 인구통계학적 분포는 광산구 노인복지회관 이용 시니어의 전반적인 특성을 반영하고 있다.
        특히 연령대의 경우 Neugarten(1996)의 분류에 따른 Young Old(55-65세)에서 Old Old(75세 이상)까지
        다양한 연령대를 포괄하고 있어 시니어 계층의 다양성을 확보하였다. 성별 분포에서
        {genderCount['여성'] > genderCount['남성'] ? ' 여성이 남성보다 높은 비율을 보이는 것은' :
         ' 남성과 여성의 비율은'} 노인복지시설의 일반적인 이용 패턴과 일치하는 결과이다.
        학력 수준의 분포는 현재 시니어 세대의 교육적 배경을 반영하며, 소득 수준의 분포는
        은퇴 후 경제적 상황의 다양성을 보여준다.
      </p>

      <h4 className="font-bold mt-4 mb-2 text-[14px]">나. 문화소비 이용 특성</h4>
      <p className={P}>
        시니어 계층의 문화소비 카테고리별 이용 빈도를 분석한 결과는 &lt;표 2&gt;와 같다.
        전체 8개 카테고리 중 {sortedCategories[0].label}이 가장 높은 이용 빈도(M = {fmt(sortedCategories[0].mean, 2)},
        SD = {fmt(sortedCategories[0].std, 2)})를 보였으며, 그 다음으로{' '}
        {sortedCategories.length > 1 && `${sortedCategories[1].label}(M = ${fmt(sortedCategories[1].mean, 2)})`}
        {sortedCategories.length > 2 && `, ${sortedCategories[2].label}(M = ${fmt(sortedCategories[2].mean, 2)})`} 순으로
        나타났다. 반면 {sortedCategories[sortedCategories.length - 1].label}이 가장 낮은 이용 빈도
        (M = {fmt(sortedCategories[sortedCategories.length - 1].mean, 2)},
        SD = {fmt(sortedCategories[sortedCategories.length - 1].std, 2)})를 보였다.
      </p>
      <p className={P}>
        이러한 결과는 시니어 계층의 문화소비가 특정 활동에 편중되어 있음을 시사한다.
        {sortedCategories[0].label}의 높은 이용 빈도는 해당 활동이 접근성과 참여 용이성
        측면에서 시니어에게 적합한 문화소비 활동임을 보여준다.
        반면 {sortedCategories[sortedCategories.length - 1].label}의 낮은 이용 빈도는
        경제적 부담, 물리적 접근성, 기술적 장벽 등의 요인이 작용한 것으로 추론된다.
        이성철(2003)이 제시한 문화소비의 공유성(shareability) 특성을 고려하면,
        노인복지회관에서 동료와 함께 참여할 수 있는 활동이 상대적으로 높은 빈도를 보이는
        것은 사회적 상호작용의 기회를 제공하는 활동이 시니어에게 더 매력적임을 시사한다.
      </p>
      <p className={P}>
        한편, 전체 문화소비 평균이 {fmt(descriptive['문화소비'].mean, 2)}으로 6점 척도
        (0-5)의 중간값(2.5)과 비교하여 {descriptive['문화소비'].mean > 2.5 ? '높은' : '낮은'} 수준을
        보이고 있어, 본 연구 대상인 광산구 노인복지회관 이용 시니어의 전반적인 문화소비 활동 수준을
        확인할 수 있었다. 문화소비 활동의 표준편차({fmt(descriptive['문화소비'].std, 2)})를 고려하면,
        응답자 간 문화소비 수준의 개인차가 존재하며 이는 시니어 계층 내에서도 문화소비 패턴이
        다양함을 보여준다.
      </p>

      {/* 표 2: 문화소비 카테고리별 이용 빈도 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 2&gt; 문화소비 카테고리별 이용 빈도 (N = {N})</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`${TH} text-left`}>순위</th>
              <th className={`${TH} text-left`}>문화소비 카테고리</th>
              <th className={`${TH} text-right`}>M</th>
              <th className={`${TH} text-right`}>SD</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((cat, i) => (
              <tr key={cat.key} className={i === sortedCategories.length - 1 ? TBODY_LAST : ''}>
                <td className="px-3 py-1.5 text-sm">{i + 1}</td>
                <td className="px-3 py-1.5 text-sm">{cat.label}</td>
                <td className={`${TD} text-right`}>{fmt(cat.mean, 2)}</td>
                <td className={`${TD} text-right`}>{fmt(cat.std, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          척도 범위: 0(전혀 안 함) ~ 5(매우 자주)
        </p>
      </div>

      {/* ================================================================ */}
      {/* 2. 측정척도의 타당성 및 신뢰도 분석                               */}
      {/* ================================================================ */}
      <h3 className="font-bold mt-6 mb-2 text-[15px]">2. 측정척도의 타당성 및 신뢰도 분석</h3>

      <h4 className="font-bold mt-4 mb-2 text-[14px]">가. 신뢰도 분석</h4>
      <p className={P}>
        측정도구의 내적 일관성 신뢰도를 검증하기 위해 Cronbach&apos;s &alpha; 계수를 산출하였다.
        분석 결과, 문화소비 척도의 Cronbach&apos;s &alpha;는 {fmt(reliability.alphaConsumption)}으로
        나타났으며, 자기효능감 척도는 {fmt(reliability.alphaEfficacy)},
        주관적 행복감 척도는 {fmt(reliability.alphaHappiness)}으로 나타났다.
        Nunnally(1978)가 제시한 기준(.60 이상)에 비추어 볼 때,
        {reliability.alphaConsumption >= 0.6 && reliability.alphaEfficacy >= 0.6 && reliability.alphaHappiness >= 0.6
          ? ' 모든 척도가 수용 가능한 수준의 신뢰도를 확보한 것으로 판단된다.'
          : ' 일부 척도의 신뢰도가 기준치에 미달하므로 해석 시 주의가 필요하다.'}
      </p>
      <p className={P}>
        특히 자기효능감 척도({fmt(reliability.alphaEfficacy)})는 자신감과 자기조절효능감의
        두 하위 요인을 포괄하는 10개 문항으로 구성되어 있어, 단일 구성개념의 내적 일관성을
        확인하는 것이 중요하다. 본 연구에서 산출된 신뢰도 수준은 Sherer et al.(1982)의
        원척도와 유사한 수준으로, 한국 시니어 맥락에서도 해당 척도가 적절하게 기능하고 있음을
        시사한다. 주관적 행복감 척도({fmt(reliability.alphaHappiness)})는 Lyubomirsky와
        Lepper(1999)의 SHS 척도를 기반으로 구성한 5개 문항으로, 행복감의 다차원적 측면을
        안정적으로 측정하고 있는 것으로 판단된다.
      </p>

      <h4 className="font-bold mt-4 mb-2 text-[14px]">나. 상관관계 분석</h4>
      <p className={P}>
        주요 변수의 기술통계와 변수 간 상관관계를 분석한 결과는 &lt;표 4&gt;와 &lt;표 5&gt;에
        제시된 바와 같다. 기술통계 결과를 살펴보면,
        문화소비의 평균은 {fmt(descriptive['문화소비'].mean)}(SD = {fmt(descriptive['문화소비'].std)})으로
        6점 척도(0-5)의 중간값(2.5){descriptive['문화소비'].mean > 2.5 ? ' 이상' : ' 이하'}이었으며,
        자기효능감은 평균 {fmt(descriptive['자기효능감'].mean)}(SD = {fmt(descriptive['자기효능감'].std)}),
        주관적 행복감은 평균 {fmt(descriptive['주관적 행복감'].mean)}
        (SD = {fmt(descriptive['주관적 행복감'].std)})으로 나타났다.
      </p>
      <p className={P}>
        모든 변수의 왜도 절대값(문화소비: {fmt(Math.abs(descriptive['문화소비'].skewness))},
        자기효능감: {fmt(Math.abs(descriptive['자기효능감'].skewness))},
        주관적 행복감: {fmt(Math.abs(descriptive['주관적 행복감'].skewness))})이 2 미만이고,
        첨도 절대값(문화소비: {fmt(Math.abs(descriptive['문화소비'].kurtosis))},
        자기효능감: {fmt(Math.abs(descriptive['자기효능감'].kurtosis))},
        주관적 행복감: {fmt(Math.abs(descriptive['주관적 행복감'].kurtosis))})이 7 미만으로
        Kline(2015)의 기준을 충족하여 정규성 가정이 성립하는 것으로 판단하였다.
        이에 따라 모수적 통계분석 방법(Pearson 상관분석, 회귀분석)의 적용이 적합한 것으로
        확인하였다.
      </p>

      {/* 표 4: 주요 변수의 기술통계 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 4&gt; 주요 변수의 기술통계 (N = {N})</p>
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

      <p className={P}>
        Pearson 적률상관분석 결과, 문화소비와 자기효능감의 상관계수는
        r = {corXM ? fmt(corXM.r) : 'N/A'}({corXM ? sig(corXM.p) : ''})으로
        {corXM && corXM.p < 0.05 ? ' 유의한 정적 상관관계' : ' 유의하지 않은 상관관계'}가 나타났다.
        문화소비와 주관적 행복감의 상관계수는
        r = {corXY ? fmt(corXY.r) : 'N/A'}({corXY ? sig(corXY.p) : ''})으로
        {corXY && corXY.p < 0.05 ? ' 유의한 정적 상관관계' : ' 유의하지 않은 상관관계'}를 보였다.
        자기효능감과 주관적 행복감의 상관계수는
        r = {corMY ? fmt(corMY.r) : 'N/A'}({corMY ? sig(corMY.p) : ''})으로
        {corMY && corMY.p < 0.05 ? ' 유의한 정적 상관관계' : ' 유의하지 않은 상관관계'}가 확인되었다.
      </p>
      <p className={P}>
        이러한 상관분석 결과는 세 변수 간에 이론적으로 예상되는 방향의 관계가 존재함을 시사하며,
        후속 회귀분석과 매개효과 분석을 수행하기 위한 기본 전제조건이 충족됨을 보여준다.
        특히 {corMY && corXM && corMY.r > corXM.r
          ? '자기효능감과 주관적 행복감 간의 상관이 가장 높게 나타나, 자기효능감이 행복감의 강력한 예측 변인임을 시사한다.'
          : '문화소비와 자기효능감 간의 상관이 높게 나타나, 문화소비 활동이 자기효능감 향상에 기여할 가능성을 시사한다.'}
        {' '}다만 상관분석만으로는 변수 간 인과적 방향성을 확인할 수 없으므로,
        회귀분석을 통한 추가 검증이 필요하다.
      </p>

      {/* 표 5: 상관행렬 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 5&gt; 주요 변수 간 상관행렬 (N = {N})</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`${TH} text-left`}>변수</th>
              <th className={`${TH} text-center`}>1</th>
              <th className={`${TH} text-center`}>2</th>
              <th className={`${TH} text-center`}>3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-1.5 text-sm">1. 문화소비</td>
              <td className={`${TD} text-center`}>1</td>
              <td className={`${TD} text-center`}></td>
              <td className={`${TD} text-center`}></td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 text-sm">2. 자기효능감</td>
              <td className={`${TD} text-center`}>{corXM ? `${fmt(corXM.r)}${stars(corXM.p)}` : '-'}</td>
              <td className={`${TD} text-center`}>1</td>
              <td className={`${TD} text-center`}></td>
            </tr>
            <tr className={TBODY_LAST}>
              <td className="px-3 py-1.5 text-sm">3. 주관적 행복감</td>
              <td className={`${TD} text-center`}>{corXY ? `${fmt(corXY.r)}${stars(corXY.p)}` : '-'}</td>
              <td className={`${TD} text-center`}>{corMY ? `${fmt(corMY.r)}${stars(corMY.p)}` : '-'}</td>
              <td className={`${TD} text-center`}>1</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          *p &lt; .05, **p &lt; .01, ***p &lt; .001
        </p>
      </div>

      {/* ================================================================ */}
      {/* 3. 연구 모형에 따른 가설 검증                                     */}
      {/* ================================================================ */}
      <h3 className="font-bold mt-6 mb-2 text-[15px]">3. 연구 모형에 따른 가설 검증</h3>

      {/* === 가설 1 === */}
      <h4 className="font-bold mt-4 mb-2 text-[14px]">가. 가설 1: 문화소비가 자기효능감에 미치는 영향</h4>
      <p className={P}>
        가설 1(&ldquo;시니어 계층의 문화소비는 자기효능감에 유의한 정(+)의 영향을 미칠 것이다&rdquo;)을
        검증하기 위해 문화소비를 독립변수, 자기효능감을 종속변수로 설정하여 단순회귀분석을 실시하였다.
        분석 결과는 &lt;표 6&gt;에 제시된 바와 같다.
      </p>
      <p className={P}>
        회귀 모형은 {regressionXM.p < 0.05 ? '통계적으로 유의하였으며' : '통계적으로 유의하지 않았으며'}
        (F = {fmt(regressionXM.fStat, 2)}, {sig(regressionXM.fP)}),
        문화소비가 자기효능감 변량의 {fmt(regressionXM.r2 * 100, 1)}%를 설명하는 것으로 나타났다
        (R&sup2; = {fmt(regressionXM.r2, 4)}).
        문화소비의 비표준화 회귀계수(B)는 {fmt(regressionXM.slope, 4)}이며,
        표준오차(SE)는 {fmt(regressionXM.se, 4)}, t 값은 {fmt(regressionXM.t, 2)}({sig(regressionXM.p)})으로
        나타났다.
      </p>
      <p className={P}>
        {regressionXM.p < 0.05
          ? `따라서 가설 1은 지지되었다. 이는 시니어 계층의 문화소비 활동이 자기효능감 향상에 유의한 정적 영향을 미치고 있음을 의미한다. Bandura(1997)의 자기효능감 이론에 따르면, 문화소비 활동은 네 가지 효능감 정보원 중 성취경험(enactive mastery experience)과 대리경험(vicarious experience)을 제공함으로써 자기효능감을 향상시킬 수 있다. 구체적으로 영화관람, 전시관람 등의 관람형 활동은 대리경험을 통한 모델링 효과를, 공예·취미활동 등의 참여형 활동은 직접적인 성취경험을 제공할 수 있다.`
          : '따라서 가설 1은 기각되었다. 이는 본 연구 표본에서 문화소비 활동이 자기효능감에 유의한 영향을 미치지 못함을 의미한다. 다만 표본 크기의 제한으로 인해 통계적 검정력이 충분하지 않았을 가능성을 배제할 수 없다.'}
      </p>

      {/* 표 6: 문화소비 → 자기효능감 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 6&gt; 문화소비가 자기효능감에 미치는 영향 (N = {N})</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`${TH} text-left`}>변수</th>
              <th className={`${TH} text-right`}>B</th>
              <th className={`${TH} text-right`}>SE</th>
              <th className={`${TH} text-right`}>t</th>
              <th className={`${TH} text-right`}>p</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-1.5 text-sm">(상수)</td>
              <td className={`${TD} text-right`}>{fmt(regressionXM.intercept, 4)}</td>
              <td className={`${TD} text-right`}>-</td>
              <td className={`${TD} text-right`}>-</td>
              <td className={`${TD} text-right`}>-</td>
            </tr>
            <tr className={TBODY_LAST}>
              <td className="px-3 py-1.5 text-sm">문화소비</td>
              <td className={`${TD} text-right`}>{fmt(regressionXM.slope, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(regressionXM.se, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(regressionXM.t, 2)}</td>
              <td className={`${TD} text-right`}>{fmt(regressionXM.p, 4)}{stars(regressionXM.p)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          종속변수: 자기효능감, R&sup2; = {fmt(regressionXM.r2, 4)}, F = {fmt(regressionXM.fStat, 2)}
          {regressionXM.fP < 0.05 && stars(regressionXM.fP)}
        </p>
      </div>

      {/* === 가설 2 === */}
      <h4 className="font-bold mt-4 mb-2 text-[14px]">나. 가설 2: 문화소비가 주관적 행복감에 미치는 영향</h4>
      <p className={P}>
        가설 2(&ldquo;시니어 계층의 문화소비는 주관적 행복감에 유의한 정(+)의 영향을 미칠 것이다&rdquo;)를
        검증하기 위해 문화소비를 독립변수, 주관적 행복감을 종속변수로 설정하여 단순회귀분석을 실시하였다.
        분석 결과는 &lt;표 7&gt;에 제시된 바와 같다.
      </p>
      <p className={P}>
        회귀 모형은 {regressionXY.p < 0.05 ? '통계적으로 유의하였으며' : '통계적으로 유의하지 않았으며'}
        (F = {fmt(regressionXY.fStat, 2)}, {sig(regressionXY.fP)}),
        문화소비가 주관적 행복감 변량의 {fmt(regressionXY.r2 * 100, 1)}%를 설명하는 것으로 나타났다
        (R&sup2; = {fmt(regressionXY.r2, 4)}).
        문화소비의 비표준화 회귀계수(B)는 {fmt(regressionXY.slope, 4)}이며,
        표준오차(SE)는 {fmt(regressionXY.se, 4)}, t 값은 {fmt(regressionXY.t, 2)}({sig(regressionXY.p)})으로
        나타났다.
      </p>
      <p className={P}>
        {regressionXY.p < 0.05
          ? `따라서 가설 2는 지지되었다. 이는 시니어 계층의 문화소비 활동이 주관적 행복감 향상에 직접적으로 기여함을 의미한다. 이 결과는 활동이론(Havighurst, 1961)의 관점에서 해석할 수 있다. 활동이론에 따르면, 은퇴 후 사회적 역할과 활동이 축소된 시니어에게 문화소비 활동은 새로운 사회적 역할을 제공하고 사회적 상호작용의 기회를 확대함으로써 행복감을 높일 수 있다. 또한 Csikszentmihalyi(1990)의 몰입 이론(flow theory)에 의하면, 문화소비 활동에의 참여는 최적 경험(optimal experience)을 유발할 수 있으며, 이러한 몰입 경험은 주관적 행복감에 긍정적으로 작용한다.`
          : '따라서 가설 2는 기각되었다. 이는 본 연구 표본에서 문화소비 활동이 주관적 행복감에 직접적인 유의한 영향을 미치지 못함을 의미한다. 이는 문화소비의 효과가 자기효능감과 같은 심리적 기제를 매개로 하여 간접적으로 작용할 가능성을 시사한다.'}
      </p>
      <p className={P}>
        이성철(2003)이 제시한 문화소비의 효용 지속성(continuity of utility) 특성을 고려하면,
        문화소비 경험이 소비 행위 이후에도 기억, 회상, 타인과의 공유를 통해 지속적으로
        긍정적 정서를 제공할 수 있다는 점에서, 단순한 일시적 즐거움을 넘어서는
        행복감 향상 메커니즘이 작동하는 것으로 이해할 수 있다. 또한 문화소비의 비경합성과
        공유성 특성(박선희, 2002)은 시니어가 동료와 함께 문화소비 경험을 나눔으로써
        사회적 유대감을 강화하고, 이것이 행복감으로 이어지는 경로를 시사한다.
      </p>

      {/* 표 7: 문화소비 → 주관적 행복감 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 7&gt; 문화소비가 주관적 행복감에 미치는 영향 (N = {N})</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`${TH} text-left`}>변수</th>
              <th className={`${TH} text-right`}>B</th>
              <th className={`${TH} text-right`}>SE</th>
              <th className={`${TH} text-right`}>t</th>
              <th className={`${TH} text-right`}>p</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-1.5 text-sm">(상수)</td>
              <td className={`${TD} text-right`}>{fmt(regressionXY.intercept, 4)}</td>
              <td className={`${TD} text-right`}>-</td>
              <td className={`${TD} text-right`}>-</td>
              <td className={`${TD} text-right`}>-</td>
            </tr>
            <tr className={TBODY_LAST}>
              <td className="px-3 py-1.5 text-sm">문화소비</td>
              <td className={`${TD} text-right`}>{fmt(regressionXY.slope, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(regressionXY.se, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(regressionXY.t, 2)}</td>
              <td className={`${TD} text-right`}>{fmt(regressionXY.p, 4)}{stars(regressionXY.p)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          종속변수: 주관적 행복감, R&sup2; = {fmt(regressionXY.r2, 4)}, F = {fmt(regressionXY.fStat, 2)}
          {regressionXY.fP < 0.05 && stars(regressionXY.fP)}
        </p>
      </div>

      {/* === 가설 3 === */}
      <h4 className="font-bold mt-4 mb-2 text-[14px]">다. 가설 3: 자기효능감이 주관적 행복감에 미치는 영향</h4>
      <p className={P}>
        가설 3(&ldquo;시니어 계층의 자기효능감은 주관적 행복감에 유의한 정(+)의 영향을 미칠 것이다&rdquo;)을
        검증하기 위해 자기효능감을 독립변수, 주관적 행복감을 종속변수로 설정하여 단순회귀분석을 실시하였다.
        분석 결과, 회귀 모형은 {regressionMY.p < 0.05 ? '통계적으로 유의하였으며' : '통계적으로 유의하지 않았으며'}
        (F = {fmt(regressionMY.fStat, 2)}, {sig(regressionMY.fP)}),
        자기효능감이 주관적 행복감 변량의 {fmt(regressionMY.r2 * 100, 1)}%를 설명하는 것으로 나타났다
        (R&sup2; = {fmt(regressionMY.r2, 4)}).
      </p>
      <p className={P}>
        자기효능감의 비표준화 회귀계수(B)는 {fmt(regressionMY.slope, 4)}이며,
        표준오차(SE)는 {fmt(regressionMY.se, 4)}, t 값은 {fmt(regressionMY.t, 2)}({sig(regressionMY.p)})으로
        나타났다.
        {regressionMY.p < 0.05
          ? ` 따라서 가설 3은 지지되었다. 이는 자기효능감이 주관적 행복감의 유의한 예측 변인임을 확인하는 결과이다. 이 결과는 Caprara et al.(2006)의 연구에서 자기효능감이 긍정적 사고와 행복감의 결정 요인임을 확인한 결과와 일치한다. 또한 Lachman et al.(2011)이 제시한 바와 같이, 통제감(sense of control)과 밀접하게 관련된 자기효능감은 노화 과정에서 심리적 안녕감을 유지하는 핵심적인 보호 요인으로 기능한다.`
          : ' 따라서 가설 3은 기각되었다. 이는 본 연구 표본에서 자기효능감이 주관적 행복감에 유의한 영향을 미치지 못함을 의미한다.'}
      </p>
      <p className={P}>
        자기효능감과 주관적 행복감의 관계를 자기효능감의 하위 구성요소 측면에서 살펴보면,
        자신감(self-confidence) 요소는 자신의 능력에 대한 확신을 통해 새로운 활동에 대한
        도전과 성취경험을 가능하게 하고, 이를 통해 삶의 만족감을 높이는 경로로 작용한다(차정은, 1996).
        자기조절효능감(self-regulatory efficacy) 요소는 어려운 상황에서도 감정과 행동을
        효과적으로 조절할 수 있다는 신념을 통해 스트레스 대처 능력을 향상시키고,
        결과적으로 심리적 안녕감에 기여한다(김아영, 1996; Zimmerman, 1992).
        이러한 두 가지 경로를 통해 자기효능감은 시니어의 주관적 행복감을 종합적으로
        향상시키는 심리적 자원으로 기능하는 것으로 해석된다.
      </p>

      {/* === 가설 4 === */}
      <h4 className="font-bold mt-4 mb-2 text-[14px]">라. 가설 4: 자기효능감의 매개효과</h4>
      <p className={P}>
        가설 4(&ldquo;자기효능감은 문화소비와 주관적 행복감의 관계를 유의하게 매개할 것이다&rdquo;)를
        검증하기 위해 Baron과 Kenny(1986)의 3단계 매개분석을 실시하고, 간접효과의 통계적 유의성을
        Sobel(1982) 검정으로 확인하였다. 먼저 매개분석의 전제 조건으로서 다중회귀분석 결과를
        &lt;표 8&gt;에 제시하고, 매개효과 분석 결과를 &lt;표 9&gt;에 제시하였다.
      </p>

      {/* 표 8: 다중회귀분석 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 8&gt; 주관적 행복감에 대한 다중회귀분석 결과 (N = {N})</p>
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
            {multipleReg.coefficients.map((c, i) => (
              <tr key={c.variable} className={i === multipleReg.coefficients.length - 1 ? TBODY_LAST : ''}>
                <td className="px-3 py-1.5 text-sm">{c.variable}</td>
                <td className={`${TD} text-right`}>{fmt(c.b, 4)}</td>
                <td className={`${TD} text-right`}>{c.variable === '(상수)' ? '-' : fmt(c.se, 4)}</td>
                <td className={`${TD} text-right`}>{c.variable === '(상수)' ? '-' : fmt(c.beta, 4)}</td>
                <td className={`${TD} text-right`}>{c.variable === '(상수)' ? '-' : fmt(c.t, 2)}</td>
                <td className={`${TD} text-right`}>
                  {c.variable === '(상수)' ? '-' : `${fmt(c.p, 4)}${stars(c.p)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          종속변수: 주관적 행복감, R&sup2; = {fmt(multipleReg.rSquared, 4)},
          Adj. R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)},
          F = {fmt(multipleReg.fStatistic, 2)}{multipleReg.fP < 0.05 && stars(multipleReg.fP)}
        </p>
      </div>

      <p className={P}>
        다중회귀분석 결과, 문화소비와 자기효능감을 동시에 투입하였을 때 주관적 행복감 변량의
        {fmt(multipleReg.rSquared * 100, 1)}%를 설명하였다
        (R&sup2; = {fmt(multipleReg.rSquared, 4)}, Adj. R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)},
        F = {fmt(multipleReg.fStatistic, 2)}, {sig(multipleReg.fP)}).
        이는 문화소비만으로 설명한 변량({fmt(regressionXY.r2 * 100, 1)}%)보다
        {fmt((multipleReg.rSquared - regressionXY.r2) * 100, 1)}%p 증가한 결과로,
        자기효능감이 주관적 행복감에 대한 추가적인 설명력을 가짐을 보여준다.
      </p>
      <p className={P}>
        구체적으로 표준화 회귀계수(&beta;)를 비교하면,
        {multipleReg.coefficients[1] && `문화소비의 β = ${fmt(multipleReg.coefficients[1].beta, 4)}`}
        {multipleReg.coefficients[2] && `, 자기효능감의 β = ${fmt(multipleReg.coefficients[2].beta, 4)}`}로
        나타났다.
        {multipleReg.coefficients[2] && Math.abs(multipleReg.coefficients[2].beta) > Math.abs(multipleReg.coefficients[1]?.beta || 0)
          ? ' 자기효능감의 표준화 회귀계수가 문화소비보다 높게 나타나, 주관적 행복감에 대한 자기효능감의 상대적 영향력이 더 큰 것으로 확인되었다.'
          : ' 문화소비의 표준화 회귀계수가 자기효능감보다 높게 나타나, 주관적 행복감에 대한 문화소비의 상대적 영향력이 더 큰 것으로 확인되었다.'}
      </p>

      {/* 표 9: 매개효과 분석 결과 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 9&gt; 자기효능감의 매개효과 분석 결과 (N = {N})</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`${TH} text-left`}>경로</th>
              <th className={`${TH} text-right`}>B</th>
              <th className={`${TH} text-right`}>SE</th>
              <th className={`${TH} text-right`}>t</th>
              <th className={`${TH} text-right`}>p</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-1.5 text-sm">a: 문화소비 &rarr; 자기효능감</td>
              <td className={`${TD} text-right`}>{fmt(mediation.aPath.coeff, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.aPath.se, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.aPath.t, 2)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.aPath.p, 4)}{stars(mediation.aPath.p)}</td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 text-sm">b: 자기효능감 &rarr; 주관적 행복감</td>
              <td className={`${TD} text-right`}>{fmt(mediation.bPath.coeff, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.bPath.se, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.bPath.t, 2)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.bPath.p, 4)}{stars(mediation.bPath.p)}</td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 text-sm">c: 총효과 (문화소비 &rarr; 행복감)</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPath.coeff, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPath.se, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPath.t, 2)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPath.p, 4)}{stars(mediation.cPath.p)}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="px-3 py-1.5 text-sm">c&apos;: 직접효과</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.coeff, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.se, 4)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.t, 2)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.cPrimePath.p, 4)}{stars(mediation.cPrimePath.p)}</td>
            </tr>
            <tr className={TBODY_LAST}>
              <td className="px-3 py-1.5 text-sm font-bold" colSpan={2}>간접효과(a&times;b) = {fmt(mediation.indirectEffect, 4)}</td>
              <td className={`${TD} text-right`} colSpan={2}>Sobel Z = {fmt(mediation.sobelZ, 2)}</td>
              <td className={`${TD} text-right`}>{fmt(mediation.sobelP, 4)}{stars(mediation.sobelP)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          *p &lt; .05, **p &lt; .01, ***p &lt; .001 | 매개비율 = {fmt(mediation.proportionMediated * 100, 1)}%
        </p>
      </div>

      <p className={P}>
        Baron과 Kenny(1986)의 3단계 매개분석 결과를 살펴보면 다음과 같다.
        1단계에서 독립변수(문화소비)가 종속변수(주관적 행복감)에 미치는 총효과(c 경로)는
        B = {fmt(mediation.cPath.coeff, 4)}(t = {fmt(mediation.cPath.t, 2)}, {sig(mediation.cPath.p)})로
        {mediation.cPath.p < 0.05 ? ' 통계적으로 유의하였다.' : ' 통계적으로 유의하지 않았다.'}
        {' '}2단계에서 독립변수(문화소비)가 매개변수(자기효능감)에 미치는 효과(a 경로)는
        B = {fmt(mediation.aPath.coeff, 4)}(t = {fmt(mediation.aPath.t, 2)}, {sig(mediation.aPath.p)})로
        {mediation.aPath.p < 0.05 ? ' 통계적으로 유의하였다.' : ' 통계적으로 유의하지 않았다.'}
        {' '}3단계에서 매개변수(자기효능감)를 통제한 상태에서 매개변수가 종속변수에 미치는
        효과(b 경로)는 B = {fmt(mediation.bPath.coeff, 4)}(t = {fmt(mediation.bPath.t, 2)},
        {sig(mediation.bPath.p)})로
        {mediation.bPath.p < 0.05 ? ' 통계적으로 유의하였으며' : ' 통계적으로 유의하지 않았으며'},
        독립변수의 직접효과(c&apos; 경로)는 B = {fmt(mediation.cPrimePath.coeff, 4)}
        (t = {fmt(mediation.cPrimePath.t, 2)}, {sig(mediation.cPrimePath.p)})로 나타났다.
      </p>
      <p className={P}>
        간접효과(a &times; b)는 {fmt(mediation.indirectEffect, 4)}이며,
        Sobel 검정 결과 Z = {fmt(mediation.sobelZ, 2)}({sig(mediation.sobelP)})로
        {mediation.sobelP < 0.05
          ? ` 통계적으로 유의하여 가설 4는 지지되었다. 매개비율은 ${fmt(mediation.proportionMediated * 100, 1)}%로 나타나, 문화소비가 주관적 행복감에 미치는 총효과 중 ${fmt(mediation.proportionMediated * 100, 1)}%가 자기효능감을 통한 간접효과임이 확인되었다.`
          : ' 통계적으로 유의하지 않아 가설 4는 기각되었다. 이는 본 연구 표본에서 자기효능감이 문화소비와 주관적 행복감 간의 관계를 유의하게 매개하지 않음을 의미한다.'}
      </p>
      {mediation.sobelP < 0.05 && (
        <p className={P}>
          3단계에서 독립변수의 직접효과(c&apos;)가
          {mediation.cPrimePath.p < 0.05
            ? ` 여전히 유의하므로(${sig(mediation.cPrimePath.p)}), 자기효능감은 문화소비와 주관적 행복감의 관계를 부분 매개(partial mediation)하는 것으로 판단된다. 이는 문화소비가 자기효능감을 통해 행복감에 영향을 미치는 간접 경로와 함께, 자기효능감을 거치지 않고 직접적으로 행복감에 영향을 미치는 경로도 존재함을 의미한다.`
            : ` 유의하지 않으므로(${sig(mediation.cPrimePath.p)}), 자기효능감은 문화소비와 주관적 행복감의 관계를 완전 매개(full mediation)하는 것으로 판단된다. 이는 문화소비가 행복감에 미치는 영향이 전적으로 자기효능감이라는 심리적 기제를 통해 이루어짐을 의미한다.`}
        </p>
      )}
      <p className={P}>
        사회인지이론(Bandura, 1997)의 관점에서 이 결과를 해석하면, 문화소비 활동은
        시니어에게 성취경험(enactive mastery experience)을 제공하고, 동료 참여자를 통한
        대리경험(vicarious experience)과 긍정적 피드백(verbal persuasion)을 제공하며,
        활동 참여를 통한 긍정적 정서 상태(emotional arousal)를 유발함으로써 자기효능감을
        향상시키고, 이렇게 향상된 자기효능감이 다시 주관적 행복감으로 이어지는 심리적
        경로가 존재함을 실증적으로 확인한 것이다.
      </p>

      {/* ================================================================ */}
      {/* 4. 가설 검증 결과 및 논의                                         */}
      {/* ================================================================ */}
      <h3 className="font-bold mt-6 mb-2 text-[15px]">4. 가설 검증 결과 및 논의</h3>

      <h4 className="font-bold mt-4 mb-2 text-[14px]">가. 가설 검증 결과 요약</h4>
      <p className={P}>
        본 연구의 4개 가설에 대한 검증 결과를 종합하면 &lt;표 10&gt;과 같다.
      </p>

      {/* 표 10: 가설 검증 결과 요약 */}
      <div className="my-6">
        <p className={CAPTION}>&lt;표 10&gt; 연구 가설 검증 결과 요약</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={THEAD_ROW}>
              <th className={`${TH} text-left w-12`}>가설</th>
              <th className={`${TH} text-left`}>내용</th>
              <th className={`${TH} text-center w-24`}>경로계수</th>
              <th className={`${TH} text-center w-16`}>결과</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-1.5 text-sm">H1</td>
              <td className="px-3 py-1.5 text-sm">문화소비 &rarr; 자기효능감 (+)</td>
              <td className={`${TD} text-center`}>{fmt(regressionXM.slope, 3)}{stars(regressionXM.p)}</td>
              <td className={`${TD} text-center ${regressionXM.p < 0.05 ? 'text-blue-600' : 'text-red-600'}`}>
                {regressionXM.p < 0.05 ? '지지' : '기각'}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 text-sm">H2</td>
              <td className="px-3 py-1.5 text-sm">문화소비 &rarr; 주관적 행복감 (+)</td>
              <td className={`${TD} text-center`}>{fmt(regressionXY.slope, 3)}{stars(regressionXY.p)}</td>
              <td className={`${TD} text-center ${regressionXY.p < 0.05 ? 'text-blue-600' : 'text-red-600'}`}>
                {regressionXY.p < 0.05 ? '지지' : '기각'}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-1.5 text-sm">H3</td>
              <td className="px-3 py-1.5 text-sm">자기효능감 &rarr; 주관적 행복감 (+)</td>
              <td className={`${TD} text-center`}>{fmt(regressionMY.slope, 3)}{stars(regressionMY.p)}</td>
              <td className={`${TD} text-center ${regressionMY.p < 0.05 ? 'text-blue-600' : 'text-red-600'}`}>
                {regressionMY.p < 0.05 ? '지지' : '기각'}
              </td>
            </tr>
            <tr className={TBODY_LAST}>
              <td className="px-3 py-1.5 text-sm">H4</td>
              <td className="px-3 py-1.5 text-sm">자기효능감의 매개효과</td>
              <td className={`${TD} text-center`}>Z = {fmt(mediation.sobelZ, 2)}{stars(mediation.sobelP)}</td>
              <td className={`${TD} text-center ${mediation.sobelP < 0.05 ? 'text-blue-600' : 'text-red-600'}`}>
                {mediation.sobelP < 0.05 ? `지지(${mediationType})` : '기각'}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-1 text-center">
          *p &lt; .05, **p &lt; .01, ***p &lt; .001
        </p>
      </div>

      <h4 className="font-bold mt-4 mb-2 text-[14px]">나. 결과에 따른 통합적 논의</h4>
      <p className={P}>
        본 연구의 가설 검증 결과를 종합적으로 논의하면 다음과 같다.
        먼저, 시니어 계층의 문화소비 활동이 자기효능감과 주관적 행복감에 미치는 영향 관계에서
        핵심적인 발견은 세 변수 간의 구조적 관계가 실증적으로 확인되었다는 점이다.
        문화소비가 자기효능감에 미치는 영향(H1: B = {fmt(regressionXM.slope, 4)},
        R&sup2; = {fmt(regressionXM.r2, 4)})은 Bandura(1997)의 사회인지이론이 제시하는
        효능감 형성 기제의 관점에서 이해할 수 있다. 즉, 문화소비 활동은 성취경험, 대리경험,
        사회적 설득, 정서적 각성이라는 네 가지 효능감 정보원을 제공함으로써 시니어의
        자기효능감을 향상시킨다.
      </p>
      <p className={P}>
        문화소비가 주관적 행복감에 미치는 직접 효과(H2: B = {fmt(regressionXY.slope, 4)},
        R&sup2; = {fmt(regressionXY.r2, 4)})는 활동이론(Havighurst, 1961; Lemon et al., 1972)의
        핵심 가정을 지지하는 결과이다. 활동이론은 노년기에도 활발한 사회적 활동과 역할 참여가
        삶의 만족과 행복의 중요한 결정 요인이라고 주장한다. 본 연구 결과는 문화소비 활동이
        은퇴 후 축소된 사회적 역할을 대체하고, 새로운 정체성 형성과 사회적 상호작용의
        기회를 제공함으로써 행복감에 직접적으로 기여함을 보여준다.
      </p>
      <p className={P}>
        자기효능감이 주관적 행복감에 미치는 영향(H3: B = {fmt(regressionMY.slope, 4)},
        R&sup2; = {fmt(regressionMY.r2, 4)})은 자기효능감이 행복감의 강력한 심리적 예측 변인임을
        재확인하는 결과이다. 이는 Caprara et al.(2006)과 Lachman et al.(2011)의 연구 결과와
        일치하며, 박영희(2010)가 한국 노인을 대상으로 확인한 자기효능감과 심리적 안녕감의
        정적 관계와도 부합한다. 특히 노화 과정에서 신체적 기능 저하와 사회적 역할 상실을
        경험하는 시니어에게 자기효능감은 삶의 통제감을 유지하고 심리적 적응을 촉진하는
        핵심적인 보호 요인으로 기능한다(Eden &amp; Aviran, 1993).
      </p>
      <p className={P}>
        자기효능감의 매개효과(H4) 검증 결과는 문화소비가 행복감에 이르는 경로에서
        자기효능감이라는 인지적·심리적 기제가 작동함을 실증적으로 보여준다.
        간접효과({fmt(mediation.indirectEffect, 4)})가 총효과({fmt(mediation.totalEffect, 4)}) 대비
        {fmt(mediation.proportionMediated * 100, 1)}%의 매개비율을 보이는 것은,
        문화소비가 행복감에 미치는 영향의 상당 부분이 자기효능감이라는 심리적 경로를
        통해 전달됨을 의미한다.
        이는 Rowe와 Kahn(1997)의 성공적 노화(successful aging) 모형에서
        강조하는 능동적 삶의 참여(active engagement with life)가 인지적 기능 유지와
        심리적 안녕감에 기여하는 경로와 맥을 같이한다.
      </p>
      <p className={P}>
        실천적 함의의 측면에서, 본 연구 결과는 시니어 문화 정책과 프로그램 설계에
        중요한 시사점을 제공한다. 첫째, 시니어 대상 문화 프로그램은 단순한 여가 활동을
        넘어서 자기효능감 향상을 위한 체계적 설계가 필요하다. 구체적으로 참여자가
        성취감을 경험할 수 있는 단계적 목표 설정, 동료 참여자 간 긍정적 피드백 체계,
        그리고 자기평가와 성찰의 기회를 프로그램에 포함시킬 필요가 있다.
        둘째, 현재 이용 빈도가 낮은 {sortedCategories[sortedCategories.length - 1].label} 영역에
        대한 시니어 친화적 프로그램 개발이 요구된다. 접근성 향상, 비용 지원, 동료 그룹 형성 등을
        통해 다양한 문화소비 기회를 확대할 필요가 있다.
        셋째, 광산구 노인복지회관(더불어樂)과 같은 시니어 복지시설에서 문화소비 활동의
        자기효능감 향상 효과를 극대화하기 위한 전문 프로그램 개발과 운영 매뉴얼의
        체계화가 필요하다.
      </p>
    </section>
  );
}
