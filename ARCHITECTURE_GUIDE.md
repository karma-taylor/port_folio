# Portfolio 架构指南 (Path A'')

> **读者**：未来在本仓库新增项目、新增交互、改样式的 AI 助手或人类开发者。
> **目的**：在不引入任何构建工具的前提下，保持"数据与视图解耦、DOM 顺序权威、SEO 资产完备"三条原则，让新增功能可控、可回滚、不破坏现有体验。
> **维护人**：karma-taylor (郭伟南)
> **最后更新**：2026-05-12（架构迁移完成 + 单元测试就绪）

---

## 0. 当前状态

**已完成迁移到 Path A''**。下表为重构后的实际形态，新增功能请按此架构。

| 维度 | 实现 |
|---|---|
| 卡片渲染 | `<template id="projectCardTemplate">` + `data/projects.js` + `render/project-card.js`，运行时由 `main.js` 在 `DOMContentLoaded` 中调用 `renderAllProjects` 渲染 |
| 顺序权威 | **仅** DOM 顺序 = 数据数组顺序 = 视觉顺序。原 `:nth-of-type(N) { order: M }` 5 行已删 |
| SEO 资产 | `<head>` 完整 og: meta + Twitter Card；静态预填 JSON-LD（`<script id="structuredData">`）；运行时 `seo/structured-data.js` 用 `PROJECTS` 重新注入；`<noscript>` 5 项目纯文本兜底 |
| 模块化 | `data/` · `render/` · `interactions/` · `seo/` 四个子目录，`main.js` 为唯一入口（ES Module，`type="module"`） |
| 单元测试 | `tests/index.html` 浏览器原生 runner（零依赖），覆盖 schema 验证 / 渲染 DOM / SEO 生成器 / 纯逻辑函数 |
| 构建工具 | 无 | **永远不引入**（如需 SSG 升级到 Path C，需立项重新评估） |
| 部署 | GitHub Pages，推 `main` 即生效 |

---

## 1. 不变性约束（红线，违反需用户明确批准）

| 编号 | 约束 | 为什么 |
|---|---|---|
| C1 | **不引入构建工具 / npm 依赖 / TypeScript / 框架** | 项目部署在 GitHub Pages 静态托管，目标是改一行立即生效。引入构建链会破坏这个属性 |
| C2 | **不破坏 `.project-card` 的标准 DOM 选择器** | `interactions/focus-overlay.js` 通过 `querySelector` 抓 DOM；选择器一改，交互全断 |
| C3 | **不修改 `interactions/*.js` 中既有 export 函数的签名** | `main.js` 假设 `revealCards / setupScrollProgress / setupMagneticTargets / setupProjectFocusOverlay / runBootLoader` 接口稳定 |
| C4 | **不引入会跑在用户机器上的客户端字体子集打包、image 处理服务** | 当前直接走 Google Fonts CDN + 本地图片，简单、稳定 |
| C5 | **不删除 `prefers-reduced-motion` 媒体查询里的禁用规则** | a11y 兜底，所有新增动效都必须支持降级 |
| C6 | **不删除 `<noscript>` 兜底**（迁移后） | 是 SEO / 老爬虫的最后一道防线 |

---

## 2. 技术栈

- HTML5 静态文件
- 原生 CSS（CSS Grid + custom properties + `@keyframes` + `@property`）
- 原生 ES Module JavaScript（无 polyfill、无 transpile）
- Google Fonts：Inter / Noto Sans SC / JetBrains Mono
- 部署：GitHub Pages，仓库根 `index.html` 自动重定向到 `zuopinji/index.html`

**浏览器兼容基线**：Chromium 110+ / Safari 16+ / Firefox 115+（用了 `@property`、`aspect-ratio`、`:has()` 等近 2-3 年特性）。

---

## 3. 文件结构（迁移后实际形态）

```
port_folio/
├─ README.md                  作品集对外介绍 + 项目清单表
├─ ARCHITECTURE_GUIDE.md      本文档
├─ index.html                 根入口，重定向到 zuopinji/index.html
├─ zuopinji/
│  ├─ index.html              主页面：含 <head> meta + 4 个 <template> + #projectsGrid 空挂载点 + <noscript> 兜底
│  ├─ styles.css              全部样式（无 nth-of-type 位置耦合）
│  ├─ main.js                 ES Module 入口；DOMContentLoaded 时串联渲染 → 交互 → SEO 注入
│  ├─ data/
│  │   └─ projects.js         PROJECTS 数组 + PROFILE 身份信息（唯一权威）
│  ├─ render/
│  │   ├─ dom-helpers.js      cloneTemplate / getSlot / setSlotText 等薄封装
│  │   └─ project-card.js     renderProjectCard / renderAllProjects / buildCoverUrl
│  ├─ interactions/
│  │   ├─ boot-loader.js      启动遮罩动画（runBootLoader）
│  │   ├─ reveal.js           IntersectionObserver 入场（revealCards）
│  │   ├─ scroll-progress.js  顶部 2px 进度条（setupScrollProgress + computeScrollProgress 纯函数）
│  │   ├─ magnetic.js         磁吸交互（setupMagneticTargets + computeMagneticOffset 纯函数）
│  │   └─ focus-overlay.js    项目详情弹层（拆为 queryOverlayRefs / extractCardData / createPromptButton / flyImageIntoPlace / openOverlay / closeOverlay / bindCloseHandlers / setupProjectFocusOverlay）
│  ├─ seo/
│  │   ├─ structured-data.js  buildPersonJsonLd / projectToCreativeWork / injectJsonLd
│  │   └─ noscript.js         buildNoscriptList / projectToNoscriptItem / escapeHtml
│  └─ *.png / *.jpg           项目封面、头像、背景图
└─ tests/
   ├─ index.html              浏览器原生测试 runner 入口
   ├─ runner.js               极简 describe / it / assert / run（零依赖）
   ├─ test-setup.js           fetch 生产 index.html 把 <template> 注入到测试页
   ├─ data.test.js            PROJECTS / PROFILE schema 校验
   ├─ render.test.js          renderProjectCard 的 DOM 输出验证
   ├─ seo.test.js             JSON-LD + noscript 生成器
   └─ interactions.test.js    纯逻辑函数 + 模块导出 smoke
```

