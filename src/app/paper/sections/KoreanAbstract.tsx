import type { PaperData } from '../paperData';
import { P, H2, fmt, sig } from '../paperData';

export default function KoreanAbstract({ data }: { data: PaperData }) {
  const { N, mediation, regressionXM, regressionXY, regressionMY, multipleReg } = data;

  return (
    <section className="break-before-page">
      <h2 className={H2}>국문초록</h2>

      <div className="text-center mb-6">
        <h3 className="text-[15px] font-bold leading-relaxed">
          시니어 계층의 문화소비가 자기효능감과<br />
          주관적 행복감에 미치는 영향
        </h3>
        <p className="text-[13px] text-gray-600 mt-1">
          — 자기효능감의 매개효과를 중심으로 —
        </p>
      </div>

      <p className={P}>
        본 연구는 시니어 계층의 문화소비가 자기효능감과 주관적 행복감에 미치는 영향을
        분석하고, 자기효능감의 매개효과를 검증하는 것을 목적으로 한다. 이를 위해
        광주광역시 광산구 노인복지회관(더불어樂) 이용 시니어 {N}명을 대상으로
        구조화된 설문조사를 실시하였다. 독립변수인 문화소비는 영화관람, 공연/음악회,
        전시/미술관, 독서, 스포츠, 여행, 공예/취미, 디지털 콘텐츠 등 8개 카테고리의
        활동 빈도로 측정하였으며, 매개변수인 자기효능감은 Sherer et al.(1982)의 연구를
        기반으로 자신감과 자기조절효능감을 포괄하는 10개 문항으로, 종속변수인 주관적
        행복감은 Lyubomirsky와 Lepper(1999)의 SHS 척도를 참고한 5개 문항으로 측정하였다.
      </p>
      <p className={P}>
        자료 분석은 빈도분석, 기술통계, Cronbach&apos;s &alpha; 신뢰도 분석, Pearson 상관분석,
        단순회귀분석, 다중회귀분석, 그리고 Baron과 Kenny(1986)의 3단계 매개분석과
        Sobel(1982) 검정을 적용하였다. 분석 결과, 첫째, 문화소비는 자기효능감에
        유의한 정(+)의 영향을 미쳤다(B = {fmt(regressionXM.slope, 4)},
        R&sup2; = {fmt(regressionXM.r2, 4)}, {sig(regressionXM.p)}).
        둘째, 문화소비는 주관적 행복감에 유의한 정(+)의 영향을 미쳤다
        (B = {fmt(regressionXY.slope, 4)}, R&sup2; = {fmt(regressionXY.r2, 4)},
        {sig(regressionXY.p)}).
        셋째, 자기효능감은 주관적 행복감에 유의한 정(+)의 영향을 미쳤다
        (B = {fmt(regressionMY.slope, 4)}, R&sup2; = {fmt(regressionMY.r2, 4)},
        {sig(regressionMY.p)}).
        넷째, 자기효능감은 문화소비와 주관적 행복감의 관계를
        {mediation.sobelP < 0.05 ? ' 유의하게 매개하는 것으로 확인되었다' : ' 유의하게 매개하지 않는 것으로 나타났다'}
        (간접효과 = {fmt(mediation.indirectEffect, 4)}, Sobel Z = {fmt(mediation.sobelZ, 2)},
        {sig(mediation.sobelP)}, 매개비율 = {fmt(mediation.proportionMediated * 100, 1)}%).
      </p>
      <p className={P}>
        이러한 연구 결과는 시니어 계층의 문화소비가 자기효능감이라는 심리적 기제를 통해
        주관적 행복감에 영향을 미치는 구조적 경로를 실증적으로 규명하였다는 점에서
        학술적 의의를 지닌다. 실천적 시사점으로, 시니어 문화 프로그램 설계 시 참여형·체험형
        활동을 강화하여 자기효능감 향상을 도모하고, 문화소비 접근성 제고를 위한 정책적
        지원의 필요성을 제시하였다. 다만, 횡단적 연구 설계와 편의표집의 한계를 고려하여,
        종단적 연구와 대규모 확률표집을 활용한 후속 연구가 필요함을 논의하였다.
      </p>

      <div className="mt-6 text-[13px]">
        <p>
          <strong>주제어:</strong> 시니어, 문화소비, 자기효능감, 자신감, 자기조절효능감,
          주관적 행복감, 매개효과
        </p>
      </div>
    </section>
  );
}
