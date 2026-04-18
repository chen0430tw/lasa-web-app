// localStorage 键名集中管理（必须在任何使用前定义，避免 TDZ）
const STORAGE = {
  lang:     "lasa-lang",
  theme:    "lasa-theme",
  llmKey:   "lasa-llm-key",
  llmModel: "lasa-llm-model",
  fx:       "lasa-fx",
};
const DEFAULT_BASE_CURRENCY = "TWD";
const DEFAULT_LLM_MODEL = "deepseek-ai/DeepSeek-V3";

// ── i18n ──────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  zh: {
    subtitle: "资金形态分层会计 — 先分类，后结算。看清每笔钱在经济上到底是什么。",
    "tab.batch": "批量运行", "tab.live": "实时录入", "tab.period": "期间管理",
    "tab.pending": "待确认", "tab.rules": "规则表",
    "batch.init": "初始参数", "batch.initCash": "初始现金", "batch.initReserve": "紧急预备金",
    "batch.import": "导入", "batch.loadSample": "载入示例",
    "batch.importJson": "从 JSON 解析", "batch.importCsv": "从 CSV 解析",
    "batch.importOcrBulk": "📱 OCR 截图导入",
    "batch.importReplaceToggle": "导入时替换现有列表（默认追加）",
    "batch.ocrBulkScanning": "识别中（可能需 10-30 秒）…",
    "batch.ocrBulkNone": "未识别到交易，请换张清晰的截图",
    "batch.ocrBulkAdded": "已添加 {n} 笔交易到列表",
    "batch.ocrBulkNoKey": "请先在设置（⚙️）中填写 API Key，视觉识别需要",
    "batch.rawInputPlaceholder": "贴 JSON 数组或 CSV 内容",
    "batch.eventList": "事件列表", "batch.addEvent": "新增空白事件", "batch.run": "运行 LASA",
    "batch.aiClassify": "✨ AI 批量补全分类",
    "batch.summary": "期间摘要", "batch.semanticLog": "语义日志", "batch.stateTitle": "账户状态",
    "live.initEngine": "初始化引擎", "live.reset": "重置引擎", "live.refresh": "刷新状态",
    "live.history": "已提交事件", "live.historyEmpty": "尚未提交任何事件",
    "live.submitEvent": "录入单笔事件", "live.submit": "提交事件",
    "field.timestamp": "时间", "field.amount": "金额", "field.assetType": "资产类型",
    "field.source": "来源", "field.destination": "收款方", "field.description": "描述",
    "field.rule": "分类规则", "field.restriction": "受限标注",
    "field.timeTag": "时间标签", "field.riskTags": "风险标签",
    "period.open": "开启期间", "period.id": "期间 ID", "period.label": "标签",
    "period.current": "当前期间", "period.none": "（无开启期间）",
    "period.close": "关闭并结算", "period.history": "历史期间",
    "pending.register": "登记待确认款项", "pending.eventId": "事件 ID",
    "pending.note": "备注", "pending.registerBtn": "登记",
    "pending.confirmTitle": "确认 / 释放", "pending.targetClass": "目标账类",
    "pending.confirm": "确认归类", "pending.release": "释放为异常损失",
    "pending.list": "待确认列表", "pending.empty": "暂无待确认款项",
    "pending.col.eventId": "事件ID", "pending.col.amount": "金额",
    "pending.col.riskTags": "风险标签", "pending.col.note": "备注",
    "pending.col.registeredAt": "登记时间", "period.noHistory": "暂无历史期间",
    "period.open_label": "开放中", "pending.eventIdPlaceholder": "对应已录入事件 ID",
    "period.defaultLabel": "2026 年第二季度",
    "class.income": "收入", "class.asset": "资产", "class.liability": "负债",
    "class.expense": "费用", "class.restricted": "受限",
    "rules.title": "规则注册表",
    "rules.hint": "rawCategoryHint 填入以下键名即可命中对应规则。未命中的事件进入语义回退分类器。",
    "editor.title": "编辑事件", "editor.save": "保存", "editor.cancel": "取消",
    "state.assets": "资产", "state.liabilities": "负债", "state.income": "收入",
    "state.expenses": "费用", "state.restricted": "受限资金", "state.pending": "待确认",
    "state.intangible": "无形资产", "state.reserve": "储备",
    "state.cash": "现金", "state.financial": "金融资产", "state.tradeable": "可交易资产",
    "state.other": "其他资产", "state.shortTerm": "短期负债", "state.pendingLiab": "待处理负债",
    "state.regular": "经常性收入", "state.grant": "补助收入", "state.trade": "交易实现收益",
    "state.broker": "中介佣金", "state.intangibleInc": "无形资产收益",
    "state.life": "生活费用", "state.system": "系统费用", "state.debtInt": "利息费用",
    "state.tradeLoss": "交易亏损", "state.abnormal": "异常损失",
    "state.stateFunds": "国家经费", "state.foundation": "基金会资金",
    "state.political": "政治资金", "state.private": "私人受限",
    "state.riskReserve": "风险储备", "state.speculative": "推演估值",
    "state.formal": "正式认定", "state.emergency": "紧急预备金",
    "ocr.drop": "📷 拖拽图片或点击上传票据 / 截图",
    "ocr.apply": "套用到表单", "ocr.clear": "清除",
    "ocr.scanning": "识别中…", "ocr.done": "识别完成",
    "ocr.noResult": "未识别到有效字段，请手动填写",
    "ocr.amount": "金额", "ocr.date": "日期", "ocr.merchant": "商家",
    "ai.analysisTitle": "AI 财务分析", "ai.analyze": "✨ 生成 AI 分析",
    "settings.title": "设置", "settings.apiKey": "API Key（硅基流动）",
    "settings.apiKeyPlaceholder": "sk-...", "settings.model": "模型", "settings.save": "保存",
    "settings.aiSection": "AI",
    "settings.fxSection": "币种与汇率",
    "settings.baseCcy": "基准币",
    "settings.fxHint": "汇率 = 1 单位该币种等于多少基准币。可手动编辑、新增，或点\"刷新\"抓取最新汇率。",
    "settings.fxAdd": "＋ 新增币种",
    "settings.fxRefresh": "🔄 刷新汇率",
    "settings.fxReorder": "↩ 恢复默认",
    "settings.fxCol.code": "代码",
    "settings.fxCol.name": "名称",
    "settings.fxCol.rate": "→ 基准币",
    "settings.fxCol.del": "",
    "settings.fxRefreshing": "抓取中…",
    "settings.fxRefreshOk": "已刷新",
    "settings.fxRefreshFail": "刷新失败",
    "settings.fxMissing": "未能获取的币种",
    "addCcy.title": "新增币种",
    "addCcy.code": "币种代码（ISO 4217 或加密代号）",
    "addCcy.name": "显示名称（可选）",
    "addCcy.rate": "初始汇率（1 单位此币 = ? 基准币，可留空）",
    "addCcy.confirm": "新增",
    "addCcy.exists": "该币种已存在",
    "addCcy.invalid": "请输入 2–8 位字母代码",
    "field.currency": "币种",
    "ocr.aiEnhance": "✨ AI 增强",
    "export.title": "导出结果", "export.json": "导出 JSON", "export.csv": "导出 CSV（事件）",
    "export.hint": "导出本次运行的完整数据，包含事件列表、摘要、语义日志与账户状态。",
    "theme.deep": "深海", "theme.noir": "暗黑", "theme.light": "浅色",
    "theme.emerald": "翡翠", "theme.violet": "紫调",
    "confirm.reset": "重置引擎将清除所有状态，确认吗？",
    "confirm.release": "将此款项释放为异常损失，确认吗？",
    "period.closed": "期间已关闭",
    "editor.rule": "分类规则", "editor.id": "ID", "editor.timestamp": "时间",
    "editor.amount": "金额", "editor.currency": "币种", "editor.assetType": "资产类型", "editor.source": "来源",
    "editor.destination": "收款方", "editor.description": "描述",
    "editor.restriction": "受限标注", "editor.timeTag": "时间标签", "editor.riskTags": "风险标签",
  },
  en: {
    subtitle: "Layered Asset-State Accounting — Classify first, settle later. See what every transaction really is.",
    "tab.batch": "Batch Run", "tab.live": "Live Entry", "tab.period": "Periods",
    "tab.pending": "Pending", "tab.rules": "Rules",
    "batch.init": "Initial Parameters", "batch.initCash": "Initial Cash", "batch.initReserve": "Emergency Reserve",
    "batch.import": "Import", "batch.loadSample": "Load Sample",
    "batch.importJson": "Parse JSON", "batch.importCsv": "Parse CSV",
    "batch.importOcrBulk": "📱 OCR bulk import",
    "batch.importReplaceToggle": "Replace existing list on import (default: append)",
    "batch.ocrBulkScanning": "Scanning (10-30s)…",
    "batch.ocrBulkNone": "No transactions detected; try a clearer screenshot",
    "batch.ocrBulkAdded": "Added {n} transactions to list",
    "batch.ocrBulkNoKey": "Set API Key in Settings (⚙️) — vision model requires it",
    "batch.rawInputPlaceholder": "Paste JSON array or CSV content",
    "batch.eventList": "Event List", "batch.addEvent": "Add Blank Event", "batch.run": "Run LASA",
    "batch.aiClassify": "✨ AI Auto-classify",
    "batch.summary": "Period Summary", "batch.semanticLog": "Semantic Log", "batch.stateTitle": "Account State",
    "live.initEngine": "Initialize Engine", "live.reset": "Reset Engine", "live.refresh": "Refresh State",
    "live.history": "Submitted Events", "live.historyEmpty": "No events submitted yet",
    "live.submitEvent": "Enter Single Event", "live.submit": "Submit Event",
    "field.timestamp": "Timestamp", "field.amount": "Amount", "field.assetType": "Asset Type",
    "field.source": "Source", "field.destination": "Recipient", "field.description": "Description",
    "field.rule": "Rule", "field.restriction": "Restriction",
    "field.timeTag": "Time Tag", "field.riskTags": "Risk Tags",
    "period.open": "Open Period", "period.id": "Period ID", "period.label": "Label",
    "period.current": "Current Period", "period.none": "(No open period)",
    "period.close": "Close & Settle", "period.history": "Period History",
    "pending.register": "Register Pending Item", "pending.eventId": "Event ID",
    "pending.note": "Note", "pending.registerBtn": "Register",
    "pending.confirmTitle": "Confirm / Release", "pending.targetClass": "Target Class",
    "pending.confirm": "Confirm Classification", "pending.release": "Release as Abnormal Loss",
    "pending.list": "Pending Items", "pending.empty": "No pending items",
    "pending.col.eventId": "Event ID", "pending.col.amount": "Amount",
    "pending.col.riskTags": "Risk Tags", "pending.col.note": "Note",
    "pending.col.registeredAt": "Registered At", "period.noHistory": "No period history",
    "period.open_label": "Open", "pending.eventIdPlaceholder": "Event ID of registered event",
    "period.defaultLabel": "Q2 2026",
    "class.income": "Income", "class.asset": "Asset", "class.liability": "Liability",
    "class.expense": "Expense", "class.restricted": "Restricted",
    "rules.title": "Rule Registry",
    "rules.hint": "Set rawCategoryHint to a key below to match a rule. Unmatched events fall back to the semantic classifier.",
    "editor.title": "Edit Event", "editor.save": "Save", "editor.cancel": "Cancel",
    "state.assets": "Assets", "state.liabilities": "Liabilities", "state.income": "Income",
    "state.expenses": "Expenses", "state.restricted": "Restricted", "state.pending": "Pending",
    "state.intangible": "Intangible", "state.reserve": "Reserve",
    "state.cash": "Cash", "state.financial": "Financial Assets", "state.tradeable": "Tradeable Assets",
    "state.other": "Other Assets", "state.shortTerm": "Short-term Liabilities", "state.pendingLiab": "Pending Liabilities",
    "state.regular": "Regular Income", "state.grant": "Grant Income", "state.trade": "Trade Realized",
    "state.broker": "Broker Commission", "state.intangibleInc": "Intangible Revenue",
    "state.life": "Living Expenses", "state.system": "System Expenses", "state.debtInt": "Debt Interest",
    "state.tradeLoss": "Trade Loss", "state.abnormal": "Abnormal Loss",
    "state.stateFunds": "State Funds", "state.foundation": "Foundation Funds",
    "state.political": "Political Funds", "state.private": "Private Restricted",
    "state.riskReserve": "Risk Reserve", "state.speculative": "Speculative",
    "state.formal": "Formal", "state.emergency": "Emergency Reserve",
    "ocr.drop": "📷 Drag & drop or click to upload receipt / screenshot",
    "ocr.apply": "Apply to form", "ocr.clear": "Clear",
    "ocr.scanning": "Scanning…", "ocr.done": "Done",
    "ocr.noResult": "No fields detected, please fill manually",
    "ocr.amount": "Amount", "ocr.date": "Date", "ocr.merchant": "Merchant",
    "ai.analysisTitle": "AI Financial Analysis", "ai.analyze": "✨ Generate AI Analysis",
    "settings.title": "Settings", "settings.apiKey": "API Key (SiliconFlow)",
    "settings.apiKeyPlaceholder": "sk-...", "settings.model": "Model", "settings.save": "Save",
    "settings.aiSection": "AI",
    "settings.fxSection": "Currency & FX",
    "settings.baseCcy": "Base currency",
    "settings.fxHint": "Rate = how many base-currency units per 1 unit of this currency. Edit inline, add new ones, or click Refresh to fetch live rates.",
    "settings.fxAdd": "＋ Add currency",
    "settings.fxRefresh": "🔄 Refresh rates",
    "settings.fxReorder": "↩ Reset defaults",
    "settings.fxCol.code": "Code",
    "settings.fxCol.name": "Name",
    "settings.fxCol.rate": "→ base",
    "settings.fxCol.del": "",
    "settings.fxRefreshing": "Refreshing…",
    "settings.fxRefreshOk": "Refreshed",
    "settings.fxRefreshFail": "Refresh failed",
    "settings.fxMissing": "Not fetched",
    "addCcy.title": "Add currency",
    "addCcy.code": "Currency code (ISO 4217 or crypto symbol)",
    "addCcy.name": "Display name (optional)",
    "addCcy.rate": "Initial rate (1 unit = ? base; optional)",
    "addCcy.confirm": "Add",
    "addCcy.exists": "Currency already exists",
    "addCcy.invalid": "Use 2–8 letters",
    "field.currency": "Currency",
    "ocr.aiEnhance": "✨ AI Enhance",
    "export.title": "Export Results", "export.json": "Export JSON", "export.csv": "Export CSV (Events)",
    "export.hint": "Export the full data from this run: events, summary, semantic log, and account state.",
    "theme.deep": "Deep Sea", "theme.noir": "Noir", "theme.light": "Light",
    "theme.emerald": "Emerald", "theme.violet": "Violet",
    "confirm.reset": "Reset engine and clear all state. Are you sure?",
    "confirm.release": "Release this item as an abnormal loss. Are you sure?",
    "period.closed": "Period closed.",
    "editor.rule": "Rule", "editor.id": "ID", "editor.timestamp": "Timestamp",
    "editor.amount": "Amount", "editor.currency": "Currency", "editor.assetType": "Asset Type", "editor.source": "Source",
    "editor.destination": "Recipient", "editor.description": "Description",
    "editor.restriction": "Restriction", "editor.timeTag": "Time Tag", "editor.riskTags": "Risk Tags",
  },
};

