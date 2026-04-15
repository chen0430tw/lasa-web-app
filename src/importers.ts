import { ConfirmLevel, Event, RiskTag, TimeTag } from "./types";

function parseRiskTags(raw?: string): RiskTag[] | undefined {
  if (!raw) return undefined;
  return raw.split("|").map((s) => s.trim()).filter(Boolean) as RiskTag[];
}

export function normalizeEvent(event: Event): Event {
  return {
    ...event,
    restrictionHint: event.restrictionHint ?? "",
    timeTag: event.timeTag ?? TimeTag.EVENT_DRIVEN,
    confirmLevel: event.confirmLevel ?? ConfirmLevel.A_CONFIRMED,
    riskTags: event.riskTags ?? [RiskTag.NORMAL],
    extra: event.extra ?? {},
  };
}

export function importEventsFromJSON(input: string): Event[] {
  const data = JSON.parse(input) as Event[];
  return data.map(normalizeEvent);
}

export function importEventsFromCSV(input: string): Event[] {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];
  const headers = lines[0].split(",").map((s) => s.trim());
  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = line.split(",").map((s) => s.trim());
    const row = Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? ""])) as Record<string, string>;
    return normalizeEvent({
      id: row.id,
      timestamp: row.timestamp,
      amount: Number(row.amount),
      assetType: row.assetType,
      source: row.source,
      destination: row.destination,
      description: row.description,
      rawCategoryHint: row.rawCategoryHint,
      restrictionHint: row.restrictionHint || undefined,
      timeTag: (row.timeTag as TimeTag) || undefined,
      confirmLevel: (row.confirmLevel as ConfirmLevel) || undefined,
      riskTags: parseRiskTags(row.riskTags),
      extra: row.extra ? JSON.parse(row.extra) : undefined,
    });
  });
}
