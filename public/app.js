// ── i18n ──────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  zh: {
    subtitle: "资金形态分层会计 — 先分类，后结算。看清每笔钱在经济上到底是什么。",
    "tab.batch": "批量运行", "tab.live": "实时录入", "tab.period": "期间管理",
    "tab.pending": "待确认", "tab.rules": "规则表",
    "batch.init": "初始参数", "batch.initCash": "初始现金", "batch.initReserve": "紧急预备金",
    "batch.import": "导入", "batch.loadSample": "载入示例",
    "batch.importJson": "从 JSON 解析", "batch.importCsv": "从 CSV 解析",
    "batch.rawInputPlaceholder": "贴 JSON 数组或 CSV 内容",
    "batch.eventList": "事件列表", "batch.addEvent": "新增空白事件", "batch.run": "运行 LASA",
    "batch.summary": "期间摘要", "batch.semanticLog": "语义日志", "batch.stateTitle": "账户状态",
    "live.initEngine": "初始化引擎", "live.reset": "重置引擎", "live.refresh": "刷新状态",
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
    "export.title": "导出结果", "export.json": "导出 JSON", "export.csv": "导出 CSV（事件）",
    "export.hint": "导出本次运行的完整数据，包含事件列表、摘要、语义日志与账户状态。",
    "theme.deep": "深海", "theme.noir": "暗黑", "theme.light": "浅色",
    "theme.emerald": "翡翠", "theme.violet": "紫调",
    "confirm.reset": "重置引擎将清除所有状态，确认吗？",
    "confirm.release": "将此款项释放为异常损失，确认吗？",
    "period.closed": "期间已关闭",
    "editor.rule": "分类规则", "editor.id": "ID", "editor.timestamp": "时间",
    "editor.amount": "金额", "editor.assetType": "资产类型", "editor.source": "来源",
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
    "batch.rawInputPlaceholder": "Paste JSON array or CSV content",
    "batch.eventList": "Event List", "batch.addEvent": "Add Blank Event", "batch.run": "Run LASA",
    "batch.summary": "Period Summary", "batch.semanticLog": "Semantic Log", "batch.stateTitle": "Account State",
    "live.initEngine": "Initialize Engine", "live.reset": "Reset Engine", "live.refresh": "Refresh State",
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
    "export.title": "Export Results", "export.json": "Export JSON", "export.csv": "Export CSV (Events)",
    "export.hint": "Export the full data from this run: events, summary, semantic log, and account state.",
    "theme.deep": "Deep Sea", "theme.noir": "Noir", "theme.light": "Light",
    "theme.emerald": "Emerald", "theme.violet": "Violet",
    "confirm.reset": "Reset engine and clear all state. Are you sure?",
    "confirm.release": "Release this item as an abnormal loss. Are you sure?",
    "period.closed": "Period closed.",
    "editor.rule": "Rule", "editor.id": "ID", "editor.timestamp": "Timestamp",
    "editor.amount": "Amount", "editor.assetType": "Asset Type", "editor.source": "Source",
    "editor.destination": "Recipient", "editor.description": "Description",
    "editor.restriction": "Restriction", "editor.timeTag": "Time Tag", "editor.riskTags": "Risk Tags",
  },
};

let currentLang = localStorage.getItem("lasa-lang") || "zh";

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
  localStorage.setItem("lasa-lang", currentLang);
  applyLang();
  rebuildLiveFormSelects();
  events = sampleEvents();
  renderTable();
  document.getElementById("rawInput").value = JSON.stringify(events, null, 2);
  if (!document.getElementById("tab-rules").classList.contains("hidden")) loadRules();
  if (!document.getElementById("tab-period").classList.contains("hidden")) refreshPeriods();
  if (!document.getElementById("tab-pending").classList.contains("hidden")) refreshPending();
  if (lastRunResult) document.getElementById("summaryText").textContent = generateCommentary(lastRunResult.summary, lastRunResult.state);
});

