import type { Respondent, DescriptiveStats, CorrelationResult, RegressionResult } from '@/types';

// === 기본 통계 함수 ===

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function std(arr: number[], sample = true): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const sumSq = arr.reduce((acc, v) => acc + (v - m) ** 2, 0);
  return Math.sqrt(sumSq / (sample ? arr.length - 1 : arr.length));
}

export function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function skewness(arr: number[]): number {
  const n = arr.length;
  if (n < 3) return 0;
  const m = mean(arr);
  const s = std(arr);
  if (s === 0) return 0;
  const sum = arr.reduce((acc, v) => acc + ((v - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

export function kurtosis(arr: number[]): number {
  const n = arr.length;
  if (n < 4) return 0;
  const m = mean(arr);
  const s = std(arr);
  if (s === 0) return 0;
  const sum = arr.reduce((acc, v) => acc + ((v - m) / s) ** 4, 0);
  const k = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum;
  return k - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
}

export function descriptiveStats(arr: number[]): DescriptiveStats {
  return {
    n: arr.length,
    mean: mean(arr),
    std: std(arr),
    min: arr.length > 0 ? Math.min(...arr) : 0,
    max: arr.length > 0 ? Math.max(...arr) : 0,
    median: median(arr),
    skewness: skewness(arr),
    kurtosis: kurtosis(arr),
  };
}

// === 상관분석 ===

export function pearsonCorrelation(x: number[], y: number[]): { r: number; p: number } {
  const n = Math.min(x.length, y.length);
  if (n < 3) return { r: 0, p: 1 };

  const mx = mean(x.slice(0, n));
  const my = mean(y.slice(0, n));

  let sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    sumXY += dx * dy;
    sumX2 += dx * dx;
    sumY2 += dy * dy;
  }

  if (sumX2 === 0 || sumY2 === 0) return { r: 0, p: 1 };
  const r = sumXY / Math.sqrt(sumX2 * sumY2);

  // t-test for significance
  const t = r * Math.sqrt((n - 2) / (1 - r * r));
  const p = tDistributionP(Math.abs(t), n - 2) * 2; // two-tailed

  return { r, p };
}

// 간단한 t-분포 p값 근사
function tDistributionP(t: number, df: number): number {
  // Abramowitz and Stegun approximation
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  // Incomplete beta function approximation
  return incompleteBeta(x, a, b) / 2;
}

function incompleteBeta(x: number, a: number, b: number): number {
  // Simple continued fraction approximation for regularized incomplete beta
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  const lnBeta = lnGamma(a) + lnGamma(b) - lnGamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta);

  // Lentz's continued fraction
  let f = 1, c = 1, d = 0;
  for (let i = 0; i <= 200; i++) {
    let m = Math.floor(i / 2);
    let numerator: number;
    if (i === 0) {
      numerator = 1;
    } else if (i % 2 === 0) {
      numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    } else {
      numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    }

    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;

    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;

    f *= c * d;
    if (Math.abs(c * d - 1) < 1e-8) break;
  }

  return front * (f - 1) / a;
}

function lnGamma(z: number): number {
  // Stirling's approximation with Lanczos
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  }

  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }

  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

// === Cronbach's Alpha ===

export function cronbachAlpha(items: number[][]): number {
  // items: 각 문항별 응답 배열 (items[문항인덱스][응답자인덱스])
  const k = items.length;
  if (k < 2) return 0;
  const n = items[0].length;
  if (n < 2) return 0;

  // 각 문항의 분산
  const itemVariances = items.map((item) => {
    const m = mean(item);
    return item.reduce((acc, v) => acc + (v - m) ** 2, 0) / (n - 1);
  });
  const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);

  // 총점의 분산
  const totals = Array.from({ length: n }, (_, i) =>
    items.reduce((sum, item) => sum + item[i], 0)
  );
  const totalVar = (() => {
    const m = mean(totals);
    return totals.reduce((acc, v) => acc + (v - m) ** 2, 0) / (n - 1);
  })();

  if (totalVar === 0) return 0;
  return (k / (k - 1)) * (1 - sumItemVar / totalVar);
}

// === 변수 추출 ===

export function getConsumptionMean(r: Respondent): number {
  const c = r.culturalConsumption;
  return (c.movies + c.concerts + c.exhibitions + c.reading + c.sports + c.travel + c.crafts + c.digital) / 8;
}

export function getEfficacyMean(r: Respondent): number {
  return r.selfEfficacy.reduce((a, b) => a + b, 0) / 10;
}

export function getHappinessMean(r: Respondent): number {
  return r.subjectiveHappiness.reduce((a, b) => a + b, 0) / 5;
}

export function extractVariables(respondents: Respondent[]): {
  consumption: number[];
  efficacy: number[];
  happiness: number[];
} {
  return {
    consumption: respondents.map(getConsumptionMean),
    efficacy: respondents.map(getEfficacyMean),
    happiness: respondents.map(getHappinessMean),
  };
}

// === 상관행렬 ===