let currentLang = localStorage.getItem(STORAGE.lang) || "zh";

function t(key) {
  return TRANSLATIONS[currentLang][key] ?? TRANSLATIONS.zh[key] ?? key;
}

function applyLang() {
  document.documentElement.lang = currentLang === "zh" ? "zh-Hans" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    // preserve child elements (inputs, selects)
    const firstChild = el.childNodes[0];
    if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
      firstChild.textContent = val + " ";
    } else {
      el.childNodes.forEach((n) => { if (n.nodeType === Node.TEXT_NODE) n.remove(); });
      el.prepend(document.createTextNode(val + " "));
    }
    // for elements with no children just set textContent
    if (!el.querySelector("input, select, div")) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-value]").forEach((el) => {
    el.value = t(el.dataset.i18nValue);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  document.getElementById("langBtn").textContent = currentLang === "zh" ? "EN" : "中";
}

document.getElementById("langBtn").addEventListener("click", () => {
  currentLang = currentLang === "zh" ? "en" : "zh";
  localStorage.setItem(STORAGE.lang, currentLang);
  applyLang();
  rebuildLiveFormSelects();
  renderTable(); // 保留现有事件，仅重绘（i18n 表头变化）
  if (!document.getElementById("tab-rules").classList.contains("hidden")) loadRules();
  if (!document.getElementById("tab-period").classList.contains("hidden")) refreshPeriods();
  if (!document.getElementById("tab-pending").classList.contains("hidden")) refreshPending();
  if (lastRunResult) document.getElementById("summaryText").textContent = generateCommentary(lastRunResult.summary, lastRunResult.state);
});

// ── Theme switcher ─────────────────────────────────────────────────────────────
(function () {
  const saved = localStorage.getItem(STORAGE.theme) || "deep";
  document.documentElement.setAttribute("data-theme", saved);
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    if (btn.dataset.theme === saved) btn.classList.add("active");
    btn.addEventListener("click", () => {
      const t = btn.dataset.theme;
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem(STORAGE.theme, t);
      document.querySelectorAll(".theme-btn").forEach((b) => b.classList.toggle("active", b.dataset.theme === t));
    });
  });
})();

// ── Tab navigation ─────────────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
    btn.classList.add("active");
    const panel = document.getElementById(`tab-${btn.dataset.tab}`);
    if (panel) panel.classList.remove("hidden");
    if (btn.dataset.tab === "rules") loadRules();
    if (btn.dataset.tab === "period") refreshPeriods();
    if (btn.dataset.tab === "pending") refreshPending();
    if (btn.dataset.tab === "live") refreshLiveState();
  });
});

// ── Helpers ────────────────────────────────────────────────────────────────────
// HTML 属性/文本转义，用于所有 innerHTML 插值（防 XSS：LLM 返回 / 用户输入都可能含 HTML）
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { error: `HTTP ${res.status}` };
  return res.json();
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) return {};
  return res.json();
}

function fmt(n) {
  if (n === undefined || n === null) return "—";
  const locale = currentLang === "en" ? "en-US" : "zh-TW";
  return Number(n).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── State breakdown renderer ───────────────────────────────────────────────────
function renderStateBreakdown(state, targetId) {
  if (!state) return;
  const el = document.getElementById(targetId);
  if (!el) return;

  const section = (title, rows) => {
    const visible = rows.filter(([, v]) => v !== undefined && v !== null && Number(v) !== 0);
    if (visible.length === 0) return "";
    return `
    <div class="state-section">
      <h3>${title}</h3>
      <table class="state-table">
        ${visible.map(([k, v]) => `<tr><td>${k}</td><td class="num">${fmt(v)}</td></tr>`).join("")}
      </table>
    </div>`;
  };

  el.innerHTML = `<div class="state-grid">
    ${section(t("state.assets"), [
      [t("state.cash"), state.assets?.cash],
      [t("state.financial"), state.assets?.financial],
      [t("state.tradeable"), state.assets?.tradeable],
      [t("state.other"), state.assets?.other],
    ])}
    ${section(t("state.liabilities"), [
      [t("state.shortTerm"), state.liabilities?.shortTerm],
      [t("state.pendingLiab"), state.liabilities?.pending],
    ])}
    ${section(t("state.income"), [
      [t("state.regular"), state.income?.regular],
      [t("state.grant"), state.income?.grant],
      [t("state.trade"), state.income?.tradeRealized],
      [t("state.broker"), state.income?.broker],
      [t("state.intangibleInc"), state.income?.intangibleRealized],
    ])}
    ${section(t("state.expenses"), [
      [t("state.life"), state.expenses?.life],
      [t("state.system"), state.expenses?.system],
      [t("state.debtInt"), state.expenses?.debtInterest],
      [t("state.tradeLoss"), state.expenses?.tradeLoss],
      [t("state.abnormal"), state.expenses?.abnormalLoss],
    ])}
    ${section(t("state.restricted"), [
      [t("state.stateFunds"), state.restricted?.stateFunds],
      [t("state.foundation"), state.restricted?.foundationFunds],
      [t("state.political"), state.restricted?.politicalFunds],
      [t("state.private"), state.restricted?.privateFunds],
    ])}
    ${section(t("state.pending"), [
      [t("state.riskReserve"), state.pending?.riskReserve],
      [t("state.speculative"), state.pending?.speculative],
    ])}
    ${section(t("state.intangible"), [
      [t("state.formal"), state.intangible?.formal],
      [t("state.speculative"), state.intangible?.speculative],
    ])}
    ${section(t("state.reserve"), [
      [t("state.emergency"), state.reserve?.emergencyReserve],
    ])}
  </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH TAB
// ═══════════════════════════════════════════════════════════════════════════════

let events = [];

const SAMPLE_ZH = [
  { id: "e1", timestamp: "2026-04-01T09:00:00", amount: 32000, assetType: "cash", source: "公司", destination: "银行账户", description: "四月份薪资", rawCategoryHint: "SALARY_IN", timeTag: "PERIODIC" },
  { id: "e2", timestamp: "2026-04-02T12:30:00", amount: 380, assetType: "cash", source: "银行账户", destination: "便利商店", description: "午餐与日用品", rawCategoryHint: "LIVING_EXPENSE", timeTag: "ONE_OFF" },
  { id: "e3", timestamp: "2026-04-03T10:00:00", amount: 5000, assetType: "cash", source: "银行账户", destination: "券商", description: "买入指数基金", rawCategoryHint: "INVESTMENT_BUY", timeTag: "ONE_OFF" },
  { id: "e4", timestamp: "2026-04-05T14:00:00", amount: 15000, assetType: "cash", source: "科技部", destination: "银行账户", description: "研究项目经费拨款", rawCategoryHint: "RESTRICTED_FUND_IN", restrictionHint: "STATE", riskTags: ["RESTRICTED_USE"], timeTag: "EVENT_DRIVEN" },
  { id: "e5", timestamp: "2026-04-06T16:00:00", amount: 260, assetType: "cash", source: "网购平台", destination: "银行账户", description: "退货退款", rawCategoryHint: "REFUND", timeTag: "ONE_OFF" },
  { id: "e6", timestamp: "2026-04-08T11:00:00", amount: 8000, assetType: "cash", source: "朋友", destination: "银行账户", description: "向朋友借款应急", rawCategoryHint: "BORROWED_MONEY_IN", timeTag: "TEMPORARY" },
  { id: "e7", timestamp: "2026-04-10T09:00:00", amount: 1200, assetType: "cash", source: "银行账户", destination: "房东", description: "水电押金", rawCategoryHint: "DEPOSIT_IN", timeTag: "ONE_OFF" },
  { id: "e8", timestamp: "2026-04-12T15:00:00", amount: 500, assetType: "cash", source: "银行账户", destination: "平台", description: "充值平台积分", rawCategoryHint: "POINT_TOPUP", timeTag: "ONE_OFF" },
  { id: "e9", timestamp: "2026-04-15T10:00:00", amount: 3200, assetType: "cash", source: "陌生转账", destination: "银行账户", description: "来源不明的转入款，待核实", rawCategoryHint: "DISPUTED_RECEIPT", riskTags: ["PENDING_REVIEW", "ABNORMAL_SOURCE"], timeTag: "EVENT_DRIVEN" },
];

const SAMPLE_EN = [
  { id: "e1", timestamp: "2026-04-01T09:00:00", amount: 5000, assetType: "cash", source: "Employer", destination: "Bank Account", description: "April salary", rawCategoryHint: "SALARY_IN", timeTag: "PERIODIC" },
  { id: "e2", timestamp: "2026-04-02T12:30:00", amount: 65, assetType: "cash", source: "Bank Account", destination: "Grocery Store", description: "Lunch and groceries", rawCategoryHint: "LIVING_EXPENSE", timeTag: "ONE_OFF" },
  { id: "e3", timestamp: "2026-04-03T10:00:00", amount: 800, assetType: "cash", source: "Bank Account", destination: "Brokerage", description: "Buy index fund", rawCategoryHint: "INVESTMENT_BUY", timeTag: "ONE_OFF" },
  { id: "e4", timestamp: "2026-04-05T14:00:00", amount: 2000, assetType: "cash", source: "Ministry of Science", destination: "Bank Account", description: "Research project grant", rawCategoryHint: "RESTRICTED_FUND_IN", restrictionHint: "STATE", riskTags: ["RESTRICTED_USE"], timeTag: "EVENT_DRIVEN" },
  { id: "e5", timestamp: "2026-04-06T16:00:00", amount: 40, assetType: "cash", source: "Online Shop", destination: "Bank Account", description: "Return refund", rawCategoryHint: "REFUND", timeTag: "ONE_OFF" },
  { id: "e6", timestamp: "2026-04-08T11:00:00", amount: 1200, assetType: "cash", source: "Friend", destination: "Bank Account", description: "Emergency loan from friend", rawCategoryHint: "BORROWED_MONEY_IN", timeTag: "TEMPORARY" },
  { id: "e7", timestamp: "2026-04-10T09:00:00", amount: 200, assetType: "cash", source: "Bank Account", destination: "Landlord", description: "Utility security deposit", rawCategoryHint: "DEPOSIT_IN", timeTag: "ONE_OFF" },
  { id: "e8", timestamp: "2026-04-12T15:00:00", amount: 80, assetType: "cash", source: "Bank Account", destination: "Platform", description: "Top up platform credits", rawCategoryHint: "POINT_TOPUP", timeTag: "ONE_OFF" },
  { id: "e9", timestamp: "2026-04-15T10:00:00", amount: 500, assetType: "cash", source: "Unknown Transfer", destination: "Bank Account", description: "Unidentified inbound transfer, pending review", rawCategoryHint: "DISPUTED_RECEIPT", riskTags: ["PENDING_REVIEW", "ABNORMAL_SOURCE"], timeTag: "EVENT_DRIVEN" },
];

function sampleEvents() {
  return currentLang === "en" ? SAMPLE_EN : SAMPLE_ZH;
}

function blankEvent() {
  const maxId = events.reduce((n, e) => {
    const m = String(e.id).match(/\d+$/);
    return m ? Math.max(n, Number(m[0])) : n;
  }, 0);
  return {
    id: `e${maxId + 1}`,
    _uuid: crypto.randomUUID(),
    _createdAt: new Date().toISOString(),
    timestamp: new Date().toISOString().slice(0, 19),
    amount: 0,
    assetType: "cash",
    source: "",
    destination: "",
    description: "",
    rawCategoryHint: "UNKNOWN_EVENT",
    restrictionHint: "",
    riskTags: ["NORMAL"],
    timeTag: "EVENT_DRIVEN",
  };
}

// ── Event editor modal ─────────────────────────────────────────────────────────
let editingIdx = null;

function ruleSelect(currentVal) {
  const docs = currentLang === "en" ? RULE_DOCS_EN : RULE_DOCS;
  const opts = Object.entries(docs).map(([key, desc]) =>
    `<option value="${key}" ${key === currentVal ? "selected" : ""}>${key} — ${desc}</option>`
  ).join("");
  return `<select data-key="rawCategoryHint">${opts}</select>`;
}

function openEditor(idx) {
  editingIdx = idx;
  const e = events[idx];
  const makeSelect = (key, options, current) => {
    const opts = options.map(([val, label]) =>
      `<option value="${val}" ${val === current ? "selected" : ""}>${label}</option>`
    ).join("");
    return `<select data-key="${key}">${opts}</select>`;
  };

  const makeCheckboxes = (key, options, current) => {
    const active = new Set(current || []);
    return `<div class="checkbox-group" data-key="${key}">` +
      options.map(([val, label]) =>
        `<label class="checkbox-item"><input type="checkbox" data-cb="${key}" value="${val}" ${active.has(val) ? "checked" : ""}> ${label}</label>`
      ).join("") + `</div>`;
  };

  // 币种 options（基于 FX 配置里已定义币种 + 事件当前值）
  const fxCfg = getFxConfig();
  const eventCcy = e.currency ?? fxCfg.baseCurrency;
  const ccyList = fxCurrencies(fxCfg).slice();
  if (!ccyList.includes(eventCcy)) ccyList.push(eventCcy); // 兼容事件持有不在配置里的币种
  const ccyOptsHtml = ccyList.map(c => {
    const label = fxCfg.names[c] ?? KNOWN_CURRENCIES[c];
    const text = label ? `${c} · ${label}` : c;
    return `<option value="${c}"${c === eventCcy ? " selected" : ""}>${text}</option>`;
  }).join("");

  document.getElementById("editorTitle").textContent = `${t("editor.title")} #${idx + 1}`;
  document.getElementById("editorFields").innerHTML =
    `<label style="grid-column:1/-1">${t("editor.rule")}<br>${ruleSelect(e.rawCategoryHint)}</label>` +
    `<label>${t("editor.id")}<input data-key="id" type="text" value="${e.id ?? ""}"></label>` +
    `<label>${t("editor.timestamp")}<input data-key="timestamp" type="text" value="${e.timestamp ?? ""}"></label>` +
    `<label>${t("editor.amount")}<input data-key="amount" type="number" value="${e.amount ?? 0}"></label>` +
    `<label>${t("editor.currency")}<br><select data-key="currency">${ccyOptsHtml}</select></label>` +
    `<label>${t("editor.assetType")}<br>${makeSelect("assetType", ASSET_TYPES(), e.assetType ?? "cash")}</label>` +
    `<label>${t("editor.source")}<input data-key="source" type="text" value="${e.source ?? ""}"></label>` +
    `<label>${t("editor.destination")}<input data-key="destination" type="text" value="${e.destination ?? ""}"></label>` +
    `<label style="grid-column:1/-1">${t("editor.description")}<input data-key="description" type="text" value="${(e.description ?? "").replaceAll('"', "&quot;")}"></label>` +
    `<label>${t("editor.restriction")}<br>${makeSelect("restrictionHint", RESTRICTION_HINTS(), e.restrictionHint ?? "")}</label>` +
    `<label>${t("editor.timeTag")}<br>${makeSelect("timeTag", TIME_TAGS(), e.timeTag ?? "EVENT_DRIVEN")}</label>` +
    `<label style="grid-column:1/-1">${t("editor.riskTags")}<br>${makeCheckboxes("riskTags", RISK_TAGS(), e.riskTags)}</label>`;
  document.getElementById("editorModal").classList.remove("hidden");
}

document.getElementById("editorSave")?.addEventListener("click", () => {
  if (editingIdx === null) return;
  const oldCcy = events[editingIdx].currency;
  const fields = document.getElementById("editorFields");
  // checkboxes
  const cbGroups = {};
  fields.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    const k = cb.dataset.cb;
    if (!cbGroups[k]) cbGroups[k] = [];
    if (cb.checked) cbGroups[k].push(cb.value);
  });
  Object.entries(cbGroups).forEach(([k, v]) => { events[editingIdx][k] = v; });
  // inputs & selects
  fields.querySelectorAll("input:not([type=checkbox]), select").forEach((el) => {
    const key = el.dataset.key;
    if (!key) return;
    let val = el.value;
    if (key === "amount") val = Number(val);
    events[editingIdx][key] = val;
  });
  // 币种改了 → 按当前 FX 配置快照重新锁定 fxRate
  const newCcy = events[editingIdx].currency;
  if (newCcy !== oldCcy) {
    const fx = getFxConfig();
    if (!newCcy || newCcy === fx.baseCurrency) {
      events[editingIdx].fxRate = 1;
    } else {
      const r = fx.rates[newCcy];
      if (r > 0) events[editingIdx].fxRate = r;
    }
  }
  document.getElementById("editorModal").classList.add("hidden");
  renderTable();
});

