import { AccountClass, ClassificationResult, LASAState, RiskTag } from "./types";
import { makeResult, applyClassification } from "./state";

export interface PendingItem {
  eventId: string;
  amount: number;
  riskTags: RiskTag[];
  note: string;
  registeredAt: string;
}

export class PendingConfirmManager {
  private items = new Map<string, PendingItem>();

  register(item: Omit<PendingItem, "registeredAt">): void {
    this.items.set(item.eventId, { ...item, registeredAt: new Date().toISOString() });
  }

  // Confirm pending item: reduce risk reserve, apply to target class
  confirm(state: LASAState, eventId: string, targetClass: AccountClass): void {
    const item = this.items.get(eventId);
    if (!item) throw new Error(`Pending item "${eventId}" not found.`);
    const { amount, riskTags } = item;

    let patch: Partial<ClassificationResult> = { dPendingRiskReserve: -amount };

    switch (targetClass) {
      case AccountClass.INCOME:
        patch = { ...patch, dIncomeRegular: amount };
        break;
      case AccountClass.ASSET:
        patch = { ...patch, dOther: amount };
        break;
      case AccountClass.LIABILITY:
        patch = { ...patch, dLiabilityPending: amount };
        break;
      case AccountClass.EXPENSE:
        patch = { ...patch, dExpenseAbnormalLoss: amount };
        break;
      case AccountClass.RESTRICTED:
        patch = { ...patch, dRestrictedPrivate: amount };
        break;
      default:
        throw new Error(`Cannot confirm to class ${targetClass}.`);
    }

    applyClassification(state, makeResult(targetClass, riskTags, patch), `confirm:${eventId}`, 0);
    this.items.delete(eventId);
  }

  // Release pending item as abnormal loss (write-off)
  release(state: LASAState, eventId: string): void {
    const item = this.items.get(eventId);
    if (!item) throw new Error(`Pending item "${eventId}" not found.`);
    const { amount, riskTags } = item;
    applyClassification(
      state,
      makeResult(AccountClass.EXPENSE, riskTags, {
        dExpenseAbnormalLoss: amount,
        dPendingRiskReserve: -amount,
      }),
      `release:${eventId}`,
      0,
    );
    this.items.delete(eventId);
  }

  list(): PendingItem[] {
    return Array.from(this.items.values());
  }

  get size(): number {
    return this.items.size;
  }

  reset(): void {
    this.items.clear();
  }
}
