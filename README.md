# LASA Web App

**资金形态分层会计（Layered Asset-State Accounting）**  
先分类，后结算。看清每笔钱在经济上到底是什么。

---

## 功能概览

### 引擎核心
- 规则注册表（41 条内置规则，含 6 条资产形态转换：`CASH_WITHDRAWAL` / `E_WALLET_TOPUP` / `E_WALLET_WITHDRAWAL` / `INTERNAL_TRANSFER` / `INTERNAL_TRANSFER_CANDIDATE` / `BANK_FEE`）
- LHS / WCN / MSN / ln(方差) 语义摘要
- 未知事件语义回退分类
- 原型相似度优化
- JSON / CSV 导入器（含 `currency` / `fxRate` 列）

### 账户分层
- 资产层（现金 / 金融 / 可交易 / 其他）
- 负债层（短期 / 待处理）
- 收入层（经常性 / 补助 / 交易收益 / 佣金 / 无形资产收益）
- 费用层（生活 / 系统 / 利息 / 交易亏损 / 异常损失）
- 受限资金层（国家经费 / 基金会 / 政治 / 私人）
- 待确认层（风险储备 / 推演估值）
- 无形资产层（正式认定 / 推演）
- 储备层（紧急预备金）

### Web 前端
- **批量运行**：导入 JSON / CSV，运行整批事件，查看结果
- **实时录入**：单笔事件提交，引擎状态持续更新
- **期间管理**：开启 / 关闭结算期间，查看历史
- **待确认**：登记争议款项，确认归类或释放为异常损失
- **规则表**：查看所有内置规则键说明
- **大雄妈妈赤字功能**（白皮书 §13.2–13.3）：人话总结盈余/赤字、真花掉 vs 转形、看起来有但不能动的资金、最吃钱项目、待确认层提示
- **语义日志**：折叠原始向量，显示 ln(var)、语义评分 top-3、原型相似度 top-3
- **导出结果**：完整 JSON 快照 / 事件 CSV
- **OCR 票据扫描**：拖拽 / 点击 / 粘贴截图，自动识别金额、日期、商家、**币种**，一键套用到录入表单
- **OCR 流水批量导入**：银行 App / 支付宝 / 微信支付等交易列表截图，多张并行识别，按"方向 + 关键词"自动匹配规则（提款 → `CASH_WITHDRAWAL`、手续费 → `BANK_FEE`、电支储值 → `E_WALLET_TOPUP`…），一次性填入事件列表
- **导入模式 checkbox**：JSON / CSV / OCR 三种导入统一通过"导入时替换现有列表"开关控制，默认追加，不再弹窗打断
- **多币种与实时汇率**：事件可携带 ISO 4217 / 加密货币代号与录入时的快照汇率；支持 9 种法币（SDR 5 + 港澳台 + 卢布）+ BTC / ETH / USDT，可自由新增；`🔄 刷新汇率` 从 fawazahmed0 免费 API 抓最新值；带拖拽排序与基准币切换的设置面板
- 5 套主题（深海 / 暗黑 / 浅色 / 翡翠 / 紫调）
- 中 / EN 双语切换（含所有动态渲染内容）

---

## 目录结构

```
src/
  types.ts        事件、状态、规则接口定义
  utils.ts        工具函数
  semantics.ts    LHS / WCN / MSN / ln(方差) 语义计算
  state.ts        状态更新、期间结算、大雄妈妈短评
  rules.ts        35 条规则注册表
  engine.ts       事件处理主流程
  importers.ts    JSON / CSV 导入器
  period.ts       期间管理（PeriodManager）
  confirm.ts      待确认流程（PendingConfirmManager）
  api.ts          HTTP API 路由（有状态引擎 + 无状态批量）
  server.ts       服务器入口
  demo.ts         命令行演示
  index.ts        统一导出

public/
  index.html      单页应用
  app.js          前端逻辑（i18n / 主题 / 所有交互）
  styles.css      5 套主题 CSS 变量
```

---

## 运行

```bash
npm install
npm run server
```

打开浏览器访问：`http://localhost:3000`

---

