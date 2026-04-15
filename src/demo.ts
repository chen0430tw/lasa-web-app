import { LASAEngine, runLASA } from "./engine";
import { summarizePeriod } from "./state";
import { makeLASAState } from "./utils";
import { Event, RiskTag, SystemMode, TimeTag } from "./types";

const initial = makeLASAState();
initial.assets.cash = 10000;
initial.reserve.emergencyReserve = 1000;

const engine = new LASAEngine(SystemMode.BALANCED, 17, initial);

const events: Event[] = [
  { id: "e1", timestamp: "2026-04-04T09:00:00", amount: 5000, assetType: "cash", source: "employer", destination: "bank", description: "salary", rawCategoryHint: "SALARY_IN", timeTag: TimeTag.PERIODIC },
  { id: "e2", timestamp: "2026-04-04T10:00:00", amount: 1200, assetType: "cash", source: "bank", destination: "store", description: "lunch", rawCategoryHint: "LIVING_EXPENSE", timeTag: TimeTag.ONE_OFF },
  { id: "e3", timestamp: "2026-04-04T11:00:00", amount: 3000, assetType: "cash", source: "bank", destination: "fund", description: "buy fund", rawCategoryHint: "INVESTMENT_BUY", timeTag: TimeTag.ONE_OFF },
  { id: "e4", timestamp: "2026-04-04T12:00:00", amount: 8000, assetType: "cash", source: "gov", destination: "bank", description: "restricted grant", rawCategoryHint: "RESTRICTED_FUND_IN", restrictionHint: "STATE", riskTags: [RiskTag.RESTRICTED_USE], timeTag: TimeTag.EVENT_DRIVEN },
  { id: "e5", timestamp: "2026-04-04T13:00:00", amount: 300, assetType: "cash", source: "merchant", destination: "bank", description: "refund", rawCategoryHint: "REFUND", timeTag: TimeTag.ONE_OFF },
  { id: "e6", timestamp: "2026-04-04T14:00:00", amount: 2000, assetType: "cash", source: "friend", destination: "bank", description: "borrowed", rawCategoryHint: "BORROWED_MONEY_IN", timeTag: TimeTag.TEMPORARY },
  { id: "e7", timestamp: "2026-04-04T15:00:00", amount: 450, assetType: "tax", source: "unknown", destination: "ledger", description: "unclear risky tax issue pending", rawCategoryHint: "UNKNOWN_EVENT", riskTags: [RiskTag.LEGALLY_SENSITIVE, RiskTag.HIGH_RISK], timeTag: TimeTag.EVENT_DRIVEN },
];

const summary = runLASA(engine, events);

console.log(summary);
console.log(summarizePeriod(summary));
console.log("semanticLogSize", engine.semanticLog.size);
console.log("unknownEventScores", engine.semanticLog.get("e7")?.semanticScores);
