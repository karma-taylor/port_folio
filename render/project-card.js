import { cloneTemplate, getSlot, setSlotText } from "./dom-helpers.js";

const CARD_TPL = "projectCardTemplate";
const TECH_TPL = "techBadgeTemplate";
const FLOW_TPL = "flowStepTemplate";
const LINK_TPL = "detailLinkTemplate";

export function buildCoverUrl(cover) {
  return cover.version ? `${cover.src}?v=${cover.version}` : cover.src;
}

export function sortDetailLinks(links = []) {
  const rank = (item) => (item.type === "live" ? 0 : item.type === "github" ? 1 : 2);
  return [...links].sort((a, b) => rank(a) - rank(b));
}

function normalizeLayout(options) {
  const layout = options?.layout;
  return layout === "compact" || layout === "hero" || layout === "full"
    ? layout
    : "full";
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
  setSlotText(card, "hover-value", data.hoverValue || "");

  const hoverCta = getSlot(card, "hover-cta");
  if (!hoverCta) return;
  hoverCta.removeAttribute("href");
  hoverCta.setAttribute("hidden", "");
  hoverCta.setAttribute("aria-hidden", "true");
  setSlotText(card, "hover-cta-label", "");
}

function fillMeta(card, data) {
  setSlotText(card, "title", data.title);
  card.dataset.titleLong = data.titleLong || data.title;
  setSlotText(card, "index", data.index);
  setSlotText(card, "status-label", data.statusLabel);

  const status = getSlot(card, "status");
  if (status) {
    status.classList.remove("project-status--live", "project-status--wip");
    status.classList.add(`project-status--${data.status}`);
    status.removeAttribute("hidden");
  }
}

function fillLede(card, data, layout) {
  const el = getSlot(card, "lede");
  if (!el) return;

  if (layout === "full") {
    el.textContent = "";
    el.setAttribute("hidden", "");
    return;
  }

  el.textContent = data.detail?.focus?.tagline || data.hoverValue || "";
  el.removeAttribute("hidden");
}

function fillCardActions(card, data, layout) {
  const wrap = getSlot(card, "card-actions");
  if (!wrap) return;

  wrap.replaceChildren();

  if (layout === "full") {
    wrap.setAttribute("hidden", "");
    return;
  }

  const detailButton = document.createElement("button");
  detailButton.className = "project-action project-action--detail";
  detailButton.type = "button";
  detailButton.textContent = "查看案例";
  wrap.appendChild(detailButton);

  const live = sortDetailLinks(data.detail?.links || []).find((item) => item.type === "live");
  if (live) {
    const liveLink = document.createElement("a");
    liveLink.className = "project-action project-action--demo";
    liveLink.href = live.href;
    liveLink.target = "_blank";
    liveLink.rel = "noopener noreferrer";
    liveLink.textContent = "访问上线版本";
    wrap.appendChild(liveLink);
  }

  wrap.removeAttribute("hidden");
}

function fillOutcomes(card, data, layout) {
  const list = getSlot(card, "outcomes-list");
  if (!list) return;

  list.replaceChildren();

  const outcomes = Array.isArray(data.outcomes) ? data.outcomes.slice(0, 3) : [];
  if (layout !== "hero" || outcomes.length === 0) {
    list.setAttribute("hidden", "");
    return;
  }

  outcomes.forEach((text, index) => {
    const li = document.createElement("li");
    li.className = "project-outcome";

    const idx = document.createElement("span");
    idx.className = "project-outcome__idx";
    idx.textContent = String(index + 1).padStart(2, "0");

    const label = document.createElement("span");
    label.className = "project-outcome__text";
    label.textContent = text;

    li.append(idx, label);
    list.appendChild(li);
  });

  list.removeAttribute("hidden");
}

function fillTech(card, data, layout) {
  const list = getSlot(card, "tech-list");
  if (!list) return;

  list.setAttribute("aria-label", `${data.titleLong || data.title} 技术栈`);
  list.replaceChildren();

  let techs = data.tech || [];
  if (layout !== "full") {
    const aiTechs = techs.filter((item) => item.type === "ai");
    const otherTechs = techs.filter((item) => item.type !== "ai");
    techs = [...aiTechs, ...otherTechs].slice(0, 3);
  }

  techs.forEach((item) => {
    const li = cloneTemplate(TECH_TPL);
    li.dataset.techType = item.type;
    li.textContent = item.label;
    list.appendChild(li);
  });
}