["editorClose", "editorClose2"].forEach((id) => {
  document.getElementById(id)?.addEventListener("click", () => {
    document.getElementById("editorModal").classList.add("hidden");
  });
});

function renderTable() {
  const LABELS = { id: "ID", timestamp: t("field.timestamp"), amount: t("field.amount"), description: t("field.description"), rawCategoryHint: t("field.rule") };
  const cols = Object.keys(LABELS);
  const html = [
    "<table><thead><tr>",
    ...cols.map((c) => `<th>${LABELS[c]}</th>`),
    "<th></th></tr></thead><tbody>",
    ...events.map((e, idx) => {
      const cells = cols.map((c) => {
        const v = e[c] ?? "";
        if (c === "amount") return `<td class="num">${Number(v).toLocaleString()}</td>`;
        if (c === "timestamp") return `<td class="muted">${String(v).slice(0, 10)}</td>`;
        if (c === "rawCategoryHint") return `<td class="muted">${(currentLang === "en" ? RULE_DOCS_EN : RULE_DOCS)[v] ?? v}</td>`;
        return `<td>${String(v)}</td>`;
      }).join("");
      return `<tr>${cells}<td class="row-actions">
        <button data-edit="${idx}" class="btn-icon" title="${t("editor.title")}"><i data-lucide="pencil"></i></button>
        <button data-del="${idx}" class="btn-icon btn-icon-del" title="${currentLang === "en" ? "Delete" : "删除"}"><i data-lucide="trash-2"></i></button>
      </td></tr>`;
    }),
    "</tbody></table>",
  ].join("");
  // Legend beneath table
  const LEGEND_GROUPS_ZH = [
    { label: "💰 收入类", keys: ["SALARY_IN","BROKER_COMMISSION","REIMBURSEMENT_RECEIVED","FOUNDATION_GRANT_IN","RESTRICTED_FUND_IN","FOUNDATION_PAYROLL","POLITICAL_DONATION_IN","INTANGIBLE_LICENSE_REVENUE","RESTRICTED_RELEASE_TO_GRANT","RESTRICTED_RELEASE_FOUNDATION","RESTRICTED_RELEASE_PRIVATE"] },
    { label: "💸 支出类", keys: ["LIVING_EXPENSE","BANK_FEE","DEBT_INTEREST","TAX_PENALTY","TAX_OPTIMIZATION_LEGAL","ABNORMAL_LOSS","POLITICAL_DONATION_OUT","POINT_CONSUME"] },
    { label: "🔄 资产形态转换", keys: ["INVESTMENT_BUY","TRADEABLE_ASSET_BUY","TRADEABLE_ASSET_SELL_GAIN","TRADEABLE_ASSET_SELL_LOSS","DEPOSIT_IN","DEPOSIT_RETURN","POINT_TOPUP","EMERGENCY_RESERVE_CONTRIB","EMERGENCY_RESERVE_RELEASE","INTANGIBLE_FORMAL_RECOGNITION","INTANGIBLE_SPECULATIVE_VALUE","CASH_WITHDRAWAL","E_WALLET_TOPUP","E_WALLET_WITHDRAWAL","INTERNAL_TRANSFER"] },
    { label: "⚖️ 负债类", keys: ["BORROWED_MONEY_IN","DEBT_REPAY","PREPAID_ON_BEHALF","DISPUTED_RECEIPT","TAX_RISK_PENDING","INTERNAL_TRANSFER_CANDIDATE"] },
    { label: "↩️ 修正类", keys: ["REFUND"] },
  ];
  const LEGEND_GROUPS_EN = [
    { label: "💰 Income", keys: ["SALARY_IN","BROKER_COMMISSION","REIMBURSEMENT_RECEIVED","FOUNDATION_GRANT_IN","RESTRICTED_FUND_IN","FOUNDATION_PAYROLL","POLITICAL_DONATION_IN","INTANGIBLE_LICENSE_REVENUE","RESTRICTED_RELEASE_TO_GRANT","RESTRICTED_RELEASE_FOUNDATION","RESTRICTED_RELEASE_PRIVATE"] },
    { label: "💸 Expense", keys: ["LIVING_EXPENSE","BANK_FEE","DEBT_INTEREST","TAX_PENALTY","TAX_OPTIMIZATION_LEGAL","ABNORMAL_LOSS","POLITICAL_DONATION_OUT","POINT_CONSUME"] },
    { label: "🔄 Asset Form Transfer", keys: ["INVESTMENT_BUY","TRADEABLE_ASSET_BUY","TRADEABLE_ASSET_SELL_GAIN","TRADEABLE_ASSET_SELL_LOSS","DEPOSIT_IN","DEPOSIT_RETURN","POINT_TOPUP","EMERGENCY_RESERVE_CONTRIB","EMERGENCY_RESERVE_RELEASE","INTANGIBLE_FORMAL_RECOGNITION","INTANGIBLE_SPECULATIVE_VALUE","CASH_WITHDRAWAL","E_WALLET_TOPUP","E_WALLET_WITHDRAWAL","INTERNAL_TRANSFER"] },
    { label: "⚖️ Liability", keys: ["BORROWED_MONEY_IN","DEBT_REPAY","PREPAID_ON_BEHALF","DISPUTED_RECEIPT","TAX_RISK_PENDING","INTERNAL_TRANSFER_CANDIDATE"] },
    { label: "↩️ Correction", keys: ["REFUND"] },
  ];
  const docs    = currentLang === "en" ? RULE_DOCS_EN : RULE_DOCS;
  const groups  = currentLang === "en" ? LEGEND_GROUPS_EN : LEGEND_GROUPS_ZH;
  const legendIntro = currentLang === "en"
    ? `The <strong>Classification Rule</strong> column tells LASA how to account for each transaction — which account class it belongs to and how it affects your balances. You can fill it in manually, or use <em>AI Auto-classify</em> to fill it automatically. Click a rule below to copy its key.`
    : `<strong>分类规则</strong>列告诉 LASA 每笔事件属于哪个账类、怎么影响余额。你可以手动填入，也可以用「✨ AI 批量补全分类」自动填好。点击下方规则可复制代号。`;

  const ID_LEGEND = currentLang === "en" ? [
    { code: "e1, e2…", desc: "Event ID — e stands for \"event\". Assigned automatically on import, or set manually." },
  ] : [
    { code: "e1, e2…", desc: "事件编号——e 代表 event（事件）。导入时自动分配，也可手动填写。" },
  ];

  const idLegendHtml = `
    <div class="rule-legend-group">
      <div class="rule-legend-group-label">${currentLang === "en" ? "🔖 ID format" : "🔖 ID 格式说明"}</div>
      <div class="rule-legend-chips">
        ${ID_LEGEND.map(item => `<span class="rule-chip rule-chip-id"><code>${item.code}</code><span class="rule-chip-desc">${item.desc}</span></span>`).join("")}
      </div>
    </div>`;

  const legendHtml = `
    <details class="rule-legend">
      <summary class="rule-legend-summary">${currentLang === "en" ? "📖 What do these rule codes mean?" : "📖 分类规则 & ID 格式说明"}</summary>
      <div class="rule-legend-body">
        ${idLegendHtml}
        <p class="rule-legend-intro" style="margin-top:4px">${legendIntro}</p>
        ${groups.map(g => `
          <div class="rule-legend-group">
            <div class="rule-legend-group-label">${g.label}</div>
            <div class="rule-legend-chips">
              ${g.keys.map(k => `<span class="rule-chip" title="${currentLang === "en" ? "Click to copy" : "点击复制"}: ${k}" data-copy="${k}"><span class="rule-chip-desc">${docs[k] ?? k}</span><code>${k}</code></span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </details>`;
  document.getElementById("eventTableWrap").innerHTML = html + legendHtml;

  document.getElementById("eventTableWrap").querySelectorAll("button[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openEditor(Number(btn.dataset.edit)));
  });
  document.getElementById("eventTableWrap").querySelectorAll("button[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      events.splice(Number(btn.dataset.del), 1);
      renderTable();
    });
  });
  // Click-to-copy rule chips
  document.getElementById("eventTableWrap").querySelectorAll(".rule-chip[data-copy]").forEach(chip => {
    chip.style.cursor = "pointer";
    chip.addEventListener("click", () => {
      const key = chip.dataset.copy;
      navigator.clipboard.writeText(key).then(() => {
        const orig = chip.querySelector(".rule-chip-desc").textContent;
        chip.querySelector(".rule-chip-desc").textContent = currentLang === "en" ? "Copied!" : "已复制";
        setTimeout(() => { chip.querySelector(".rule-chip-desc").textContent = orig; }, 1200);
      });
    });
  });

  if (window.lucide) lucide.createIcons();
}

document.getElementById("loadSampleBtn").addEventListener("click", () => {
  events = sampleEvents();
  renderTable();
  document.getElementById("rawInput").value = JSON.stringify(events, null, 2);
});

document.getElementById("addEventBtn").addEventListener("click", () => {
  events.push(blankEvent());
  renderTable();
});

function mergeEvents(existing, incoming) {
  const existingIds = new Set(existing.map(e => e.id));
  // Find the highest e{n} number already used
  let maxN = 0;
  for (const id of existingIds) {
    const m = id.match(/^e(\d+)$/);
    if (m) maxN = Math.max(maxN, parseInt(m[1]));
  }
  const deduped = incoming.map(e => {
    if (!existingIds.has(e.id)) { existingIds.add(e.id); return e; }
    // ID collision: assign next e{n}
    const newId = `e${++maxN}`;
    existingIds.add(newId);
    return { ...e, id: newId };
  });
  return [...existing, ...deduped];
}

function normalizeIds(evList, startIdx) {
  // IDs that don't start with a letter (e.g. bank serial numbers like 20260301001)
  // get renamed to e{n}; user IDs like e1, apr-01 are left untouched
  let counter = startIdx;
  return evList.map(e => {
    if (e.id && !/^[a-zA-Z]/.test(e.id)) {
      return { ...e, id: `e${counter++}` };
    }
    return e;
  });
}

function applyImport(incoming, mode) {
  if (mode === "append") {
    const startIdx = events.length + 1;
    events = mergeEvents(events, normalizeIds(incoming, startIdx));
  } else {
    events = normalizeIds(incoming, 1);
  }
  renderTable();
  document.getElementById("eventTableWrap").scrollIntoView({ behavior: "smooth", block: "start" });
}

function pickFileAndImport(accept, endpoint) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = true;
  input.style.display = "none";
  document.body.appendChild(input);
  input.addEventListener("change", async () => {
    const files = Array.from(input.files || []);
    document.body.removeChild(input);
    if (!files.length) return;

    // Parse all files in parallel
    const results = await Promise.all(files.map(async (file) => {
      const content = await file.text();
      const data = await postJson(endpoint, { content });
      return { file, evs: data.events || [] };
    }));

    // Sort each file's events by earliest timestamp, then sort files by that
    const sorted = results
      .filter(r => r.evs.length)
      .map(r => {
        const earliest = r.evs
          .map(e => e.timestamp ? new Date(e.timestamp).getTime() : Infinity)
          .reduce((a, b) => Math.min(a, b), Infinity);
        return { ...r, earliest };
      })
      .sort((a, b) => a.earliest - b.earliest);

    if (!sorted.length) return;

    // Merge all files in chronological order (dedup IDs within the batch)
    let incoming = [];
    const seenIds = new Set();
    let batchMaxN = 0;
    for (const { evs } of sorted) {
      for (const e of evs) {
        const m = e.id && e.id.match(/^e(\d+)$/);
        if (m) batchMaxN = Math.max(batchMaxN, parseInt(m[1]));
      }
    }
    for (const { evs } of sorted) {
      for (const e of evs) {
        let id = e.id;
        if (seenIds.has(id)) {
          id = `e${++batchMaxN}`;
        }
        seenIds.add(id);
        incoming.push(id === e.id ? e : { ...e, id });
      }
    }

    // Renumber all events sequentially e1, e2, e3… in merged order
    incoming = incoming.map((e, i) => ({ ...e, id: `e${i + 1}` }));

    // Update textarea preview with merged content
    document.getElementById("rawInput").value =
      JSON.stringify(incoming.map(({ id, timestamp, amount, assetType, source, destination, description }) =>
        ({ id, timestamp, amount, assetType, source, destination, description })), null, 2);

    const fileLabel = sorted.length === 1
      ? sorted[0].file.name
      : (currentLang === "en" ? `${sorted.length} files` : `${sorted.length} 个文件`);

    // 根据 checkbox 决定模式：默认追加；列表为空时强制替换
    const replaceToggle = document.getElementById("importReplaceToggle");
    const mode = !events.length || (replaceToggle && replaceToggle.checked) ? "replace" : "append";
    applyImport(incoming, mode);
  });
  input.click();
}

document.getElementById("importJsonBtn").addEventListener("click", () => {
  pickFileAndImport(".json,application/json", "/import/json");
});

document.getElementById("importCsvBtn").addEventListener("click", () => {
  pickFileAndImport(".csv,text/csv", "/import/csv");
});

