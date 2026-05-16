# port_folio

郭伟南的 AI 产品经理作品集静态网站，聚焦真实业务场景中的规则抽象、 AI 工作流设计与产品落地。

## 在线访问

- 主页：https://karma-taylor.github.io/port_folio/

## 关于我

我是郭伟南，专注于把复杂业务流程拆成能上线、能复用、能验证结果的 AI 工具。

### 教育背景

- 本科 · 燕山大学（2018 — 2022）
- 硕士 · 重庆大学（2022 — 2025）

### 就业方向

AI 产品经理 / AI 工作流 / Agent 应用 / 真实业务落地案例

## 主页布局

桌面端采用 3:7 两列布局：

- 左列（约 30%）：
  - 个人信息、目标岗位、联系方式
- 右列（约 70%）：
  - `Case Overview`：概括 3 类核心能力
  - `精选项目`：主案例 `Work Calendar`
  - `核心案例`：`Daily Digest` + `Money Distribute AI`
  - `补充案例`：`Weather FX Agent` + `Daily Report Engine`

窄屏自动堆叠为单列：个人信息 → 案例概览 → 精选项目 → 核心案例 → 补充案例。

## 作品集

按当前作品集对外展示顺序（从强主案例到补充案例）：

| # | 项目 | 描述 | GitHub | 上线 |
| --- | --- | --- | --- | --- |
| 01 | 工作日历协同系统（Work Calendar） | 复杂业务规则产品化；分段排期、冲突校验、状态恢复 | https://github.com/karma-taylor/work_calendar | https://work-calendar-52c.pages.dev |
| 02 | HamHome Daily Digest | AI 工作流设计；多源信息加工为可订阅结构化日报 | https://github.com/karma-taylor/Daily_digest | https://hamhome-digest-web.pages.dev/digest |
| 03 | 薪资分配策略工具（Money Distribute AI） | 高频规则型双端工具；批量配钞与导入导出可复核 | https://github.com/karma-taylor/money_classify | https://karma-taylor.github.io/money_classify/ |
| 04 | 汇率换算 Agent（weather-fx-agent） | 结果可信度设计；多银行参考、防呆纠偏、弱网可用 | https://github.com/karma-taylor/weather-fx-agent | https://karmacat-weather-fx-agent.hf.space |
| 05 | 日报自动化生成引擎 | 自动化效率提升；模板一致、异常可追溯 | https://github.com/karma-taylor/Daily_report | 暂未上线 |

## 项目结构

```
port_folio/
├─ index.html                根入口（自动跳转到 zuopinji/）
├─ README.md                 本文件
├─ ARCHITECTURE_GUIDE.md     架构指南（必读）
├─ zuopinji/                 作品集主站
│  ├─ index.html             含 <head> meta + <template> 骨架 + featured/core/support 挂载点 + <noscript>
│  ├─ styles.css             全部样式
│  ├─ main.js                ES Module 入口
│  ├─ data/projects.js       PROJECTS 数据中心（唯一权威）
│  ├─ render/                项目卡渲染器
│  │  ├─ dom-helpers.js
│  │  └─ project-card.js
│  ├─ interactions/          交互模块
│  │  ├─ boot-loader.js
│  │  ├─ reveal.js
│  │  ├─ scroll-progress.js
│  │  ├─ magnetic.js
│  │  └─ focus-overlay.js
│  ├─ seo/                   SEO 资产生成器
│  │  ├─ structured-data.js
│  │  └─ noscript.js
│  └─ *.png / *.jpg          项目封面、头像、背景图
└─ tests/                    浏览器原生单元测试（零依赖）
   ├─ index.html             测试运行入口
   ├─ runner.js
   ├─ test-setup.js
   ├─ data.test.js
   ├─ render.test.js
   ├─ seo.test.js
   └─ interactions.test.js
```

## 给协作者 / AI 助手

新增项目、改样式、加交互前，请先读 **[`ARCHITECTURE_GUIDE.md`](./ARCHITECTURE_GUIDE.md)**。文档涵盖：

- 技术栈与不变性约束（C1-C6）
- 数据/视图分离 + DOM 顺序权威两条原则
- `data/projects.js` 完整 schema 字段定义
- `<template>` 模板规范、`render/project-card.js` 渲染契约
- `main.js` 生命周期与执行顺序约束
- SEO 资产清单（OG meta + JSON-LD + `<noscript>` 兜底）
- 模块文件结构与依赖图
- 新增项目 / 改动效 / 改交互 / 跑测试 SOP
- 12 条反模式（不要做的事）

## 本地预览

由于使用 ES Module，**不能**直接用 `file://` 打开，需要起一个静态服务器：

```
python -m http.server 5500
```

然后访问：

- 主页面：http://localhost:5500/zuopinji/
- 单元测试：http://localhost:5500/tests/

## 测试

打开 [`tests/index.html`](./tests/) 即跑全部用例，顶部会显示 `共 N 项 · 通过 X · 失败 Y` 汇总。当前覆盖：

- PROJECTS / PROFILE schema、唯一性、枚举值
- renderProjectCard 的 DOM 结构、slot 填充、边界场景
- buildPersonJsonLd / projectToCreativeWork / buildNoscriptList / escapeHtml
- computeScrollProgress / computeMagneticOffset 纯逻辑分支
- 所有交互模块的导出形态 smoke

PR 合并前必须确认 `失败 0`。