## OCR 实现说明

### 技术栈
- **库**：Tesseract.js v7（`cdn.jsdelivr.net/npm/tesseract.js@7`）
- **语言包**：`chi_tra + chi_sim + eng`（繁中 + 简中 + 英文）
- **触发方式**：拖拽上传 / 点击选择文件 / 粘贴剪贴板图片（`Ctrl+V`）

### 图像预处理（关键）

直接送入 Tesseract 对收据粗体大字识别率差（如 `SUMME EUR 1,98` 会被读成乱码）。  
发送前通过 Canvas 做预处理：

```
原图 → 放大（至少 1600px 宽，最大 3×）→ 灰度 → 对比度 ×1.8 → PNG → Tesseract
```

**实测对比（EDEKA 德国超市收据，总额 1,98 EUR）：**

| 版本 | 预处理 | 识别金额 |
|------|--------|----------|
| v5   | ❌     | 19（错）  |
| v7   | ❌     | 19（错）  |
| v5   | ✅     | 1.98（对）|
| v7   | ✅     | 1.98（对）|

结论：**预处理是识别准确率的关键，Tesseract 版本无影响。**

### 字段提取逻辑（规则模式，fallback）

| 字段 | 提取策略 |
|------|----------|
| 金额 | ① 关键字行（Summe / Total / 合計 等）→ ② 货币符号前缀 → ③ 最大 `x.xx` 格式数字 → ④ 整数 + 小数碎片重组 |
| 日期 | 多格式正则（`YYYY-MM-DD` / `DD.MM.YY` / 含年月日汉字）|
| 商家 | 过滤纯数字行、货币代码行、短噪声行，取最靠上的文字行 |

### ✨ AI 增强（VLM）

规则解析对热敏纸收据、德式逗号小数（`1,98`）、背景透印等场景识别率差。点「**✨ AI 增强**」把**原图一起**上传到视觉语言模型：

- **端点**：`POST /llm/ocr`，自动检测请求体里的 `image`（base64 data URL），有图走 VLM、无图走原 Tesseract 文本 LLM
- **默认 VLM**：`Qwen/Qwen2.5-VL-72B-Instruct`（SiliconFlow），可用 `visionModel` 字段覆盖
- **Prompt 约束**：
  - 总额优先（TOTAL / SUMME / GESAMT / 合計 / 合计 / 總計 / TTL），无总额则取**最大单项**，**禁止相加与任何算术**
  - 币种从符号推断（`€`→EUR、`$`→USD、`￥/¥`→CNY/JPY 按语境、`£`→GBP、`HK$`→HKD、`NT$/元`→TWD、`₽`→RUB）
- **前端套用**：金额自动清洗欧式格式（`1,98` → `1.98`，因 `<input type="number">` 不接受逗号）；币种下拉自动选中；不在配置表内的币种会被加入并标为待刷新

---

## 多币种与汇率

### 设计原则

1. **基准币锁定在账户余额层**：`LASAState.baseCurrency` 固定（默认 TWD），所有 `assets / income / expenses / ...` 都以基准币计量
2. **事件锁定快照汇率**：`Event` 携带 `currency` + `fxRate`（1 单位原币 = `fxRate` 单位基准币），入账时 `baseAmount = amount × fxRate`。之后行情波动**不回溯**老事件，符合会计原则
3. **`metaLog` 保留完整审计链**：`{ currency, originalAmount, fxRate, baseAmount }`，任何事件随时可反查原币种与折算路径
4. **fxRate 防御**：`0` / `NaN` / `undefined` 都被降级为 `1:1`，防止静默入账 `0`

### 汇率来源

- **静态默认表**：`DEFAULT_FX.rates`（初值参考，精度粗糙）
- **联网刷新**：`POST /fx/refresh` 代理 [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api)（免费、无需 key、法币 + 加密一站式；双 CDN 容错）
- **手动编辑**：设置面板直接改数值
- **按量级归一化精度**：BTC 类大数值保留整数、法币保留 4 位小数、小数值（JPY / RUB）保留 6 位有效数字

### 设置面板

