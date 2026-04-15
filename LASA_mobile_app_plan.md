# LASA 移动端 App 规划设计文档

**版本**: v0.1  
**日期**: 2026-04-16  
**状态**: 草稿

---

## 1. 目标与定位

LASA 移动端不是简单的 Web 版套壳，而是以**手机为主要录入终端**，引擎在本地运行，离线可用，云端可选同步。

核心价值：
- 随手记一笔，自动分类，不需要手动选科目
- 拍票据/截图银行通知，自动解析录入
- 随时查看：这个月到底盈余还是赤字，哪些钱不能动

---

## 2. 技术栈选型

### 推荐：React Native + Expo

| 维度 | 选择理由 |
|------|---------|
| 引擎复用 | TypeScript 引擎（`@lasa/core`）直接 import，无需重写 |
| 离线优先 | SQLite（WatermelonDB）本地持久化 |
| 跨平台 | iOS + Android 单一代码库 |
| 构建 | EAS Build 托管，无需本地 Xcode/Android Studio |
| UI | React Native Paper 或 Tamagui |
| AGPL 兼容 | 分发二进制不触发 AGPL 网络条款 |

### 核心依赖

```
@lasa/core          — 从现有 src/ 抽出的引擎包
expo                — 托管运行时
expo-sqlite         — 本地数据库
expo-camera         — 拍照录入
expo-document-picker — 导入 CSV/JSON
react-native-paper  — UI 组件库
zustand             — 状态管理
```

---

## 3. 架构设计

```
┌─────────────────────────────────────┐
│           Mobile App                │
│  ┌──────────┐   ┌────────────────┐  │
│  │  UI 层   │   │  本地存储层    │  │
│  │ (RN Paper)│  │  (SQLite/      │  │
│  └────┬─────┘   │   WatermelonDB)│  │
│       │         └───────┬────────┘  │
│  ┌────▼─────────────────▼────────┐  │
│  │         @lasa/core            │  │
│  │  rules / engine / semantics   │  │
│  │  state / period / confirm     │  │
│  └───────────────────────────────┘  │
│  ┌────────────────────────────────┐ │
│  │       接入层（输入来源）        │ │
│  │  手动录入 / OCR / CSV / API    │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
         ↕ 可选云同步
┌─────────────────────────────────────┐
│         LASA Web App / 后端         │
└─────────────────────────────────────┘
```

---

## 4. 功能规划

### Phase 1 — MVP（核心录入与分类）

| 功能 | 说明 |
|------|------|
| 手动录入事件 | 金额、来源、收款方、描述、规则提示 |
| 自动分类 | `@lasa/core` 引擎本地运行 |
| 账户状态总览 | 自由净资产、各层余额 |
| 大雄妈妈短评 | 人话总结盈余/赤字 |
| 本地持久化 | SQLite 存储事件与状态 |
| 期间管理 | 开启/关闭结算期间 |
| 待确认流程 | 登记争议款项，确认或释放 |

### Phase 2 — 智能录入

| 功能 | 说明 |
|------|------|
| **OCR 票据扫描** | 拍照自动解析金额、商家、日期（见 §6） |
| **银行通知解析** | 读取推送通知自动生成事件（Android） |
| CSV/JSON 导入 | 从文件选择器导入 |
| 截图解析 | 粘贴支付宝/微信截图自动识别 |

### Phase 3 — 多端同步与协作

| 功能 | 说明 |
|------|------|
| 云端同步 | 与 LASA Web App 双向同步 |
| 多设备支持 | 同一账户多台手机 |
| 数据导出 | JSON 快照 / CSV |
| 飞书集成 | 白皮书 §12.2 接入层 |

---

## 5. 界面设计

### 主导航（底部 Tab）

```
[ 首页 ]  [ 录入 ]  [ 账户 ]  [ 期间 ]  [ 设置 ]
```

### 首页
- 当前期间盈余/赤字卡片（大雄妈妈短评）
- 自由净资产余额
- 最近 5 笔事件
- 快速录入悬浮按钮（FAB）

### 录入页
- 金额输入（大字数字键盘）
- 来源 / 收款方
- 描述（可选语音输入）
- 规则下拉（自动推荐）
- 风险标签
- 右上角相机图标 → OCR 录入

### 账户页
- 分层资产状态（与 Web 版 stateBreakdown 对应）
- 受限资金 / 待确认 / 紧急预备金单独高亮

---

## 6. OCR 录入方案

