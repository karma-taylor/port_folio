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
- 右列（约 70%）：项目展示，2 列卡片网格

窄屏自动堆叠为单列：个人 → 教育/就业 → 项目。

## 作品集

| 项目 | 描述 | GitHub | 上线 |
| --- | --- | --- | --- |
| weather-fx-agent（汇率换算 Agent） | 面向业务场景的汇率换算 Web 工具 | https://github.com/karma-taylor/weather-fx-agent | https://karmacat-weather-fx-agent.hf.space |
| HamHome Daily Digest（资讯日报订阅系统） | 基于 AIAgent + RAG 思路的资讯订阅平台 | https://github.com/karma-taylor/Daily_digest | https://hamhome-digest-web.pages.dev/digest |
| 工作日历（Work Calendar） | 施工/运维排班可视化日历工具 | https://github.com/karma-taylor/work_calendar | https://work-calendar-52c.pages.dev |
| 企业业务日报自动化生成引擎 | 面向企业业务的 A→B→C→D 报表自动化引擎（Python） | https://github.com/karma-taylor/Daily_report | 暂未上线 |
| 薪酬配钞工具（Money Classify） | 按面额贪心拆分的薪酬配钞工具，支持 Excel 批量 | https://github.com/karma-taylor/money_classify | https://karma-taylor.github.io/money_classify/ |

## 项目结构

- `index.html`：根入口，自动跳转到作品集页面
- `zuopinji/index.html`：作品集主页面
- `zuopinji/styles.css`：页面样式
- `zuopinji/script.js`：页面交互逻辑
- `zuopinji/*.png` / `*.jpg`：项目封面图与背景图

## 本地预览

直接用浏览器打开仓库根目录的 `index.html`，或在仓库根目录启动任意静态服务器，例如：

```
python -m http.server 5500
```

然后访问 http://localhost:5500。