// 📱 OCR 截图批量导入：银行 App / 支付宝 / 微信支付流水截图
(function () {
  const btn = document.getElementById("importOcrBulkBtn");
  const input = document.getElementById("ocrBulkInput");
  const statusEl = document.getElementById("ocrBulkStatus");
  if (!btn || !input) return;

  async function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }

  // 轻度放大（≥1600px 宽，最多 2×），截图本身通常已清晰，不做灰度/对比度以保留色彩细节
  async function lightPreprocess(file) {
    return new Promise(resolve => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(Math.max(1600 / img.width, 1), 2);
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        c.toBlob(b => resolve(b || file), "image/png");
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  btn.addEventListener("click", () => {
    const { apiKey } = getLLMConfig();
    if (!apiKey) { alert(t("batch.ocrBulkNoKey")); return; }
    input.click();
  });

  input.addEventListener("change", async () => {
    const files = Array.from(input.files || []);
    input.value = "";
    if (!files.length) return;
    const { apiKey } = getLLMConfig();
    const t0 = Date.now();
    const dots = [0, 1, 2].map(i =>
      `<span style="width:6px;height:6px;border-radius:50%;background:var(--accent,#4ea1ff);display:inline-block;animation:aiDotBounce 1.4s ${[-0.32,-0.16,0][i]}s infinite ease-in-out both"></span>`
    ).join("");
    const label = () => files.length === 1
      ? t("batch.ocrBulkScanning")
      : `${t("batch.ocrBulkScanning")} [${files.length} 张]`;
    statusEl.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px"><span style="display:inline-flex;gap:4px">${dots}</span><span id="ocrBulkProgress">${label()}</span></span>`;
    statusEl.classList.remove("hidden");
    const progEl = document.getElementById("ocrBulkProgress");
    const tick = setInterval(() => {
      if (!progEl.isConnected) return;
      progEl.textContent = `${label()} (${Math.round((Date.now() - t0) / 1000)}s)`;
    }, 500);
    btn.disabled = true;

    try {
      // 多张截图并行识别（每张独立一次 VLM 调用）
      const results = await Promise.all(files.map(async (file) => {
        const processed = await lightPreprocess(file);
        const image = await blobToDataURL(processed);
        const resp = await postJson("/llm/ocr-bulk", { image, apiKey, lang: currentLang });
        return { file, resp };
      }));
      clearInterval(tick);

      const fx = getFxConfig();
      const allTx = [];
      const errs = [];
      for (const { file, resp } of results) {
        if (resp.error) { errs.push(`${file.name}: ${resp.error}`); continue; }
        if (Array.isArray(resp.transactions)) allTx.push(...resp.transactions);
      }

      const incoming = allTx.map((tx, i) => {
        const ccy = (tx.currency || fx.baseCurrency).toUpperCase();
        const rate = ccy === fx.baseCurrency ? 1 : (fx.rates[ccy] > 0 ? fx.rates[ccy] : 1);
        const amt = Math.abs(parseFloat(String(tx.amount).replace(/[,，\s]/g, ".")) || 0);
        const date = tx.date && /^\d{4}-\d{2}-\d{2}$/.test(tx.date) ? tx.date : new Date().toISOString().slice(0, 10);
        return {
          id: `_${i}`, // 下划线开头，让 applyImport → normalizeIds 自动重编 e{n}
          timestamp: `${date}T12:00:00`,
          amount: amt,
          currency: ccy,
          fxRate: rate,
          assetType: "cash",
          source: tx.direction === "in" ? (tx.merchant || "") : "",
          destination: tx.merchant || "",
          description: tx.description || tx.merchant || "",
          rawCategoryHint: tx.hint || "",
          riskTags: ["NORMAL"],
          timeTag: "ONE_OFF",
        };
      }).filter(e => e.amount > 0);

      if (incoming.length === 0) {
        statusEl.textContent = errs.length ? `❌ ${errs.join("; ")}` : t("batch.ocrBulkNone");
        return;
      }

      // 读 checkbox：默认追加，勾选或列表为空时替换 —— 与 JSON/CSV 导入一致
      const replaceToggle = document.getElementById("importReplaceToggle");
      const mode = !events.length || (replaceToggle && replaceToggle.checked) ? "replace" : "append";
      applyImport(incoming, mode);
      const tail = errs.length ? ` (${errs.length} 张失败: ${errs.join("; ")})` : "";
      statusEl.textContent = t("batch.ocrBulkAdded").replace("{n}", incoming.length) + tail;
    } catch (e) {
      clearInterval(tick);
      statusEl.textContent = `❌ ${String(e)}`;
    } finally {
      btn.disabled = false;
    }
  });
})();

// ── 语义日志格式化（折叠原始向量，只显示有意义的字段）────────────────────────
function formatSemanticLog(log) {
  if (!log || typeof log !== "object") return "";
  const en = currentLang === "en";
  const entries = Object.entries(log);
  if (entries.length === 0) return en ? "(no semantic entries)" : "（无语义记录）";

  return entries.map(([id, ctx]) => {
    const scores = ctx.semanticScores ?? {};
    const sims   = ctx.prototypeSimilarity ?? {};
    const topScore = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    const topSim   = Object.entries(sims).sort((a, b) => b[1] - a[1])[0];

    const lnVars = [
      `lhs=${(ctx.lhsLnVar ?? 0).toFixed(4)}`,
      `nbr=${(ctx.neighborLnVar ?? 0).toFixed(4)}`,
      `orb=${(ctx.orbitLnVar ?? 0).toFixed(4)}`,
      `tot=${(ctx.totalLnVar ?? 0).toFixed(4)}`,
    ].join("  ");

    const scoreStr = Object.entries(scores).length > 0
      ? Object.entries(scores)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k, v]) => `${k}=${v.toFixed(3)}`)
          .join("  ")
      : (en ? "—" : "—");

    const simStr = Object.entries(sims).length > 0
      ? Object.entries(sims)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([k, v]) => `${k}=${v.toFixed(3)}`)
          .join("  ")
      : (en ? "—" : "—");

    const vecLen = (ctx.lhsVector ?? []).length;

    return [
      `[${id}]`,
      `  ln(var)       ${lnVars}`,
      `  scores        ${scoreStr}`,
      `  similarity    ${simStr}`,
      `  vector dim    ${vecLen}  ${en ? "(raw collapsed)" : "（原始向量已折叠）"}`,
    ].join("\n");
  }).join("\n\n");
}

// ── 大雄妈妈赤字/盈余功能（白皮书 §13.2–13.3）──────────────────────────────
function generateCommentary(summary, state) {
  const en = currentLang === "en";
  const s = state ?? {};
  const lines = [];

  // ── §13.2 一句话总结：盈余/赤字 ──
  const op = summary.operatingResult ?? 0;
  const income = summary.totalIncome ?? 0;
  const expense = summary.totalExpense ?? 0;
  const opLabel = op > 0 ? (en ? "SURPLUS" : "盈余") : op < 0 ? (en ? "DEFICIT" : "赤字") : (en ? "BREAKEVEN" : "收支平衡");
  lines.push(en
    ? `[ ${opLabel} ${fmt(Math.abs(op))} ]  Income ${fmt(income)}  /  Expenses ${fmt(expense)}`
    : `[ ${opLabel} ${fmt(Math.abs(op))} ]  收入 ${fmt(income)}  /  支出 ${fmt(expense)}`);
  lines.push("");

  // ── §13.2 真花掉 vs 转形 ──
  const realExpense = (s.expenses?.life ?? 0) + (s.expenses?.system ?? 0) + (s.expenses?.debtInterest ?? 0);
  const tradeLoss   = s.expenses?.tradeLoss ?? 0;
  const abnormal    = s.expenses?.abnormalLoss ?? 0;
  const investOut   = (s.assets?.tradeable ?? 0) + (s.assets?.financial ?? 0); // 资金转为投资资产（转形）
  const restricted  = (s.restricted?.stateFunds ?? 0) + (s.restricted?.foundationFunds ?? 0)
                    + (s.restricted?.politicalFunds ?? 0) + (s.restricted?.privateFunds ?? 0);
  const pending     = (s.pending?.riskReserve ?? 0) + (s.pending?.speculative ?? 0);
  const emergency   = s.reserve?.emergencyReserve ?? 0;

  lines.push(en ? "── What was actually spent:" : "── 真正花掉的：");
  lines.push(`  ${en ? "Living / System / Interest" : "生活 / 系统 / 利息"}  ${fmt(realExpense)}`);
  if (tradeLoss > 0)  lines.push(`  ${en ? "Trade losses" : "交易亏损"}  ${fmt(tradeLoss)}`);
  if (abnormal > 0)   lines.push(`  ${en ? "Abnormal losses" : "异常损失"}  ${fmt(abnormal)}`);
  lines.push("");

  lines.push(en ? "── Shape-shifted (not spent, form changed):" : "── 转形的（没花掉，只是形态变了）：");
  if (investOut > 0)
    lines.push(`  ${en ? "Into investments / financial assets" : "转入投资/金融资产"}  ${fmt(investOut)}`);
  if (restricted > 0)
    lines.push(`  ${en ? "Locked as restricted funds" : "转为受限资金锁定"}  ${fmt(restricted)}`);
  if (emergency > 0)
    lines.push(`  ${en ? "Parked in emergency reserve" : "拨入紧急预备金"}  ${fmt(emergency)}`);
  if (investOut + restricted + emergency === 0)
    lines.push(`  ${en ? "(none this period)" : "（本期无）"}`);
  lines.push("");

  // ── §13.2 看起来有但不能动 ──
  const frozen = restricted + pending + emergency;
  if (frozen > 0) {
    lines.push(en ? "── Exists but not freely usable:" : "── 有但不能自由动用：");
    if (restricted > 0) lines.push(`  ${en ? "Restricted" : "受限资金"}  ${fmt(restricted)}`);
    if (pending > 0)    lines.push(`  ${en ? "Pending / speculative" : "待确认/推演"}  ${fmt(pending)}`);
    if (emergency > 0)  lines.push(`  ${en ? "Emergency reserve" : "紧急预备金"}  ${fmt(emergency)}`);
    lines.push("");
  }

  // ── §13.3 谁最吃钱 ──
  const buckets = [
    [en ? "Living expenses" : "生活费用",   s.expenses?.life ?? 0],
    [en ? "System expenses" : "系统费用",   s.expenses?.system ?? 0],
    [en ? "Debt interest"   : "利息费用",   s.expenses?.debtInterest ?? 0],
    [en ? "Trade losses"    : "交易亏损",   tradeLoss],
    [en ? "Abnormal losses" : "异常损失",   abnormal],
  ].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (buckets.length > 0) {
    lines.push(en ? "── Biggest cost driver:" : "── 最吃钱的项目：");
    lines.push(`  ${buckets[0][0]}  ${fmt(buckets[0][1])}`);
    lines.push("");
  }

  // ── §13.3 仍在待确认/异常层 ──
  if (pending > 0 || abnormal > 0) {
    lines.push(en ? "── Still in pending / abnormal layer:" : "── 仍停留在待确认/异常层：");
    if (pending > 0)  lines.push(`  ${en ? "Pending / speculative" : "待确认/推演"}  ${fmt(pending)}  ← ${en ? "not income yet" : "尚未归入收益"}`);
    if (abnormal > 0) lines.push(`  ${en ? "Abnormal losses" : "异常损失"}  ${fmt(abnormal)}  ← ${en ? "review recommended" : "建议复核"}`);
    lines.push("");
  }

  // ── 自由净资产变化 ──
  const fna = summary.freeNetAssets ?? 0;
  const fnaChange = summary.freeNetAssetChange ?? 0;
  const arrow = fnaChange > 0 ? "↑" : fnaChange < 0 ? "↓" : "→";
  lines.push(en
    ? `Free net assets: ${fmt(fna)}  ${arrow} ${fmt(Math.abs(fnaChange))} this period`
    : `自由净资产：${fmt(fna)}  ${arrow} 本期变化 ${fmt(Math.abs(fnaChange))}`);

  return lines.join("\n");
}

let lastRunResult = null;

document.getElementById("runBtn").addEventListener("click", async () => {
  const fx = getFxConfig();
  const data = await postJson("/run", {
    initialCash: Number(document.getElementById("initialCash").value),
    emergencyReserve: Number(document.getElementById("emergencyReserve").value),
    baseCurrency: fx.baseCurrency,
    events,
  });
  document.getElementById("summaryText").textContent = generateCommentary(data.summary, data.state);
  document.getElementById("summaryJson").textContent = JSON.stringify(data.summary, null, 2);
  document.getElementById("semanticJson").textContent = formatSemanticLog(data.semanticLog);
  renderStateBreakdown(data.state, "stateBreakdown");
  lastRunResult = data;
  document.getElementById("exportCard").classList.remove("hidden");
  document.getElementById("aiAnalysisCard").classList.remove("hidden");
  document.getElementById("aiAnalysisResult").textContent = "";
});

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("exportJsonBtn").addEventListener("click", () => {
  if (!lastRunResult) return;
  const aiText = document.getElementById("aiAnalysisResult")?.innerText?.trim();
  const payload = {
    exportedAt: new Date().toISOString(),
    events,
    summary: lastRunResult.summary,
    summaryText: lastRunResult.summaryText,
    aiAnalysis: aiText || null,
    semanticLog: lastRunResult.semanticLog,
    state: lastRunResult.state,
  };
  downloadFile(`lasa-result-${Date.now()}.json`, JSON.stringify(payload, null, 2), "application/json");
});