export function correlationMatrix(respondents: Respondent[]): CorrelationResult[] {
  const { consumption, efficacy, happiness } = extractVariables(respondents);
  const vars = [
    { name: '문화소비', data: consumption },
    { name: '자기효능감', data: efficacy },
    { name: '주관적 행복감', data: happiness },
  ];

  const results: CorrelationResult[] = [];
  for (let i = 0; i < vars.length; i++) {
    for (let j = i; j < vars.length; j++) {
      const { r, p } = i === j ? { r: 1, p: 0 } : pearsonCorrelation(vars[i].data, vars[j].data);
      results.push({
        variable1: vars[i].name,
        variable2: vars[j].name,
        r,
        p,
        n: respondents.length,
      });
    }
  }
  return results;
}

// === 단순 회귀분석 (OLS) ===

export function simpleRegression(x: number[], y: number[]): {
  slope: number; intercept: number; se: number; r2: number; t: number; p: number; fStat: number; fP: number;
} {
  const n = x.length;
  if (n < 3) return { slope: 0, intercept: 0, se: 0, r2: 0, t: 0, p: 1, fStat: 0, fP: 1 };

  const mx = mean(x);
  const my = mean(y);

  let ssXY = 0, ssXX = 0, ssYY = 0;
  for (let i = 0; i < n; i++) {
    ssXY += (x[i] - mx) * (y[i] - my);
    ssXX += (x[i] - mx) ** 2;
    ssYY += (y[i] - my) ** 2;
  }

  const slope = ssXX > 0 ? ssXY / ssXX : 0;
  const intercept = my - slope * mx;

  const ssRes = y.reduce((acc, yi, i) => acc + (yi - intercept - slope * x[i]) ** 2, 0);
  const r2 = ssYY > 0 ? 1 - ssRes / ssYY : 0;

  const mse = ssRes / (n - 2);
  const se = ssXX > 0 ? Math.sqrt(mse / ssXX) : 0;
  const t = se > 0 ? slope / se : 0;
  const p = tDistributionP(Math.abs(t), n - 2) * 2;

  const fStat = mse > 0 ? (ssYY - ssRes) / mse : 0;
  const fP = p; // For simple regression, F = t^2

  return { slope, intercept, se, r2, t, p, fStat, fP };
}

// === 다중 회귀분석 (2개 독립변수) ===

export function multipleRegression(
  x1: number[], x2: number[], y: number[]
): RegressionResult {
  const n = x1.length;
  const vars = { x1, x2, y };

  // 행렬 계산 (정규방정식)
  const mx1 = mean(x1), mx2 = mean(x2), my = mean(y);
  let s11 = 0, s22 = 0, s12 = 0, s1y = 0, s2y = 0, syy = 0;

  for (let i = 0; i < n; i++) {
    const d1 = vars.x1[i] - mx1;
    const d2 = vars.x2[i] - mx2;
    const dy = vars.y[i] - my;
    s11 += d1 * d1;
    s22 += d2 * d2;
    s12 += d1 * d2;
    s1y += d1 * dy;
    s2y += d2 * dy;
    syy += dy * dy;
  }

  const det = s11 * s22 - s12 * s12;
  if (det === 0) {
    return {
      dependent: '', independent: [], coefficients: [],
      rSquared: 0, adjustedRSquared: 0, fStatistic: 0, fP: 1, n,
    };
  }

  const b1 = (s22 * s1y - s12 * s2y) / det;
  const b2 = (s11 * s2y - s12 * s1y) / det;
  const b0 = my - b1 * mx1 - b2 * mx2;

  const ssRes = y.reduce((acc, yi, i) => acc + (yi - b0 - b1 * x1[i] - b2 * x2[i]) ** 2, 0);
  const r2 = syy > 0 ? 1 - ssRes / syy : 0;
  const adjR2 = 1 - ((1 - r2) * (n - 1)) / (n - 3);

  const mse = ssRes / (n - 3);
  const msr = (syy - ssRes) / 2;
  const fStat = mse > 0 ? msr / mse : 0;

  const sd1 = std(x1);
  const sd2 = std(x2);
  const sdy = std(y);

  const seB1 = Math.sqrt(mse * s22 / det);
  const seB2 = Math.sqrt(mse * s11 / det);

  const tB1 = seB1 > 0 ? b1 / seB1 : 0;
  const tB2 = seB2 > 0 ? b2 / seB2 : 0;

  const pB1 = tDistributionP(Math.abs(tB1), n - 3) * 2;
  const pB2 = tDistributionP(Math.abs(tB2), n - 3) * 2;

  const beta1 = sdy > 0 ? b1 * (sd1 / sdy) : 0;
  const beta2 = sdy > 0 ? b2 * (sd2 / sdy) : 0;

  return {
    dependent: '주관적 행복감',
    independent: ['문화소비', '자기효능감'],
    coefficients: [
      { variable: '(상수)', b: b0, se: 0, beta: 0, t: 0, p: 0 },
      { variable: '문화소비', b: b1, se: seB1, beta: beta1, t: tB1, p: pB1 },
      { variable: '자기효능감', b: b2, se: seB2, beta: beta2, t: tB2, p: pB2 },
    ],
    rSquared: r2,
    adjustedRSquared: adjR2,
    fStatistic: fStat,
    fP: tDistributionP(Math.sqrt(fStat), n - 3) * 2,
    n,
  };
}
