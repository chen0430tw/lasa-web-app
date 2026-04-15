import { AccountClass, ClassificationResult, Event, RiskTag, RuleFunc, SemanticContext } from "./types";
import { makeResult } from "./state";
import { semanticClassScores } from "./semantics";
import { withDefaultRisk } from "./utils";

const risks = (event: Event) => withDefaultRisk(event.riskTags);

export const routeSalaryIn: RuleFunc = (event) =>
  makeResult(AccountClass.INCOME, risks(event), { dCash: event.amount, dIncomeRegular: event.amount });

export const routeLivingExpense: RuleFunc = (event) =>
  makeResult(AccountClass.EXPENSE, risks(event), { dCash: -event.amount, dExpenseLife: event.amount });

export const routeInvestmentBuy: RuleFunc = (event) =>
  makeResult(AccountClass.TRANSFER, risks(event), { dCash: -event.amount, dFinancial: event.amount });

export const routeRefund: RuleFunc = (event) =>
  makeResult(AccountClass.TRANSFER, risks(event), { dCash: event.amount, dExpenseLife: -event.amount });

export const routeRestrictedFundIn: RuleFunc = (event) =>
  makeResult(AccountClass.RESTRICTED, risks(event), {
    dCash: event.amount,
    dRestrictedState: (event.restrictionHint ?? "").toUpperCase() === "STATE" ? event.amount : 0,
    dRestrictedPrivate: (event.restrictionHint ?? "").toUpperCase() !== "STATE" ? event.amount : 0,
  });

export const routeBorrowedMoneyIn: RuleFunc = (event) =>
  makeResult(AccountClass.LIABILITY, risks(event), { dCash: event.amount, dLiabilityShort: event.amount });

export const routePrepaidOnBehalf: RuleFunc = (event) =>
  makeResult(AccountClass.ASSET, risks(event), { dCash: -event.amount, dOther: event.amount });

export const routeReimbursementReceived: RuleFunc = (event) =>
  makeResult(AccountClass.TRANSFER, risks(event), { dCash: event.amount, dOther: -event.amount });

export const routeBrokerCommission: RuleFunc = (event) =>
  makeResult(AccountClass.INCOME, risks(event), { dCash: event.amount, dIncomeBroker: event.amount });

export const routeTradeableAssetBuy: RuleFunc = (event) =>
  makeResult(AccountClass.ASSET, risks(event), { dCash: -event.amount, dTradeable: event.amount });

export const routeTradeableAssetSellGain: RuleFunc = (event) => {
  const cost = Number(event.extra?.cost ?? 0);
  const gain = Math.max(event.amount - cost, 0);
  return makeResult(AccountClass.INCOME, risks(event), { dCash: event.amount, dTradeable: -cost, dIncomeTrade: gain });
};

export const routeIntangibleLicenseRevenue: RuleFunc = (event) =>
  makeResult(AccountClass.INCOME, risks(event), { dCash: event.amount, dIncomeIntangible: event.amount });

export const routeDebtInterest: RuleFunc = (event) =>
  makeResult(AccountClass.EXPENSE, risks(event), { dCash: -event.amount, dExpenseDebtInterest: event.amount });

export const routeRestrictedReleaseToGrant: RuleFunc = (event) =>
  makeResult(AccountClass.INCOME, risks(event), {
    dIncomeGrant: event.amount,
    dRestrictedState: (event.restrictionHint ?? "").toUpperCase() === "STATE" ? -event.amount : 0,
  });

export const routeFoundationGrantIn: RuleFunc = (event) =>
  makeResult(AccountClass.RESTRICTED, risks(event), { dCash: event.amount, dRestrictedFoundation: event.amount });

export const routeFoundationPayroll: RuleFunc = (event) =>
  makeResult(AccountClass.INCOME, risks(event), { dCash: event.amount, dIncomeRegular: event.amount });

export const routePoliticalDonationOut: RuleFunc = (event) =>
  makeResult(AccountClass.EXPENSE, risks(event), { dCash: -event.amount, dExpenseSystem: event.amount });

export const routePoliticalDonationIn: RuleFunc = (event) =>
  makeResult(AccountClass.RESTRICTED, risks(event), { dCash: event.amount, dRestrictedPolitical: event.amount });

export const routeTaxOptimizationLegal: RuleFunc = (event) =>
  makeResult(AccountClass.EXPENSE, risks(event), { dExpenseDebtInterest: -event.amount });

export const routeTaxRiskPending: RuleFunc = (event) =>
  makeResult(AccountClass.PENDING, risks(event), { dPendingRiskReserve: event.amount });

export const routeTaxPenalty: RuleFunc = (event) =>
  makeResult(AccountClass.EXPENSE, risks(event), { dCash: -event.amount, dExpenseAbnormalLoss: event.amount });

export const routeIntangibleSpeculativeValue: RuleFunc = (event) =>
  makeResult(AccountClass.INTANGIBLE, risks(event), { dPendingSpeculative: event.amount, dIntangibleSpeculative: event.amount });

