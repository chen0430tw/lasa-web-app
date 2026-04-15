import {
  AccountClass,
  ConfirmLevel,
  Edge,
  Event,
  HBV,
  HyperVector,
  Node,
  SemanticContext,
  TimeTag,
} from "./types";
import { dot, lnVariance, numberFromConfirmLevel, numberFromTimeTag, sigmoid, withDefaultRisk } from "./utils";

export class WCNGraph {
  nodes = new Map<string, Node>();
  edges: Edge[] = [];
}

export class MSNState {
  constructor(public moduloSize: number) {}
  orbitMap = new Map<string, number[]>();
  entropyMap = new Map<string, number>();
}

function hashBucket(text: string, n: number, seed = 0): number[] {
  const arr = Array(n).fill(0) as number[];
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    const idx = (ch + i + seed) % n;
    arr[idx] += ((ch % 13) + 1) / 13;
  }
  return arr;
}

export function encodeLHS(event: Event): HyperVector {
  const risk = withDefaultRisk(event.riskTags).join(",");
  const restriction = event.restrictionHint ?? "";
  const vec: number[] = [];
  vec.push(...hashBucket(`${event.description}${event.rawCategoryHint}`, 8, 1));
  vec.push(...hashBucket(`${event.source}->${event.destination}${event.assetType}`, 8, 2));
  vec.push(Math.min(Math.abs(event.amount) / 10000, 10), event.amount >= 0 ? 1 : -1);
  vec.push(...hashBucket(`${restriction}${risk}`, 4, 3));
  vec.push(
    numberFromTimeTag(event.timeTag ?? TimeTag.EVENT_DRIVEN),
    numberFromConfirmLevel(event.confirmLevel ?? ConfirmLevel.A_CONFIRMED),
  );
  return { values: vec };
}

function similarity(v1: number[], v2: number[]): number {
  return sigmoid(dot(v1, v2) / Math.max(v1.length, 1));
}

export function cosineSimilarity(v1: number[], v2: number[]): number {
  const n = Math.min(v1.length, v2.length);
  let ab = 0;
  let a2 = 0;
  let b2 = 0;
  for (let i = 0; i < n; i++) {
    ab += v1[i] * v2[i];
    a2 += v1[i] * v1[i];
    b2 += v2[i] * v2[i];
  }
  const denom = Math.sqrt(a2) * Math.sqrt(b2);
  return denom === 0 ? 0 : ab / denom;
}

export function updateWCN(graph: WCNGraph, eventId: string, vector: number[]): void {
  graph.nodes.set(eventId, { eventId, vector });
  for (const [otherId, other] of graph.nodes.entries()) {
    if (otherId === eventId) continue;
    const w = similarity(vector, other.vector);
    graph.edges.push({ fromId: eventId, toId: otherId, weight: w });
    graph.edges.push({ fromId: otherId, toId: eventId, weight: w });
  }
}

export function neighborhoodFeatures(graph: WCNGraph, eventId: string): number[] {
  const touching = graph.edges
    .filter((e) => e.fromId === eventId || e.toId === eventId)
    .map((e) => e.weight);
  if (touching.length === 0) return [0, 0, 0, 0];
  const total = touching.reduce((a, b) => a + b, 0);
  const avg = total / touching.length;
  return [total, avg, Math.max(...touching), Math.min(...touching)];
}

function projectToModuloSpace(vector: number[], m: number): number {
  return ((Math.round(vector.reduce((a, b) => a + b, 0) * 10) % m) + m) % m;
}

function buildOrbit(initial: number, localSignature: number[], m: number, gamma: number): number[] {
  const orbit: number[] = [];
  const seen = new Set<number>();
  let cur = initial;
  for (let i = 0; i < 16; i++) {
    orbit.push(cur);
    if (seen.has(cur)) break;
    seen.add(cur);
    const drift = Math.round(localSignature.reduce((a, b) => a + b, 0) * (1 - gamma) * 2);
    cur = (((cur + drift) % m) + m) % m;
  }
  return orbit;
}

function computeEntropy(orbit: number[]): number {
  const freq = new Map<number, number>();
  for (const o of orbit) freq.set(o, (freq.get(o) ?? 0) + 1);
  const total = orbit.length;
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / total;
    entropy -= p * Math.log(p);
  }
  return entropy;
}

