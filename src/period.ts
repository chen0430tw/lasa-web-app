import { LASAState, PeriodSummary } from "./types";
import { cloneState } from "./utils";
import { settlePeriod } from "./state";

export interface Period {
  id: string;
  label: string;
  openedAt: string;
  closedAt?: string;
  startSnapshot: LASAState;
  endSnapshot?: LASAState;
  summary?: PeriodSummary;
}

export class PeriodManager {
  private periods: Period[] = [];
  private currentId: string | null = null;

  open(id: string, label: string, currentState: LASAState): void {
    if (this.currentId !== null) {
      throw new Error(`Period "${this.currentId}" is still open. Close it before opening a new one.`);
    }
    this.periods.push({
      id,
      label,
      openedAt: new Date().toISOString(),
      startSnapshot: cloneState(currentState),
    });
    this.currentId = id;
  }

  close(currentState: LASAState): Period {
    if (this.currentId === null) {
      throw new Error("No open period.");
    }
    const p = this.periods.find((x) => x.id === this.currentId)!;
    p.closedAt = new Date().toISOString();
    p.endSnapshot = cloneState(currentState);
    p.summary = settlePeriod(p.startSnapshot, currentState);
    this.currentId = null;
    return p;
  }

  current(): Period | null {
    if (this.currentId === null) return null;
    return this.periods.find((x) => x.id === this.currentId) ?? null;
  }

  list(): Period[] {
    return [...this.periods];
  }

  isOpen(): boolean {
    return this.currentId !== null;
  }

  reset(): void {
    this.periods = [];
    this.currentId = null;
  }
}
