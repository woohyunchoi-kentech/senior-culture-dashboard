import type { MediationResult } from '@/types';
import { simpleRegression, mean, std } from './statistics';

export function mediationAnalysis(
  x: number[], // 독립변수: 문화소비
  m: number[], // 매개변수: 자기효능감
  y: number[], // 종속변수: 행복감
): MediationResult {
  const n = x.length;

  // Step 1: X → Y (총효과, c path)
  const regXY = simpleRegression(x, y);

  // Step 2: X → M (a path)
  const regXM = simpleRegression(x, m);

  // Step 3: X, M → Y (직접효과 c', b path)
  // 간단한 다중회귀: Y = b0 + c'*X + b*M
  const mx = mean(x), mm = mean(m), my = mean(y);
  let sxx = 0, smm = 0, sxm = 0, sxy = 0, smy = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dm = m[i] - mm;
    const dy = y[i] - my;
    sxx += dx * dx;
    smm += dm * dm;
    sxm += dx * dm;
    sxy += dx * dy;
    smy += dm * dy;
    syy += dy * dy;
  }

  const det = sxx * smm - sxm * sxm;
  let cPrime = 0, bCoeff = 0;
  if (det !== 0) {
    cPrime = (smm * sxy - sxm * smy) / det;
    bCoeff = (sxx * smy - sxm * sxy) / det;
  }
  const b0 = my - cPrime * mx - bCoeff * mm;

  const ssRes = y.reduce((acc, yi, i) => acc + (yi - b0 - cPrime * x[i] - bCoeff * m[i]) ** 2, 0);
  const mse = ssRes / (n - 3);

  const seCPrime = det > 0 ? Math.sqrt(mse * smm / det) : 0;
  const seBCoeff = det > 0 ? Math.sqrt(mse * sxx / det) : 0;

  const tCPrime = seCPrime > 0 ? cPrime / seCPrime : 0;
  const tBCoeff = seBCoeff > 0 ? bCoeff / seBCoeff : 0;

  // 간접효과: a * b
  const a = regXM.slope;
  const b = bCoeff;
  const indirectEffect = a * b;
  const totalEffect = regXY.slope;
  const directEffect = cPrime;

  // Sobel 검정
  const seA = regXM.se;
  const seB = seBCoeff;
  const sobelSE = Math.sqrt(a * a * seB * seB + b * b * seA * seA);
  const sobelZ = sobelSE > 0 ? indirectEffect / sobelSE : 0;
  // Normal distribution approximation for p-value
  const sobelP = 2 * (1 - normalCDF(Math.abs(sobelZ)));

  const proportionMediated = totalEffect !== 0 ? indirectEffect / totalEffect : 0;

  return {
    totalEffect,
    directEffect,
    indirectEffect,
    aPath: { coeff: a, se: seA, t: regXM.t, p: regXM.p },
    bPath: { coeff: b, se: seB, t: tBCoeff, p: pFromT(Math.abs(tBCoeff), n - 3) },
    cPath: { coeff: totalEffect, se: regXY.se, t: regXY.t, p: regXY.p },
    cPrimePath: { coeff: directEffect, se: seCPrime, t: tCPrime, p: pFromT(Math.abs(tCPrime), n - 3) },
    sobelZ,
    sobelP,
    proportionMediated,
  };
}

function normalCDF(x: number): number {
  // Abramowitz and Stegun 7.1.26 approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

function pFromT(t: number, df: number): number {
  // Use normal approximation for large df
  if (df > 30) {
    return 2 * (1 - normalCDF(t));
  }
  // For small df, approximate with adjusted normal
  const adjustedT = t * (1 - 1 / (4 * df));
  return 2 * (1 - normalCDF(adjustedT));
}
