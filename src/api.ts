import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { LASAEngine, runLASA } from "./engine";
import { summarizePeriod } from "./state";
import { makeLASAState } from "./utils";
import { AccountClass, Event, SystemMode } from "./types";
import { importEventsFromCSV, importEventsFromJSON, normalizeEvent } from "./importers";
import { RULE_REGISTRY } from "./rules";
import { PeriodManager } from "./period";
import { PendingConfirmManager } from "./confirm";

// ── Stateful server engine ────────────────────────────────────────────────────

interface ServerState {
  engine: LASAEngine;
  periodManager: PeriodManager;
  confirmManager: PendingConfirmManager;
}

function makeServerState(): ServerState {
  const initial = makeLASAState();
  return {
    engine: new LASAEngine(SystemMode.BALANCED, 17, initial),
    periodManager: new PeriodManager(),
    confirmManager: new PendingConfirmManager(),
  };
}

let ss: ServerState = makeServerState();

// ── HTTP helpers ──────────────────────────────────────────────────────────────

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
}

function sendJson(res: ServerResponse, code: number, data: unknown): void {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data, null, 2));
}

// 统一 SiliconFlow chat/completions 调用。三个 /llm/* 端点共用。
type LLMResult = { ok: true; content: string } | { ok: false; error: string; status: number };
async function callSiliconFlow(opts: {
  apiKey: string;
  model: string;
  messages: any[];
  temperature?: number;
  maxTokens?: number;
  tag: string;
}): Promise<LLMResult> {
  const res = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${opts.apiKey}` },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 512,
    }),
  });
  const data = await res.json() as any;
  if (!res.ok) {
    const errMsg = data?.error?.message ?? data?.message ?? JSON.stringify(data);
    console.error(`[${opts.tag}]`, res.status, errMsg);
    return { ok: false, error: `[${res.status}] ${errMsg}`, status: res.status };
  }
  return { ok: true, content: data.choices?.[0]?.message?.content ?? "" };
}

function contentType(path: string): string {
  const ext = extname(path);
  switch (ext) {
    case ".html": return "text/html; charset=utf-8";
    case ".js":   return "text/javascript; charset=utf-8";
    case ".css":  return "text/css; charset=utf-8";
    case ".json": return "application/json; charset=utf-8";
    default:      return "text/plain; charset=utf-8";
  }
}

function serveStatic(res: ServerResponse, filepath: string): void {
  if (!existsSync(filepath)) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType(filepath));
  res.end(readFileSync(filepath));
}

// ── Route handlers ────────────────────────────────────────────────────────────

export function createLASAServer(port = 3000) {
  const server = createServer(async (req, res) => {
    const url = req.url ?? "/";
    const method = req.method ?? "GET";

    // CORS for dev convenience
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (method === "OPTIONS") { res.statusCode = 204; return res.end(); }

    try {
      // ── Health ──────────────────────────────────────────────────────────────
      if (method === "GET" && url === "/health") {
        return sendJson(res, 200, { ok: true });
      }

      // ── Rules registry ──────────────────────────────────────────────────────
      if (method === "GET" && url === "/rules") {
        return sendJson(res, 200, { rules: Object.keys(RULE_REGISTRY) });
      }

      // ── Stateful state ──────────────────────────────────────────────────────
      if (method === "GET" && url === "/state") {
        return sendJson(res, 200, {
          state: ss.engine.state,
          semanticLogSize: ss.engine.semanticLog.size,
          currentPeriod: ss.periodManager.current(),
          pendingItems: ss.confirmManager.list(),
        });
      }

      // ── Process single event on stateful engine ─────────────────────────────
      if (method === "POST" && url === "/event") {
        const body = await readBody(req);
        const event: Event = normalizeEvent(JSON.parse(body) as Event);
        const { processEvent } = await import("./engine");
        processEvent(event, ss.engine);
        const ctx = ss.engine.semanticLog.get(event.id);
        return sendJson(res, 200, {
          eventId: event.id,
          accountClass: ss.engine.state.metaLog.at(-1)?.accountClass,
          semanticContext: ctx,
          state: ss.engine.state,
        });
      }

      // ── Reset stateful engine ───────────────────────────────────────────────
      if (method === "POST" && url === "/reset") {
        const body = await readBody(req);
        const payload = body ? (JSON.parse(body) as { initialCash?: number; emergencyReserve?: number; baseCurrency?: string }) : {};
        const initial = makeLASAState(payload.baseCurrency || "TWD");
        ss = {
          engine: new LASAEngine(SystemMode.BALANCED, 17, initial),
          periodManager: new PeriodManager(),
          confirmManager: new PendingConfirmManager(),
        };
        if (payload.initialCash !== undefined) ss.engine.state.assets.cash = payload.initialCash;
        if (payload.emergencyReserve !== undefined) ss.engine.state.reserve.emergencyReserve = payload.emergencyReserve;
        return sendJson(res, 200, { ok: true, state: ss.engine.state });
      }

      // ── Period management ───────────────────────────────────────────────────
      if (method === "GET" && url === "/periods") {
        return sendJson(res, 200, {
          periods: ss.periodManager.list(),
          current: ss.periodManager.current(),
        });
      }

      if (method === "POST" && url === "/period/open") {
        const body = await readBody(req);
        const { id, label } = JSON.parse(body) as { id: string; label: string };
        ss.periodManager.open(id, label, ss.engine.state);
        return sendJson(res, 200, { ok: true, period: ss.periodManager.current() });
      }

      if (method === "POST" && url === "/period/close") {
        const period = ss.periodManager.close(ss.engine.state);
        return sendJson(res, 200, {
          ok: true,
          period,
          summaryText: period.summary ? summarizePeriod(period.summary) : "",
        });
      }

      // ── Pending confirmation ────────────────────────────────────────────────
      if (method === "GET" && url === "/pending") {
        return sendJson(res, 200, { items: ss.confirmManager.list() });
      }

      if (method === "POST" && url === "/pending/register") {
        const body = await readBody(req);
        const item = JSON.parse(body) as { eventId: string; amount: number; riskTags?: string[]; note?: string };
        ss.confirmManager.register({
          eventId: item.eventId,
          amount: item.amount,
          riskTags: (item.riskTags ?? ["NORMAL"]) as any,
          note: item.note ?? "",
        });
        return sendJson(res, 200, { ok: true, items: ss.confirmManager.list() });
      }

      if (method === "POST" && url === "/pending/confirm") {
        const body = await readBody(req);
        const { eventId, targetClass } = JSON.parse(body) as { eventId: string; targetClass: AccountClass };
        ss.confirmManager.confirm(ss.engine.state, eventId, targetClass);
        return sendJson(res, 200, { ok: true, state: ss.engine.state });
      }

      if (method === "POST" && url === "/pending/release") {
        const body = await readBody(req);
        const { eventId } = JSON.parse(body) as { eventId: string };
        ss.confirmManager.release(ss.engine.state, eventId);
        return sendJson(res, 200, { ok: true, state: ss.engine.state });
      }

      // ── Stateless batch run (original endpoint, kept) ───────────────────────
      if (method === "POST" && url === "/run") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { events: Event[]; initialCash?: number; emergencyReserve?: number; baseCurrency?: string };
        const initial = makeLASAState(payload.baseCurrency || "TWD");
        initial.assets.cash = payload.initialCash ?? 0;
        initial.reserve.emergencyReserve = payload.emergencyReserve ?? 0;
        const engine = new LASAEngine(SystemMode.BALANCED, 17, initial);
        const events = (payload.events ?? []).map(normalizeEvent);
        const summary = runLASA(engine, events);
        return sendJson(res, 200, {
          summary,
          state: engine.state,
          semanticLog: Object.fromEntries(engine.semanticLog.entries()),
          semanticLogSize: engine.semanticLog.size,
          summaryText: summarizePeriod(summary),
        });
      }

      // ── Importers ───────────────────────────────────────────────────────────
      if (method === "POST" && url === "/import/json") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { content: string };
        return sendJson(res, 200, { events: importEventsFromJSON(payload.content) });
      }

      if (method === "POST" && url === "/import/csv") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { content: string };
        return sendJson(res, 200, { events: importEventsFromCSV(payload.content) });
      }

      // ── FX rate refresh（法币 + 加密；fawazahmed0 免费源，无需 key） ─────────
      if (method === "POST" && url === "/fx/refresh") {
        const body = await readBody(req);
        const { base, codes } = JSON.parse(body) as { base: string; codes: string[] };
        const baseLower = (base || "TWD").toLowerCase();
        const sources = [
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseLower}.json`,
          `https://latest.currency-api.pages.dev/v1/currencies/${baseLower}.json`,
        ];
        let data: any = null;
        let lastErr: string | null = null;
        for (const u of sources) {
          try {
            const r = await fetch(u);
            if (r.ok) { data = await r.json(); break; }
            lastErr = `HTTP ${r.status} from ${u}`;
          } catch (e) {
            lastErr = String(e);
          }
        }
        if (!data) return sendJson(res, 200, { error: lastErr || "FX source unavailable" });
        const inner = data[baseLower] as Record<string, number> | undefined;
        if (!inner) return sendJson(res, 200, { error: `No rates for base ${base}` });
        const rates: Record<string, number> = {};
        const missing: string[] = [];
        for (const raw of codes || []) {
          const code = raw.toUpperCase();
          const lower = code.toLowerCase();
          if (lower === baseLower) { rates[code] = 1; continue; }
          const v = inner[lower];
          if (typeof v === "number" && v > 0) {
            rates[code] = 1 / v; // 1 单位 code = (1 / v) 单位 base
          } else {
            missing.push(code);
          }
        }
        return sendJson(res, 200, { base: base.toUpperCase(), rates, date: data.date, missing });
      }

      // ── LLM proxy ──────────────────────────────────────────────────────────
      if (method === "POST" && url === "/llm/ocr") {
        const body = await readBody(req);
        const { text, image, apiKey, model, visionModel, lang } = JSON.parse(body) as {
          text: string; image?: string; apiKey?: string; model?: string; visionModel?: string; lang?: string;
        };
        const key = apiKey || process.env.SILICONFLOW_API_KEY || "";
        if (!key) return sendJson(res, 400, { error: "No API key configured" });
        const useVision = typeof image === "string" && image.startsWith("data:image/");
        const m = useVision
          ? (visionModel || "Qwen/Qwen2.5-VL-72B-Instruct")
          : (model || "deepseek-ai/DeepSeek-V3");
        const isEn = lang === "en";
        const prompt = isEn
          ? `You are a receipt parser. ${useVision ? "The image is authoritative; the OCR text below is noisy and may contain digit errors (e.g. 9↔3, 8↔B, 0↔O). Read the image directly." : ""}Extract fields and return ONLY valid JSON (no markdown).
Fields to extract (omit if not found):
- amount: number (e.g. 12.50). Priority: (1) if an explicit TOTAL line exists (keywords: TOTAL, SUMME, GESAMT, 合計, 合计, 總計, TTL), copy that number verbatim; (2) otherwise, return the SINGLE LARGEST line-item amount as-written. DO NOT sum line items. DO NOT do any arithmetic. If in doubt, omit the field.
- currency: ISO 4217 code (USD, EUR, CNY, JPY, GBP, HKD, MOP, TWD, RUB) or crypto symbol (BTC, ETH, USDT). Infer from symbols (€=EUR, $=USD, ￥/¥=CNY or JPY based on context, £=GBP, HK$=HKD, NT$/元=TWD, ₽=RUB) or text labels.
- date: string YYYY-MM-DD
- merchant: string (store/vendor name)
- hint: LASA rule key best matching the purchase (e.g. LIVING_EXPENSE, SALARY_IN, INVESTMENT_BUY, etc.)

OCR text (noisy, for reference only):
${text}`
          : `你是收据/发票解析助手。${useVision ? "以图片为准；下方 OCR 文字噪声较大且可能有数字误识别（如 9↔3、8↔B、0↔O），请直接从图片识别。" : ""}只返回合法JSON（不要Markdown代码块）。
需提取的字段（无法识别则省略）：
- amount: 金额数字（如 12.50）。优先级：(1) 若收据上有明确的总额行（关键词：TOTAL / SUMME / GESAMT / 合計 / 合计 / 總計 / TTL），直接照抄那个数字；(2) 否则返回单行金额中**最大**的那个，原样照抄。严禁把多行金额相加。严禁做任何算术。无法确定时请省略此字段。
- currency: ISO 4217 货币代码（USD / EUR / CNY / JPY / GBP / HKD / MOP / TWD / RUB）或加密货币代号（BTC / ETH / USDT）。依据符号推断：€=EUR、$=USD、￥/¥ 根据语境判断 CNY 或 JPY、£=GBP、HK$=HKD、NT$/台币/元=TWD、₽=RUB。
- date: 日期字符串 YYYY-MM-DD
- merchant: 商家名称
- hint: 最匹配的 LASA 规则键（如 LIVING_EXPENSE / SALARY_IN / INVESTMENT_BUY 等）

OCR文字（仅作参考，可能有误）：
${text}`;
        const messages = useVision
          ? [{
              role: "user",
              content: [
                { type: "image_url", image_url: { url: image } },
                { type: "text", text: prompt },
              ],
            }]
          : [{ role: "user", content: prompt }];
        const result = await callSiliconFlow({ apiKey: key, model: m, messages, temperature: 0.1, maxTokens: 256, tag: "LLM/ocr" });
        if (!result.ok) return sendJson(res, 200, { error: result.error });
        const jsonMatch = result.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try { return sendJson(res, 200, JSON.parse(jsonMatch[0])); } catch {}
        }
        return sendJson(res, 200, { raw: result.content });
      }

      // ── OCR 批量：银行 / 支付宝 / 微信支付等流水截图，一张图识别多笔交易 ─────
      if (method === "POST" && url === "/llm/ocr-bulk") {
        const body = await readBody(req);
        const { image, apiKey, visionModel, lang } = JSON.parse(body) as {
          image?: string; apiKey?: string; visionModel?: string; lang?: string;
        };
        const key = apiKey || process.env.SILICONFLOW_API_KEY || "";
        if (!key) return sendJson(res, 400, { error: "No API key configured" });
        if (!image || !image.startsWith("data:image/")) {
          return sendJson(res, 400, { error: "image (base64 data URL) required" });
        }
        const m = visionModel || "Qwen/Qwen2.5-VL-72B-Instruct";
        const isEn = lang === "en";
        const ruleHints = "SALARY_IN / LIVING_EXPENSE / INVESTMENT_BUY / TRADEABLE_ASSET_BUY / BORROWED_MONEY_IN / DEBT_REPAY / REFUND / REIMBURSEMENT_RECEIVED / BROKER_COMMISSION / RESTRICTED_FUND_IN / DEPOSIT_IN / TAX_PENALTY / ABNORMAL_LOSS / BANK_FEE / CASH_WITHDRAWAL / E_WALLET_TOPUP / E_WALLET_WITHDRAWAL / INTERNAL_TRANSFER / INTERNAL_TRANSFER_CANDIDATE";
        const prompt = isEn
          ? `You are parsing a transaction ledger screenshot (bank app, Alipay, WeChat Pay, etc.) with MULTIPLE transactions. Identify EVERY visible transaction row and return a JSON array.

**Direction (critical — must be done per row):**
- Amount prefixed with "-" / "−", or red/purple color, or row labeled 支出/提款/出金/转出 → direction="out"
- Amount with no sign or "+", or green/blue color, or row labeled 存入/入账/转入/收入 → direction="in"
- Each row is independent — don't assume a screen is all-in or all-out.

**hint selection rules (precise — don't conflate categories):**
- Real daily spending (restaurant, shopping, QR pay to merchant) → LIVING_EXPENSE
- Confirmed salary/wage/bonus → SALARY_IN
- Refund → REFUND
- Loan received → BORROWED_MONEY_IN; loan repayment → DEBT_REPAY
- Fund/stock buy → INVESTMENT_BUY or TRADEABLE_ASSET_BUY
- **ATM cash withdrawal / debit-card cash-out principal** (金融卡提 / ATM 提款 / ATM 領現 / 提領 / 取款 — the principal amount itself) → CASH_WITHDRAWAL (bank balance → physical cash, zero-delta)
- **Bank fees** (提領手續費 / 跨行手續費 / 轉帳手續費 / 服務費 / 管理費 / 年費 — a separate row for the fee, not the principal) → BANK_FEE (real cash outflow to system expense)
- **E-wallet top-up** (電支儲值 / 錢包充值 / Apple Pay 儲值) → E_WALLET_TOPUP (bank → e-wallet container)
- **E-wallet withdrawal back to bank** (電支提領 / 餘額提領) → E_WALLET_WITHDRAWAL
- **Explicit same-owner account-to-account transfer** (跨行轉入本人帳戶 / 跨行轉出本人帳戶 / 帳戶互轉 / 本人同名轉帳) → INTERNAL_TRANSFER
- **Ambiguous 跨行轉入 / 跨行轉出** (no "本人/同名" marker, counterparty unclear — could be self or third-party) → INTERNAL_TRANSFER_CANDIDATE
- Never force SALARY_IN or LIVING_EXPENSE for any of the above — they are zero-delta to total assets.
- Totally unknown → INTERNAL_TRANSFER_CANDIDATE

Each element: {amount: number(abs), currency, date:"YYYY-MM-DD", merchant, description, hint, direction:"in"|"out"}

Currency defaults: Alipay/WeChat→CNY; NT$/台币 context→TWD; $→USD; €→EUR.

Return ONLY the raw JSON array. No markdown.`
          : `你是交易流水识别助手。图中是一张银行 App / 支付宝 / 微信支付 等交易记录截图，包含多笔交易。识别**每一条可见的交易**并返回 JSON 数组。

**方向识别（关键，必须逐行判断）：**
- 金额前有 \`-\` 或 \`−\` 负号，或颜色是红/紫色，或行内标注 支出/提款/出金/转出 → direction="out"
- 金额无符号或带 \`+\`，或颜色绿/蓝色，或行内标注 存入/入账/转入/收入 → direction="in"
- 每一行独立判断，不要假设一屏都是收入或都是支出

**hint 选择规则（精确区分，不要混为一谈）：**
- 真正的日常消费（扫码支付商家/餐饮/购物）→ LIVING_EXPENSE
- 明确薪资/工资/绩效奖金 → SALARY_IN
- 退款/退货 → REFUND
- 借入款项 → BORROWED_MONEY_IN；还款本金 → DEBT_REPAY
- 投资买入（基金/股票等）→ INVESTMENT_BUY 或 TRADEABLE_ASSET_BUY
- **ATM 提款本金**（金融卡提 / ATM 提款 / ATM 領現 / 提領 / 取款 —— 取款金额本身）→ CASH_WITHDRAWAL（银行 → 现金，不损益）
- **银行手续费**（提領手續費 / 跨行手續費 / 轉帳手續費 / 服務費 / 管理費 / 年費 —— **独立一行**的手续费，不是本金）→ BANK_FEE（真实现金支出到系统费用层）
- **電子錢包充值**（電支儲值 / 錢包充值 / Apple Pay 儲值）→ E_WALLET_TOPUP（银行 → 电支余额容器）
- **電子錢包提領回銀行**（電支提領 / 餘額提領）→ E_WALLET_WITHDRAWAL
- **明确本人账户对账户**（跨行轉入本人帳戶 / 跨行轉出本人帳戶 / 帳戶互轉 / 本人同名轉帳）→ INTERNAL_TRANSFER
- **跨行轉入 / 跨行轉出**（无"本人/同名"标记，对手方不明）→ INTERNAL_TRANSFER_CANDIDATE
- **绝不**把以上任何一类硬塞成 SALARY_IN 或 LIVING_EXPENSE（它们对总资产零影响，塞错会污染收支统计）
- 完全无法判断 → INTERNAL_TRANSFER_CANDIDATE

每条元素：{amount: 绝对值, currency, date:"YYYY-MM-DD", merchant, description, hint, direction:"in"|"out"}

币种默认：支付宝/微信→CNY；NT$/台币语境→TWD；$→USD；€→EUR。

只返回纯 JSON 数组，不要 Markdown 代码块。`;

        const messages = [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: image } },
            { type: "text", text: prompt },
          ],
        }];
        const result = await callSiliconFlow({ apiKey: key, model: m, messages, temperature: 0.1, maxTokens: 2048, tag: "LLM/ocr-bulk" });
        if (!result.ok) return sendJson(res, 200, { error: result.error });
        const jsonMatch = result.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            const arr = JSON.parse(jsonMatch[0]);
            if (Array.isArray(arr)) return sendJson(res, 200, { transactions: arr });
          } catch {}
        }
        return sendJson(res, 200, { error: "Failed to parse LLM response", raw: result.content });
      }

      if (method === "POST" && url === "/llm/analysis") {
        const body = await readBody(req);
        const { state, summary, apiKey, model, lang } = JSON.parse(body) as {
          state: any; summary: any; apiKey?: string; model?: string; lang?: string;
        };
        const key = apiKey || process.env.SILICONFLOW_API_KEY || "";
        if (!key) return sendJson(res, 400, { error: "No API key configured" });
        const m = model || "deepseek-ai/DeepSeek-V3";
        const isEn = lang === "en";
        const stateSnippet = JSON.stringify({ assets: state?.assets, liabilities: state?.liabilities,
          income: state?.income, expenses: state?.expenses, restricted: state?.restricted,
          pending: state?.pending, reserve: state?.reserve }, null, 2);
        const summarySnippet = JSON.stringify(summary ?? {}, null, 2);
        const prompt = isEn
          ? `You are a personal finance analyst using the LASA (Layered Asset-State Accounting) framework.
Analyze the following account state and period summary, then provide a concise, plain-language report covering:
1. Overall financial health (surplus or deficit, key figures)
2. What money is truly spendable vs. locked/restricted
3. Top spending categories
4. Any risks or items needing attention (pending items, abnormal losses, etc.)
5. One actionable suggestion

Keep it under 200 words. Use plain language, no jargon.

Account State:
${stateSnippet}

Period Summary:
${summarySnippet}`
          : `你是个人财务分析师，使用 LASA（资金形态分层会计）框架。
分析以下账户状态和期间摘要，用简洁人话输出报告，涵盖：
1. 整体财务健康（盈余还是赤字，关键数字）
2. 真正可动用的钱 vs 锁定/受限资金
3. 最主要的支出项目
4. 需要注意的风险（待确认款项、异常损失等）
5. 一条具体可操作的建议

不超过200字，说人话，不要术语堆砌。

账户状态：
${stateSnippet}

期间摘要：
${summarySnippet}`;
        const result = await callSiliconFlow({ apiKey: key, model: m, messages: [{ role: "user", content: prompt }], temperature: 0.7, maxTokens: 512, tag: "LLM/analysis" });
        if (!result.ok) return sendJson(res, 200, { error: result.error });
        return sendJson(res, 200, { analysis: result.content });
      }

      if (method === "POST" && url === "/llm/classify") {
        const body = await readBody(req);
        const { events, apiKey, model, lang } = JSON.parse(body) as {
          events: { id: string; description?: string; source?: string; destination?: string; amount?: number }[];
          apiKey?: string; model?: string; lang?: string;
        };
        const key = apiKey || process.env.SILICONFLOW_API_KEY || "";
        if (!key) return sendJson(res, 400, { error: "No API key configured" });
        const m = model || "deepseek-ai/DeepSeek-V3";
        const ruleKeys = Object.keys(RULE_REGISTRY).join(", ");
        const eventLines = events.map((e, i) =>
          `${i + 1}. id=${e.id} | 金额=${e.amount ?? "?"} | 来源=${e.source || "?"} | 收款方=${e.destination || "?"} | 描述=${e.description || "?"}`
        ).join("\n");
        const prompt = lang === "en"
          ? `You are a LASA financial classifier. Match each transaction to the best rule key.

Key disambiguation rules:
- BROKER_COMMISSION: fees/commissions received FOR a service YOU provided (design, consulting, translation, etc.)
- REIMBURSEMENT_RECEIVED: money paid back to you that you advanced for someone else
- RESTRICTED_FUND_IN: government grants, scholarships, state subsidies (source is government/ministry/bureau)
- FOUNDATION_GRANT_IN: grants from foundations/NGOs/charities (non-government)
- SALARY_IN: regular salary, bonus, performance pay from employer
- LIVING_EXPENSE: daily living costs (food, transport, utilities, shopping, entertainment)
- INVESTMENT_BUY: buying financial assets (funds, stocks, bonds) — money stays as asset
- TRADEABLE_ASSET_BUY: buying tradeable/speculative assets (stocks, crypto)
- TRADEABLE_ASSET_SELL_GAIN / TRADEABLE_ASSET_SELL_LOSS: selling tradeable assets
- BORROWED_MONEY_IN: loans received (liability)
- DEBT_REPAY: repaying loans
- DEPOSIT_IN: paying a security/rental deposit OUT (cash leaves, creates a refundable receivable asset) — includes housing deposit, travel deposit, rental deposit
- TAX_PENALTY: tax fines or penalties imposed by tax authority (use this, NOT ABNORMAL_LOSS, for tax penalties)
- ABNORMAL_LOSS: non-tax unexpected losses, accidents, non-tax fines
- POLITICAL_DONATION_OUT: ALL outgoing donations — political, charitable, public welfare (e.g. Hope Project, Red Cross) — this is the only outgoing donation rule
- DISPUTED_RECEIPT: unknown/suspicious source

Available rule keys: ${ruleKeys}

Transactions:
${eventLines}

Return ONLY a JSON array like: [{"id":"e1","hint":"LIVING_EXPENSE"},...]
No explanation, no markdown, just the JSON array.`
          : `你是 LASA 财务分类助手。为每笔交易匹配最合适的规则键。

关键区分规则：
- BROKER_COMMISSION：你提供服务（设计/咨询/翻译等）收到的佣金或服务费（钱流入你账户）
- REIMBURSEMENT_RECEIVED：你之前垫付的钱被还回来了
- RESTRICTED_FUND_IN：来自政府/教育部/科技局/民政局等国家机构的拨款、奖学金、补贴、救助金（受限资金）
- FOUNDATION_GRANT_IN：来自基金会/慈善机构/NGO的资助（非政府来源）
- SALARY_IN：雇主发放的工资、绩效奖金、年终奖
- LIVING_EXPENSE：日常生活支出（餐饮/交通/水电/购物/娱乐/医疗/宠物/订阅等）
- INVESTMENT_BUY：购买金融理财产品（余额宝/基金定投/国债），资产形态转换
- TRADEABLE_ASSET_BUY：购买可交易高风险资产（股票/ETF/加密货币）
- TRADEABLE_ASSET_SELL_GAIN / TRADEABLE_ASSET_SELL_LOSS：卖出可交易资产盈利/亏损
- BORROWED_MONEY_IN：借入款项（产生负债）
- DEBT_REPAY：偿还借款本金
- DEPOSIT_IN：你向外缴纳押金/定金/保证金（现金流出，换入押金应收款资产；包括购房定金、租房押金、旅游订金）
- EMERGENCY_RESERVE_CONTRIB：主动存入紧急备用金
- TAX_PENALTY：税务机关开具的罚款通知（专用于税务罚款，不要用 ABNORMAL_LOSS）
- ABNORMAL_LOSS：非税务的意外损失、盗窃、意外事故等
- POLITICAL_DONATION_OUT：所有对外捐款支出，包括政治捐款、公益捐款、慈善捐款（如希望工程/红十字/NGO），这是唯一的捐款支出规则
- DISPUTED_RECEIPT：来源不明或有争议的款项

可用规则键：${ruleKeys}

交易列表：
${eventLines}

只返回 JSON 数组，格式：[{"id":"e1","hint":"LIVING_EXPENSE"},...]
不要解释，不要 Markdown，只返回 JSON 数组。`;
        const result = await callSiliconFlow({ apiKey: key, model: m, messages: [{ role: "user", content: prompt }], temperature: 0.1, maxTokens: 1024, tag: "LLM/classify" });
        if (!result.ok) return sendJson(res, 200, { error: result.error });
        const jsonMatch = result.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try { return sendJson(res, 200, { classifications: JSON.parse(jsonMatch[0]) }); } catch {}
        }
        return sendJson(res, 200, { error: "Failed to parse LLM response", raw: result.content });
      }

      // ── Static files ────────────────────────────────────────────────────────
      if (method === "GET" && (url === "/" || url === "/index.html")) {
        return serveStatic(res, join(process.cwd(), "public", "index.html"));
      }
      if (method === "GET" && url.startsWith("/app.js")) {
        return serveStatic(res, join(process.cwd(), "public", "app.js"));
      }
      if (method === "GET" && url.startsWith("/styles.css")) {
        return serveStatic(res, join(process.cwd(), "public", "styles.css"));
      }

      return sendJson(res, 404, { error: "Not found" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return sendJson(res, 400, { error: msg });
    }
  });

  return {
    listen: () => server.listen(port, () => console.log(`LASA API listening on :${port}`)),
    server,
  };
}
