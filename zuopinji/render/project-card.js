/**
 * 项目卡片渲染器
 *
 * 职责：把 projects.js 中的纯数据对象，转换成与 index.html 中 <template> 同构的 DOM 节点。
 * 不做任何业务判断、不绑定事件、不调用交互 setup。
 *
 * layout:
 *   - full（默认）：完整卡片，用于测试与兼容
 *   - compact：首页网格卡（无流程条、无 GitHub 条、技术栈最多 4、含演示/详情）
 *   - hero：精选大卡（同 compact 信息量 + 版式由 CSS 放大）
 */

import {
  cloneTemplate,
  getSlot,
  setSlotText,
} from "./dom-helpers.js";

const CARD_TPL = "projectCardTemplate";
const TECH_TPL = "techBadgeTemplate";
const FLOW_TPL = "flowStepTemplate";
const LINK_TPL = "detailLinkTemplate";

/**
 * 拼出最终的 cover URL（带可选 cache-buster）。
 * @param {{src: string, version?: string}} cover
 * @returns {string}
 */
export function buildCoverUrl(cover) {
  return cover.version ? `${cover.src}?v=${cover.version}` : cover.src;
}

/**
 * 详情链接排序：上线在前，GitHub 在后。
 * @param {Array<{ type: string }>} links
 */
export function sortDetailLinks(links) {
  const rank = (l) => (l.type === "live" ? 0 : l.type === "github" ? 1 : 2);
  return [...links].sort((a, b) => rank(a) - rank(b));
}

/**
 * @param {object} options
 * @param {'full' | 'compact' | 'hero'} [options.layout]
 * @returns {'full' | 'compact' | 'hero'}
 */
function normalizeLayout(options) {
  const l = options?.layout;
  if (l === "hero" || l === "compact" || l === "full") return l;
  return "full";
}

function fillCover(card, data) {
  const wrap = getSlot(card, "cover-bg");
  const img = getSlot(card, "cover-img");
  const url = buildCoverUrl(data.cover);
  if (wrap) wrap.style.setProperty("--cover-url", `url(${url})`);
  if (img) {
    img.src = url;
    img.alt = data.cover.alt;
  }
}

function fillHover(card, data) {
  setSlotText(card, "hover-value", data.hoverValue);

  const hoverCta = getSlot(card, "hover-cta");
  if (hoverCta) {
    hoverCta.removeAttribute("href");
    hoverCta.setAttribute("hidden", "");
    hoverCta.setAttribute("aria-hidden", "true");
  }
  setSlotText(card, "hover-cta-label", "");
}

function fillMeta(card, data, layout) {
  setSlotText(card, "title", data.title);
  card.dataset.titleLong = data.titleLong || data.title;

  const indexEl = getSlot(card, "index");
  const status = getSlot(card, "status");

  if (layout === "full") {
    setSlotText(card, "index", data.index);
    if (indexEl) indexEl.removeAttribute("aria-hidden");
    if (status) {
      status.classList.add(`project-status--${data.status}`);
      status.removeAttribute("hidden");
    }
    setSlotText(card, "status-label", data.statusLabel);
  } else {
    if (indexEl) {
      indexEl.textContent = "";
      indexEl.setAttribute("aria-hidden", "true");
    }
    if (status) {
      status.setAttribute("hidden", "");
      status.classList.remove(
        "project-status--live",
        "project-status--wip"
      );
    }
  }
}

function fillLede(card, data, layout) {
  const el = getSlot(card, "lede");
  if (!el) return;
  if (layout === "compact" || layout === "hero") {
    const text =
      data.detail?.focus?.tagline || data.hoverValue || "";
    el.textContent = text;
    el.removeAttribute("hidden");
  } else {
    el.textContent = "";
    el.setAttribute("hidden", "");
  }
}

function fillCardActions(card, data, layout) {
  const wrap = getSlot(card, "card-actions");
  if (!wrap) return;
  wrap.setAttribute("hidden", "");
}

function fillOutcomes(card, data, layout) {
  const list = getSlot(card, "outcomes-list");
  if (!list) return;
  list.replaceChildren();
}

function fillTech(card, data, layout) {
  const list = getSlot(card, "tech-list");
  if (!list) return;
  list.setAttribute("aria-label", `${data.titleLong || data.title} 技术栈`);
  list.replaceChildren();

  let techs = data.tech || [];
  if (layout !== "full") {
    const aiTechs = techs.filter((t) => t.type === "ai");
    const otherTechs = techs.filter((t) => t.type !== "ai");
    techs = [...aiTechs, ...otherTechs].slice(0, 4);
  }

  techs.forEach((t) => {
    const li = cloneTemplate(TECH_TPL);
    li.dataset.techType = t.type;
    li.textContent = t.label;
    list.appendChild(li);
  });
}