> 白皮书 §12.2 提到接入层需支持多来源，OCR 是手机端最自然的录入方式，白皮书未详细规定实现方案，以下为设计补充。

### 6.1 使用场景

- 拍超市/餐厅收据 → 自动填金额、商家名、日期
- 拍银行转账截图 → 自动填金额、来源/收款方
- 拍微信/支付宝付款页面截图

### 6.2 实现方案（两档选择）

**方案 A：本地 OCR（离线优先）**

使用 Google ML Kit Text Recognition（Android）/ Vision Framework（iOS），通过 Expo 插件调用：

```
expo-camera → 拍照 → ML Kit / Vision → 文字识别
→ 正则提取（金额、商家、日期）→ 预填录入表单
```

优点：完全离线、无成本、隐私安全  
缺点：识别复杂票据准确率有限

**方案 B：云端 OCR（高精度）**

调用 Google Cloud Vision API 或 Azure Form Recognizer，专门针对收据/发票做结构化提取：

```
expo-camera → 拍照 → 压缩 → Cloud Vision API
→ 结构化结果（amount/merchant/date）→ 预填表单
```

优点：准确率高，支持发票/收据专用模型  
缺点：需网络、有 API 费用、需处理隐私

### 6.3 推荐路线

**Phase 2 先用方案 A（ML Kit）**，覆盖大多数手写/印刷金额识别场景，离线可用。  
**Phase 3 按需升级方案 B**，用于企业用户的发票/报销场景。

### 6.4 提取字段映射

| OCR 提取字段 | LASA 事件字段 |
|-------------|-------------|
| 金额 | `amount` |
| 商家/收款方 | `destination` |
| 日期时间 | `timestamp` |
| 品类关键词 | 辅助推荐 `rawCategoryHint` |

---

## 7. 本地数据库设计

### 表结构（SQLite）

```sql
-- 事件表
CREATE TABLE events (
  id          TEXT PRIMARY KEY,
  uuid        TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  timestamp   TEXT NOT NULL,
  amount      REAL NOT NULL,
  asset_type  TEXT,
  source      TEXT,
  destination TEXT,
  description TEXT,
  hint        TEXT,
  restriction TEXT,
  time_tag    TEXT,
  risk_tags   TEXT,  -- JSON array
  account_class TEXT,
  period_id   TEXT
);

-- 期间表
CREATE TABLE periods (
  id           TEXT PRIMARY KEY,
  label        TEXT,
  opened_at    TEXT,
  closed_at    TEXT,
  start_snapshot TEXT,  -- JSON
  end_snapshot   TEXT,  -- JSON
  summary        TEXT   -- JSON
);

-- 待确认表
CREATE TABLE pending_items (
  event_id      TEXT PRIMARY KEY,
  amount        REAL,
  risk_tags     TEXT,
  note          TEXT,
  registered_at TEXT,
  status        TEXT   -- pending/confirmed/released
);
```

---

## 8. `@lasa/core` 拆包计划

将以下文件从 `src/` 抽出为独立 npm 包：

```
packages/lasa-core/
  src/
    types.ts
    utils.ts
    semantics.ts
    state.ts
    rules.ts
    engine.ts
    importers.ts
    period.ts
    confirm.ts
    index.ts
  package.json     ("name": "@lasa/core")
  tsconfig.json
```

Web App 和 Mobile App 均通过 `import { LASAEngine } from "@lasa/core"` 使用，引擎逻辑只维护一份。

---

## 9. 开发里程碑

| 阶段 | 内容 | 目标 |
|------|------|------|
| M0 | 抽出 `@lasa/core`，Web App 迁移验证 | 引擎与 UI 完全解耦 |
| M1 | Expo 项目初始化，SQLite 持久化，手动录入 + 分类 | MVP 可用 |
| M2 | 首页仪表板，大雄妈妈短评，期间管理 | 核心体验完整 |
| M3 | OCR 录入（ML Kit），CSV 导入 | 智能录入 |
| M4 | 云同步，多设备，飞书接入 | 扩展生态 |

---

## 10. 待决策事项

- [ ] OCR 是否优先做，还是 M1 先跳过
- [ ] 云同步后端用 LASA Web App 现有 API，还是新建同步服务
- [ ] 飞书集成优先级（白皮书提到但未详述）
- [ ] App Store / Google Play 发布策略（AGPL 与应用商店条款兼容性需确认）
- [ ] 付费/免费模式