- **基准币选择器**（切换会连带设置 state.baseCurrency）
- **币种表**：代码 / 名称（editable combobox，WAI-ARIA 模式，点击即展开全量候选）/ 汇率 / 删除
- **拖拽排序**：HTML5 原生 drag-and-drop，上下半判定插入位置，基准币永远锁定首位
- **＋ 新增币种**：datalist 下拉 40+ 预置主流币种（USD / EUR / KRW / SOL / DOGE 等），选中代码自动填对应中文名
- **🔄 刷新汇率**：立即持久化到 localStorage（不受"取消"按钮影响）
- **↩ 恢复默认**：顺序 + 名称复位，汇率不动（那是刷新按钮的职责）
- **CSS subgrid**：表头与所有行共享列 tracks，永远严格对齐

---

## API 端点

### 无状态批量
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| POST | `/run` | 批量运行；请求体可含 `baseCurrency`，返回 summary / state / semanticLog |
| POST | `/import/json` | 解析 JSON 事件数组 |
| POST | `/import/csv` | 解析 CSV 内容（支持 `currency` / `fxRate` 列 + 中英别名） |
| GET | `/rules` | 获取规则键列表 |

### 有状态引擎
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/reset` | 重置引擎（初始现金 / 预备金 / `baseCurrency`） |
| GET | `/state` | 获取当前账户状态 |
| POST | `/event` | 提交单笔事件（可携带 `currency` / `fxRate`） |
| POST | `/period/open` | 开启期间 |
| POST | `/period/close` | 关闭并结算期间 |
| GET | `/periods` | 获取期间历史 |
| POST | `/pending/register` | 登记待确认款项 |
| POST | `/pending/confirm` | 确认归类 |
| POST | `/pending/release` | 释放为异常损失 |
| GET | `/pending` | 获取待确认列表 |

### FX / LLM 代理
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/fx/refresh` | 请求 `{ base, codes[] }`，返回 `{ rates, date, missing }`；fawazahmed0 免费源 |
| POST | `/llm/ocr` | 单笔收据字段提取；有 `image` 字段走 VLM（Qwen2.5-VL），否则走文本 LLM |
| POST | `/llm/ocr-bulk` | 多笔流水截图识别；返回 `{ transactions: [...] }`，每条含 amount/currency/date/merchant/description/hint/direction |
| POST | `/llm/analysis` | 生成财务分析（DeepSeek-V3） |
| POST | `/llm/classify` | 批量补全事件 `rawCategoryHint` |

---

## 规则快查（仅列新增与关键）

| 规则键 | 语义 | 损益 | 适用描述关键词 |
|---|---|---|---|
| `CASH_WITHDRAWAL` | 银行存款 → 现金（取现本金） | 不损益 | 金融卡提 / ATM 提款 / ATM 領現 / 提領 / 取款 |
| `BANK_FEE` | 银行手续费（真现金支出） | 费用 · system | 提領手續費 / 跨行手續費 / 轉帳手續費 / 服務費 / 管理費 / 年費 |
| `E_WALLET_TOPUP` | 银行 → 电子钱包余额（充值） | 不损益 | 電支儲值 / 錢包充值 / Apple Pay 儲值 |
| `E_WALLET_WITHDRAWAL` | 电子钱包 → 银行（提领） | 不损益 | 電支提領 / 餘額提領 |
| `INTERNAL_TRANSFER` | 本人账户对账户转移 | 不损益 | 跨行轉入/轉出本人帳戶 / 帳戶互轉 / 本人同名轉帳 |
| `INTERNAL_TRANSFER_CANDIDATE` | 疑似内部转移，对手方不明 | 不损益 + PENDING_REVIEW | 跨行轉入 / 跨行轉出（无"本人"标记） |

**设计原则**：资产形态转换类规则（前 5 条）在 LASA 单 cash 层下不产生账户 delta，事件仅进 `metaLog` 留痕；不会污染期间收支统计。`BANK_FEE` 是真现金支出，与 `CASH_WITHDRAWAL` 分开（取款 170 元本金 + 手续费 15 元属两条事件、两种规则）。