### 模块依赖关系（自上而下，无环）

```
                      ┌────────────────────────┐
                      │      index.html        │
                      │  (templates + grid)    │
                      └─────────────┬──────────┘
                                    │ type="module"
                                    ▼
                              ┌──────────┐
                              │ main.js  │
                              └────┬─────┘
              ┌────────────────────┼─────────────────────┐
              ▼                    ▼                     ▼
       data/projects.js      render/*               interactions/*
              │                    │                     │
              └────────────────────┼─────────────────────┤
                                   ▼                     ▼
                             dom-helpers              seo/*
```

- `interactions/*` 之间互不依赖
- `render/project-card.js` 只依赖 `dom-helpers.js`，不知道 `data/` 形态（schema 解释在数据消费方）
- `seo/*` 是纯函数，可单独测试，不依赖 DOM helpers

---

## 4. 核心架构原则

### 4.1 数据/视图分离
**唯一权威**：`data/projects.js` 中的 `PROJECTS` 数组。
**模板**：`<template id="projectCardTemplate">`（外加 techBadge / flowStep / detailLink 三个子模板），结构纯净、所有可变文本/链接用 `data-slot="xxx"` 标记。
**渲染器**：`render/project-card.js` 的 `renderProjectCard(data)`，只做"克隆模板 → 按 slot 填充 → 返回 HTMLElement"，不做任何业务判断。

### 4.2 DOM 顺序权威
数据数组的顺序就是 DOM 顺序就是视觉顺序。**永远不要**写 `:nth-of-type(N) { order: M }` 这类把视觉位置绑定到 DOM 序号的规则。要换位置就直接重排数组。

### 4.3 SEO 资产完备
HTML 初始内容必须能让爬虫和社交分享卡片至少抓到：
- 姓名 + 身份（已在 `<h1>` / `<p class="profile-role">`）
- 5 个项目的标题 + 一句话简介（通过 `<noscript>` 列表）
- `og:title` / `og:description` / `og:image` / `og:url`
- `application/ld+json` 结构化数据（Person + hasPart 项目列表）

---

## 5. 数据 Schema（`data/projects.js`）

```js
// data/projects.js
// 数组顺序 = DOM 顺序 = 视觉顺序。要改位置直接重排数组。
export const PROJECTS = [
  {
    // ---- 标识 / 排版 ----
    id: "money",                            // 必填，全局唯一，kebab-case
    index: "01",                            // 必填，显示用编号，纯字符串（保留前导 0）
    size: "tall",                           // 必填，枚举：featured | tall | wide | small
    status: "live",                         // 必填，枚举：live | wip
    statusLabel: "已上线",                  // 必填，与 status 对应的中文展示（"已上线" / "建设中"）

    // ---- 主信息 ----
    title: "基于逻辑算法的薪资分配策略工具（Money Distribute AI）", // 必填
    cover: {
      src: "./money-cover.png",             // 必填，相对路径
      version: "20260512-darkmoney",        // 选填，cache-buster；构造 url 时拼成 `${src}?v=${version}`
      alt: "基于逻辑算法的薪资分配策略工具项目展示图", // 必填，a11y 关键
    },

    // ---- 悬停层 ----
    hoverValue: "基于贪心算法的薪资现金分配策略：按可用面额自动拆分张数与余数，单笔即时计算 + Excel 批量导入导出，小程序版同步在路上。", // 必填
    hoverCta: {
      href: "https://karma-taylor.github.io/money_classify/", // 必填
      label: "访问演示",                    // 必填："访问演示" / "访问地址" / "查看演示"
      aria: "访问薪资分配策略工具演示",     // 必填，aria-label 完整描述
    },

    // ---- 技术栈胶囊 ----
    tech: [
      { type: "lang",      label: "JavaScript" },
      { type: "tool",      label: "Excel 导入导出" },
      { type: "framework", label: "WeChat 小程序" },
      { type: "ai",        label: "Cursor" },
      { type: "deploy",    label: "GitHub Pages" },
    ],
    // type 枚举（决定颜色）：lang | framework | tool | api | ai | deploy
    // 新增 type 必须同步在 styles.css 加 [data-tech-type="..."] 着色规则

    // ---- 业务流程 4 步 ----
    flow: {
      ariaLabel: "薪资分配策略工具 业务流程", // 必填
      steps: [
        { idx: "01", label: "选定面额" },
        { idx: "02", label: "贪心拆分" },
        { idx: "03", label: "余数校验" },
        { idx: "04", label: "批量导出", accent: true }, // 终态步骤可加 accent: true
      ],
      // 固定 4 步。少于 4 步视觉会失衡；多于 4 步会换行破坏布局
    },

    // ---- GitHub CTA ----
    github: {
      href: "https://github.com/karma-taylor/money_classify", // 必填
      magnetic: true,                       // 选填，默认 true（启用磁吸）
      magneticStrength: 0.25,               // 选填，默认 0.25（0-1 之间）
    },

    // ---- focus overlay 详情 ----
    detail: {
      summary: "用贪心算法把工资金额按可选面额（50000/25000/10000/5000/1000）从大到小拆成张数和余数。网页端单笔计算 + Excel 批量导入导出，微信小程序版本同步在路上。",
      prompt: "Prompt：你是一个银行柜员，需要根据当天可用纸币面额为员工薪酬进行现金配钞……",
      // 完整 Prompt 文本，会渲染进弹层
      links: [
        { type: "github", href: "https://github.com/karma-taylor/money_classify", label: "GitHub 链接" },
        { type: "live",   href: "https://karma-taylor.github.io/money_classify/", label: "上线链接" },
      ],
      // links 中的 type 决定使用哪个 SVG 图标（github | live）
      // wip 项目可以省略 live 那条
    },
  },
  // …… 其余项目按目标视觉顺序排列 ……
];
```