document.getElementById("exportCsvBtn").addEventListener("click", () => {
  if (!lastRunResult) return;
  const cols = ["id", "timestamp", "amount", "currency", "fxRate", "assetType", "source", "destination", "description", "rawCategoryHint", "timeTag", "restrictionHint", "riskTags"];
  const header = cols.join(",");
  const rows = events.map((e) =>
    cols.map((c) => {
      const v = c === "riskTags" ? (e[c] || []).join("|") : (e[c] ?? "");
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(",")
  );
  downloadFile(`lasa-events-${Date.now()}.csv`, [header, ...rows].join("\n"), "text/csv");
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE TAB
// ═══════════════════════════════════════════════════════════════════════════════

async function refreshLiveState() {
  const data = await getJson("/state");
  renderStateBreakdown(data.state, "liveStateBreakdown");
}

document.getElementById("resetEngineBtn").addEventListener("click", async () => {
  if (!confirm(t("confirm.reset"))) return;
  const fx = getFxConfig();
  await postJson("/reset", {
    initialCash: Number(document.getElementById("liveInitCash").value),
    emergencyReserve: Number(document.getElementById("liveInitReserve").value),
    baseCurrency: fx.baseCurrency,
  });
  refreshLiveState();
  refreshPending();
  refreshPeriods();
  // Clear history table
  const wrap = document.getElementById("liveHistoryWrap");
  wrap.innerHTML = `<span class="live-history-empty">${t("live.historyEmpty")}</span>`;
  document.getElementById("eventResult").textContent = "";
});

document.getElementById("fetchStateBtn").addEventListener("click", refreshLiveState);

document.getElementById("submitEventBtn").addEventListener("click", async () => {
  const riskTags = Array.from(document.querySelectorAll("#evRiskBoxes input:checked")).map((cb) => cb.value);
  const fx = getFxConfig();
  const ccy = document.getElementById("evCcy").value || fx.baseCurrency;
  const snapshotRate = ccy === fx.baseCurrency ? 1 : (fx.rates[ccy] > 0 ? fx.rates[ccy] : 1);
  const event = {
    id: document.getElementById("evId").value || `e${Date.now()}`,
    timestamp: document.getElementById("evTs").value,
    amount: Number(document.getElementById("evAmt").value),
    currency: ccy,
    fxRate: snapshotRate,
    assetType: document.getElementById("evAsset").value,
    source: document.getElementById("evSrc").value,
    destination: document.getElementById("evDst").value,
    description: document.getElementById("evDesc").value,
    rawCategoryHint: document.getElementById("evHint").value,
    restrictionHint: document.getElementById("evRestrict").value || undefined,
    riskTags: riskTags.length ? riskTags : ["NORMAL"],
    timeTag: document.getElementById("evTimeTag").value,
  };
  const data = await postJson("/event", event);
  document.getElementById("eventResult").textContent =
    `→ ${data.accountClass}\n` + JSON.stringify(data.semanticContext?.semanticScores ?? {}, null, 2);
  renderStateBreakdown(data.state, "liveStateBreakdown");

  // Sync to batch events list — assign new ID if collision
  let syncEvent = event;
  if (events.find(e => e.id === syncEvent.id)) {
    let maxN = 0;
    events.forEach(e => { const m = e.id.match(/^e(\d+)$/); if (m) maxN = Math.max(maxN, +m[1]); });
    syncEvent = { ...event, id: `e${maxN + 1}` };
  }
  events.push(syncEvent);
  renderTable();

  // Append to history table
  const wrap = document.getElementById("liveHistoryWrap");
  if (!wrap.querySelector("table")) {
    wrap.innerHTML = `<table class="live-history-table"><thead><tr>
      <th>ID</th><th>${t("field.timestamp")}</th><th class="num">${t("field.amount")}</th>
      <th>${t("field.description")}</th><th>${t("field.rule")}</th>
    </tr></thead><tbody></tbody></table>`;
  }
  const cls = data.accountClass ?? "—";
  const ruleDocs = currentLang === "en" ? RULE_DOCS_EN : RULE_DOCS;
  const hintLabel = event.rawCategoryHint
    ? `<span class="muted" style="font-size:0.78rem">${esc(ruleDocs[event.rawCategoryHint] ?? event.rawCategoryHint)}</span>`
    : `<span class="muted">—</span>`;
  const tr = document.createElement("tr");
  const amtDisplay = event.currency && event.currency !== getFxConfig().baseCurrency
    ? `${Number(event.amount).toLocaleString()} <span class="muted" style="font-size:0.72rem">${esc(event.currency)}</span>`
    : Number(event.amount).toLocaleString();
  tr.innerHTML = `<td>${esc(event.id)}</td>
    <td class="muted">${esc(String(event.timestamp).slice(0,10))}</td>
    <td class="num">${amtDisplay}</td>
    <td>${esc(event.description || "—")}</td>
    <td>${hintLabel}</td>`;
  wrap.querySelector("tbody").appendChild(tr);

  // auto-increment ID
  const m = document.getElementById("evId").value.match(/^(.*?)(\d+)$/);
  if (m) document.getElementById("evId").value = m[1] + (Number(m[2]) + 1);
});

// ═══════════════════════════════════════════════════════════════════════════════
// PERIOD TAB
// ═══════════════════════════════════════════════════════════════════════════════

async function refreshPeriods() {
  const data = await getJson("/periods");

  const cur = data.current;
  document.getElementById("currentPeriodInfo").textContent = cur
    ? (currentLang === "en"
        ? `ID: ${cur.id}\nLabel: ${cur.label}\nOpened: ${cur.openedAt}`
        : `ID: ${cur.id}\n标签: ${cur.label}\n开启: ${cur.openedAt}`)
    : t("period.none");

  const list = document.getElementById("periodList");
  if (!data.periods || data.periods.length === 0) {
    list.innerHTML = `<p class='muted'>${t("period.noHistory")}</p>`;
    return;
  }
  list.innerHTML = data.periods.map((p) => `
    <div class="period-card">
      <strong>${p.id}</strong> — ${p.label}<br>
      <span class="muted">${p.openedAt?.slice(0, 10)} → ${p.closedAt?.slice(0, 10) ?? t("period.open_label")}</span>
      ${p.summary ? `<pre>${JSON.stringify(p.summary, null, 2)}</pre>` : ""}
    </div>`).join("");
}

document.getElementById("openPeriodBtn").addEventListener("click", async () => {
  const id = document.getElementById("periodId").value;
  const label = document.getElementById("periodLabel").value;
  const data = await postJson("/period/open", { id, label });
  if (data.error) return alert(data.error);
  refreshPeriods();
});

document.getElementById("closePeriodBtn").addEventListener("click", async () => {
  const data = await postJson("/period/close", {});
  if (data.error) return alert(data.error);
  alert(data.summaryText || t("period.closed"));
  refreshPeriods();
  refreshLiveState();
});

// ═══════════════════════════════════════════════════════════════════════════════
// PENDING TAB
// ═══════════════════════════════════════════════════════════════════════════════

async function refreshPending() {
  const data = await getJson("/pending");
  const list = document.getElementById("pendingList");
  if (!data.items || data.items.length === 0) {
    list.innerHTML = `<p class='muted'>${t("pending.empty")}</p>`;
    return;
  }
  list.innerHTML = `<table>
    <thead><tr><th>${t("pending.col.eventId")}</th><th>${t("pending.col.amount")}</th><th>${t("pending.col.riskTags")}</th><th>${t("pending.col.note")}</th><th>${t("pending.col.registeredAt")}</th></tr></thead>
    <tbody>
    ${data.items.map((item) => `
      <tr>
        <td>${item.eventId}</td>
        <td class="num">${fmt(item.amount)}</td>
        <td>${(item.riskTags || []).join(", ")}</td>
        <td>${item.note || "—"}</td>
        <td>${item.registeredAt?.slice(0, 19) ?? "—"}</td>
      </tr>`).join("")}
    </tbody>
  </table>`;
}

document.getElementById("registerPendingBtn").addEventListener("click", async () => {
  const riskRaw = document.getElementById("pendRisk").value;
  const data = await postJson("/pending/register", {
    eventId: document.getElementById("pendId").value,
    amount: Number(document.getElementById("pendAmt").value),
    riskTags: riskRaw ? riskRaw.split("|").map((s) => s.trim()).filter(Boolean) : ["PENDING_REVIEW"],
    note: document.getElementById("pendNote").value,
  });
  if (data.error) return alert(data.error);
  refreshPending();
});

document.getElementById("confirmPendingBtn").addEventListener("click", async () => {
  const data = await postJson("/pending/confirm", {
    eventId: document.getElementById("confirmId").value,
    targetClass: document.getElementById("confirmClass").value,
  });
  if (data.error) return alert(data.error);
  refreshPending();
  refreshLiveState();
});

document.getElementById("releasePendingBtn").addEventListener("click", async () => {
  if (!confirm(t("confirm.release"))) return;
  const data = await postJson("/pending/release", {
    eventId: document.getElementById("confirmId").value,
  });
  if (data.error) return alert(data.error);
  refreshPending();
  refreshLiveState();
});

// ═══════════════════════════════════════════════════════════════════════════════
// RULES TAB
// ═══════════════════════════════════════════════════════════════════════════════

const ASSET_TYPES_ZH = [
  ["cash",      "现金"], ["financial", "金融资产"], ["tradeable", "可交易资产"],
  ["tax",       "税务"], ["points",    "积分/点数"], ["deposit",  "保证金"], ["other", "其他"],
];
const ASSET_TYPES_EN = [
  ["cash",      "Cash"], ["financial", "Financial Asset"], ["tradeable", "Tradeable Asset"],
  ["tax",       "Tax"], ["points",    "Points / Credits"], ["deposit",  "Deposit"], ["other", "Other"],
];

const TIME_TAGS_ZH = [
  ["ONE_OFF","一次性"],["PERIODIC","周期性"],["LONG_TERM","长期"],
  ["TEMPORARY","临时"],["EVENT_DRIVEN","事件驱动"],
];
const TIME_TAGS_EN = [
  ["ONE_OFF","One-off"],["PERIODIC","Periodic"],["LONG_TERM","Long-term"],
  ["TEMPORARY","Temporary"],["EVENT_DRIVEN","Event-driven"],
];

const RISK_TAGS_ZH = [
  ["NORMAL","正常"],["RESTRICTED_USE","受限使用"],["LEGALLY_SENSITIVE","法律敏感"],
  ["VALUATION_RISK","估值风险"],["LIQUIDITY_RISK","流动性风险"],
  ["HIGH_RISK","高风险"],["ABNORMAL_SOURCE","异常来源"],["PENDING_REVIEW","待审核"],
];
const RISK_TAGS_EN = [
  ["NORMAL","Normal"],["RESTRICTED_USE","Restricted Use"],["LEGALLY_SENSITIVE","Legally Sensitive"],
  ["VALUATION_RISK","Valuation Risk"],["LIQUIDITY_RISK","Liquidity Risk"],
  ["HIGH_RISK","High Risk"],["ABNORMAL_SOURCE","Abnormal Source"],["PENDING_REVIEW","Pending Review"],
];

const RESTRICTION_HINTS_ZH = [
  ["","无"],["STATE","国家经费"],["FOUNDATION","基金会"],["POLITICAL","政治资金"],["PRIVATE","私人受限"],
];
const RESTRICTION_HINTS_EN = [
  ["","None"],["STATE","State Funds"],["FOUNDATION","Foundation"],["POLITICAL","Political"],["PRIVATE","Private"],
];

function ASSET_TYPES()      { return currentLang === "en" ? ASSET_TYPES_EN      : ASSET_TYPES_ZH; }
function TIME_TAGS()        { return currentLang === "en" ? TIME_TAGS_EN        : TIME_TAGS_ZH; }
function RISK_TAGS()        { return currentLang === "en" ? RISK_TAGS_EN        : RISK_TAGS_ZH; }
function RESTRICTION_HINTS(){ return currentLang === "en" ? RESTRICTION_HINTS_EN: RESTRICTION_HINTS_ZH; }

const RULE_DOCS_EN = {
  SALARY_IN: "Salary / payroll income",
  LIVING_EXPENSE: "Daily living expenses",
  INVESTMENT_BUY: "Buy financial asset (form transfer)",
  REFUND: "Refund (reverse living expense)",
  RESTRICTED_FUND_IN: "Restricted fund received (state / private)",
  BORROWED_MONEY_IN: "Borrowed money (short-term liability)",
  PREPAID_ON_BEHALF: "Prepaid on behalf (other asset)",
  REIMBURSEMENT_RECEIVED: "Reimbursement received",
  BROKER_COMMISSION: "Broker commission income",
  TRADEABLE_ASSET_BUY: "Buy tradeable asset",
  TRADEABLE_ASSET_SELL_GAIN: "Sell tradeable asset (gain)",
  TRADEABLE_ASSET_SELL_LOSS: "Sell tradeable asset (loss)",
  INTANGIBLE_LICENSE_REVENUE: "Intangible asset license revenue",
  DEBT_INTEREST: "Debt interest expense",
  RESTRICTED_RELEASE_TO_GRANT: "Release state restricted fund as grant income",
  RESTRICTED_RELEASE_FOUNDATION: "Release foundation fund as grant income",
  RESTRICTED_RELEASE_PRIVATE: "Release private restricted fund as grant income",
  FOUNDATION_GRANT_IN: "Foundation grant received",
  FOUNDATION_PAYROLL: "Foundation payroll",
  POLITICAL_DONATION_OUT: "Political donation out",
  POLITICAL_DONATION_IN: "Political donation in (restricted)",
  TAX_OPTIMIZATION_LEGAL: "Legal tax optimization (reduce interest expense)",
  TAX_RISK_PENDING: "Tax risk (pending reserve)",
  TAX_PENALTY: "Tax penalty (abnormal loss)",
  INTANGIBLE_SPECULATIVE_VALUE: "Intangible speculative valuation",
  INTANGIBLE_FORMAL_RECOGNITION: "Intangible formal recognition (speculative → formal)",
  DEBT_REPAY: "Debt repayment (reduce short-term liability)",
  ABNORMAL_LOSS: "Abnormal loss (theft / damage / write-off)",
  EMERGENCY_RESERVE_CONTRIB: "Contribute to emergency reserve",
  EMERGENCY_RESERVE_RELEASE: "Release emergency reserve",
  POINT_TOPUP: "Top up points / credits (intangible formal asset)",
  POINT_CONSUME: "Consume points / credits (expense)",
  DEPOSIT_IN: "Security deposit paid (other asset)",
  DEPOSIT_RETURN: "Security deposit returned (form transfer)",
  DISPUTED_RECEIPT: "Disputed / unverified receipt (pending + liability)",
  BANK_FEE: "Bank fee (transfer/withdrawal/service charges — real cash outflow)",
  CASH_WITHDRAWAL: "ATM cash withdrawal (bank → physical cash, zero delta)",
  E_WALLET_TOPUP: "E-wallet top-up (bank → e-wallet, zero delta)",
  E_WALLET_WITHDRAWAL: "E-wallet withdrawal (e-wallet → bank, zero delta)",
  INTERNAL_TRANSFER: "Same-owner account-to-account transfer (zero delta)",
  INTERNAL_TRANSFER_CANDIDATE: "Suspected internal transfer, counterparty unclear (pending review)",
};

const RULE_DOCS = {
  SALARY_IN: "工资/薪酬收入",
  LIVING_EXPENSE: "日常生活费用",
  INVESTMENT_BUY: "购买金融资产（形态转换）",
  REFUND: "退款（逆向生活费）",
  RESTRICTED_FUND_IN: "受限资金进入（国家/私人）",
  BORROWED_MONEY_IN: "借入款（短期负债）",
  PREPAID_ON_BEHALF: "代垫款（其他资产）",
  REIMBURSEMENT_RECEIVED: "收回代垫款",
  BROKER_COMMISSION: "经纪佣金收入",
  TRADEABLE_ASSET_BUY: "购买可交易资产",
  TRADEABLE_ASSET_SELL_GAIN: "出售可交易资产（盈利）",
  TRADEABLE_ASSET_SELL_LOSS: "出售可交易资产（亏损）",
  INTANGIBLE_LICENSE_REVENUE: "无形资产授权收入",
  DEBT_INTEREST: "债务利息费用",
  RESTRICTED_RELEASE_TO_GRANT: "国家受限资金转为补助收入",
  RESTRICTED_RELEASE_FOUNDATION: "基金会受限资金转为补助收入",
  RESTRICTED_RELEASE_PRIVATE: "私人受限资金转为补助收入",
  FOUNDATION_GRANT_IN: "基金会补助进入",
  FOUNDATION_PAYROLL: "基金会薪资",
  POLITICAL_DONATION_OUT: "政治捐款支出",
  POLITICAL_DONATION_IN: "政治捐款进入（受限）",
  TAX_OPTIMIZATION_LEGAL: "合法税务优化（减少利息费用）",
  TAX_RISK_PENDING: "税务风险（挂待确认）",
  TAX_PENALTY: "税务罚款（异常损失）",
  INTANGIBLE_SPECULATIVE_VALUE: "无形资产推演估值",
  INTANGIBLE_FORMAL_RECOGNITION: "无形资产正式认定（推演→正式）",
  DEBT_REPAY: "偿还借款（减少短期负债）",
  ABNORMAL_LOSS: "异常损失（盗窃/损毁/核销）",
  EMERGENCY_RESERVE_CONTRIB: "注入紧急预备金",
  EMERGENCY_RESERVE_RELEASE: "释放紧急预备金",
  POINT_TOPUP: "充值积分/点数（无形正式资产）",
  POINT_CONSUME: "消耗积分/点数（费用）",
  DEPOSIT_IN: "缴纳保证金（其他资产）",
  DEPOSIT_RETURN: "退回保证金（形态转换）",
  DISPUTED_RECEIPT: "争议/待核实到款（挂待确认+负债）",
  BANK_FEE: "银行手续费（转账/提款/服务费等真实现金支出）",
  CASH_WITHDRAWAL: "ATM 提款 / 金融卡提（银行存款 → 现金，不损益）",
  E_WALLET_TOPUP: "电子钱包充值（银行 → 电支余额，不损益）",
  E_WALLET_WITHDRAWAL: "电子钱包提领（电支 → 银行，不损益）",
  INTERNAL_TRANSFER: "本人账户对账户转移（不损益）",
  INTERNAL_TRANSFER_CANDIDATE: "疑似内部转移，对手方不明（挂待复核）",
};

async function loadRules() {
  const data = await getJson("/rules");
  const el = document.getElementById("rulesList");
  const rules = data.rules || [];
  const docs = currentLang === "en" ? RULE_DOCS_EN : RULE_DOCS;
  const colKey = currentLang === "en" ? "Rule Key (rawCategoryHint)" : "规则键 (rawCategoryHint)";
  const colDesc = currentLang === "en" ? "Description" : "说明";
  el.innerHTML = `<table>
    <thead><tr><th>${colKey}</th><th>${colDesc}</th></tr></thead>
    <tbody>
    ${rules.map((r) => `<tr>
      <td><code>${r}</code></td>
      <td>${docs[r] ?? "—"}</td>
    </tr>`).join("")}
    </tbody>
  </table>`;
}

// ── Init ──────────────────────────────────────────────────────────────────────
function populateSelect(id, options) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  options.forEach(([val, label]) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    el.appendChild(opt);
  });
}

function rebuildLiveFormSelects() {
  populateSelect("evAsset", ASSET_TYPES());
  populateSelect("evRestrict", RESTRICTION_HINTS());
  populateSelect("evTimeTag", TIME_TAGS());
  populateCurrencySelect(document.getElementById("evCcy"), getFxConfig());

  const evHintEl = document.getElementById("evHint");
  const docs = currentLang === "en" ? RULE_DOCS_EN : RULE_DOCS;
  evHintEl.innerHTML = "";
  Object.entries(docs).forEach(([key, desc]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${key} — ${desc}`;
    evHintEl.appendChild(opt);
  });

  const evRiskBoxes = document.getElementById("evRiskBoxes");
  const prevChecked = new Set(
    Array.from(evRiskBoxes.querySelectorAll("input:checked")).map((cb) => cb.value)
  );
  evRiskBoxes.innerHTML = "";
  RISK_TAGS().forEach(([val, label]) => {
    const lbl = document.createElement("label");
    lbl.className = "checkbox-item";
    const checked = prevChecked.size ? prevChecked.has(val) : val === "NORMAL";
    lbl.innerHTML = `<input type="checkbox" data-risk="${val}" value="${val}" ${checked ? "checked" : ""}> ${label}`;
    evRiskBoxes.appendChild(lbl);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// OCR
// ═══════════════════════════════════════════════════════════════════════════════
(function () {
  const dropEl    = document.getElementById("ocrDrop");
  const inputEl   = document.getElementById("ocrInput");
  const statusEl  = document.getElementById("ocrStatus");
  const previewWrap = document.getElementById("ocrPreviewWrap");
  const previewImg  = document.getElementById("ocrPreview");
  const resultEl  = document.getElementById("ocrResult");
  const applyBtn  = document.getElementById("ocrApplyBtn");
  const aiBtn     = document.getElementById("ocrAiBtn");
  const clearBtn  = document.getElementById("ocrClearBtn");

  let ocrData = {};   // { amount, date, merchant, raw }

  // ── 解析 OCR 文字 ──────────────────────────────────────────────────────────
  function normalizeNumber(s) {
    // 判断是欧式（逗号小数）还是美式（点小数）
    // 欧式特征：末尾是 ,\d{1,2}（如 7,06 / 1,29）
    // 美式特征：末尾是 .\d{1,2}（如 7.06）
    if (/\d{1,3}(?:\.\d{3})*,\d{1,2}$/.test(s)) {
      // 欧式：1.234,56 → 1234.56
      return s.replace(/\./g, "").replace(",", ".");
    } else if (/,\d{1,2}$/.test(s) && !/\.\d/.test(s)) {
      // 简单欧式：7,06 → 7.06
      return s.replace(",", ".");
    }
    // 美式/无小数：去掉千分位逗号
    return s.replace(/,/g, "");
  }

  function parseOcrText(text) {
    const result = {};

    // ── 金额：优先找合计行关键字（多语言），再找货币符号，最后回退 ──
    const totalKeywords = /(?:合計|合计|總計|总计|金額|金额|小計|小计|應付|应付|Gesamt|Summe|Summe:|SUMME|Total|TOTAL|Amount|Subtotal|BEZAHLT|Zu zahlen)[^\d\n]*([\d.,]+)/i;
    const currencyPrefix = /(?:NT\$|TWD|CNY|RMB|EUR|HKD|USD|\$|¥|￥)\s*([\d.,]+)/i;
    const fallbackAmt   = /\b(\d{1,4}[.,]\d{2})\b/g;

    let amtRaw = null;
    const totalMatch = text.match(totalKeywords);
    if (totalMatch) {
      amtRaw = totalMatch[1];
    } else {
      const currMatch = text.match(currencyPrefix);
      if (currMatch) amtRaw = currMatch[1];
      else {
        // 回退 A：收集所有 x.xx / x,xx 格式数字，取最大值
        const all = [...text.matchAll(fallbackAmt)].map(m => parseFloat(normalizeNumber(m[1])));
        if (all.length > 0) {
          amtRaw = String(Math.max(...all));
        } else {
          // 回退 B：OCR 把 "1,98" 读成 ", 19" 时，尝试在同一行重组整数 + 小数碎片
          const lines2 = text.split(/\n/);
          let reconstructed = null;
          for (const line of lines2) {
            const intPart = line.match(/\b(\d{1,4})\b/);
            const decPart = line.match(/[,.\s](\d{2})\b/);
            if (intPart && decPart && intPart.index < decPart.index) {
              const candidate = `${intPart[1]}.${decPart[1]}`;
              // 合理范围：0.01 ~ 9999.99
              const v = parseFloat(candidate);
              if (v > 0 && v < 10000) { reconstructed = candidate; break; }
            }
          }
          if (reconstructed) {
            amtRaw = reconstructed;
          } else {
            // 回退 C：尾部孤立整数（最后手段）
            const loose = text.match(/\b(\d{1,5})\s*$|\b(\d{1,5})\s*\n/m);
            if (loose) amtRaw = (loose[1] || loose[2]);
          }
        }
      }
    }
    if (amtRaw) result.amount = normalizeNumber(amtRaw);

    // ── 日期：多种格式 ──
    const dateMatch = text.match(/(\d{4})[\/\-年.](\d{1,2})[\/\-月.](\d{1,2})/)
                   || text.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
    if (dateMatch) {
      const [, a, b, c] = dateMatch;
      // 判断年份位置
      if (a.length === 4) result.date = `${a}-${b.padStart(2,"0")}-${c.padStart(2,"0")}`;
      else {
        const yr = c.length === 2 ? `20${c}` : c;
        result.date = `${yr}-${b.padStart(2,"0")}-${a.padStart(2,"0")}`;
      }
    }

    // ── 商家：过滤掉杂讯行，取最长的纯文字行（通常是店名） ──
    const NOISE = /^(?:EUR|USD|TWD|CNY|HKD|GBP|JPY|CHF|AUD|KRW|A|AW|AM|\d[\d\s,.:/\\-]+)$/i;
    const lines = text.split(/\n/)
      .map(l => l.trim())
      .filter(l =>
        l.length >= 4 &&
        !/^\d[\d\s,.:]*$/.test(l) &&
        !/^[\W_]+$/.test(l) &&
        !NOISE.test(l) &&
        (l.match(/[a-zA-Z\u4e00-\u9fff]/g) || []).length >= 3
      );
    // 商家：取最靠近顶部、字母密度高的行（店名通常在收据最上方）
    if (lines.length > 0) {
      result.merchant = lines[0].slice(0, 40);
    }

    result.raw = text;
    return result;
  }

  // ── 渲染识别结果 ──────────────────────────────────────────────────────────
  function renderResult(data) {
    ocrData = data;
    if (!data.amount && !data.date && !data.merchant) {
      resultEl.innerHTML = `<span class="muted">${t("ocr.noResult")}</span>`;
      applyBtn.disabled = true;
      return;
    }
    applyBtn.disabled = false;
    const aiTag = data._aiEnhanced
      ? `<span style="font-size:0.75rem;background:var(--btn-primary);color:var(--text);border-radius:4px;padding:1px 6px;margin-left:6px">✨ AI</span>`
      : "";
    const row = (label, val, aiField) => val
      ? `<div class="ocr-field"><span class="ocr-field-label">${esc(label)}</span><span class="ocr-field-value">${esc(val)}${data._aiEnhanced && aiField ? aiTag : ""}</span></div>`
      : "";
    const hintLabel = currentLang === "en" ? "Rule" : "规则";
    const hintRow = data.hint
      ? `<div class="ocr-field"><span class="ocr-field-label">${esc(hintLabel)}</span><span class="ocr-field-value" style="font-size:0.82rem">${esc(data.hint)}${aiTag}</span></div>`
      : "";
    const rawEscaped = esc(data.raw || "");
    resultEl.innerHTML =
      (data._aiEnhanced ? `<div style="font-size:0.8rem;color:var(--muted);margin-bottom:6px">✨ ${currentLang==="en"?"AI enhanced":"AI 已增强"}</div>` : "") +
      row(t("ocr.amount"),   data.amount,   true) +
      row(t("field.currency"), data.currency, true) +
      row(t("ocr.date"),     data.date,     true) +
      row(t("ocr.merchant"), data.merchant, true) +
      hintRow +
      `<details style="margin-top:8px"><summary style="cursor:pointer;color:var(--muted);font-size:0.8rem">${currentLang==="en"?"Raw text":"原始文字"}</summary><pre style="font-size:0.75rem;max-height:160px;overflow-y:auto;margin:4px 0 0">${rawEscaped}</pre></details>`;
  }

  // ── 图像预处理：放大 + 灰度 + 增强对比度（提升 Tesseract 识别率）──────────
  function preprocessImage(file) {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        // 放大到至少 1600px 宽，最大 3×，提升小图识别率
        const scale = Math.min(Math.max(1600 / img.width, 1), 3);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        // 灰度 + 提升对比度 → 让收据印刷文字更清晰
        ctx.filter = "grayscale(1) contrast(1.8) brightness(1.05)";
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), "image/png");
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  // ── Blob → data URL（用于把预处理后的图片一并送给视觉模型） ──────────────
  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload  = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }

  // ── 执行 OCR ──────────────────────────────────────────────────────────────
  async function runOcr(file) {
    previewImg.src = URL.createObjectURL(file);
    previewWrap.classList.remove("hidden");
    statusEl.textContent = t("ocr.scanning");
    statusEl.classList.remove("hidden");
    resultEl.innerHTML = "";
    applyBtn.disabled = true;

    try {
      statusEl.textContent = t("ocr.scanning") + (currentLang === "en" ? " (preprocessing…)" : " (预处理…)");
      const processed = await preprocessImage(file);
      // base64 编码与 Tesseract 识别并行：两者都只读 processed，没有顺序依赖
      const [imageB64, ocrResult] = await Promise.all([
        blobToDataURL(processed).catch(() => null),
        Tesseract.recognize(processed, "chi_tra+chi_sim+eng", {
          logger: m => {
            if (m.status === "recognizing text")
              statusEl.textContent = `${t("ocr.scanning")} ${Math.round(m.progress * 100)}%`;
          },
        }),
      ]);
      statusEl.textContent = t("ocr.done");
      const parsed = parseOcrText(ocrResult.data.text);
      if (imageB64) parsed._imageB64 = imageB64;
      renderResult(parsed);
    } catch (e) {
      statusEl.textContent = String(e);
    }
  }

  // ── AI 增强 OCR ───────────────────────────────────────────────────────────
  aiBtn.addEventListener("click", async () => {
    if (!ocrData.raw) return;
    const { apiKey, model } = getLLMConfig();
    if (!apiKey) {
      alert(currentLang === "en" ? "Please set your API Key in Settings (⚙️)." : "请先在设置（⚙️）中填写 API Key。");
      return;
    }
    const origText = statusEl.textContent;
    statusEl.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px">${currentLang === "en" ? "AI enhancing" : "AI 增强中"}<span style="display:inline-flex;gap:3px">${[0,1,2].map(i=>`<span style="width:5px;height:5px;border-radius:50%;background:var(--accent);display:inline-block;animation:aiDotBounce 1.4s ${[-0.32,-0.16,0][i]}s infinite ease-in-out both"></span>`).join("")}</span></span>`;
    statusEl.classList.remove("hidden");
    aiBtn.disabled = true;
    const data = await postJson("/llm/ocr", {
      text: ocrData.raw,
      image: ocrData._imageB64 || undefined,
      apiKey,
      model,
      lang: currentLang,
    });
    aiBtn.disabled = false;
    statusEl.textContent = origText;
    if (data.error) { alert("AI Error: " + data.error); return; }
    // 合并 AI 结果到 ocrData（AI 优先）
    ocrData._aiEnhanced = true;
    if (data.amount)   ocrData.amount   = String(data.amount);
    if (data.date)     ocrData.date     = data.date;
    if (data.merchant) ocrData.merchant = data.merchant;
    if (data.currency) ocrData.currency = String(data.currency).toUpperCase();
    if (data.hint)     ocrData.hint     = data.hint;
    if (data.hint) {
      // 自动选到规则下拉
      const hintEl = document.getElementById("evHint");
      if ([...hintEl.options].some(o => o.value === data.hint)) hintEl.value = data.hint;
    }
    renderResult(ocrData);
  });

  // ── 套用到表单 ────────────────────────────────────────────────────────────
  applyBtn.addEventListener("click", () => {
    if (ocrData.amount) {
      // 兼容欧式小数格式（1,98 → 1.98）；type=number input 不接受逗号，会静默空值
      const cleaned = String(ocrData.amount).replace(/[,，]/g, ".").replace(/\s/g, "");
      const num = parseFloat(cleaned);
      if (!isNaN(num) && num > 0) document.getElementById("evAmt").value = String(num);
    }
    if (ocrData.merchant) document.getElementById("evDst").value = ocrData.merchant;
    if (ocrData.date) {
      const cur = document.getElementById("evTs").value;
      const time = cur.includes("T") ? cur.split("T")[1] : "12:00:00";
      document.getElementById("evTs").value = `${ocrData.date}T${time}`;
    }
    if (ocrData.currency) {
      const ccyEl = document.getElementById("evCcy");
      // 若识别出的币种不在列表中，动态加入（rate 留 0，等用户刷新或手填）
      const cfg = getFxConfig();
      const ccy = String(ocrData.currency).toUpperCase();
      if (cfg.rates[ccy] === undefined) {
        cfg.rates[ccy] = 0;
        saveFxConfig(cfg);
        populateCurrencySelect(ccyEl, cfg, ccy);
      } else {
        ccyEl.value = ccy;
      }
    }
  });

  // ── 清除 ──────────────────────────────────────────────────────────────────
  clearBtn.addEventListener("click", () => {
    previewWrap.classList.add("hidden");
    statusEl.classList.add("hidden");
    previewImg.src = "";
    resultEl.innerHTML = "";
    ocrData = {};
    inputEl.value = "";
  });

  // ── 点击上传 ──────────────────────────────────────────────────────────────
  dropEl.addEventListener("click", () => inputEl.click());
  inputEl.addEventListener("change", () => {
    if (inputEl.files[0]) runOcr(inputEl.files[0]);
  });

  // ── 拖拽上传 ──────────────────────────────────────────────────────────────
  dropEl.addEventListener("dragover", e => { e.preventDefault(); dropEl.classList.add("dragover"); });
  dropEl.addEventListener("dragleave", () => dropEl.classList.remove("dragover"));
  dropEl.addEventListener("drop", e => {
    e.preventDefault();
    dropEl.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) runOcr(file);
  });

  // ── 贴上剪贴板图片 ────────────────────────────────────────────────────────
  document.addEventListener("paste", e => {
    if (document.getElementById("tab-live").classList.contains("hidden")) return;
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith("image/"));
    if (item) runOcr(item.getAsFile());
  });
})();