export function updateMSN(msn: MSNState, eventId: string, vector: number[], localSignature: number[], gamma: number): void {
  const init = projectToModuloSpace(vector, msn.moduloSize);
  const orbit = buildOrbit(init, localSignature, msn.moduloSize, gamma);
  msn.orbitMap.set(eventId, orbit);
  msn.entropyMap.set(eventId, computeEntropy(orbit));
}

export function buildSemanticContext(event: Event, graph: WCNGraph, msn: MSNState, hbv: HBV): SemanticContext {
  const hv = encodeLHS(event);
  const neighbor = neighborhoodFeatures(graph, event.id);
  const localSignature = [...hv.values, ...neighbor];
  updateMSN(msn, event.id, hv.values, localSignature, hbv.gamma);
  const orbit = msn.orbitMap.get(event.id) ?? [];
  const lhsLnVar = lnVariance(hv.values);
  const neighborLnVar = lnVariance(neighbor);
  const orbitLnVar = lnVariance(orbit.map((x) => Number(x)));
  const totalLnVar = 0.5 * lhsLnVar + 0.25 * neighborLnVar + 0.25 * orbitLnVar;
  return {
    lhsVector: hv.values,
    neighborVector: neighbor,
    orbit,
    orbitEntropy: msn.entropyMap.get(event.id) ?? 0,
    lhsLnVar,
    neighborLnVar,
    orbitLnVar,
    totalLnVar,
    semanticScores: {},
    prototypeSimilarity: {},
  };
}

export function semanticClassScores(event: Event, ctx: SemanticContext): Record<AccountClass, number> {
  const scores = {
    [AccountClass.ASSET]: 0,
    [AccountClass.LIABILITY]: 0,
    [AccountClass.INCOME]: 0,
    [AccountClass.EXPENSE]: 0,
    [AccountClass.TRANSFER]: 0,
    [AccountClass.RESTRICTED]: 0,
    [AccountClass.PENDING]: 0,
    [AccountClass.INTANGIBLE]: 0,
  } as Record<AccountClass, number>;

  const desc = `${event.description} ${event.rawCategoryHint}`.toLowerCase();
  const amt = Math.abs(event.amount);

  if (["salary", "payroll", "commission", "revenue", "grant release", "license"].some((k) => desc.includes(k))) scores[AccountClass.INCOME] += 1;
  if (["expense", "lunch", "buy", "penalty", "interest", "donation out"].some((k) => desc.includes(k))) scores[AccountClass.EXPENSE] += 1;
  if (["borrowed", "loan", "repay"].some((k) => desc.includes(k))) scores[AccountClass.LIABILITY] += 1;
  if (["restricted", "foundation grant", "political donation in"].some((k) => desc.includes(k))) scores[AccountClass.RESTRICTED] += 1;
  if (["refund", "reimbursement", "transfer"].some((k) => desc.includes(k))) scores[AccountClass.TRANSFER] += 1;
  if (["speculative", "valuation", "ip value"].some((k) => desc.includes(k))) scores[AccountClass.INTANGIBLE] += 1;
  if (["risk", "pending", "unclear", "suspicious"].some((k) => desc.includes(k))) scores[AccountClass.PENDING] += 1;

  if (ctx.totalLnVar > 1.2) scores[AccountClass.PENDING] += 0.8;
  else if (ctx.totalLnVar > 0.2) {
    scores[AccountClass.EXPENSE] += 0.2;
    scores[AccountClass.INCOME] += 0.2;
  } else {
    scores[AccountClass.TRANSFER] += 0.2;
    scores[AccountClass.ASSET] += 0.2;
  }

  if (ctx.orbitEntropy > 1.0) scores[AccountClass.PENDING] += 0.5;
  if (amt > 0 && ["goods", "inventory"].includes(event.assetType)) scores[AccountClass.ASSET] += 0.5;
  if (amt > 0 && event.assetType === "tax") {
    scores[AccountClass.EXPENSE] += 0.3;
    scores[AccountClass.PENDING] += 0.2;
  }

  const riskTags = withDefaultRisk(event.riskTags);
  if (riskTags.includes("LEGALLY_SENSITIVE" as any)) scores[AccountClass.PENDING] += 0.5;
  if (riskTags.includes("VALUATION_RISK" as any) || riskTags.includes("LIQUIDITY_RISK" as any)) {
    scores[AccountClass.INTANGIBLE] += 0.5;
    scores[AccountClass.PENDING] += 0.3;
  }

  ctx.semanticScores = scores;
  return scores;
}