### 5.1 字段约束矩阵

| 字段 | 类型 | 必填 | 备注 |
|---|---|---|---|
| `id` | string | ✓ | 全局唯一，kebab-case |
| `index` | string | ✓ | 必须是字符串，前导 0 保留 |
| `size` | enum | ✓ | `featured` / `tall` / `wide` / `small` |
| `status` | enum | ✓ | `live` / `wip` |
| `statusLabel` | string | ✓ | live ⇒ "已上线"，wip ⇒ "建设中" |
| `title` | string | ✓ | 含括注的全名 |
| `cover.src` | string | ✓ | 相对路径 |
| `cover.version` | string | – | cache-buster 时戳，更新封面时务必同步更新 |
| `cover.alt` | string | ✓ | 不可为空，a11y 必需 |
| `hoverValue` | string | ✓ | 一句话价值主张 ≤ 60 字 |
| `hoverCta.href` | url | ✓ | wip 可指向 GitHub README |
| `hoverCta.label` | string | ✓ | 短动词短语 |
| `hoverCta.aria` | string | ✓ | 完整 aria-label |
| `tech` | array | ✓ | 3-6 项最佳，超过 6 个会换行影响布局 |
| `tech[].type` | enum | ✓ | 见着色枚举 |
| `flow.ariaLabel` | string | ✓ | 用于屏幕阅读器 |
| `flow.steps` | array | ✓ | **固定 4 项** |
| `github.href` | url | ✓ | 公开 repo |
| `detail.summary` | string | ✓ | 长描述，弹层主文案 |
| `detail.prompt` | string | – | 没有就用 fallback：「Prompt：突出产品定位与核心使用场景。」 |
| `detail.links` | array | ✓ | 至少 1 项（GitHub），live 项目应有 2 项 |

### 5.2 `size` 选择决策树

```
是这个项目的"门面"主推？是 → featured  (1 列 × 2 行，最大格子)
                       否 → ↓
偏纵向截图（如日历列、表单）？是 → tall   (1 列 × 2 行)
                              否 → ↓
偏横向截图（如长 dashboard、邮件主体）？是 → wide   (2 列 × 1 行，内部左右布局)
                                       否 → small  (1 列 × 1 行)
```

约束：整个 grid 必须能填满 3 列网格、不留空洞。新增/删除项目时**用户应同时指定 size**，不要 AI 自行猜测。

---

## 6. 模板规范（`<template id="projectCardTemplate">`）

放在 `zuopinji/index.html` 的 `<body>` 末尾。结构必须**与目标渲染结果 100% 同构**，所有可变内容用 `data-slot="xxx"` 占位。SVG 图标（GitHub icon、live icon、status dot）**写一次**，渲染器直接 clone 拿过来用。

### 6.1 模板骨架（精简示意，完整版以实际仓库为准）

```html
<template id="projectCardTemplate">
  <article class="project-card reveal">
    <button class="project-trigger" type="button" aria-expanded="false">
      <div class="project-cover" data-slot="cover-bg">
        <img data-slot="cover-img" />
      </div>
      <div class="project-hover-overlay" aria-hidden="true">
        <p class="hover-value" data-slot="hover-value"></p>
      </div>
    </button>
    <a class="hover-cta" data-slot="hover-cta" target="_blank" rel="noopener noreferrer">
      <span class="hover-cta-text" data-slot="hover-cta-label"></span>
      <span class="hover-cta-arrow" aria-hidden="true">↗</span>
    </a>
    <div class="project-meta">
      <span class="project-index" data-slot="index"></span>
      <h3 class="project-title" data-slot="title"></h3>
      <span class="project-status" data-slot="status">
        <span class="status-dot" aria-hidden="true"></span>
        <span data-slot="status-label"></span>
      </span>
      <ul class="project-tech" data-slot="tech-list"></ul>
    </div>
    <ol class="project-flow" data-slot="flow-list"></ol>
    <a class="github-cta" data-slot="github-cta" data-magnetic data-magnetic-strength="0.25" target="_blank" rel="noopener noreferrer">
      <span class="github-icon" aria-hidden="true">
        <!-- 这里写一次完整的 GitHub SVG path -->
      </span>
      <span>Star on GitHub</span>
    </a>
    <div class="project-content" hidden>
      <p class="project-summary" data-slot="summary"></p>
      <p class="project-prompt" data-slot="prompt"></p>
      <div class="project-links" data-slot="detail-links"></div>
    </div>
  </article>
</template>

<template id="techBadgeTemplate">
  <li data-slot="tech-item"></li>
</template>

<template id="flowStepTemplate">
  <li class="flow-step">
    <span class="flow-step-idx" data-slot="flow-idx"></span>
    <span class="flow-step-label" data-slot="flow-label"></span>
  </li>
</template>

<template id="detailLinkTemplate">
  <a target="_blank" rel="noopener noreferrer">
    <!-- 图标由 type 决定，可以预先放两份 SVG，用 data-icon-for="github|live" 切换 -->
    <span class="github-icon" data-icon-for="github" aria-hidden="true"><svg>...</svg></span>
    <span class="live-icon"   data-icon-for="live"   aria-hidden="true"><svg>...</svg></span>
    <span data-slot="link-label"></span>
  </a>
</template>
```

### 6.2 模板编辑红线

