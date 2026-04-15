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
  const hv = encodeLHS(event);
  updateWCN(engine.graph, event.id, hv.values);
  const ctx = buildSemanticContext(event, engine.graph, engine.msn, engine.hbv);
  enrichWithPrototypeSimilarity(engine, ctx);
  const result = tryRuleRegistry(event, ctx) ?? fallbackSemanticClassifier(event, ctx);
  applyClassification(engine.state, result, event.id, ctx.totalLnVar);
  updatePrototype(engine, result.accountClass, ctx.lhsVector);
  engine.semanticLog.set(event.id, ctx);
}

export function runLASA(engine: LASAEngine, events: Event[]): PeriodSummary {
  const startState = cloneState(engine.state);
  [...events]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .forEach((event) => processEvent(event, engine));
  return settlePeriod(startState, engine.state);
}
