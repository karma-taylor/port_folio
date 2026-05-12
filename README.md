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

窄屏自动堆叠为单列：个人 → 教育/就业 → 项目（保留 DOM 自然顺序，汇率 Agent 优先展示）。

## 作品集

按主页 Bento 视觉顺序（左→右、上→下）编号：

| # | 项目 | 描述 | GitHub | 上线 |
| --- | --- | --- | --- | --- |
| 01 | 基于逻辑算法的薪资分配策略工具 (Money Distribute AI) | 贪心算法按可用面额自动拆分张数与余数，网页 + 微信小程序双形态 | https://github.com/karma-taylor/money_classify | https://karma-taylor.github.io/money_classify/ |
| 02 | HamHome Daily Digest（资讯日报订阅系统） | 基于 AIAgent + RAG 思路的资讯订阅平台 | https://github.com/karma-taylor/Daily_digest | https://hamhome-digest-web.pages.dev/digest |
| 03 | weather-fx-agent（汇率换算 Agent） | 面向业务场景的汇率换算 Web 工具 | https://github.com/karma-taylor/weather-fx-agent | https://karmacat-weather-fx-agent.hf.space |
| 04 | 工作日历（Work Calendar） | 施工/运维排班可视化日历工具 | https://github.com/karma-taylor/work_calendar | https://work-calendar-52c.pages.dev |
| 05 | 企业业务日报自动化生成引擎 | 用 Python 取代日结手工搬数：多维数据自动清洗、复杂表单秒级生成，结算效率提升约 90%（pandas + openpyxl + Streamlit） | https://github.com/karma-taylor/Daily_report | 暂未上线 |

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