- **不要**改 `<article class="project-card">` 的根标签、根类名
- **不要**改任何子元素的 class（`.project-cover`, `.project-meta`, `.project-flow`, `.github-cta`, `.hover-cta`, `.project-content` 等都被 CSS 和 JS 引用）
- **不要**改任何 `data-slot="xxx"` 的名字（渲染器与之耦合）
- 如确需新增 slot：先在数据 schema 加字段 → 在模板加 `<...data-slot="new-thing">` → 在 `render/project-card.js` 加填充逻辑 → 在 `styles.css` 加样式 → 在 `tests/render.test.js` 加用例

---

## 7. 渲染器（`render/project-card.js`）

```js
// render/project-card.js（精简伪代码，实际见仓库）
// 渲染单张项目卡。输入数据对象，输出 DOM 节点（未挂载）。

const cardTpl  = document.getElementById("projectCardTemplate");
const techTpl  = document.getElementById("techBadgeTemplate");
const flowTpl  = document.getElementById("flowStepTemplate");
const linkTpl  = document.getElementById("detailLinkTemplate");

export function renderProjectCard(data) {
  const node = cardTpl.content.firstElementChild.cloneNode(true);

  // 1. 根 article 上的 data-* 属性
  node.dataset.status = data.status;
  node.dataset.size   = data.size;

  // 2. 封面图
  const cover    = node.querySelector('[data-slot="cover-bg"]');
  const coverImg = node.querySelector('[data-slot="cover-img"]');
  const coverUrl = `${data.cover.src}${data.cover.version ? `?v=${data.cover.version}` : ""}`;
  cover.style.setProperty("--cover-url", `url(${coverUrl})`);
  coverImg.src = coverUrl;
  coverImg.alt = data.cover.alt;

  // 3. 悬停层 / hover CTA
  node.querySelector('[data-slot="hover-value"]').textContent     = data.hoverValue;
  const hoverCta = node.querySelector('[data-slot="hover-cta"]');
  hoverCta.href           = data.hoverCta.href;
  hoverCta.ariaLabel      = data.hoverCta.aria;
  node.querySelector('[data-slot="hover-cta-label"]').textContent = data.hoverCta.label;

  // 4. meta（index / title / status）
  node.querySelector('[data-slot="index"]').textContent         = data.index;
  node.querySelector('[data-slot="title"]').textContent         = data.title;
  const status = node.querySelector('[data-slot="status"]');
  status.classList.add(`project-status--${data.status}`);
  node.querySelector('[data-slot="status-label"]').textContent  = data.statusLabel;

  // 5. tech 胶囊
  const techList = node.querySelector('[data-slot="tech-list"]');
  techList.setAttribute("aria-label", `${data.title} 技术栈`);
  data.tech.forEach(t => {
    const li = techTpl.content.firstElementChild.cloneNode(true);
    li.dataset.techType = t.type;
    li.textContent      = t.label;
    techList.appendChild(li);
  });

  // 6. flow 4 步
  const flowList = node.querySelector('[data-slot="flow-list"]');
  flowList.setAttribute("aria-label", data.flow.ariaLabel);
  data.flow.steps.forEach(s => {
    const li = flowTpl.content.firstElementChild.cloneNode(true);
    if (s.accent) li.classList.add("flow-step--accent");
    li.querySelector('[data-slot="flow-idx"]').textContent   = s.idx;
    li.querySelector('[data-slot="flow-label"]').textContent = s.label;
    flowList.appendChild(li);
  });

  // 7. GitHub CTA
  const githubCta = node.querySelector('[data-slot="github-cta"]');
  githubCta.href = data.github.href;
  if (data.github.magnetic === false) githubCta.removeAttribute("data-magnetic");
  if (data.github.magneticStrength != null) {
    githubCta.dataset.magneticStrength = String(data.github.magneticStrength);
  }

  // 8. focus overlay 详情
  node.querySelector('[data-slot="summary"]').textContent = data.detail.summary;
  if (data.detail.prompt) {
    node.querySelector('[data-slot="prompt"]').textContent = data.detail.prompt;
  }
  const detailLinks = node.querySelector('[data-slot="detail-links"]');
  data.detail.links.forEach(l => {
    const a = linkTpl.content.firstElementChild.cloneNode(true);
    a.href = l.href;
    // 隐藏不需要的图标
    a.querySelectorAll("[data-icon-for]").forEach(icon => {
      if (icon.dataset.iconFor !== l.type) icon.remove();
    });
    a.querySelector('[data-slot="link-label"]').textContent = l.label;
    detailLinks.appendChild(a);
  });

  return node;
}

export function renderAllProjects(projects, mountEl) {
  const frag = document.createDocumentFragment();
  projects.forEach(p => frag.appendChild(renderProjectCard(p)));
  mountEl.replaceChildren(frag);
}
```

**契约**：
- `renderProjectCard(data)` **必须**返回挂载就绪的 `<article class="project-card reveal">` 节点
- 渲染器**绝对不**调用 `revealCards()` / `setupMagneticTargets()` / `setupProjectFocusOverlay()`；那是 `main.js` 的职责
- 渲染器**绝对不**写死任何项目特定文案（包括 fallback 文字）；如需 fallback 走数据层默认值

---

## 8. 生命周期（`main.js`）

**关键**：所有依赖 DOM 查询的 setup 函数，**必须在卡片渲染完成之后**执行。

```js
// main.js
import { PROJECTS, PROFILE }    from "./data/projects.js";
import { renderAllProjects }    from "./render/project-card.js";
import { runBootLoader }        from "./interactions/boot-loader.js";
import { revealCards }          from "./interactions/reveal.js";
import { setupScrollProgress }  from "./interactions/scroll-progress.js";
import { setupMagneticTargets } from "./interactions/magnetic.js";
import { setupProjectFocusOverlay } from "./interactions/focus-overlay.js";
import { buildPersonJsonLd, injectJsonLd } from "./seo/structured-data.js";

// 1. boot loader 立即跑（盖住屏幕，与卡片渲染并行）
runBootLoader();

// 2. DOM 就绪后：渲染卡片 → 绑定交互 → 刷新 SEO
function init() {
  renderAllProjects(PROJECTS, document.getElementById("projectsGrid"));
  revealCards();
  setupScrollProgress();
  setupMagneticTargets();
  setupProjectFocusOverlay();
  injectJsonLd(buildPersonJsonLd(PROFILE, PROJECTS));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
```