// Repay borrowed money: cash out, liability reduced
export const routeDebtRepay: RuleFunc = (event) =>
  makeResult(AccountClass.LIABILITY, risks(event), {
    dCash: -event.amount,
    dLiabilityShort: -event.amount,
  });

// Sell tradeable asset at a loss
export const routeTradeableAssetSellLoss: RuleFunc = (event) => {
  const cost = Number(event.extra?.cost ?? 0);
  const loss = Math.max(cost - event.amount, 0);
  return makeResult(AccountClass.EXPENSE, risks(event), {
    dCash: event.amount,
    dTradeable: -cost,
    dExpenseTradeLoss: loss,
  });
};

// Abnormal loss: theft, damage, write-off
export const routeAbnormalLoss: RuleFunc = (event) =>
  makeResult(AccountClass.EXPENSE, [RiskTag.HIGH_RISK, ...risks(event)], {
    dCash: -event.amount,
    dExpenseAbnormalLoss: event.amount,
  });

// Formal recognition of intangible asset (speculative → formal)
export const routeIntangibleFormalRecognition: RuleFunc = (event) =>
  makeResult(AccountClass.INTANGIBLE, risks(event), {
    dIntangibleFormal: event.amount,
    dIntangibleSpeculative: -event.amount,
  });

// Contribute to emergency reserve
export const routeEmergencyReserveContrib: RuleFunc = (event) =>
  makeResult(AccountClass.ASSET, risks(event), {
    dCash: -event.amount,
    dEmergencyReserve: event.amount,
  });

// Release emergency reserve back to cash
export const routeEmergencyReserveRelease: RuleFunc = (event) =>
  makeResult(AccountClass.ASSET, risks(event), {
    dCash: event.amount,
    dEmergencyReserve: -event.amount,
  });

// Release foundation restricted funds as grant income
export const routeRestrictedReleaseFoundation: RuleFunc = (event) =>
  makeResult(AccountClass.INCOME, risks(event), {
    dIncomeGrant: event.amount,
    dRestrictedFoundation: -event.amount,
  });

// Release private restricted funds as grant income
export const routeRestrictedReleasePrivate: RuleFunc = (event) =>
  makeResult(AccountClass.INCOME, risks(event), {
    dIncomeGrant: event.amount,
    dRestrictedPrivate: -event.amount,
  });

// Points / credits top-up: cash out, intangible formal (redeemable value) in
export const routePointTopup: RuleFunc = (event) =>
  makeResult(AccountClass.ASSET, risks(event), {
    dCash: -event.amount,
    dIntangibleFormal: event.amount,
  });

// Points / credits consumed as expense
export const routePointConsume: RuleFunc = (event) =>
  makeResult(AccountClass.EXPENSE, risks(event), {
    dIntangibleFormal: -event.amount,
    dExpenseLife: event.amount,
  });

// Security deposit paid out: cash out, other asset (receivable) in
export const routeDepositIn: RuleFunc = (event) =>
  makeResult(AccountClass.ASSET, risks(event), {
    dCash: -event.amount,
    dOther: event.amount,
  });

// Security deposit returned: other asset out, cash in
export const routeDepositReturn: RuleFunc = (event) =>
  makeResult(AccountClass.TRANSFER, risks(event), {
    dCash: event.amount,
    dOther: -event.amount,
  });

// Disputed / unverified receipt: cash in, liability pending (may return) + risk reserve note
export const routeDisputedReceipt: RuleFunc = (event) =>
  makeResult(AccountClass.PENDING, [RiskTag.PENDING_REVIEW, RiskTag.ABNORMAL_SOURCE], {
    dCash: event.amount,
    dLiabilityPending: event.amount,
    dPendingRiskReserve: event.amount,
  });

export const routeDefaultPending: RuleFunc = (event) =>
  makeResult(AccountClass.PENDING, risks(event), { dPendingSpeculative: 0 });