// ── Theme switcher ─────────────────────────────────────────────────────────────
(function () {
  const saved = localStorage.getItem("lasa-theme") || "deep";
  document.documentElement.setAttribute("data-theme", saved);
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    if (btn.dataset.theme === saved) btn.classList.add("active");
    btn.addEventListener("click", () => {
      const t = btn.dataset.theme;
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("lasa-theme", t);
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

  document.getElementById("editorTitle").textContent = `${t("editor.title")} #${idx + 1}`;
  document.getElementById("editorFields").innerHTML =
    `<label style="grid-column:1/-1">${t("editor.rule")}<br>${ruleSelect(e.rawCategoryHint)}</label>` +
    `<label>${t("editor.id")}<input data-key="id" type="text" value="${e.id ?? ""}"></label>` +
    `<label>${t("editor.timestamp")}<input data-key="timestamp" type="text" value="${e.timestamp ?? ""}"></label>` +
    `<label>${t("editor.amount")}<input data-key="amount" type="number" value="${e.amount ?? 0}"></label>` +
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
  document.getElementById("eventTableWrap").innerHTML = html;

  document.getElementById("eventTableWrap").querySelectorAll("button[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openEditor(Number(btn.dataset.edit)));
  });
  document.getElementById("eventTableWrap").querySelectorAll("button[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      events.splice(Number(btn.dataset.del), 1);
      renderTable();
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

document.getElementById("importJsonBtn").addEventListener("click", async () => {
  const data = await postJson("/import/json", { content: document.getElementById("rawInput").value });
  events = data.events || [];
  renderTable();
});

document.getElementById("importCsvBtn").addEventListener("click", async () => {
  const data = await postJson("/import/csv", { content: document.getElementById("rawInput").value });
  events = data.events || [];
  renderTable();
});

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
  const data = await postJson("/run", {
    initialCash: Number(document.getElementById("initialCash").value),
    emergencyReserve: Number(document.getElementById("emergencyReserve").value),
    events,
  });
  document.getElementById("summaryText").textContent = generateCommentary(data.summary, data.state);
  document.getElementById("summaryJson").textContent = JSON.stringify(data.summary, null, 2);
  document.getElementById("semanticJson").textContent = formatSemanticLog(data.semanticLog);
  renderStateBreakdown(data.state, "stateBreakdown");
  lastRunResult = data;
  document.getElementById("exportCard").classList.remove("hidden");
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
  const payload = {
    exportedAt: new Date().toISOString(),
    events,
    summary: lastRunResult.summary,
    summaryText: lastRunResult.summaryText,
    semanticLog: lastRunResult.semanticLog,
    state: lastRunResult.state,
  };
  downloadFile(`lasa-result-${Date.now()}.json`, JSON.stringify(payload, null, 2), "application/json");
});

document.getElementById("exportCsvBtn").addEventListener("click", () => {
  if (!lastRunResult) return;
  const cols = ["id", "timestamp", "amount", "assetType", "source", "destination", "description", "rawCategoryHint", "timeTag", "restrictionHint", "riskTags"];
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
  await postJson("/reset", {
    initialCash: Number(document.getElementById("liveInitCash").value),
    emergencyReserve: Number(document.getElementById("liveInitReserve").value),
  });
  refreshLiveState();
  refreshPending();
  refreshPeriods();
});

document.getElementById("fetchStateBtn").addEventListener("click", refreshLiveState);

document.getElementById("submitEventBtn").addEventListener("click", async () => {
  const riskTags = Array.from(document.querySelectorAll("#evRiskBoxes input:checked")).map((cb) => cb.value);
  const event = {
    id: document.getElementById("evId").value || `e${Date.now()}`,
    timestamp: document.getElementById("evTs").value,
    amount: Number(document.getElementById("evAmt").value),
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

rebuildLiveFormSelects();

applyLang();
events = sampleEvents();
renderTable();
document.getElementById("rawInput").value = JSON.stringify(events, null, 2);
