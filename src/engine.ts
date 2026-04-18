import { HBV, LASAState, Event, PeriodSummary, SemanticContext, SystemMode, AccountClass } from "./types";
import { WCNGraph, MSNState, buildSemanticContext, encodeLHS, updateWCN, cosineSimilarity } from "./semantics";
import { applyClassification, settlePeriod } from "./state";
import { makeHBV, cloneState } from "./utils";
import { fallbackSemanticClassifier, tryRuleRegistry } from "./rules";

export class LASAEngine {
  hbv: HBV;
  state: LASAState;
  graph: WCNGraph;
  msn: MSNState;
  semanticLog = new Map<string, SemanticContext>();
  prototypes = new Map<AccountClass, number[]>();

  constructor(mode: SystemMode, moduloSize: number, initialState: LASAState) {
    this.hbv = makeHBV(mode);
    this.state = cloneState(initialState);
    this.graph = new WCNGraph();
    this.msn = new MSNState(moduloSize);
  }
}

function updatePrototype(engine: LASAEngine, accountClass: AccountClass, vector: number[]): void {
  const prev = engine.prototypes.get(accountClass);
  if (!prev) {
    engine.prototypes.set(accountClass, [...vector]);
    return;
  }
  const next = prev.map((x, i) => (x + (vector[i] ?? 0)) / 2);
  engine.prototypes.set(accountClass, next);
}

export function enrichWithPrototypeSimilarity(engine: LASAEngine, ctx: SemanticContext): void {
  const sims: Partial<Record<AccountClass, number>> = {};
  for (const [cls, proto] of engine.prototypes.entries()) {
    sims[cls] = cosineSimilarity(ctx.lhsVector, proto);
  }
  ctx.prototypeSimilarity = sims;
}

export function processEvent(event: Event, engine: LASAEngine): void {
  // 折算为基准币：若事件币种 = 基准币或省略，则 fxRate 默认 1
  // fxRate 必须 > 0；0 / NaN / undefined 均视为未知，降级为 1:1 防止静默入账 0
  const originalAmount = event.amount;
  const baseCcy = engine.state.baseCurrency;
  const sameCcy = !event.currency || event.currency === baseCcy;
  const rawRate = event.fxRate;
  const fxRate = sameCcy ? 1 : (typeof rawRate === "number" && rawRate > 0 ? rawRate : 1);
  const baseAmount = event.amount * fxRate;
  const normalized: Event = { ...event, amount: baseAmount };

  const hv = encodeLHS(normalized);
  updateWCN(engine.graph, normalized.id, hv.values);
  const ctx = buildSemanticContext(normalized, engine.graph, engine.msn, engine.hbv);
  enrichWithPrototypeSimilarity(engine, ctx);
  const result = tryRuleRegistry(normalized, ctx) ?? fallbackSemanticClassifier(normalized, ctx);
  applyClassification(engine.state, result, normalized.id, ctx.totalLnVar);
  // 补注原始币种审计信息
  const lastMeta = engine.state.metaLog[engine.state.metaLog.length - 1];
  if (lastMeta && lastMeta.eventId === normalized.id) {
    lastMeta.currency = event.currency ?? baseCcy;
    lastMeta.originalAmount = originalAmount;
    lastMeta.fxRate = fxRate;
    lastMeta.baseAmount = baseAmount;
  }
  updatePrototype(engine, result.accountClass, ctx.lhsVector);
  engine.semanticLog.set(normalized.id, ctx);
}

export function runLASA(engine: LASAEngine, events: Event[]): PeriodSummary {
  const startState = cloneState(engine.state);
  [...events]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .forEach((event) => processEvent(event, engine));
  return settlePeriod(startState, engine.state);
}
