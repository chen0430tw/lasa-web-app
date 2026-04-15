import { ConfirmLevel, HBV, LASAState, RiskTag, SystemMode, TimeTag } from "./types";

export function makeHBV(_mode: SystemMode): HBV {
  return { alpha: 0.3333, beta: 0.3333, gamma: 0.3334 };
}

export function numberFromTimeTag(tag: TimeTag): number {
  switch (tag) {
    case TimeTag.ONE_OFF: return 1;
    case TimeTag.PERIODIC: return 2;
    case TimeTag.LONG_TERM: return 3;
    case TimeTag.TEMPORARY: return 4;
    case TimeTag.EVENT_DRIVEN: return 5;
  }
}

export function numberFromConfirmLevel(level: ConfirmLevel): number {
  switch (level) {
    case ConfirmLevel.A_CONFIRMED: return 1;
    case ConfirmLevel.B_HIGH_CONFIDENCE: return 2;
    case ConfirmLevel.C_TO_VERIFY: return 3;
    case ConfirmLevel.D_NOTE_ONLY: return 4;
  }
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function dot(a: number[], b: number[]): number {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}

export function variance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
}

export function lnVariance(values: number[], eps = 1e-9): number {
  return Math.log(variance(values) + eps);
}

export function makeLASAState(): LASAState {
  return {
    assets: { cash: 0, financial: 0, tradeable: 0, other: 0 },
    liabilities: { shortTerm: 0, pending: 0 },
    income: { regular: 0, grant: 0, tradeRealized: 0, broker: 0, intangibleRealized: 0 },
    expenses: { life: 0, system: 0, debtInterest: 0, tradeLoss: 0, abnormalLoss: 0 },
    restricted: { stateFunds: 0, foundationFunds: 0, politicalFunds: 0, privateFunds: 0 },
    pending: { riskReserve: 0, speculative: 0 },
    intangible: { formal: 0, speculative: 0 },
    reserve: { emergencyReserve: 0 },
    metaLog: [],
  };
}

export function cloneState<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function withDefaultRisk(tags?: RiskTag[]): RiskTag[] {
  return tags && tags.length > 0 ? tags : [RiskTag.NORMAL];
}
