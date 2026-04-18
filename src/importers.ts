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

// ── CSV 工具 ──────────────────────────────────────────────────────────────────

/** 自动检测分隔符（逗号 / 分号 / Tab） */
function detectSep(line: string): string {
  const counts = { ",": 0, ";": 0, "\t": 0 };
  for (const ch of line) if (ch in counts) counts[ch as keyof typeof counts]++;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

/** 解析单行 CSV，处理引号包裹字段 */
function parseCsvLine(line: string, sep: string): string[] {
  const cols: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === sep && !inQ) {
      cols.push(cur.trim()); cur = "";
    } else {
      cur += ch;
    }
  }
  cols.push(cur.trim());
  return cols;
}

/** 列名模糊映射（支持中英文别名） */
const COL_ALIASES: Record<string, string[]> = {
  id:              ["id", "编号", "流水号", "序号", "transaction_id", "txid"],
  timestamp:       ["timestamp", "时间", "日期", "交易时间", "交易日期", "date", "datetime", "time"],
  amount:          ["amount", "金额", "交易金额", "发生额", "收支金额", "价格", "price"],
  currency:        ["currency", "ccy", "币种", "货币", "币别", "货币代码"],
  fxRate:          ["fxrate", "fx_rate", "rate", "汇率", "兑换率"],
  assetType:       ["assettype", "asset_type", "资产类型", "类型"],
  source:          ["source", "来源", "付款方", "转入方", "对方户名", "from"],
  destination:     ["destination", "目的地", "收款方", "转出方", "对方账户", "to", "商家", "merchant"],
  description:     ["description", "描述", "备注", "摘要", "用途", "交易说明", "附言", "memo", "remark", "note", "details"],
  rawCategoryHint: ["rawcategoryhint", "raw_category_hint", "规则", "分类", "分类规则", "hint", "category", "类别"],
  restrictionHint: ["restrictionhint", "restriction_hint", "受限", "restriction"],
  timeTag:         ["timetag", "time_tag", "时间标签"],
  riskTags:        ["risktags", "risk_tags", "风险标签", "风险"],
};

function mapHeader(h: string): string {
  const key = h.toLowerCase().replace(/[\s_\-]/g, "");
  for (const [field, aliases] of Object.entries(COL_ALIASES)) {
    if (aliases.some(a => a.toLowerCase().replace(/[\s_\-]/g, "") === key)) return field;
  }
  return h; // 原样保留，不认识的列名
}

/** 解析各种日期格式为 ISO 字符串 */
function parseDate(s: string): string {
  if (!s) return new Date().toISOString();
  // 已经是 ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.includes("T") ? s : s + "T00:00:00";
  // 2026/04/01、2026.04.01
  const m1 = s.match(/(\d{4})[\/.](\d{1,2})[\/.](\d{1,2})/);
  if (m1) return `${m1[1]}-${m1[2].padStart(2,"0")}-${m1[3].padStart(2,"0")}T00:00:00`;
  // DD/MM/YYYY or MM/DD/YYYY
  // 若第一段 > 12，必为 DD（DD/MM/YYYY）；否则默认 MM/DD/YYYY（国际通用）
  const m2 = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m2) {
    const [, a, b, yr] = m2;
    const [mm, dd] = Number(a) > 12 ? [b, a] : [a, b];
    return `${yr}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}T00:00:00`;
  }
  // 尝试 Date.parse 兜底
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function importEventsFromCSV(input: string): Event[] {
  // 预处理：消除货币金额中的千位逗号（如 ¥12,000.00 → ¥12000.00）
  // 匹配模式：货币符号或负号后跟数字，再跟 ,三位数字 的重复，避免把字段分隔符误删
  const preprocessed = input.replace(/([-¥$￥€£]\d[\d,]*\.\d+)/g, (m) => m.replace(/,/g, ""))
                             .replace(/([¥$￥€£])(\d{1,3})(,\d{3})+/g, (m) => m.replace(/,/g, ""));
  const lines = preprocessed.trim().split(/\r?\n/).filter(l => l.trim());
  if (lines.length <= 1) return [];

  const sep = detectSep(lines[0]);

  // 找真正的表头行：含分隔符且包含金额/时间等关键字的行，跳过银行导出的前置说明行
  let headerIdx = 0;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const low = lines[i].toLowerCase();
    const hasSep = lines[i].includes(sep);
    if (hasSep && (low.includes("amount") || low.includes("金额") || low.includes("交易金额") ||
        low.includes("timestamp") || low.includes("交易日期") || low.includes("流水") ||
        low.includes("序号") || low.includes("date"))) {
      headerIdx = i;
      break;
    }
  }

  const rawHeaders = parseCsvLine(lines[headerIdx], sep);
  const headers = rawHeaders.map(mapHeader);

  let idCounter = 1;
  const results: Event[] = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i], sep);
    if (cols.every(c => !c)) continue; // 跳过空行
    const row = Object.fromEntries(headers.map((h, idx) => [h, cols[idx] ?? ""])) as Record<string, string>;

    const amt = parseFloat(row.amount?.replace(/[,，\s¥$￥]/g, "") || "0");
    if (isNaN(amt) || amt === 0) continue; // 跳过金额无效行（如汇总行）

    const ccy = row.currency?.trim().toUpperCase() || undefined;
    const rateStr = row.fxRate?.replace(/[,，\s]/g, "");
    const rate = rateStr ? parseFloat(rateStr) : undefined;

    results.push(normalizeEvent({
      id: row.id || `e${idCounter++}`,
      timestamp: parseDate(row.timestamp),
      amount: Math.abs(amt),            // 支出也用正数，靠规则判方向
      currency: ccy,
      fxRate: rate !== undefined && !isNaN(rate) && rate > 0 ? rate : undefined,
      assetType: row.assetType || "cash",
      source: row.source || "",
      destination: row.destination || "",
      description: row.description || "",
      rawCategoryHint: row.rawCategoryHint || undefined,
      restrictionHint: row.restrictionHint || undefined,
      timeTag: (row.timeTag as TimeTag) || undefined,
      confirmLevel: (row.confirmLevel as ConfirmLevel) || undefined,
      riskTags: parseRiskTags(row.riskTags),
      extra: {},
    }));
  }

  return results;
}