### 8.1 顺序约束

| 步骤 | 依赖 | 不能颠倒原因 |
|---|---|---|
| `renderAllProjects` | `<template>` 已就绪 + `<section id="projectsGrid">` 已存在 | 后续所有 setup 都 `querySelectorAll('.project-card')` |
| `revealCards` | DOM 已渲染 | 否则 IntersectionObserver 观察不到节点 |
| `setupScrollProgress` | 无强依赖 | 但卡片渲染会改变 scrollHeight，要在之后跑才能算对总高 |
| `setupMagneticTargets` | DOM 已渲染 | 否则抓不到 `[data-magnetic]` 元素 |
| `setupProjectFocusOverlay` | DOM 已渲染 | 它要给 `.project-trigger` 绑 click |

### 8.2 ES Module 导入

`<script src="./main.js?v=..." type="module"></script>` —— **必须**加 `type="module"`，否则 `import` 报错。模块脚本默认 `defer`，会在 HTML 解析完后执行，所以 `DOMContentLoaded` 监听器仍然安全（不会错过事件，浏览器对 defer 脚本注册的 DOMContentLoaded 监听器会等到所有 defer 跑完再触发）。如果脚本加载完毕时 `readyState` 已经是 `interactive` 或 `complete`，`init()` 直接调用以保证幂等启动。

### 8.3 boot loader 例外

boot loader 是 IIFE 立即执行（不等 DOMContentLoaded），因为它要尽早盖住屏幕。这部分**不依赖**项目卡 DOM，无需放进 init 流程。

---

## 9. CSS 约束（`styles.css`）

### 9.1 数据驱动 vs 位置驱动

| 项目 | 实现 |
|---|---|
| 卡片大小（占几格） | `.project-card[data-size="..."]` 选择器 → grid-column / grid-row span（数据驱动） |
| 卡片视觉顺序 | **由 PROJECTS 数组顺序决定**，CSS 无 `:nth-of-type` 排序规则 |
| 内部子元素布局 | `.project-card[data-size="wide"] > .project-trigger` 等子选择器 |

### 9.2 `data-size` 几何表

| size | grid-column | grid-row | cover aspect-ratio | 内部布局 |
|---|---|---|---|---|
| `featured` | span 1 | span 2 | 4 / 3.8 | 标准纵向 flex |
| `tall`     | span 1 | span 2 | 4 / 3.8 | 标准纵向 flex |
| `wide`     | span 2 | span 1 | auto, height 100%, min-height 200px | **内部 grid 左图右文** |
| `small`    | span 1 | span 1 | 4 / 3 | 标准纵向 flex |

### 9.3 响应式断点

| 断点 | 行为 |
|---|---|
| `≥ 1101px` | 3 列 Bento，所有 `data-size` 生效 |
| `≤ 1100px` | `grid-auto-flow: row dense`，`wide` 退化为单列纵向 flex |
| `≤ 860px` | 所有 size 退化为 1×1，cover aspect-ratio 统一 16/9 |

### 9.4 `data-tech-type` 着色枚举

| type | 用途 | 当前色调 |
|---|---|---|
| `lang` | 编程语言（Python / JavaScript） | 蓝紫 |
| `framework` | 框架（RAG / 小程序 / Streamlit） | 青绿 |
| `tool` | 工具/库（pandas / Excel / 定时任务） | 琥珀 |
| `api` | 第三方 API | 玫红 |
| `ai` | AI 编辑器/Agent（Cursor / Dify） | 紫粉 |
| `deploy` | 部署平台（GitHub Pages / Cloudflare） | 灰白 |

新增 type 需要：
1. 在数据里使用
2. 在 styles.css 加 `.project-tech li[data-tech-type="新type"] { background: ...; color: ...; border: ...; }` 规则

---

## 10. SEO 资产（迁移时一次加完）

### 10.1 `<head>` 必加内容

```html
<head>
  <!-- 基础 -->
  <title>郭伟南 · AI 产品经理作品集</title>
  <meta name="description" content="郭伟南的个人作品集：Agent 应用、数据型工具、Web 前端。包含汇率换算 Agent、HamHome 资讯日报、薪资分配策略工具等 5 个落地项目。" />

  <!-- Open Graph（微信 / 领英 / Twitter / Discord 卡片预览） -->
  <meta property="og:type"        content="profile" />
  <meta property="og:title"       content="郭伟南 · AI 产品经理作品集" />
  <meta property="og:description" content="Agent 应用 / 数据型工具 / Web 前端 — 5 个真实落地项目。" />
  <meta property="og:url"         content="https://karma-taylor.github.io/port_folio/zuopinji/" />
  <meta property="og:image"       content="https://karma-taylor.github.io/port_folio/zuopinji/og-card.jpg" />
  <meta property="og:locale"      content="zh_CN" />

  <!-- Twitter Cards 兼容 -->
  <meta name="twitter:card"  content="summary_large_image" />
  <meta name="twitter:title" content="郭伟南 · AI 产品经理作品集" />
  <meta name="twitter:image" content="https://karma-taylor.github.io/port_folio/zuopinji/og-card.jpg" />

  <!-- 结构化数据 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "郭伟南",
    "alternateName": "Guo Weinan",
    "url": "https://karma-taylor.github.io/port_folio/",
    "sameAs": ["https://github.com/karma-taylor"],
    "jobTitle": "AI 产品经理",
    "hasPart": [
      { "@type": "CreativeWork", "name": "基于逻辑算法的薪资分配策略工具", "url": "https://karma-taylor.github.io/money_classify/", "description": "贪心算法按可用面额拆分薪资现金" },
      { "@type": "CreativeWork", "name": "HamHome Daily Digest", "url": "https://hamhome-digest-web.pages.dev/digest", "description": "AIAgent + RAG 资讯日报订阅" },
      { "@type": "CreativeWork", "name": "weather-fx-agent", "url": "https://karmacat-weather-fx-agent.hf.space", "description": "面向业务场景的汇率换算 Agent" },
      { "@type": "CreativeWork", "name": "工作日历", "url": "https://work-calendar-52c.pages.dev", "description": "施工/运维排班可视化日历" },
      { "@type": "CreativeWork", "name": "企业业务日报自动化生成引擎", "url": "https://github.com/karma-taylor/Daily_report", "description": "Python 自动化日报，效率提升 90%" }
    ]
  }
  </script>
</head>
```

