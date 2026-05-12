/**
 * Portfolio 入口编排
 *
 * 执行顺序约束（参考 ARCHITECTURE_GUIDE.md §8）：
 *   1. boot loader 立即开始（盖屏，独立于卡片渲染）
 *   2. 等 DOMContentLoaded：渲染所有项目卡到 #projectsGrid
 *   3. 渲染完毕后绑定 reveal / scroll progress / magnetic / focus overlay
 *   4. 同步刷新 SEO JSON-LD（用 PROJECTS 当唯一数据源）
 */

import { PROJECTS, PROFILE } from "./data/projects.js";
import { renderAllProjects } from "./render/project-card.js";
import { runBootLoader } from "./interactions/boot-loader.js";
import { revealCards } from "./interactions/reveal.js";
import { setupScrollProgress } from "./interactions/scroll-progress.js";
import { setupMagneticTargets } from "./interactions/magnetic.js";
import { setupProjectFocusOverlay } from "./interactions/focus-overlay.js";
import {
  buildPersonJsonLd,
  injectJsonLd,
} from "./seo/structured-data.js";

/**
 * 渲染所有项目卡片到挂载点。
 * @param {Element | null} mountEl
 */
function renderProjects(mountEl) {
  if (!mountEl) {
    console.warn("[main] #projectsGrid 未找到，跳过项目渲染");
    return;
  }
  renderAllProjects(PROJECTS, mountEl);
}

/**
 * 渲染完成后绑定所有依赖 DOM 的交互。
 */
function bindInteractions() {
  revealCards();
  setupScrollProgress();
  setupMagneticTargets();
  setupProjectFocusOverlay();
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
  renderProjects(document.getElementById("projectsGrid"));
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
