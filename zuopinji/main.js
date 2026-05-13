/**
 * Portfolio 入口编排
 *
 * 执行顺序约束（参考 ARCHITECTURE_GUIDE.md §8）：
 *   1. boot loader 立即开始（盖屏，独立于卡片渲染）
 *   2. 等 DOMContentLoaded：精选项目 + 其余项目卡渲染
 *   3. 渲染完毕后绑定 reveal / scroll progress / magnetic / focus overlay / 卡片按钮
 *   4. 同步刷新 SEO JSON-LD（用 PROJECTS 当唯一数据源）
 */

import { PROJECTS, PROFILE } from "./data/projects.js";
import {
  renderAllProjects,
  renderFeaturedProject,
} from "./render/project-card.js";
import { runBootLoader } from "./interactions/boot-loader.js";
import { revealCards } from "./interactions/reveal.js";
import { setupScrollProgress } from "./interactions/scroll-progress.js";
import { setupMagneticTargets } from "./interactions/magnetic.js";
import { setupProjectFocusOverlay } from "./interactions/focus-overlay.js";
import { bindProjectCardDetailButtons } from "./interactions/project-card-actions.js";
import {
  buildPersonJsonLd,
  injectJsonLd,
} from "./seo/structured-data.js";

/**
 * 渲染精选区 + 项目网格。
 */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  const hero = document.getElementById("featuredHero");
  if (!grid || !hero) {
    console.warn("[main] #projectsGrid 或 #featuredHero 未找到，跳过项目渲染");
    return;
  }
  const [featured, ...rest] = PROJECTS;
  renderFeaturedProject(hero, featured);
  renderAllProjects(rest, grid, { layout: "compact" });
}

/**
 * 渲染完成后绑定所有依赖 DOM 的交互。
 */
function bindInteractions() {
  revealCards();
  setupScrollProgress();
  setupMagneticTargets();
  setupProjectFocusOverlay();
  setupWechatQrHover();
  const shell = document.getElementById("home");
  if (shell) bindProjectCardDetailButtons(shell);
}

/**
 * 微信二维码：仅在悬停微信图标时显示，浮层挂在页面层级（不在侧栏容器内）。
 */
function setupWechatQrHover() {
  const icon = document.getElementById("wechatIcon");
  const floating = document.getElementById("wechatQrFloating");
  if (!(icon instanceof HTMLElement) || !(floating instanceof HTMLElement)) return;

  const floatingWidth = 210;
  const offsetY = 10;

  const show = () => {
    const rect = icon.getBoundingClientRect();
    const rawLeft = rect.left + rect.width / 2 - floatingWidth / 2;
    const maxLeft = window.innerWidth - floatingWidth - 12;
    const left = Math.min(Math.max(12, rawLeft), maxLeft);
    const top = rect.bottom + offsetY;

    floating.style.left = `${left}px`;
    floating.style.top = `${top}px`;
    floating.style.transform = "translate3d(0, 0, 0)";
    floating.classList.add("is-visible");
  };

  const hide = () => {
    floating.classList.remove("is-visible");
    floating.style.transform = "translate3d(-9999px, -9999px, 0)";
  };

  icon.addEventListener("mouseenter", show);
  icon.addEventListener("mouseleave", hide);
  icon.addEventListener("blur", hide);
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide);
}

/**
 * 注入 / 刷新 head 中的 JSON-LD 结构化数据。
 */
function refreshStructuredData() {
  const jsonLd = buildPersonJsonLd(PROFILE, PROJECTS);
  injectJsonLd(jsonLd);
}

/**
 * 主初始化：项目渲染 → 交互绑定 → SEO 注入。
 */
function init() {
  renderProjects();
  bindInteractions();
  refreshStructuredData();
}

/* ------------------------------ 启动序列 ------------------------------ */

runBootLoader();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
