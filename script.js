import { CASES } from "./data/case-manifest.js?v=20261025-stage";
import { setupNav } from "./nav.js?v=20261025-stage";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const esc = (value = "") =>
  String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);

function splitTitle(title = "") {
  const match = String(title).match(/^(.*?)[（(]([^（）()]+)[）)]\s*$/);
  return match ? { zh: match[1].trim(), en: match[2].trim() } : { zh: title, en: "" };
}

function titleMarkup(title) {
  const { zh, en } = splitTitle(title);
  return `${esc(zh)}${en ? `<em class="serif">${esc(en)}</em>` : ""}`;
}

function externalLink(project, className) {
  const external = project.live || project.github;
  if (!external) return "";
  const label = project.live ? "访问产品" : "查看 GitHub";
  const track = project.live ? "live_open" : "github_open";
  return `<a class="${className}" href="${esc(external.href)}" target="_blank" rel="noopener noreferrer" data-track="${track}" data-track-label="${esc(project.slug)}">${label} <span aria-hidden="true">↗</span></a>`;
}

function corePanel(project, position) {
  const href = `./cases/${project.slug}/`;
  const results = (project.results || [])
    .filter((item) => !(project.verification && item.label === "验证方式"))
    .slice(0, 3)
    .map((item) => `<li><small>${esc(item.label)}</small><strong>${esc(item.value)}</strong></li>`)
    .join("");
  const meta = [
    ["角色", project.role],
    ["场景", project.scenario],
    ["验证", project.verification],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<div><dt class="eyebrow">${label}</dt><dd>${esc(value)}</dd></div>`)
    .join("");
  return `<article class="case-panel reveal">
    <div class="case-panel__copy">
      <p class="eyebrow"><b>${esc(project.index)}</b> &amp; ${esc(project.statusLabel)}</p>
      <h3><a href="${href}" data-track="case_open" data-track-label="${esc(project.slug)}-title">${titleMarkup(project.title)}</a></h3>
      <p class="case-panel__tagline">${esc(project.tagline)}</p>
      ${meta ? `<dl class="case-panel__meta">${meta}</dl>` : ""}
      ${results ? `<ul class="case-panel__results" aria-label="关键结果">${results}</ul>` : ""}
      <div class="case-panel__actions">
        <a class="tlink" href="${href}" data-track="case_open" data-track-label="${esc(project.slug)}">阅读案例 <span aria-hidden="true">→</span></a>
        ${externalLink(project, "tlink tlink--quiet")}
      </div>
    </div>
    <a class="case-panel__media" href="${href}" tabindex="-1" aria-hidden="true" data-track="case_open" data-track-label="${esc(project.slug)}-cover"><img src="${esc(project.cover)}" alt="" loading="${position ? "lazy" : "eager"}" /></a>
  </article>`;
}

function moreRow(project) {
  const href = `./cases/${project.slug}/`;
  return `<li class="more-row reveal">
    <span class="eyebrow">${esc(project.index)}</span>
    <a class="more-row__title" href="${href}" data-track="case_open" data-track-label="${esc(project.slug)}-title">${titleMarkup(project.title)}</a>
    <span class="more-row__tagline">${esc(project.tagline)}</span>
    <span class="eyebrow">${esc(project.statusLabel)}</span>
    <span class="more-row__links">
      <a class="tlink" href="${href}" data-track="case_open" data-track-label="${esc(project.slug)}">案例 <span aria-hidden="true">→</span></a>
      ${externalLink(project, "tlink tlink--quiet")}
    </span>
  </li>`;
}

function renderCases() {
  const coreRoot = document.getElementById("coreCases");
  const moreRoot = document.getElementById("moreCases");
  if (!coreRoot || !moreRoot) return;
  const core = CASES.filter((project) => project.tier === "core");
  const more = CASES.filter((project) => project.tier !== "core");
  coreRoot.innerHTML = core.map(corePanel).join("");
  moreRoot.innerHTML = more.map(moreRow).join("");
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );
  items.forEach((item) => observer.observe(item));
}

function setupQrPopovers() {
  const popovers = document.querySelectorAll(".qr-pop");
  document.addEventListener("click", (event) => {
    popovers.forEach((popover) => {
      if (popover.open && !popover.contains(event.target)) popover.open = false;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    popovers.forEach((popover) => {
      popover.open = false;
    });
  });
}

function setupClock() {
  const nodes = document.querySelectorAll("[data-clock]");
  if (!nodes.length) return;
  const formatter = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Shanghai" });
  const tick = () => {
    const now = new Date();
    const text = formatter.format(now);
    nodes.forEach((node) => {
      node.textContent = text;
      node.setAttribute("datetime", now.toISOString());
    });
  };
  tick();
  setInterval(tick, 15000);
}

function setupCounters() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length || prefersReducedMotion || !("IntersectionObserver" in window)) return;
  const run = (node) => {
    const target = Number(node.dataset.count) || 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  nodes.forEach((node) => observer.observe(node));
}

// One screen at a time: the hash picks the active view, the opening screen is the default.
function setupViews() {
  const views = [...document.querySelectorAll("[data-view]")];
  if (!views.length) return;
  const ids = views.map((view) => view.id);
  const navLinks = [...document.querySelectorAll('.top__nav a[href^="#"]')];
  let current = null;
  let leaveTimer = 0;

  const resolve = () => {
    const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
    return ids.includes(hash) ? hash : "home";
  };

  const activate = (id) => {
    views.forEach((view) => {
      const active = view.id === id;
      view.classList.toggle("is-active", active);
      view.classList.remove("is-leaving");
      view.toggleAttribute("hidden", !active);
    });
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    document.body.dataset.view = id;
    window.scrollTo({ top: 0, behavior: "instant" });
    current = id;
  };

  const show = (id) => {
    if (id === current) return;
    const leaving = views.find((view) => view.id === current);
    window.clearTimeout(leaveTimer);
    if (!leaving || prefersReducedMotion) {
      activate(id);
      return;
    }
    leaving.classList.add("is-leaving");
    leaveTimer = window.setTimeout(() => activate(id), 280);
  };

  // Hash links within the page (nav, "下一节", "← 开屏") drive the router natively.
  window.addEventListener("hashchange", () => show(resolve()));
  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    const index = ids.indexOf(current);
    if (event.key === "ArrowRight" && index < ids.length - 1) location.hash = ids[index + 1];
    if (event.key === "ArrowLeft" && index > 0) location.hash = index - 1 === 0 ? "top" : ids[index - 1];
  });
  activate(resolve());
}

renderCases();
setupViews();
setupNav();
setupReveal();
setupQrPopovers();
setupClock();
setupCounters();