function fillFlow(card, data, layout) {
  const list = getSlot(card, "flow-list");
  if (!list) return;

  if (layout !== "full") {
    list.replaceChildren();
    return;
  }

  list.setAttribute("aria-label", data.flow.ariaLabel);

  data.flow.steps.forEach((s) => {
    const li = cloneTemplate(FLOW_TPL);
    if (s.accent) li.classList.add("flow-step--accent");
    const idx = li.querySelector('[data-slot="flow-idx"]');
    const label = li.querySelector('[data-slot="flow-label"]');
    if (idx) idx.textContent = s.idx;
    if (label) label.textContent = s.label;
    list.appendChild(li);
  });
}

function fillGithubCta(card, data, layout) {
  const cta = getSlot(card, "github-cta");
  if (!cta) return;

  if (layout !== "full") {
    cta.removeAttribute("href");
    cta.removeAttribute("data-magnetic");
    cta.removeAttribute("data-magnetic-strength");
    cta.setAttribute("hidden", "");
    return;
  }

  cta.removeAttribute("hidden");
  cta.href = data.github.href;

  if (data.github.magnetic === false) {
    cta.removeAttribute("data-magnetic");
  } else {
    cta.setAttribute("data-magnetic", "");
  }
  if (data.github.magneticStrength != null) {
    cta.dataset.magneticStrength = String(data.github.magneticStrength);
  }
}

function fillDetailLink(linkNode, linkData) {
  linkNode.href = linkData.href;
  if (linkData.download) {
    linkNode.setAttribute("download", linkData.download);
  } else {
    linkNode.removeAttribute("download");
  }
  linkNode.querySelectorAll("[data-icon-for]").forEach((icon) => {
    if (icon.dataset.iconFor !== linkData.type) icon.remove();
  });
  const label = linkNode.querySelector('[data-slot="link-label"]');
  if (label) label.textContent = linkData.label;
}

function renderResultCard(results = []) {
  const grid = document.createElement("div");
  grid.className = "focus-result-grid";

  results.forEach((item) => {
    const cell = document.createElement("div");
    cell.className = "focus-result-cell";

    const label = document.createElement("p");
    label.className = "focus-result-label";
    label.textContent = item.label;

    const value = document.createElement("p");
    value.className = "focus-result-value";
    value.textContent = item.value;

    cell.append(label, value);
    grid.appendChild(cell);
  });

  return grid;
}

function buildFocusSection(title, content, className = "focus-export-block") {
  const section = document.createElement("section");
  section.className = className;

  const heading = document.createElement("h4");
  heading.className = "focus-export-h";
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.className = "focus-export-p";
  paragraph.textContent = content || "待补充";

  section.append(heading, paragraph);
  return section;
}

function buildPromptSection(promptDesign = {}) {
  const section = document.createElement("section");
  section.className = "focus-export-block focus-export-prompt";

  const heading = document.createElement("h4");
  heading.className = "focus-export-h";
  heading.textContent = "Prompt 设计";

  const dl = document.createElement("dl");
  dl.className = "focus-pd-dl";

  [
    ["目标", promptDesign.goal],
    ["输入", promptDesign.inputs],
    ["规则", promptDesign.rules],
    ["输出", promptDesign.output],
    ["防错", promptDesign.safeguards],
  ].forEach(([labelText, valueText]) => {
    const dt = document.createElement("dt");
    dt.textContent = labelText;
    const dd = document.createElement("dd");
    dd.textContent = valueText || "待补充";
    dl.append(dt, dd);
  });

  section.append(heading, dl);
  return section;
}

function buildExcerptSection(excerpt = "") {
  const section = document.createElement("section");
  section.className = "focus-export-block";

  const label = document.createElement("p");
  label.className = "focus-excerpt-label";
  label.textContent = "脱敏节选";

  const pre = document.createElement("pre");
  pre.className = "focus-excerpt-pre";
  pre.textContent = excerpt || "待补充";

  section.append(label, pre);
  return section;
}

function fillFocusExport(card, data) {
  const root = getSlot(card, "focus-export");
  if (!root || !data.detail?.focus) return;

  const f = data.detail.focus;
  const pd = f.promptDesign || {};
  const recruiting = data.detail?.recruiting || {};

  root.replaceChildren();

  const lede = document.createElement("p");
  lede.className = "focus-export-lede";
  lede.textContent = f.tagline || recruiting.background || data.detail.summary || "";
  root.appendChild(lede);

  const resultsSection = document.createElement("section");
  resultsSection.className = "focus-export-results";
  const resultsHeading = document.createElement("h4");
  resultsHeading.className = "focus-export-h";
  resultsHeading.textContent = "结果与验证";
  resultsSection.append(resultsHeading, renderResultCard(recruiting.results || []));
  root.appendChild(resultsSection);

  const grid = document.createElement("div");
  grid.className = "focus-export-grid";
  const leftCol = document.createElement("div");
  leftCol.className = "focus-export-col";
  const rightCol = document.createElement("div");
  rightCol.className = "focus-export-col";

  leftCol.append(
    buildFocusSection("业务背景", recruiting.background || data.detail.summary || ""),
    buildFocusSection("谁在用 / 典型场景", recruiting.usersScene || ""),
    buildFocusSection("核心问题", recruiting.coreProblem || f.problem || "")
  );

  rightCol.append(
    buildFocusSection("我的负责", f.ownership || ""),
    buildFocusSection("关键产品判断", f.productJudgment || ""),
    buildPromptSection(pd),
    buildFocusSection("风险与未做", recruiting.risks || "待补充"),
    buildExcerptSection(pd.excerpt || "")
  );

  grid.append(leftCol, rightCol);
  root.appendChild(grid);
}

