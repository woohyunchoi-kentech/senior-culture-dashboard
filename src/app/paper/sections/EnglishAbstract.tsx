import type { PaperData } from '../paperData';
import { H2, fmt, sig } from '../paperData';

export default function EnglishAbstract({ data }: { data: PaperData }) {
  const { N, mediation, regressionXM, regressionXY, regressionMY, multipleReg } = data;

  const AP = 'mb-3 text-justify text-[13px] indent-[2em] leading-relaxed';

  return (
    <section className="break-before-page">
      <h2 className={H2}>Abstract</h2>

      <div className="text-center mb-6">
        <h3 className="text-[14px] font-bold leading-relaxed">
          The Effect of Cultural Consumption on Self-Efficacy and<br />
          Subjective Happiness among Senior Citizens:<br />
          Focusing on the Mediating Role of Self-Efficacy
        </h3>
        <p className="text-[12px] text-gray-600 mt-2">
          Choi, Ji-Eun
        </p>
        <p className="text-[12px] text-gray-500">
          Department of Cultural Management and Tourism<br />
          Graduate School of Cultural Studies, Chonnam National University
        </p>
      </div>

      <p className={AP}>
        This study investigates the effects of cultural consumption on self-efficacy
        and subjective happiness among senior citizens, with a particular focus on
        the mediating role of self-efficacy. A structured survey was administered to
        {' '}{N} senior citizens utilizing the Gwangsan-gu Senior Welfare Center
        (Deobureoak) in Gwangju Metropolitan City, South Korea. Cultural consumption
        (independent variable) was measured across eight categories of activity
        frequency: movie viewing, concerts/music, exhibitions/galleries, reading,
        sports, travel, crafts/hobbies, and digital content. Self-efficacy (mediating
        variable) was measured using 10 items encompassing self-confidence and
        self-regulatory efficacy based on Sherer et al. (1982). Subjective happiness
        (dependent variable) was measured using 5 items adapted from Lyubomirsky
        and Lepper&apos;s (1999) Subjective Happiness Scale.
      </p>
      <p className={AP}>
        Data analysis included frequency analysis, descriptive statistics,
        Cronbach&apos;s alpha reliability analysis, Pearson correlation analysis,
        simple and multiple regression analyses, Baron and Kenny&apos;s (1986) three-step
        mediation analysis, and Sobel&apos;s (1982) test. The results are as follows:
        First, cultural consumption had a statistically significant positive effect
        on self-efficacy (B = {fmt(regressionXM.slope, 4)},
        R&sup2; = {fmt(regressionXM.r2, 4)}, {sig(regressionXM.p)}).
        Second, cultural consumption had a statistically significant positive effect
        on subjective happiness (B = {fmt(regressionXY.slope, 4)},
        R&sup2; = {fmt(regressionXY.r2, 4)}, {sig(regressionXY.p)}).
        Third, self-efficacy had a statistically significant positive effect
        on subjective happiness (B = {fmt(regressionMY.slope, 4)},
        R&sup2; = {fmt(regressionMY.r2, 4)}, {sig(regressionMY.p)}).
        Fourth, self-efficacy {mediation.sobelP < 0.05
          ? 'significantly mediated'
          : 'did not significantly mediate'} the relationship between cultural
        consumption and subjective happiness (indirect effect = {fmt(mediation.indirectEffect, 4)},
        Sobel Z = {fmt(mediation.sobelZ, 2)}, {sig(mediation.sobelP)},
        proportion mediated = {fmt(mediation.proportionMediated * 100, 1)}%).
      </p>
      <p className={AP}>
        These findings empirically demonstrate the structural pathway through which
        cultural consumption influences subjective happiness via the psychological
        mechanism of self-efficacy among senior citizens. Drawing on Bandura&apos;s (1997)
        social cognitive theory and Havighurst&apos;s (1961) activity theory, this study
        suggests that cultural consumption activities enhance self-efficacy through
        enactive mastery experiences, vicarious learning, verbal persuasion, and
        positive emotional arousal, which in turn contributes to greater subjective
        happiness. Multiple regression revealed that cultural consumption and
        self-efficacy explained {fmt(multipleReg.rSquared * 100, 1)}% of variance
        in subjective happiness (R&sup2; = {fmt(multipleReg.rSquared, 4)},
        Adj. R&sup2; = {fmt(multipleReg.adjustedRSquared, 4)}).
      </p>
      <p className={AP}>
        The practical implications of this study include the need for designing
        senior cultural programs that systematically incorporate experiential and
        participatory activities to enhance self-efficacy, as well as policy
        support for improving accessibility to cultural consumption opportunities.
        Limitations include the cross-sectional design, convenience sampling, and
        relatively small sample size ({N}), suggesting the need for longitudinal
        studies and larger probability-based samples in future research.
      </p>

      <div className="mt-6 text-[12px]">
        <p>
          <strong>Keywords:</strong> Senior Citizens, Cultural Consumption,
          Self-Efficacy, Self-Confidence, Self-Regulatory Efficacy,
          Subjective Happiness, Mediating Effect
        </p>
      </div>
    </section>
  );
}
