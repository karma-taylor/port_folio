/**
 * 项目卡片渲染器
 *
 * 职责：把 projects.js 中的纯数据对象，转换成与历史 HTML 结构 100% 同构的 DOM 节点。
 * 不做任何业务判断、不绑定事件、不调用交互 setup。
 *
 * 模板依赖（必须存在于 index.html 中）：
 *   - <template id="projectCardTemplate">
 *   - <template id="techBadgeTemplate">
 *   - <template id="flowStepTemplate">
 *   - <template id="detailLinkTemplate">
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
    hoverCta.href = data.hoverCta.href;
    hoverCta.setAttribute("aria-label", data.hoverCta.aria);
  }
  setSlotText(card, "hover-cta-label", data.hoverCta.label);
}

function fillMeta(card, data) {
  setSlotText(card, "index", data.index);
  setSlotText(card, "title", data.title);
  card.dataset.titleLong = data.titleLong || data.title;

  const status = getSlot(card, "status");
  if (status) status.classList.add(`project-status--${data.status}`);
  setSlotText(card, "status-label", data.statusLabel);
}

function fillOutcomes(card, data) {
  const list = getSlot(card, "outcomes-list");
  if (!list) return;
  const labelBase = data.titleLong || data.title;
  list.setAttribute("aria-label", `${labelBase} 关键成果`);
  list.replaceChildren();
  (data.outcomes || []).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

function fillTech(card, data) {
  const list = getSlot(card, "tech-list");
  if (!list) return;
  list.setAttribute("aria-label", `${data.titleLong || data.title} 技术栈`);

  data.tech.forEach((t) => {
    const li = cloneTemplate(TECH_TPL);
    li.dataset.techType = t.type;
    li.textContent = t.label;
    list.appendChild(li);
  });
}

function fillFlow(card, data) {
  const list = getSlot(card, "flow-list");
  if (!list) return;
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

function fillGithubCta(card, data) {
  const cta = getSlot(card, "github-cta");
  if (!cta) return;
  cta.href = data.github.href;

  if (data.github.magnetic === false) {
    cta.removeAttribute("data-magnetic");
  }
  if (data.github.magneticStrength != null) {
    cta.dataset.magneticStrength = String(data.github.magneticStrength);
  }
}

function fillDetailLink(linkNode, linkData) {
  linkNode.href = linkData.href;
  linkNode.querySelectorAll("[data-icon-for]").forEach((icon) => {
    if (icon.dataset.iconFor !== linkData.type) icon.remove();
  });
  const label = linkNode.querySelector('[data-slot="link-label"]');
  if (label) label.textContent = linkData.label;
}

function fillDetail(card, data) {
  setSlotText(card, "summary", data.detail.summary);
  if (data.detail.prompt) {
    setSlotText(card, "prompt", data.detail.prompt);
  }
  const linksHolder = getSlot(card, "detail-links");
  if (!linksHolder) return;

  data.detail.links.forEach((l) => {
    const a = cloneTemplate(LINK_TPL);
    fillDetailLink(a, l);
    linksHolder.appendChild(a);
  });
}

/**
 * 渲染一张项目卡。
 * @param {object} data 单个项目对象，schema 见 ARCHITECTURE_GUIDE.md §5
 * @returns {HTMLElement} 已就绪的 <article class="project-card"> 节点
 */
export function renderProjectCard(data) {
  const card = cloneTemplate(CARD_TPL);
  card.dataset.status = data.status;
  card.dataset.size = data.size;

  fillCover(card, data);
  fillHover(card, data);
  fillMeta(card, data);
  fillTech(card, data);
  fillOutcomes(card, data);
  fillFlow(card, data);
  fillGithubCta(card, data);
  fillDetail(card, data);

  return card;
}

/**
 * 把所有项目渲染到指定挂载点。
 * @param {Array<object>} projects
 * @param {Element} mountEl
 */
export function renderAllProjects(projects, mountEl) {
  if (!mountEl) {
    throw new Error("[project-card] mountEl 不存在，渲染入口缺失");
  }
  const frag = document.createDocumentFragment();
  projects.forEach((p) => frag.appendChild(renderProjectCard(p)));
  mountEl.replaceChildren(frag);
}