// ═══════════════════════════════════════════════════════════════════════════════
// FX / CURRENCY
// ═══════════════════════════════════════════════════════════════════════════════
// 预置币种词典：代码 → 默认显示名称（用于 datalist 下拉 + 自动填名）
const KNOWN_CURRENCIES = {
  // 法币主流
  USD: "美元", EUR: "欧元", GBP: "英镑", CHF: "瑞士法郎",
  CAD: "加拿大元", AUD: "澳大利亚元", NZD: "新西兰元",
  // 东亚
  CNY: "人民币", JPY: "日元", TWD: "新台币", HKD: "港币", MOP: "澳门币",
  KRW: "韩元", SGD: "新加坡元", THB: "泰铢", VND: "越南盾",
  MYR: "马来西亚林吉特", IDR: "印尼盾", PHP: "菲律宾比索", INR: "印度卢比",
  // 欧洲/北欧
  RUB: "俄罗斯卢布", TRY: "土耳其里拉", PLN: "波兰兹罗提",
  CZK: "捷克克朗", HUF: "匈牙利福林", SEK: "瑞典克朗",
  NOK: "挪威克朗", DKK: "丹麦克朗",
  // 中东/非洲
  AED: "阿联酋迪拉姆", SAR: "沙特里亚尔", ILS: "以色列新谢克尔",
  EGP: "埃及镑", ZAR: "南非兰特",
  // 南美
  BRL: "巴西雷亚尔", MXN: "墨西哥比索", ARS: "阿根廷比索",
  // 加密主流
  BTC: "比特币", ETH: "以太币", USDT: "泰达币", USDC: "USD Coin",
  BNB: "币安币", SOL: "Solana", XRP: "瑞波币", ADA: "艾达币",
  DOGE: "狗狗币", TRX: "波场", DOT: "波卡", MATIC: "Polygon",
  LTC: "莱特币", SHIB: "柴犬币", AVAX: "雪崩", LINK: "Chainlink",
  UNI: "Uniswap", ATOM: "Cosmos",
};

