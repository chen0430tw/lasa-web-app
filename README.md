# LASA Web App

**资金形态分层会计（Layered Asset-State Accounting）**  
先分类，后结算。看清每笔钱在经济上到底是什么。

---

## 功能概览

### 引擎核心
- 规则注册表（35 条内置规则）
- LHS / WCN / MSN / ln(方差) 语义摘要
- 未知事件语义回退分类
- 原型相似度优化
- JSON / CSV 导入器

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

## API 端点

### 无状态批量
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| POST | `/run` | 批量运行，返回 summary / state / semanticLog |
| POST | `/import/json` | 解析 JSON 事件数组 |
| POST | `/import/csv` | 解析 CSV 内容 |
| GET | `/rules` | 获取规则键列表 |

### 有状态引擎
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/reset` | 重置引擎（初始现金 / 预备金） |
| GET | `/state` | 获取当前账户状态 |
| POST | `/event` | 提交单笔事件 |
| POST | `/period/open` | 开启期间 |
| POST | `/period/close` | 关闭并结算期间 |
| GET | `/periods` | 获取期间历史 |
| POST | `/pending/register` | 登记待确认款项 |
| POST | `/pending/confirm` | 确认归类 |
| POST | `/pending/release` | 释放为异常损失 |
| GET | `/pending` | 获取待确认列表 |