JSON-LD 中的项目列表**必须从 `data/projects.js` 同步维护**。`main.js` 的 `init()` 在卡片渲染后会调用 `injectJsonLd(buildPersonJsonLd(PROFILE, PROJECTS))`，运行时刷新 `<script id="structuredData">` 内容；而 `<head>` 中的静态预填用于无 JS 爬虫兜底，两者**必须保持一致**。

### 10.2 `<body>` 末尾 `<noscript>` 兜底

```html
<noscript>
  <section class="noscript-fallback">
    <h2>作品集（精简版）</h2>
    <p>请开启 JavaScript 以获得完整体验。以下是项目清单的精简文本：</p>
    <ol>
      <li><strong>基于逻辑算法的薪资分配策略工具</strong> — 贪心算法拆分薪资面额 — <a href="https://karma-taylor.github.io/money_classify/">演示</a> · <a href="https://github.com/karma-taylor/money_classify">GitHub</a></li>
      <li><strong>HamHome Daily Digest</strong> — AIAgent + RAG 资讯日报订阅 — <a href="https://hamhome-digest-web.pages.dev/digest">演示</a> · <a href="https://github.com/karma-taylor/Daily_digest">GitHub</a></li>
      <li><strong>weather-fx-agent</strong> — 业务场景汇率换算 Agent — <a href="https://karmacat-weather-fx-agent.hf.space">演示</a> · <a href="https://github.com/karma-taylor/weather-fx-agent">GitHub</a></li>
      <li><strong>工作日历</strong> — 施工/运维排班日历 — <a href="https://work-calendar-52c.pages.dev">演示</a> · <a href="https://github.com/karma-taylor/work_calendar">GitHub</a></li>
      <li><strong>企业业务日报自动化生成引擎</strong> — Python 自动化日报引擎，效率 +90% — <a href="https://github.com/karma-taylor/Daily_report">GitHub</a></li>
    </ol>
  </section>
</noscript>
```

`<noscript>` 内容**必须**与 `PROJECTS` 数组保持手动同步。更新一个项目时务必同步更新这里 + JSON-LD。

### 10.3 og 图准备

`zuopinji/og-card.jpg` 推荐尺寸 **1200×630**，主体含姓名 + 身份 + portfolio 关键字 + 暗色调（与站点一致）。生成后提交到仓库，更新 `og:image` URL。

---

## 11. SOP

### 11.1 新增项目 SOP

1. 准备素材：封面图 `zuopinji/<id>-cover.png|jpg`（建议宽高 ≥ 1200×900，深色主调）
2. 在 `zuopinji/data/projects.js` 的 `PROJECTS` 数组里按目标视觉位置插入一条新对象，**所有必填字段补齐**（schema 见 §5）
3. 如果新增了不存在的 `tech.type`，同步在 `styles.css` 加 `[data-tech-type="新type"]` 着色规则
4. 同步更新 `zuopinji/index.html` 中 `<noscript>` 项目列表（5 条 → 6 条）
5. 同步更新 `<head>` 中 `<script id="structuredData">` 的 `hasPart` 数组（运行时 main.js 也会重注一次，但静态预填用于无 JS 爬虫）
6. 同步更新 `README.md` 项目表，**视觉编号 01-N 重新排定**
7. `index.html` 中的 `?v=...` cache buster 更新
8. 跑测试：浏览器打开 `tests/index.html`，确认 PROJECTS schema 测试全绿
9. 本地用 `python -m http.server 5500` 起静态服务器，hard-refresh 主页面验证桌面 + 移动两种断点
10. 提交：`feat(projects): add <project-name>` 单条 commit
11. 推送：`git push origin main`

### 11.2 修改 hover 动效 SOP

1. 改 `styles.css` 中 `.project-card:hover` / `.project-card:hover img` 等规则
2. 检查 `@media (prefers-reduced-motion: reduce)` 块，确保新增动效在减弱动画模式下被禁用
3. 更新 `?v=...` cache buster
4. 验证 + commit + push

### 11.3 修改 boot loader / reveal / scroll progress / 磁吸 / focus overlay SOP

1. 定位到对应文件：`zuopinji/interactions/<feature>.js`
2. 修改函数实现；**不要**改 export 出去的函数名（`main.js` 依赖它）
3. 如果有可抽离的纯逻辑，单独 export 一个 pure 函数并在 `tests/interactions.test.js` 加用例
4. 如果新增需要的 CSS，同步在 `styles.css` 加
5. 更新 `?v=...` cache buster
6. 跑测试 → 浏览器验证 → commit + push

### 11.4 修改 SEO 资产 SOP