const DEFAULT_FX = {
  baseCurrency: "TWD",
  order: ["TWD", "USD", "EUR", "CNY", "JPY", "GBP", "HKD", "MOP", "RUB", "BTC", "ETH", "USDT"],
  // 1 单位该币种 = rates[ccy] 单位基准币（TWD）；仅为初始参考值，应点"刷新"抓真实汇率
  rates: {
    TWD: 1, USD: 31.5, EUR: 34, CNY: 4.3, JPY: 0.21, GBP: 39.5,
    HKD: 4.0, MOP: 3.9, RUB: 0.32,
    BTC: 2500000, ETH: 100000, USDT: 31.5,
  },
  names: {
    TWD: "新台币", USD: "美元", EUR: "欧元", CNY: "人民币", JPY: "日元", GBP: "英镑",
    HKD: "港币", MOP: "澳门币", RUB: "卢布",
    BTC: "比特币", ETH: "以太币", USDT: "泰达币",
  },
};

function getFxConfig() {
  try {
    const raw = localStorage.getItem(STORAGE.fx);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_FX));
    const parsed = JSON.parse(raw);
    // 兜底：确保基准币有 rate=1
    if (!parsed.rates) parsed.rates = {};
    if (!parsed.names) parsed.names = {};
    if (!parsed.baseCurrency) parsed.baseCurrency = DEFAULT_BASE_CURRENCY;
    parsed.rates[parsed.baseCurrency] = 1;
    // 兜底 order：保证所有 rates 的键都在 order 里，且 order 里没有孤立项
    if (!Array.isArray(parsed.order)) parsed.order = [];
    const codes = Object.keys(parsed.rates);
    parsed.order = parsed.order.filter(c => codes.includes(c));
    for (const c of codes) if (!parsed.order.includes(c)) parsed.order.push(c);
    return parsed;
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_FX));
  }
}

function saveFxConfig(cfg) {
  localStorage.setItem(STORAGE.fx, JSON.stringify(cfg));
}

// 汇率按数量级决定小数位，避免 15 位浮点噪声
function roundRate(v) {
  if (!(v > 0)) return 0;
  if (v >= 10000) return Math.round(v);                 // e.g. BTC
  if (v >= 1)     return Math.round(v * 10000) / 10000; // e.g. USD, EUR
  return Number(v.toPrecision(6));                      // e.g. JPY, RUB
}

function fxCurrencies(cfg) {
  // 基准币永远第一，其余按 cfg.order 指定顺序（用户可拖拽）
  const base = cfg.baseCurrency;
  const others = (cfg.order || []).filter(c => c !== base && cfg.rates[c] !== undefined);
  // 补齐 rates 中有但 order 缺的
  for (const c of Object.keys(cfg.rates)) {
    if (c !== base && !others.includes(c)) others.push(c);
  }
  return [base, ...others];
}

function populateCurrencySelect(selectEl, cfg, selected) {
  if (!selectEl) return;
  const current = selected ?? selectEl.value ?? cfg.baseCurrency;
  selectEl.innerHTML = "";
  for (const c of fxCurrencies(cfg)) {
    const opt = document.createElement("option");
    opt.value = c;
    const name = cfg.names[c];
    opt.textContent = name ? `${c} · ${name}` : c;
    selectEl.appendChild(opt);
  }
  if ([...selectEl.options].some(o => o.value === current)) {
    selectEl.value = current;
  } else {
    selectEl.value = cfg.baseCurrency;
  }
}

