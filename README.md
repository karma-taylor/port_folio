# port_folio

郭伟南的个人作品集静态网站。

## 在线访问

- 主页：https://karma-taylor.github.io/port_folio/

## 关于我

我是郭伟南，专注于把创意变成易用、稳定且有质感的产品体验。

### 教育背景

- 本科 · 燕山大学（2018 — 2022）
- 硕士 · 重庆大学（2022 — 2025）

### 就业方向

AI 产品经理 / Agent 应用 / 数据型工具 / Web 前端

## 主页布局

桌面端采用 3:7 两列布局：

- 左列（约 30%）：
  - 上：个人情况（PORTFOLIO 主标题 + 一句话介绍）
  - 下：教育背景 + 就业方向
- 右列（约 70%）：Bento Box 网格 — 顶部三张 tall 卡片（薪资 · 资讯日报 · 汇率 Agent）并排，底部一张 wide 工作日历 + 一张 small 日报引擎

窄屏自动堆叠为单列：个人 → 教育/就业 → 项目（按 01 → 05 编号顺序展示）。

## 作品集

按主页 Bento 视觉顺序（左→右、上→下）编号：

| # | 项目 | 描述 | GitHub | 上线 |
| --- | --- | --- | --- | --- |
| 01 | 薪资分配策略工具（Money Distribute AI） | 贪心配钞、Excel 批量；典型场景压缩人工核对时间 | https://github.com/karma-taylor/money_classify | https://karma-taylor.github.io/money_classify/ |
| 02 | HamHome Daily Digest | 多源资讯 + RAG 分桶摘要 + 定时邮件 | https://github.com/karma-taylor/Daily_digest | https://hamhome-digest-web.pages.dev/digest |
| 03 | 汇率换算 Agent（weather-fx-agent） | 多银行参考、防呆纠偏、弱网可用 | https://github.com/karma-taylor/weather-fx-agent | https://karmacat-weather-fx-agent.hf.space |
| 04 | 工作日历排班系统（Work Calendar） | 分段排班、冲突校验、Supabase 同步 | https://github.com/karma-taylor/work_calendar | https://work-calendar-52c.pages.dev |
| 05 | 日报自动化生成引擎 | Python 自动化日报，结算效率提升约 90% | https://github.com/karma-taylor/Daily_report | 暂未上线 |

## 项目结构

```
port_folio/
├─ index.html                根入口（自动跳转到 zuopinji/）
├─ README.md                 本文件
├─ ARCHITECTURE_GUIDE.md     架构指南（必读）
├─ zuopinji/                 作品集主站
│  ├─ index.html             含 <head> meta + <template> 骨架 + #projectsGrid 挂载点 + <noscript>
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
