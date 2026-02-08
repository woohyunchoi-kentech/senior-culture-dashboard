import { CULTURAL_CONSUMPTION_CATEGORIES, SELF_EFFICACY_ITEMS, HAPPINESS_ITEMS } from '@/lib/constants';
import { H2, H3 } from '../paperData';

export default function Appendix({ N }: { N: number }) {
  return (
    <section className="break-before-page">
      <h2 className={H2}>부록</h2>

      <h3 className={H3}>부록 1. 설문지</h3>

      <div className="text-[12.5px] space-y-6 mt-4">
        {/* 안내문 */}
        <div className="border border-gray-300 rounded p-4 bg-gray-50">
          <p className="font-bold text-center mb-3">설 문 지</p>
          <p className="text-[12px] leading-relaxed">
            안녕하십니까? 본 설문지는 &ldquo;시니어 계층의 문화소비가 자기효능감과 주관적 행복감에
            미치는 영향&rdquo;에 관한 연구를 위해 작성되었습니다. 귀하의 솔직하고 성의 있는
            응답은 본 연구에 매우 소중한 자료가 됩니다. 본 설문은 익명으로 진행되며,
            응답 내용은 통계 처리되어 연구 목적으로만 사용됩니다. 바쁘신 중에도
            설문에 참여해 주셔서 진심으로 감사드립니다.
          </p>
          <p className="text-[12px] text-right mt-3">
            전남대학교 문화전문대학원 문화경영관광전공<br />
            연구자: 최지은
          </p>
        </div>

        {/* Part 1: 인구통계 */}
        <div>
          <p className="font-bold mb-2">Part 1. 인구통계학적 특성</p>
          <div className="space-y-2 ml-4 text-[12px]">
            <p>1. 귀하의 성별은? &emsp; ① 남성 &emsp; ② 여성</p>
            <p>2. 귀하의 연령대는? &emsp; ① 60-64세 &emsp; ② 65-69세 &emsp; ③ 70-74세 &emsp; ④ 75-79세 &emsp; ⑤ 80세 이상</p>
            <p>3. 귀하의 최종 학력은? &emsp; ① 초등학교 이하 &emsp; ② 중학교 &emsp; ③ 고등학교 &emsp; ④ 대학교 이상</p>
            <p>4. 귀하의 월 소득 수준은? &emsp; ① 100만원 미만 &emsp; ② 100-200만원 &emsp; ③ 200-300만원 &emsp; ④ 300만원 이상</p>
          </div>
        </div>

        {/* Part 2: 문화소비 */}
        <div>
          <p className="font-bold mb-2">Part 2. 문화소비 활동 빈도</p>
          <p className="text-[11px] text-gray-500 mb-2">
            다음 각 문화소비 활동에 대해 최근 6개월간의 참여 빈도를 표시해 주십시오.
            (0=전혀 안 함, 1=거의 안 함, 2=가끔, 3=보통, 4=자주, 5=매우 자주)
          </p>
          <table className="w-full text-[11px] border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">문항</th>
                {[0, 1, 2, 3, 4, 5].map(n => (
                  <th key={n} className="border border-gray-300 px-1 py-1 text-center w-10">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CULTURAL_CONSUMPTION_CATEGORIES.map((cat, i) => (
                <tr key={cat.key}>
                  <td className="border border-gray-300 px-2 py-1">{i + 1}. {cat.label}</td>
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <td key={n} className="border border-gray-300 text-center">○</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Part 3: 자기효능감 */}
        <div>
          <p className="font-bold mb-2">Part 3. 자기효능감</p>
          <p className="text-[11px] text-gray-500 mb-2">
            다음 각 문항에 대해 귀하의 생각과 가장 일치하는 곳에 표시해 주십시오.
            (1=전혀 그렇지 않다, 2=그렇지 않다, 3=보통이다, 4=그렇다, 5=매우 그렇다)
          </p>
          <table className="w-full text-[11px] border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">문항</th>
                {[1, 2, 3, 4, 5].map(n => (
                  <th key={n} className="border border-gray-300 px-1 py-1 text-center w-10">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SELF_EFFICACY_ITEMS.map((item, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 px-2 py-1">{i + 1}. {item}</td>
                  {[1, 2, 3, 4, 5].map(n => (
                    <td key={n} className="border border-gray-300 text-center">○</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Part 4: 주관적 행복감 */}
        <div>
          <p className="font-bold mb-2">Part 4. 주관적 행복감</p>
          <p className="text-[11px] text-gray-500 mb-2">
            다음 각 문항에 대해 귀하의 생각과 가장 일치하는 곳에 표시해 주십시오.
            (1=전혀 그렇지 않다, 2=그렇지 않다, 3=보통이다, 4=그렇다, 5=매우 그렇다)
          </p>
          <table className="w-full text-[11px] border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-left">문항</th>
                {[1, 2, 3, 4, 5].map(n => (
                  <th key={n} className="border border-gray-300 px-1 py-1 text-center w-10">{n}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HAPPINESS_ITEMS.map((item, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 px-2 py-1">{i + 1}. {item}</td>
                  {[1, 2, 3, 4, 5].map(n => (
                    <td key={n} className="border border-gray-300 text-center">○</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-[11px] text-gray-500 mt-6">
          설문에 응해 주셔서 감사합니다.
        </p>
      </div>

      {/* 부록 정보 */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300">
        <p className="text-xs text-gray-400 text-center">
          본 논문은 대시보드 내 데이터({N}건)를 기반으로 자동 생성된 논문입니다.
          통계 수치는 입력된 데이터에 따라 동적으로 변경됩니다.
        </p>
      </div>
    </section>
  );
}