// 全局刷新所有币种下拉
function refreshCurrencyDropdowns() {
  const cfg = getFxConfig();
  populateCurrencySelect(document.getElementById("evCcy"), cfg);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
(function () {
  const modal   = document.getElementById("settingsModal");
  const keyEl   = document.getElementById("settingsApiKey");
  const modelEl = document.getElementById("settingsModel");
  const baseEl  = document.getElementById("settingsBaseCcy");
  const tableEl = document.getElementById("settingsFxTable");
  const statusEl = document.getElementById("settingsFxStatus");
  const addModal    = document.getElementById("addCcyModal");
  const addCodeEl   = document.getElementById("addCcyCode");
  const addNameEl   = document.getElementById("addCcyName");
  const addRateEl   = document.getElementById("addCcyRate");

  // 打开时加载当前 FX 配置到编辑态
  let draft = null; // 编辑中的 FX 配置副本；保存时写回

  // 拖拽态
  let dragCode = null;

  function renderFxTable() {
    if (!draft) return;
    renderCcyDatalists(); // 同步候选（主表名称 input 的 datalist 也跟着刷新）
    const codes = fxCurrencies(draft);
    // 整个表一个 grid，每个 header / row 用 subgrid 继承列 tracks，保证所有单元对齐
    const gridCols = "18px 56px 1fr 1fr 30px";
    tableEl.style.display = "grid";
    tableEl.style.gridTemplateColumns = gridCols;
    tableEl.style.columnGap = "6px";
    tableEl.style.rowGap = "4px";
    const header = `
      <div class="fx-row fx-row-header" style="display:grid;grid-template-columns:subgrid;grid-column:1/-1;gap:6px;align-items:center;font-size:0.82rem;color:var(--muted)">
        <div></div>
        <div>${t("settings.fxCol.code")}</div>
        <div>${t("settings.fxCol.name")}</div>
        <div style="text-align:right">${t("settings.fxCol.rate")}</div>
        <div></div>
      </div>
    `;
    const rowStyle = `display:grid;grid-template-columns:subgrid;grid-column:1/-1;gap:6px;align-items:center`;
    const rows = codes.map(code => {
      const isBase = code === draft.baseCurrency;
      const name = draft.names[code] ?? KNOWN_CURRENCIES[code] ?? "";
      const rate = draft.rates[code] ?? 0;
      const handle = isBase
        ? `<span style="color:var(--muted);text-align:center;font-size:0.9rem" title="基准币固定首位">🔒</span>`
        : `<span class="fx-handle" style="cursor:grab;color:var(--muted);text-align:center;user-select:none" title="拖拽排序">⋮⋮</span>`;
      // 名称列：editable combobox。单 input，点击展开共享浮动面板，键入过滤，可自由输入
      const nameCell = `<input type="text" class="ccy-combo-input" data-fx-name="${esc(code)}" value="${esc(name)}" role="combobox" aria-autocomplete="list" aria-expanded="false" style="font-size:0.82rem;min-width:0" />`;
      return `
        <div class="fx-row" data-code="${esc(code)}" ${isBase ? "" : 'draggable="true"'} style="${rowStyle}">
          ${handle}
          <div style="font-family:monospace;font-weight:600;font-size:0.85rem">${esc(code)}${isBase ? " ★" : ""}</div>
          ${nameCell}
          <input data-fx-rate="${esc(code)}" type="number" step="any" value="${rate}" ${isBase ? "disabled" : ""} style="font-size:0.82rem${isBase ? ";opacity:0.6" : ""};text-align:right" />
          <button data-fx-del="${esc(code)}" ${isBase ? "disabled" : ""} title="删除" style="padding:2px 6px;font-size:0.78rem">${isBase ? "" : "✕"}</button>
        </div>
      `;
    }).join("");
    tableEl.innerHTML = header + rows;

    // 绑定名称 combobox：focus/click 展开、input 过滤、选项 click 填入、blur 关闭
    tableEl.querySelectorAll("input.ccy-combo-input").forEach(inp => {
      inp.addEventListener("input", e => {
        draft.names[e.target.dataset.fxName] = e.target.value;
        renderComboPanel(e.target);
      });
      inp.addEventListener("focus", e => openCombo(e.target));
      inp.addEventListener("click", e => openCombo(e.target));
      inp.addEventListener("blur", () => setTimeout(closeCombo, 120));
      inp.addEventListener("keydown", e => handleComboKey(e));
    });
    tableEl.querySelectorAll("input[data-fx-rate]").forEach(inp => {
      inp.addEventListener("input", e => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v) && v > 0) draft.rates[e.target.dataset.fxRate] = v;
      });
    });
    tableEl.querySelectorAll("button[data-fx-del]").forEach(btn => {
      btn.addEventListener("click", e => {
        const code = e.currentTarget.dataset.fxDel;
        delete draft.rates[code];
        delete draft.names[code];
        draft.order = (draft.order || []).filter(c => c !== code);
        saveFxConfig(draft);
        refreshCurrencyDropdowns();
        renderFxTable();
        populateCurrencySelect(baseEl, draft, draft.baseCurrency);
      });
    });

    // 绑定拖拽（基准币行不 draggable，天然豁免）
    const clearMarks = () => {
      tableEl.querySelectorAll(".fx-row").forEach(r => {
        r.style.borderTop = "";
        r.style.borderBottom = "";
      });
    };
    tableEl.querySelectorAll(".fx-row[data-code][draggable='true']").forEach(row => {
      row.addEventListener("dragstart", e => {
        dragCode = row.dataset.code;
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", dragCode); } catch {}
        row.style.opacity = "0.35";
      });
      row.addEventListener("dragend", () => {
        row.style.opacity = "";
        clearMarks();
        dragCode = null;
      });
      row.addEventListener("dragover", e => {
        e.preventDefault();
        if (!dragCode || dragCode === row.dataset.code) return;
        e.dataTransfer.dropEffect = "move";
        const rect = row.getBoundingClientRect();
        const above = (e.clientY - rect.top) < rect.height / 2;
        // 仅在本行清除，避免闪烁
        row.style.borderTop = above ? "2px solid var(--accent, #4ea1ff)" : "";
        row.style.borderBottom = above ? "" : "2px solid var(--accent, #4ea1ff)";
        row.dataset.dropPos = above ? "before" : "after";
      });
      row.addEventListener("dragleave", () => {
        row.style.borderTop = "";
        row.style.borderBottom = "";
      });
      row.addEventListener("drop", e => {
        e.preventDefault();
        const targetCode = row.dataset.code;
        const dropPos = row.dataset.dropPos || "before";
        clearMarks();
        if (!dragCode || dragCode === targetCode) return;
        const order = (draft.order || []).slice();
        const from = order.indexOf(dragCode);
        if (from < 0) return;
        order.splice(from, 1);          // 先移除源
        let to = order.indexOf(targetCode);
        if (to < 0) { order.push(dragCode); }
        else {
          if (dropPos === "after") to++;
          order.splice(to, 0, dragCode);
        }
        draft.order = order;
        saveFxConfig(draft);
        refreshCurrencyDropdowns();
        renderFxTable();
      });
    });
  }

  const open  = () => {
    keyEl.value   = localStorage.getItem(STORAGE.llmKey)   || "";
    modelEl.value = localStorage.getItem(STORAGE.llmModel) || DEFAULT_LLM_MODEL;
    draft = getFxConfig();
    populateCurrencySelect(baseEl, draft, draft.baseCurrency);
    renderFxTable();
    statusEl.textContent = "";
    modal.classList.remove("hidden");
  };
  const close = () => { modal.classList.add("hidden"); draft = null; };

  baseEl.addEventListener("change", () => {
    if (!draft) return;
    draft.baseCurrency = baseEl.value;
    draft.rates[draft.baseCurrency] = 1;
    renderFxTable();
  });

  document.getElementById("settingsBtn").addEventListener("click", open);
  document.getElementById("settingsClose").addEventListener("click", close);
  document.getElementById("settingsClose2").addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });

  document.getElementById("settingsSave").addEventListener("click", () => {
    if (draft) {
      draft.rates[draft.baseCurrency] = 1;
      saveFxConfig(draft);
      refreshCurrencyDropdowns();
    }
    localStorage.setItem(STORAGE.llmKey,   keyEl.value.trim());
    localStorage.setItem(STORAGE.llmModel, modelEl.value);
    close();
  });

  // 刷新汇率（调用后端 /fx/refresh）
  document.getElementById("settingsFxRefresh").addEventListener("click", async () => {
    if (!draft) return;
    statusEl.textContent = t("settings.fxRefreshing");
    try {
      const codes = Object.keys(draft.rates);
      const resp = await postJson("/fx/refresh", { base: draft.baseCurrency, codes });
      if (resp.error) {
        statusEl.textContent = `${t("settings.fxRefreshFail")}: ${resp.error}`;
        return;
      }
      for (const [code, r] of Object.entries(resp.rates || {})) {
        draft.rates[code] = roundRate(r);
      }
      draft.rates[draft.baseCurrency] = 1;
      // 刷新 = 外部数据同步，立即持久化（不随"取消"丢失）
      saveFxConfig(draft);
      refreshCurrencyDropdowns();
      renderFxTable();
      const miss = resp.missing && resp.missing.length
        ? ` · ${t("settings.fxMissing")}: ${resp.missing.join(", ")}`
        : "";
      statusEl.textContent = `${t("settings.fxRefreshOk")} (${resp.date || "—"})${miss}`;
    } catch (e) {
      statusEl.textContent = `${t("settings.fxRefreshFail")}: ${e}`;
    }
  });

  // ── Editable combobox（WAI-ARIA 模式）：共享浮动面板，支持键盘 ───────────
  let comboPanel = null;
  let comboActive = null;
  let comboHighlight = -1;

  function ensureComboPanel() {
    if (comboPanel) return comboPanel;
    comboPanel = document.createElement("div");
    comboPanel.id = "ccyComboPanel";
    comboPanel.setAttribute("role", "listbox");
    comboPanel.hidden = true;
    Object.assign(comboPanel.style, {
      position: "fixed", zIndex: "9999", maxHeight: "240px",
      overflowY: "auto", minWidth: "160px",
      background: "var(--card, #1b1b1b)",
      border: "1px solid var(--border, #3a3a3a)",
      borderRadius: "4px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
      fontSize: "0.85rem",
    });
    // mousedown 阻止 input blur 触发 close
    comboPanel.addEventListener("mousedown", e => e.preventDefault());
    comboPanel.addEventListener("click", e => {
      const li = e.target.closest("[data-combo-value]");
      if (!li || !comboActive) return;
      const val = li.dataset.comboValue;
      comboActive.value = val;
      if (draft) draft.names[comboActive.dataset.fxName] = val;
      closeCombo();
    });
    document.body.appendChild(comboPanel);
    return comboPanel;
  }

  function positionComboPanel() {
    if (!comboPanel || comboPanel.hidden || !comboActive) return;
    const rect = comboActive.getBoundingClientRect();
    comboPanel.style.top = (rect.bottom + 2) + "px";
    comboPanel.style.left = rect.left + "px";
    comboPanel.style.width = rect.width + "px";
  }

  function openCombo(inp) {
    ensureComboPanel();
    comboActive = inp;
    comboPanel.hidden = false;
    inp.setAttribute("aria-expanded", "true");
    renderComboPanel(inp, /*filter=*/false); // 打开即全量
    positionComboPanel();
  }

  function renderComboPanel(inp, filter = true) {
    if (!comboPanel || comboPanel.hidden) return;
    const all = new Set(Object.values(KNOWN_CURRENCIES));
    if (draft) Object.values(draft.names || {}).forEach(n => { if (n) all.add(n); });
    const query = filter ? inp.value.trim().toLowerCase() : "";
    const list = [...all].filter(n => !query || n.toLowerCase().includes(query)).sort();
    comboHighlight = -1;
    comboPanel.innerHTML = list.length
      ? list.map((n, i) =>
          `<div data-combo-value="${esc(n)}" data-idx="${i}" role="option" style="padding:5px 10px;cursor:pointer">${esc(n)}</div>`
        ).join("")
      : `<div style="padding:5px 10px;color:var(--muted)">（无匹配；按 Enter 保留当前输入）</div>`;
  }

  // 跟随滚动：任何元素的 scroll 都重新定位（capture=true 抓到父容器滚动）
  window.addEventListener("scroll", positionComboPanel, true);
  window.addEventListener("resize", positionComboPanel);

  function closeCombo() {
    if (!comboPanel || comboPanel.hidden) return;
    comboPanel.hidden = true;
    if (comboActive) comboActive.setAttribute("aria-expanded", "false");
    comboActive = null;
    comboHighlight = -1;
  }

  function handleComboKey(e) {
    if (!comboPanel || comboPanel.hidden) return;
    const rows = [...comboPanel.querySelectorAll("[data-combo-value]")];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      comboHighlight = Math.min(comboHighlight + 1, rows.length - 1);
      updateHighlight(rows);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      comboHighlight = Math.max(comboHighlight - 1, 0);
      updateHighlight(rows);
    } else if (e.key === "Enter") {
      if (comboHighlight >= 0 && rows[comboHighlight]) {
        e.preventDefault();
        const val = rows[comboHighlight].dataset.comboValue;
        comboActive.value = val;
        if (draft) draft.names[comboActive.dataset.fxName] = val;
        closeCombo();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeCombo();
    }
  }

  function updateHighlight(rows) {
    rows.forEach((r, i) => {
      r.style.background = i === comboHighlight ? "var(--accent, #4ea1ff)" : "";
      r.style.color = i === comboHighlight ? "#fff" : "";
      if (i === comboHighlight) r.scrollIntoView({ block: "nearest" });
    });
  }

  // 填充 datalist：代码选单（全部已知币种） + 名称选单（value=名称，label=代码，用户输入时能看到对应币种）
  function renderCcyDatalists() {
    const codeDl = document.getElementById("ccyCodeList");
    const nameDl = document.getElementById("ccyNameList");
    if (codeDl) {
      codeDl.innerHTML = Object.entries(KNOWN_CURRENCIES)
        .map(([code, name]) => `<option value="${code}">${name}</option>`)
        .join("");
    }
    if (nameDl) {
      // 反向映射（名称→代码）。若多代码同名，保留首个
      const nameToCode = {};
      for (const [code, name] of Object.entries(KNOWN_CURRENCIES)) {
        if (!nameToCode[name]) nameToCode[name] = code;
      }
      // 补上用户自定义但不在 KNOWN 里的名字
      if (draft) {
        for (const [code, name] of Object.entries(draft.names || {})) {
          if (name && !nameToCode[name]) nameToCode[name] = code;
        }
      }
      nameDl.innerHTML = Object.entries(nameToCode)
        .map(([name, code]) => `<option value="${name}">${code}</option>`)
        .join("");
    }
  }
  renderCcyDatalists();

  // 代码输入联动自动填名称（仅在名称为空时填）
  addCodeEl.addEventListener("input", () => {
    const code = addCodeEl.value.trim().toUpperCase();
    const known = KNOWN_CURRENCIES[code];
    if (known && !addNameEl.value.trim()) {
      addNameEl.value = known;
    }
  });

  // 恢复默认：order 恢复到预置顺序；预置币种的名称也恢复（用户乱改的名字会被覆盖回去）；rates 不动（刷新按钮负责）
  document.getElementById("settingsFxReorder").addEventListener("click", () => {
    if (!draft) return;
    const defaultOrdered = DEFAULT_FX.order.filter(c => draft.rates[c] !== undefined);
    const extras = Object.keys(draft.rates).filter(c => !defaultOrdered.includes(c)).sort();
    draft.order = [...defaultOrdered, ...extras];
    // 预置币种：名称恢复到 DEFAULT_FX.names 或 KNOWN_CURRENCIES
    for (const code of defaultOrdered) {
      const def = DEFAULT_FX.names[code] ?? KNOWN_CURRENCIES[code];
      if (def) draft.names[code] = def;
    }
    saveFxConfig(draft);
    refreshCurrencyDropdowns();
    renderFxTable();
    statusEl.textContent = "";
  });

  // ── 新增币种 modal ────────────────────────────────────────────────────────
  document.getElementById("settingsFxAdd").addEventListener("click", () => {
    addCodeEl.value = "";
    addNameEl.value = "";
    addRateEl.value = "";
    renderCcyDatalists();
    addModal.classList.remove("hidden");
    addCodeEl.focus();
  });
  const closeAdd = () => addModal.classList.add("hidden");
  document.getElementById("addCcyClose").addEventListener("click", closeAdd);
  document.getElementById("addCcyCancel").addEventListener("click", closeAdd);
  addModal.addEventListener("click", e => { if (e.target === addModal) closeAdd(); });

  document.getElementById("addCcyConfirm").addEventListener("click", () => {
    if (!draft) return;
    const code = addCodeEl.value.trim().toUpperCase();
    if (!/^[A-Z0-9]{2,8}$/.test(code)) { alert(t("addCcy.invalid")); return; }
    if (draft.rates[code] !== undefined) { alert(t("addCcy.exists")); return; }
    const name = addNameEl.value.trim();
    const rateRaw = addRateEl.value.trim();
    const rate = rateRaw ? parseFloat(rateRaw) : 0; // 0 = 未知，等刷新获取
    draft.rates[code] = (!isNaN(rate) && rate > 0) ? rate : 0;
    if (name) draft.names[code] = name;
    closeAdd();
    populateCurrencySelect(baseEl, draft, draft.baseCurrency);
    renderFxTable();
  });
})();

function getLLMConfig() {
  return {
    apiKey: localStorage.getItem(STORAGE.llmKey)   || "",
    model:  localStorage.getItem(STORAGE.llmModel) || DEFAULT_LLM_MODEL,
  };
}

function renderMarkdown(text) {
  // 简单 Markdown 渲染：**bold**、*italic*、换行转段落
  const escaped = text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const html = escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br>");
  return `<p>${html}</p>`;
}

function showAIThinking(el, label) {
  el.className = "ai-result";
  el.innerHTML = `<div class="ai-thinking">
    <div class="ai-thinking-dots"><span></span><span></span><span></span></div>
    <span>${label}</span>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI 财务分析
// ═══════════════════════════════════════════════════════════════════════════════
document.getElementById("aiClassifyBtn").addEventListener("click", async () => {
  if (!events.length) return;
  const { apiKey, model } = getLLMConfig();
  if (!apiKey) {
    alert(currentLang === "en" ? "Please set your API Key in Settings (⚙️)." : "请先在设置（⚙️）中填写 API Key。");
    return;
  }

  const toClassify = events.filter(e => !e.rawCategoryHint);
  if (!toClassify.length) {
    alert(currentLang === "en" ? "All events already have a rule hint." : "所有事件已有分类规则，无需补全。");
    return;
  }

  const btn = document.getElementById("aiClassifyBtn");
  const progressWrap = document.getElementById("classifyProgress");
  const progressBar  = document.getElementById("classifyProgressBar");
  const progressLabel = document.getElementById("classifyProgressLabel");

  const CHUNK = 10;
  const total = toClassify.length;
  const chunks = [];
  for (let i = 0; i < total; i += CHUNK) chunks.push(toClassify.slice(i, i + CHUNK));

  // Show progress UI
  btn.disabled = true;
  btn.textContent = currentLang === "en" ? "Classifying…" : "分类中…";
  progressWrap.classList.remove("hidden");

  const setProgress = (done, outOf, label) => {
    progressBar.style.width = (outOf === 0 ? 0 : Math.round((done / outOf) * 100)) + "%";
    progressLabel.innerHTML = label;
  };

  const slowHint = total > 20
    ? (currentLang === "en" ? " · Large batches may take a while, please wait…" : " · 数量较多时等待时间较长，请耐心等待…")
    : "";
  setProgress(0, total,
    `<span class="cp-dots"><span></span><span></span><span></span></span>` +
    (currentLang === "en"
      ? `Processing 0 / ${total}…${slowHint}`
      : `正在处理 0 / ${total} 条…${slowHint}`)
  );

  const resultMap = new Map();
  let done = 0;
  let hadError = null;

  for (let ci = 0; ci < chunks.length; ci++) {
    const chunk = chunks[ci];
    const data = await postJson("/llm/classify", {
      events: chunk.map(e => ({ id: e.id, description: e.description, source: e.source, destination: e.destination, amount: e.amount })),
      apiKey, model, lang: currentLang,
    });

    if (data.error) { hadError = data.error; break; }

    (data.classifications || []).forEach(c => resultMap.set(c.id, c.hint));
    done += chunk.length;

    const pct = Math.round((done / total) * 100);
    setProgress(done, total,
      `<span class="cp-dots"><span></span><span></span><span></span></span>` +
      (currentLang === "en"
        ? `Processing ${done} / ${total}… (${pct}%)`
        : `正在处理 ${done} / ${total} 条… (${pct}%)`)
    );
  }

  // Restore button
  btn.disabled = false;
  btn.textContent = currentLang === "en" ? "✨ AI Auto-classify" : "✨ AI 批量补全分类";

  if (hadError) {
    progressWrap.classList.add("hidden");
    alert("AI Error: " + hadError);
    return;
  }

  // Apply results
  let filled = 0;
  events = events.map(e => {
    if (!e.rawCategoryHint && resultMap.has(e.id)) { filled++; return { ...e, rawCategoryHint: resultMap.get(e.id) }; }
    return e;
  });
  renderTable();

  // Show done state, then hide after 3s
  setProgress(total, total,
    `<span class="classify-progress-done">✓ ` +
    (currentLang === "en" ? `Done — filled ${filled} hints` : `完成 — 已补全 ${filled} 条分类规则`) +
    `</span>`
  );
  setTimeout(() => progressWrap.classList.add("hidden"), 3000);
});

document.getElementById("aiAnalysisBtn").addEventListener("click", async () => {
  if (!lastRunResult) return;
  const { apiKey, model } = getLLMConfig();
  if (!apiKey) {
    alert(currentLang === "en" ? "Please set your API Key in Settings (⚙️)." : "请先在设置（⚙️）中填写 API Key。");
    return;
  }
  const resultEl = document.getElementById("aiAnalysisResult");
  showAIThinking(resultEl, currentLang === "en" ? "Analyzing your finances…" : "正在分析财务状况…");
  const data = await postJson("/llm/analysis", {
    state:   lastRunResult.state,
    summary: lastRunResult.summary,
    apiKey, model,
    lang: currentLang,
  });
  resultEl.className = "ai-result";
  if (data.error) {
    resultEl.textContent = "Error: " + data.error;
  } else {
    resultEl.innerHTML = renderMarkdown(data.analysis || (currentLang === "en" ? "No response." : "无响应。"));
  }
});

rebuildLiveFormSelects();

applyLang();
// 启动时事件列表为空，示例只在用户点击「载入示例」时加载
renderTable();
