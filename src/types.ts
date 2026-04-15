export enum AccountClass {
  ASSET = "ASSET",
  LIABILITY = "LIABILITY",
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
  RESTRICTED = "RESTRICTED",
  PENDING = "PENDING",
  INTANGIBLE = "INTANGIBLE",
}

export enum TimeTag {
  ONE_OFF = "ONE_OFF",
  PERIODIC = "PERIODIC",
  LONG_TERM = "LONG_TERM",
  TEMPORARY = "TEMPORARY",
  EVENT_DRIVEN = "EVENT_DRIVEN",
}

export enum ConfirmLevel {
  A_CONFIRMED = "A_CONFIRMED",
  B_HIGH_CONFIDENCE = "B_HIGH_CONFIDENCE",
  C_TO_VERIFY = "C_TO_VERIFY",
  D_NOTE_ONLY = "D_NOTE_ONLY",
}

export enum RiskTag {
  NORMAL = "NORMAL",
  RESTRICTED_USE = "RESTRICTED_USE",
  LEGALLY_SENSITIVE = "LEGALLY_SENSITIVE",
  VALUATION_RISK = "VALUATION_RISK",
  LIQUIDITY_RISK = "LIQUIDITY_RISK",
  HIGH_RISK = "HIGH_RISK",
  ABNORMAL_SOURCE = "ABNORMAL_SOURCE",
  PENDING_REVIEW = "PENDING_REVIEW",
}

export enum SystemMode {
  BALANCED = "BALANCED",
}

export interface HBV {
  alpha: number;
  beta: number;
  gamma: number;
}

export interface Event {
  id: string;
  timestamp: string;
  amount: number;
  assetType: string;
  source: string;
  destination: string;
  description: string;
  rawCategoryHint: string;
  restrictionHint?: string;
  timeTag?: TimeTag;
  confirmLevel?: ConfirmLevel;
  riskTags?: RiskTag[];
  extra?: Record<string, number>;
}

export interface HyperVector {
  values: number[];
}

export interface Node {
  eventId: string;
  vector: number[];
}

export interface Edge {
  fromId: string;
  toId: string;
  weight: number;
}

export interface SemanticContext {
  lhsVector: number[];
  neighborVector: number[];
  orbit: number[];
  orbitEntropy: number;
  lhsLnVar: number;
  neighborLnVar: number;
  orbitLnVar: number;
  totalLnVar: number;
  semanticScores: Partial<Record<AccountClass, number>>;
  prototypeSimilarity: Partial<Record<AccountClass, number>>;
}

export interface AssetState {
  cash: number;
  financial: number;
  tradeable: number;
  other: number;
}

export interface LiabilityState {
  shortTerm: number;
  pending: number;
}

export interface IncomeState {
  regular: number;
  grant: number;
  tradeRealized: number;
  broker: number;
  intangibleRealized: number;
}

export interface ExpenseState {
  life: number;
  system: number;
  debtInterest: number;
  tradeLoss: number;
  abnormalLoss: number;
}

export interface RestrictedState {
  stateFunds: number;
  foundationFunds: number;
  politicalFunds: number;
  privateFunds: number;
}

export interface PendingState {
  riskReserve: number;
  speculative: number;
}

export interface IntangibleState {
  formal: number;
  speculative: number;
}

export interface ReserveState {
  emergencyReserve: number;
}

export interface MetaRecord {
  eventId: string;
  accountClass: AccountClass;
  riskTags: RiskTag[];
  totalLnVar: number;
}

export interface LASAState {
  assets: AssetState;
  liabilities: LiabilityState;
  income: IncomeState;
  expenses: ExpenseState;
  restricted: RestrictedState;
  pending: PendingState;
  intangible: IntangibleState;
  reserve: ReserveState;
  metaLog: MetaRecord[];
}

export interface ClassificationResult {
  accountClass: AccountClass;
  dCash: number;
  dFinancial: number;
  dTradeable: number;
  dOther: number;
  dLiabilityShort: number;
  dLiabilityPending: number;
  dIncomeRegular: number;
  dIncomeGrant: number;
  dIncomeTrade: number;
  dIncomeBroker: number;
  dIncomeIntangible: number;
  dExpenseLife: number;
  dExpenseSystem: number;
  dExpenseDebtInterest: number;
  dExpenseTradeLoss: number;
  dExpenseAbnormalLoss: number;
  dRestrictedState: number;
  dRestrictedFoundation: number;
  dRestrictedPolitical: number;
  dRestrictedPrivate: number;
  dPendingRiskReserve: number;
  dPendingSpeculative: number;
  dIntangibleFormal: number;
  dIntangibleSpeculative: number;
  dEmergencyReserve: number;
  riskTags: RiskTag[];
}

export interface PeriodSummary {
  totalIncome: number;
  totalExpense: number;
  operatingResult: number;
  totalAssets: number;
  totalLiabilities: number;
  freeNetAssets: number;
  freeNetAssetChange: number;
}

export type RuleFunc = (event: Event, ctx: SemanticContext) => ClassificationResult;