1. 数据变更 → 改 `data/projects.js` → 静态 JSON-LD 也同步改 `<head>` 中的 `<script id="structuredData">`
2. 生成器逻辑变更 → 改 `seo/structured-data.js` 或 `seo/noscript.js` → 在 `tests/seo.test.js` 加用例
3. 浏览器 devtools 用 [Rich Results Test](https://search.google.com/test/rich-results) 验证 JSON-LD 合法性（可选）

### 11.5 cache busting 规约

每次修改 `styles.css` 或 `main.js` / `interactions/*` / `render/*` / `data/*` 中任何 JS，**必须**更新 `index.html` 中对应 `<link>` / `<script>` 标签的 `?v=` 参数。命名建议 `YYYYMMDD-<feature>`，例如 `?v=20260512-modular`。否则用户访问会看到旧版本（GitHub Pages CDN 缓存）。

由于 main.js 通过 ES Module import 其他文件，只需要更新 `<script src="main.js?v=...">` 这一处的 cache buster 即可让子模块也被重新拉取（浏览器对 `import` 的 URL 做完整字符串缓存键）。**保险做法：CSS 和 main.js 两处 cache buster 都换。**

### 11.6 跑单元测试 SOP

```bash
# 仓库根目录
python -m http.server 5500
# 浏览器打开
http://localhost:5500/tests/index.html
```

页面顶部会显示 `共 N 项 · 通过 X · 失败 Y` 的汇总。失败用红色行展示，含堆栈。点击 "重新运行" 可重跑（不需刷新页面）。

PR 合并前**必须**确认 `失败 0`。新增模块/纯函数时**应**在对应 `tests/*.test.js` 加用例。

---

## 12. 反模式（不要做的事）

| 反模式 | 错在哪 | 正确做法 |
|---|---|---|
| 在 `render/project-card.js` 里硬编码任何文案 | 破坏数据/视图分离 | 加到 `data/projects.js` 字段 |
| 用 template literal 拼 HTML 字符串 | SVG 多、escape 痛、无 IDE 支持 | 用 `<template>` clone |
| 写 `:nth-of-type(N) { order: M }` | 把视觉位置绑死到 DOM 位置 | 重排数组 |
| 给卡片加 `:nth-child` / `:first-child` 等位置选择器 | 同上 | 用 `[data-size="..."]` 或新增 data-* 属性 |
| 改 `.project-card` / `.project-trigger` / `.project-meta` 等核心类名 | 破坏 `interactions/focus-overlay.js` 的 querySelector | 加新类名，不改老类名 |
| 跳过 `prefers-reduced-motion` 适配 | 部分用户晕动症 | 任何 transform/animation 都在 reduced-motion 块里禁用 |
| 提交时不更新 cache buster | 用户看到旧版本 | 一改 css/js 就同步改 `?v=` |
| 在 JS 里读 `card.querySelector('.project-summary')` 拿数据 | 渲染前 DOM 不存在 | 改成读 `PROJECTS` 数组或缓存 data 在 `dataset` 上 |
| 改 README 项目表但不改 noscript / JSON-LD | SEO / 兜底数据漂移 | 一改全改，把它们当一份多视图的数据源 |
| 把新项目放在数组中间但视觉显示在末尾 | 违反"数据顺序 = 视觉顺序"原则 | 直接放到目标视觉位置 |
| 用 `setTimeout(setupX, 100)` 等"幻数" | 不可靠，慢机器会失败 | 用 `DOMContentLoaded` 显式编排 |
| 引入 jQuery / Lodash / 任何 npm 包 | 违反 C1 不变性 | 用原生 API |

---

## 13. a11y / 性能 / 兼容性

### 13.1 a11y 清单

- 所有图片有 `alt`，装饰性图片用 `alt=""` 或 `aria-hidden="true"`
- `<button>` 不放 `<a>` 或交互元素（HTML5 禁忌）
- `<ol>` / `<ul>` 给项目流程和技术栈 —— 语义化
- 状态标签用 `aria-label`（"已上线"、"建设中"）
- 弹层有 `aria-hidden="true|false"` 跟随状态，Escape 关闭，focus trap
- 颜色对比度：正文文字 ≥ 4.5:1，大字号文字 ≥ 3:1
- 焦点可见样式：所有可交互元素 `:focus-visible` 必须有清晰的轮廓或阴影

### 13.2 性能清单

- 动画**只用** `transform` / `opacity` / `filter`（GPU 合成层）
- 大量监听用 `passive: true`（scroll / mousemove）
- 不必要时用 `requestAnimationFrame` 节流（已在磁吸、滚动进度里实现）
- 图片**预先压缩**到 ≤ 500KB 单张，宽度 ≤ 1600px
- Google Fonts 用 `display=swap`，避免 FOIT
- 大资源加 `loading="lazy"`（封面图视情况，首屏的 featured / tall 不要 lazy）

### 13.3 浏览器兼容兜底

- `@property` 不支持时降级：渐变流动效果会变成静态渐变，不影响主体功能
- `aspect-ratio` 不支持时降级：使用 padding-bottom hack（暂未实现，仅 4 年内浏览器有问题时需要）
- `<template>` 不支持时降级：所有 Chromium / Firefox / Safari 主流版本都支持，无需 polyfill
- ES Module 不支持时降级：极旧浏览器（IE / 早期 Edge）会完全无法运行，由 `<noscript>` 兜底

---

## 14. 部署

### 14.1 GitHub Pages

- 仓库：[`karma-taylor/port_folio`](https://github.com/karma-taylor/port_folio)
- 分支：`main`
- 推送 `main` → Pages 自动构建（≤ 2 分钟生效）
- 入口：`https://karma-taylor.github.io/port_folio/` → 跳转到 `/zuopinji/`

### 14.2 常见部署问题

| 现象 | 原因 | 解决 |
|---|---|---|
| 改了 CSS / JS 但用户看到旧版 | 浏览器或 CDN 缓存 | 更新 `?v=` cache buster |
| 改了图片但用户看到旧图 | 同上 | 在数据里的 `cover.version` 字段更新；或重命名文件 |
| 推送后 5 分钟仍未生效 | GitHub Pages 构建偶尔变慢 | 看仓库 Actions tab 是否有 Pages build & deploy job |
| 链接 404 | 路径大小写错误（GitHub Pages 区分大小写） | 检查相对路径是否完全一致 |

### 14.3 Git commit 规约

- `feat(scope): xxx` — 新功能
- `fix(scope): xxx` — Bug 修复
- `style(scope): xxx` — 纯样式调整，不改逻辑
- `refactor(scope): xxx` — 重构（如本指南描述的 Path A'' 迁移）
- `docs(scope): xxx` — 文档（含本指南）
- `chore(scope): xxx` — 杂项（cache buster bump、依赖整理）

scope 可选：`projects` / `cards` / `motion` / `seo` / `boot` / `layout` 等。

---

## 15. 何时升级到 Path C（构建时生成）

当出现以下任一信号，应重新评估是否升级到 Eleventy / Astro：

- 项目数量超过 12-15 个
- 需要多语言（中/英切换）
- 需要按 tag 筛选 / 搜索 / 排序
- SEO 数据（Google Search Console / 百度搜索资源）显示项目页面长期未被索引
- 需要为每个项目生成独立详情页（而非 focus overlay）
- 多人协作，需要更强的数据 schema 校验（JSON Schema / TypeScript）

升级到 Path C **不是本指南的范畴**，但当时机到来时，因为本架构数据已经在 `data/projects.js` 中标准化、模板已经在 `<template>` 中独立、渲染逻辑已经在 `render/project-card.js` 中纯化，迁移成本主要在选 SSG 工具 + 把模板复用进去。

---

## 附录 A：当前 5 个项目的视觉顺序（截止 2026-05-12）

| 视觉位置 | id | size | status |
|---|---|---|---|
| 01 | `money` (薪资分配策略工具) | `tall` | `live` |
| 02 | `digest` (HamHome Daily Digest) | `tall` | `live` |
| 03 | `fx` (weather-fx-agent) | `featured` | `live` |
| 04 | `calendar` (工作日历) | `wide` | `live` |
| 05 | `report` (日报生成引擎) | `small` | `wip` |

桌面端布局（3 列网格）：

```
┌──────────┬──────────┬──────────┐
│  01      │  02      │  03      │
│  Money   │  Digest  │  FX      │
│  tall    │  tall    │  featured│
│          │          │          │
├──────────┼──────────┴──────────┤
│  05      │  04                 │
│  Report  │  Calendar (wide)    │
│  small   │                     │
└──────────┴─────────────────────┘
```

迁移到 Path A'' 后，这个顺序由 `PROJECTS` 数组顺序唯一决定。

---

## 附录 B：关键 DOM 选择器 → 用途映射

| 选择器 | 用途 | 引用方 |
|---|---|---|
| `.project-card` | 卡片根 | CSS + interactions/focus-overlay.js |
| `.project-card[data-size="..."]` | Bento span 控制 | CSS |
| `.project-card[data-status="..."]` | 当前未使用，留作扩展 | — |
| `.project-trigger` | 点击触发 focus overlay | interactions/focus-overlay.js |
| `.project-cover` | 封面容器（带 `--cover-url` CSS var） | CSS + render/project-card.js |
| `.project-cover img` | 封面图本体 | interactions/focus-overlay.js（flying image FLIP 动画） |
| `.project-hover-overlay` | 悬停时遮罩 | CSS |
| `.hover-cta` | 悬停时浮现的访问按钮 | CSS |
| `.project-meta` | 元信息容器（index + title + status + tech） | CSS |
| `.project-index` | 视觉编号 "01-05" | CSS |
| `.project-title` | 项目标题 | CSS + interactions/focus-overlay.js |
| `.project-status` / `.status-dot` | 状态徽章 + 呼吸灯 | CSS |
| `.project-tech` / `li[data-tech-type]` | 技术胶囊列表 + 着色 | CSS |
| `.project-flow` / `.flow-step` | 4 步业务流程 | CSS |
| `.flow-step-idx` / `.flow-step-label` | 步骤序号 + 标签 | CSS |
| `.flow-step--accent` | 终态步骤强调 | CSS |
| `.github-cta` | 底部 Star on GitHub 按钮 | CSS + interactions/magnetic.js |
| `[data-magnetic]` / `[data-magnetic-strength]` | 磁吸目标 | interactions/magnetic.js |
| `.project-content` (hidden) | focus overlay 的数据源 | interactions/focus-overlay.js (`extractCardData`) |
| `.project-summary` / `.project-prompt` / `.project-links` | 详情字段 | interactions/focus-overlay.js |
| `.reveal` / `.is-visible` | IntersectionObserver 入场动画 | interactions/reveal.js |
| `.scroll-progress__bar` | 顶部 2px 进度条 | interactions/scroll-progress.js |
| `.ambient-orbs` / `.ambient-orb` | 背景紫蓝光斑 | CSS |
| `#bootLoader` | 启动遮罩 | interactions/boot-loader.js |
| `#focusOverlay` / `#focusImage` / `#focusTitle` / 等 | focus 弹层 | interactions/focus-overlay.js |
| `#projectsGrid` | 项目卡挂载点 | main.js (`renderAllProjects`) |
| `#structuredData` | JSON-LD 脚本节点 | seo/structured-data.js (`injectJsonLd`) |
| `<template id="projectCardTemplate">` 等 4 个 | 渲染骨架 | render/project-card.js (`cloneTemplate`) |
| `[data-slot="..."]` | 模板填充锚点 | render/dom-helpers.js |

---

**End of guide.**

如有歧义或新场景未覆盖，请优先：
1. 读 `README.md` 看项目背景
2. 读本文件相关章节
3. 读 `styles.css` 顶部的 CSS variables 段落，理解设计系统
4. 读 `main.js` 看启动顺序，再读 `interactions/*.js` 看具体实现
5. 跑 `tests/index.html` 看现有用例约束
6. 仍不清楚 → 在 PR 描述里写明假设，让 reviewer 拍板
