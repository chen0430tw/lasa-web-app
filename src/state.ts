import { AccountClass, ClassificationResult, LASAState, MetaRecord, PeriodSummary } from "./types";

export function makeResult(
  accountClass: AccountClass,
  riskTags: ClassificationResult["riskTags"],
  patch: Partial<ClassificationResult> = {},
): ClassificationResult {
  return {
    accountClass,
    dCash: 0,
    dFinancial: 0,
    dTradeable: 0,
    dOther: 0,
    dLiabilityShort: 0,
    dLiabilityPending: 0,
    dIncomeRegular: 0,
    dIncomeGrant: 0,
    dIncomeTrade: 0,
    dIncomeBroker: 0,
    dIncomeIntangible: 0,
    dExpenseLife: 0,
    dExpenseSystem: 0,
    dExpenseDebtInterest: 0,
    dExpenseTradeLoss: 0,
    dExpenseAbnormalLoss: 0,
    dRestrictedState: 0,
    dRestrictedFoundation: 0,
    dRestrictedPolitical: 0,
    dRestrictedPrivate: 0,
    dPendingRiskReserve: 0,
    dPendingSpeculative: 0,
    dIntangibleFormal: 0,
    dIntangibleSpeculative: 0,
    dEmergencyReserve: 0,
    riskTags,
    ...patch,
  };
}

export function totalAssets(state: LASAState): number {
  return state.assets.cash + state.assets.financial + state.assets.tradeable + state.assets.other + state.intangible.formal;
}
export function totalLiabilities(state: LASAState): number {
  return state.liabilities.shortTerm + state.liabilities.pending;
}
export function totalRestricted(state: LASAState): number {
  return state.restricted.stateFunds + state.restricted.foundationFunds + state.restricted.politicalFunds + state.restricted.privateFunds;
}
export function totalIncome(state: LASAState): number {
  return state.income.regular + state.income.grant + state.income.tradeRealized + state.income.broker + state.income.intangibleRealized;
}
export function totalExpense(state: LASAState): number {
  return state.expenses.life + state.expenses.system + state.expenses.debtInterest + state.expenses.tradeLoss + state.expenses.abnormalLoss;
}
export function freeNetAssets(state: LASAState): number {
  return totalAssets(state) - totalLiabilities(state) - totalRestricted(state) - state.reserve.emergencyReserve;
}

export function applyClassification(state: LASAState, result: ClassificationResult, eventId: string, totalLnVarValue: number): void {
  state.assets.cash += result.dCash;
  state.assets.financial += result.dFinancial;
  state.assets.tradeable += result.dTradeable;
  state.assets.other += result.dOther;
  state.liabilities.shortTerm += result.dLiabilityShort;
  state.liabilities.pending += result.dLiabilityPending;
  state.income.regular += result.dIncomeRegular;
  state.income.grant += result.dIncomeGrant;
  state.income.tradeRealized += result.dIncomeTrade;
  state.income.broker += result.dIncomeBroker;
  state.income.intangibleRealized += result.dIncomeIntangible;
  state.expenses.life += result.dExpenseLife;
  state.expenses.system += result.dExpenseSystem;
  state.expenses.debtInterest += result.dExpenseDebtInterest;
  state.expenses.tradeLoss += result.dExpenseTradeLoss;
  state.expenses.abnormalLoss += result.dExpenseAbnormalLoss;
  state.restricted.stateFunds += result.dRestrictedState;
  state.restricted.foundationFunds += result.dRestrictedFoundation;
  state.restricted.politicalFunds += result.dRestrictedPolitical;
  state.restricted.privateFunds += result.dRestrictedPrivate;
  state.pending.riskReserve += result.dPendingRiskReserve;
  state.pending.speculative += result.dPendingSpeculative;
  state.intangible.formal += result.dIntangibleFormal;
  state.intangible.speculative += result.dIntangibleSpeculative;
  state.reserve.emergencyReserve += result.dEmergencyReserve;
  state.metaLog.push({
    eventId,
    accountClass: result.accountClass,
    riskTags: result.riskTags,
    totalLnVar: totalLnVarValue,
  });
}

export function settlePeriod(startState: LASAState, endState: LASAState): PeriodSummary {
  return {
    totalIncome: totalIncome(endState) - totalIncome(startState),
    totalExpense: totalExpense(endState) - totalExpense(startState),
    operatingResult: (totalIncome(endState) - totalIncome(startState)) - (totalExpense(endState) - totalExpense(startState)),
    totalAssets: totalAssets(endState),
    totalLiabilities: totalLiabilities(endState),
    freeNetAssets: freeNetAssets(endState),
    freeNetAssetChange: freeNetAssets(endState) - freeNetAssets(startState),
  };
}

export function summarizePeriod(summary: PeriodSummary): string {
  const status = summary.operatingResult > 0 ? "盈余" : summary.operatingResult < 0 ? "赤字" : "收支平衡";
  return `这个周期收入 ${summary.totalIncome.toFixed(2)}，支出 ${summary.totalExpense.toFixed(2)}，结果 ${status}。自由净资产变化 ${summary.freeNetAssetChange.toFixed(2)}。`;
}