export const RULE_REGISTRY: Record<string, RuleFunc> = {
  SALARY_IN: routeSalaryIn,
  LIVING_EXPENSE: routeLivingExpense,
  INVESTMENT_BUY: routeInvestmentBuy,
  REFUND: routeRefund,
  RESTRICTED_FUND_IN: routeRestrictedFundIn,
  BORROWED_MONEY_IN: routeBorrowedMoneyIn,
  PREPAID_ON_BEHALF: routePrepaidOnBehalf,
  REIMBURSEMENT_RECEIVED: routeReimbursementReceived,
  BROKER_COMMISSION: routeBrokerCommission,
  TRADEABLE_ASSET_BUY: routeTradeableAssetBuy,
  TRADEABLE_ASSET_SELL_GAIN: routeTradeableAssetSellGain,
  INTANGIBLE_LICENSE_REVENUE: routeIntangibleLicenseRevenue,
  DEBT_INTEREST: routeDebtInterest,
  RESTRICTED_RELEASE_TO_GRANT: routeRestrictedReleaseToGrant,
  FOUNDATION_GRANT_IN: routeFoundationGrantIn,
  FOUNDATION_PAYROLL: routeFoundationPayroll,
  POLITICAL_DONATION_OUT: routePoliticalDonationOut,
  POLITICAL_DONATION_IN: routePoliticalDonationIn,
  TAX_OPTIMIZATION_LEGAL: routeTaxOptimizationLegal,
  TAX_RISK_PENDING: routeTaxRiskPending,
  TAX_PENALTY: routeTaxPenalty,
  INTANGIBLE_SPECULATIVE_VALUE: routeIntangibleSpeculativeValue,
  DEBT_REPAY: routeDebtRepay,
  TRADEABLE_ASSET_SELL_LOSS: routeTradeableAssetSellLoss,
  ABNORMAL_LOSS: routeAbnormalLoss,
  INTANGIBLE_FORMAL_RECOGNITION: routeIntangibleFormalRecognition,
  EMERGENCY_RESERVE_CONTRIB: routeEmergencyReserveContrib,
  EMERGENCY_RESERVE_RELEASE: routeEmergencyReserveRelease,
  RESTRICTED_RELEASE_FOUNDATION: routeRestrictedReleaseFoundation,
  RESTRICTED_RELEASE_PRIVATE: routeRestrictedReleasePrivate,
  POINT_TOPUP: routePointTopup,
  POINT_CONSUME: routePointConsume,
  DEPOSIT_IN: routeDepositIn,
  DEPOSIT_RETURN: routeDepositReturn,
  DISPUTED_RECEIPT: routeDisputedReceipt,
};

export function semanticAdjustResult(event: Event, result: ClassificationResult, ctx: SemanticContext): ClassificationResult {
  const unstable = ctx.totalLnVar > 1.2;
  const highEntropy = ctx.orbitEntropy > 1.0;
  const riskTags = withDefaultRisk(event.riskTags);
  const legallySensitive = riskTags.includes(RiskTag.LEGALLY_SENSITIVE);
  const abnormal = riskTags.includes(RiskTag.ABNORMAL_SOURCE) || riskTags.includes(RiskTag.HIGH_RISK);

  if (unstable && ![AccountClass.RESTRICTED, AccountClass.LIABILITY].includes(result.accountClass)) {
    result.dPendingRiskReserve += Math.min(Math.abs(event.amount) * 0.05, Math.abs(event.amount));
  }
  if (highEntropy && [AccountClass.INCOME, AccountClass.EXPENSE].includes(result.accountClass)) {
    result.dPendingRiskReserve += Math.min(Math.abs(event.amount) * 0.03, Math.abs(event.amount));
  }
  if (legallySensitive || abnormal) {
    result.dPendingRiskReserve += Math.min(Math.abs(event.amount) * 0.10, Math.abs(event.amount));
  }
  return result;
}

export function tryRuleRegistry(event: Event, ctx: SemanticContext): ClassificationResult | null {
  const func = RULE_REGISTRY[event.rawCategoryHint];
  if (!func) return null;
  return semanticAdjustResult(event, func(event, ctx), ctx);
}

export function fallbackSemanticClassifier(event: Event, ctx: SemanticContext): ClassificationResult {
  const scores = semanticClassScores(event, ctx);
  const prototype = ctx.prototypeSimilarity ?? {};
  for (const [cls, sim] of Object.entries(prototype)) {
    scores[cls as AccountClass] = (scores[cls as AccountClass] ?? 0) + (sim ?? 0) * 0.6;
  }

  const cls = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as AccountClass;
  const amt = event.amount;

  if (cls === AccountClass.INCOME) return semanticAdjustResult(event, makeResult(AccountClass.INCOME, risks(event), { dCash: amt, dIncomeRegular: amt }), ctx);
  if (cls === AccountClass.EXPENSE) return semanticAdjustResult(event, makeResult(AccountClass.EXPENSE, risks(event), { dCash: -amt, dExpenseLife: amt }), ctx);
  if (cls === AccountClass.LIABILITY) return semanticAdjustResult(event, makeResult(AccountClass.LIABILITY, risks(event), { dCash: amt, dLiabilityPending: amt }), ctx);
  if (cls === AccountClass.RESTRICTED) return semanticAdjustResult(event, makeResult(AccountClass.RESTRICTED, risks(event), { dCash: amt, dRestrictedPrivate: amt }), ctx);
  if (cls === AccountClass.TRANSFER) return semanticAdjustResult(event, makeResult(AccountClass.TRANSFER, risks(event), { dCash: amt }), ctx);
  if (cls === AccountClass.ASSET) return semanticAdjustResult(event, makeResult(AccountClass.ASSET, risks(event), { dCash: -amt, dOther: amt }), ctx);
  if (cls === AccountClass.INTANGIBLE) return semanticAdjustResult(event, makeResult(AccountClass.INTANGIBLE, risks(event), { dPendingSpeculative: amt, dIntangibleSpeculative: amt }), ctx);
  return semanticAdjustResult(event, makeResult(AccountClass.PENDING, risks(event), { dPendingRiskReserve: amt }), ctx);
}