function fillRoute(card, data, layout) {
  const root = getSlot(card, "route");
  if (!root) return;

  root.replaceChildren();

  const route = Array.isArray(data.route) ? data.route : [];
  if (layout === "full" || route.length === 0) {
    root.setAttribute("hidden", "");
    return;
  }

  route.forEach((item) => {
    const row = document.createElement("div");
    row.className = "project-route__item";

    const label = document.createElement("span");
    label.className = "project-route__label";
    label.textContent = item.label;

    const value = document.createElement("span");
    value.className = "project-route__value";
    value.textContent = item.value;

    row.append(label, value);
    root.appendChild(row);
  });

  root.removeAttribute("hidden");
}

function fillFlow(card, data, layout) {
  const list = getSlot(card, "flow-list");
  if (!list) return;

  list.replaceChildren();

  if (layout !== "full" || !data.flow?.steps) return;

  list.setAttribute("aria-label", data.flow.ariaLabel);
  data.flow.steps.forEach((step) => {
    const li = cloneTemplate(FLOW_TPL);
    if (step.accent) li.classList.add("flow-step--accent");
    const idx = li.querySelector('[data-slot="flow-idx"]');
    const label = li.querySelector('[data-slot="flow-label"]');
    if (idx) idx.textContent = step.idx;
    if (label) label.textContent = step.label;
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

  cta.href = data.github.href;
  cta.removeAttribute("hidden");

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

function fillFocusExport(card, data) {
  const root = getSlot(card, "focus-export");
  if (!root || !data.detail?.focus) return;

  const focus = data.detail.focus;
  const recruiting = data.detail.recruiting || {};

  root.replaceChildren();

  const solution = [
    focus.flowSummary,
    focus.productJudgment,
  ].filter(Boolean).join(" ");

  const delivery = recruiting.delivery || [
    ...(recruiting.results || []).map((item) => `${item.label}：${item.value}`),
    focus.ownership ? `负责范围：${focus.ownership}` : "",
  ].filter(Boolean).join("；");

  const flow = document.createElement("div");
  flow.className = "focus-export-flow";
  flow.append(
    buildFocusSection("01 / 业务痛点", recruiting.coreProblem || focus.problem || ""),
    buildFocusSection("02 / 调研与范围定义", recruiting.researchScope || recruiting.usersScene || ""),
    buildFocusSection("03 / 方案、规则与风险处理", solution),
    buildFocusSection("04 / 交付、上线与验收", delivery),
    buildFocusSection("05 / 边界与下一步", recruiting.risks || "待补充")
  );
  root.appendChild(flow);
}

function fillDetail(card, data) {
  fillFocusExport(card, data);
  setSlotText(card, "summary", data.detail.summary || "");

  const promptEl = getSlot(card, "prompt");
  if (promptEl) {
    promptEl.textContent = "";
    promptEl.setAttribute("hidden", "");
  }

  const linksHolder = getSlot(card, "detail-links");
  if (!linksHolder) return;
  linksHolder.replaceChildren();

  sortDetailLinks(data.detail.links || []).forEach((item) => {
    const node = cloneTemplate(LINK_TPL);
    fillDetailLink(node, item);
    linksHolder.appendChild(node);
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

export function renderProjectCard(data, options = {}) {
  const layout = normalizeLayout(options);
  const card = cloneTemplate(CARD_TPL);

  card.dataset.projectId = data.id;
  card.dataset.status = data.status;
  card.dataset.layout = layout;
  card.dataset.size = layout === "full" ? data.size : "uniform";

  fillCover(card, data);
  fillHover(card, data);
  fillMeta(card, data);
  fillLede(card, data, layout);
  fillTech(card, data, layout);
  fillRoute(card, data, layout);
  fillOutcomes(card, data, layout);
  fillCardActions(card, data, layout);
  fillFlow(card, data, layout);
  fillGithubCta(card, data, layout);
  fillDetail(card, data);

  return card;
}

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

export function renderAllProjects(projects, mountEl, options = {}) {
  if (!mountEl) {
    throw new Error("[project-card] mountEl 不存在，渲染入口缺失");
  }

  const layout = options.layout === "compact" ? "compact" : "full";
  const frag = document.createDocumentFragment();
  projects.forEach((item) => {
    frag.appendChild(renderProjectCard(item, { layout }));
  });
  mountEl.replaceChildren(frag);
}