function fillDetail(card, data) {
  fillFocusExport(card, data);
  setSlotText(card, "summary", data.detail.summary);

  const promptEl = getSlot(card, "prompt");
  if (promptEl) {
    promptEl.textContent = "";
    promptEl.setAttribute("hidden", "");
  }

  const linksHolder = getSlot(card, "detail-links");
  if (!linksHolder) return;

  linksHolder.replaceChildren();

  sortDetailLinks(data.detail.links).forEach((l) => {
    const a = cloneTemplate(LINK_TPL);
    fillDetailLink(a, l);
    linksHolder.appendChild(a);
  });

  const content = card.querySelector(".project-content");
  const existingCta = content?.querySelector(".project-contact-cta");
  if (existingCta) existingCta.remove();

  const ctaLinks = data.detail?.recruiting?.contactCta || [];
  if (!content || !ctaLinks.length) return;

  const contactWrap = document.createElement("div");
  contactWrap.className = "project-contact-cta";

  const contactHeading = document.createElement("p");
  contactHeading.className = "project-contact-cta__title";
  contactHeading.textContent = "继续沟通";

  const contactList = document.createElement("div");
  contactList.className = "project-contact-cta__links";

  ctaLinks.forEach((link) => {
    const a = document.createElement("a");
    a.className = "project-contact-link";
    a.href = link.href;
    a.textContent = link.label;
    if (link.download) a.setAttribute("download", link.download);
    if (link.target === "_blank") {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    contactList.appendChild(a);
  });

  contactWrap.append(contactHeading, contactList);
  content.appendChild(contactWrap);
}

/**
 * 渲染一张项目卡。
 * @param {object} data 单个项目对象
 * @param {object} [options]
 * @param {'full' | 'compact' | 'hero'} [options.layout='full']
 * @returns {HTMLElement}
 */
export function renderProjectCard(data, options = {}) {
  const layout = normalizeLayout(options);

  const card = cloneTemplate(CARD_TPL);
  card.dataset.status = data.status;
  card.dataset.layout = layout;
  card.dataset.size = layout === "full" ? data.size : "uniform";

  fillCover(card, data);
  fillHover(card, data);
  fillMeta(card, data, layout);
  fillLede(card, data, layout);
  fillTech(card, data, layout);
  fillOutcomes(card, data, layout);
  fillCardActions(card, data, layout);
  fillFlow(card, data, layout);
  fillGithubCta(card, data, layout);
  fillDetail(card, data);

  return card;
}

/**
 * 精选项目区：眉题 + 可选一句话 + 大卡。
 * @param {Element | null} mountEl
 * @param {object} data
 */
export function renderFeaturedProject(mountEl, data) {
  if (!mountEl) return;

  mountEl.replaceChildren();
  const inner = document.createElement("div");
  inner.className = "featured-hero__inner";

  const eyebrow = document.createElement("p");
  eyebrow.className = "featured-hero__eyebrow";
  eyebrow.id = "featured-hero-label";
  eyebrow.textContent = "精选项目";

  inner.appendChild(eyebrow);

  const teaser = data.detail?.heroTeaser;
  if (teaser) {
    const p = document.createElement("p");
    p.className = "featured-hero__teaser";
    p.textContent = teaser;
    inner.appendChild(p);
  }

  inner.appendChild(renderProjectCard(data, { layout: "hero" }));
  mountEl.appendChild(inner);
  mountEl.setAttribute("aria-labelledby", "featured-hero-label");
}

/**
 * 把所有项目渲染到指定挂载点。
 * @param {Array<object>} projects
 * @param {Element} mountEl
 * @param {object} [options]
 * @param {'full' | 'compact'} [options.layout='full']
 */
export function renderAllProjects(projects, mountEl, options = {}) {
  if (!mountEl) {
    throw new Error("[project-card] mountEl 不存在，渲染入口缺失");
  }
  const layout = options.layout === "compact" ? "compact" : "full";
  const frag = document.createDocumentFragment();
  projects.forEach((p) =>
    frag.appendChild(renderProjectCard(p, { layout }))
  );
  mountEl.replaceChildren(frag);
}
