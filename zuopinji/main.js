/**
 * Portfolio 入口编排
 *
 * 执行顺序约束（参考 ARCHITECTURE_GUIDE.md §8）：
 *   1. boot loader 立即开始（盖屏，独立于卡片渲染）
 *   2. 等 DOMContentLoaded：精选项目 + 其余项目卡渲染
 *   3. 渲染完毕后绑定 reveal / scroll progress / magnetic / focus overlay / 卡片按钮
 *   4. 同步刷新 SEO JSON-LD（用 PROJECTS 当唯一数据源）
 */

import { PROJECTS, PROFILE } from "./data/projects.js?v=20260517-case-study";
import {
  renderAllProjects,
  renderFeaturedProject,
} from "./render/project-card.js?v=20260627-featured-poster";
import { runBootLoader } from "./interactions/boot-loader.js?v=20260517-case-study";
import { revealCards } from "./interactions/reveal.js?v=20260517-case-study";
import { setupScrollProgress } from "./interactions/scroll-progress.js?v=20260517-case-study";
import { setupMagneticTargets } from "./interactions/magnetic.js?v=20260517-case-study";
import { setupProjectFocusOverlay } from "./interactions/focus-overlay.js?v=20260517-case-study";
import { bindProjectCardDetailButtons } from "./interactions/project-card-actions.js?v=20260517-case-study";
import { setupWorkbenchAvatar } from "./interactions/workbench-avatar.js?v=20260628-neck-pivot-2";
import { setupWorkbenchScreens } from "./interactions/workbench-screens.js?v=20260628-hero-hover-balance";
import { setupProjectDeckMotion } from "./interactions/project-deck-motion.js?v=20260627-aipm-workbench-deck";
import {
  buildPersonJsonLd,
  injectJsonLd,
} from "./seo/structured-data.js?v=20260517-case-study";

const CONTACT_CTA = [
  { type: "resume", label: "简历 PDF", href: "./resume.pdf", download: "郭伟南-简历.pdf" },
  { type: "email", label: "邮箱", href: "mailto:taylorkarma@163.com" },
  { type: "wechat", label: "微信", href: "./wechat-qr.png", target: "_blank" },
];

const CASE_ENHANCEMENTS = {
  calendar: {
    background:
      "把原本依赖 Excel 和人工确认的协同排期流程，产品化为一个有规则约束、能真实落地的系统。",
    usersScene:
      "需要多人协同排期、资源分配与任务统筹的角色会同时使用。典型场景是跨周任务安排、多角色参与、临时调整与名单变更。",
    coreProblem:
      "原来的问题不只是“排期麻烦”，而是人员、时间窗、角色、分段参与和冲突规则交织在一起，人工对齐既低效又容易漏错。",
    results: [
      { label: "结果 01", value: "把分段冲突前置到保存前" },
      { label: "结果 02", value: "让名单与任务状态跨设备恢复" },
      { label: "结果 03", value: "用分段参与替代整段默认参与" },
      { label: "验证方式", value: "真实场景试跑" },
    ],
    risks:
      "多人并发编辑与权限分层还可以继续细化；移动端体验和更复杂的排期规则尚未展开。",
    retro:
      "这类工具优先级最高的是正确性和可追溯，而不是编辑自由度。先锁定规则边界，后续再补效率优化会更稳。",
  },
  digest: {
    background:
      "把原本分散在多个信息源里的内容，加工成能按时送达、可直接消费的结构化日报。",
    usersScene:
      "产品、运营与研究类角色需要关注多源资讯。典型场景是每天固定时间收到重点主题摘要，而不是反复切换渠道。",
    coreProblem:
      "真正的痛点不是“信息多”，而是用户要自己切换渠道、重复阅读、再二次整理；如果不先做主题分桶和时区对齐，订阅内容就很难稳定可用。",
    results: [
      { label: "结果 01", value: "减少用户二次整理成本" },
      { label: "结果 02", value: "让结构化摘要可复用到邮件与前端" },
      { label: "结果 03", value: "让订阅内容按时区稳定送达" },
      { label: "验证方式", value: "订阅链路试跑" },
    ],
    risks:
      "资讯源波动和抓取异常仍需要监控告警；更细粒度的个性化订阅与反馈闭环暂未展开。",
    retro:
      "信息订阅工具先要把“稳定、可读、可追溯”做扎实，再去追求更重的分析深度，这样更符合日常使用频率。",
  },
  money: {
    background:
      "把规则明确、重复频繁、又容易出错的薪资配钞流程，做成网页和小程序双端工具。",
    usersScene:
      "财务、人力或协助发薪的运营角色会使用。典型场景是批量导入名单后快速得到各面额张数和剩余金额。",
    coreProblem:
      "问题不在算法本身，而在高频发薪场景里，人工拆分、核对、导出和异常处理都很琐碎；如果口径不一致，结果就不可复核。",
    results: [
      { label: "结果 01", value: "把人工核对压到 3 分钟级" },
      { label: "结果 02", value: "让双端拆分口径保持一致" },
      { label: "结果 03", value: "让导入导出与异常校验可复核" },
      { label: "验证方式", value: "单笔 + 批量试跑" },
    ],
    risks:
      "当前策略以固定面额组为主，更复杂的库存约束与多轮调拨还没纳入；小程序端的批量处理链路仍可继续打磨。",
    retro:
      "这类工具的关键不是“算法多复杂”，而是结果口径一致、导出可交付、异常可解释。网页端和小程序端共用同一套拆分逻辑后，落地价值会更完整。",
  },
  fx: {
    background:
      "面向跨币种换算与报价辅助场景，把多银行参考汇率、防呆校验和弱网策略做成可直接使用的换算工具。",
    usersScene:
      "柜台、差旅报销、跨境结算或业务报价场景都可能用到。典型诉求是快速得到可复核的换算结果，而不是黑盒答案。",
    coreProblem:
      "核心问题不是出一个数字，而是要让用户知道“按什么口径算出来”，同时避免方向输错、汇率缺失或弱网场景下结果失真。",
    results: [
      { label: "结果 01", value: "让换算口径可解释、可复核" },
      { label: "结果 02", value: "把方向纠偏前置到输入阶段" },
      { label: "结果 03", value: "让弱网场景仍可快速出数" },
      { label: "验证方式", value: "多源交叉比对" },
    ],
    risks:
      "汇率接口稳定性与多源口径差异仍需持续观察；更完整的历史记录与审计留痕暂未展开。",
    retro:
      "对业务工具来说，解释清楚“这次按什么口径算出来”比单纯给出一个数字更重要，这会直接影响信任感。",
  },
  report: {
    background:
      "面向企业业务日结场景，用脚本把多表清洗、模板渲染和异常勾稽串成自动化流程，替代重复手工搬数。",
    usersScene:
      "结算、运营和做日报台账的角色会用到。典型场景是按固定模板产出 B/C/D 表，并把异常项单独拉出来复核。",
    coreProblem:
      "真正难点不是生成报表，而是既要保持模板格式不变，又要把多表清洗、规则勾稽和异常留痕串成一条可复核链路。",
    results: [
      { label: "结果 01", value: "把日结耗时压到 10 分钟内" },
      { label: "结果 02", value: "让异常清单可追溯" },
      { label: "结果 03", value: "保证模板口径稳定输出" },
      { label: "验证方式", value: "历史模板回放" },
    ],
    risks:
      "规则变更时仍依赖维护映射与模板更新；更通用的配置化规则管理还没有做成产品层能力。",
    retro:
      "自动化日报的价值不只在省时，更在于稳定口径和降低返工。模板一致性和异常留痕是最值得先守住的底线。",
  },
};

function applyRecruitingEnhancements(projects) {
  projects.forEach((project) => {
    const enhancement = CASE_ENHANCEMENTS[project.id];
    if (!enhancement) return;
    project.detail = project.detail || {};
    project.detail.recruiting = {
      ...enhancement,
      contactCta: CONTACT_CTA,
    };
  });
}

applyRecruitingEnhancements(PROJECTS);

/**
 * 渲染精选区 + 项目网格。
 */
function renderProjects() {
  const hero = document.getElementById("featuredHero");
  const coreGrid = document.getElementById("coreProjectsGrid");
  const supportGrid = document.getElementById("supportProjectsGrid");
  if (!hero || !coreGrid || !supportGrid) {
    console.warn("[main] 项目分组挂载点缺失，跳过项目渲染");
    return;
  }
  const [featured, ...rest] = PROJECTS;
  const coreCases = rest.slice(0, 2);
  const supportCases = rest.slice(2);
  renderFeaturedProject(hero, featured);
  renderAllProjects(coreCases, coreGrid, { layout: "compact" });
  renderAllProjects(supportCases, supportGrid, { layout: "compact" });
}

/**
 * 渲染完成后绑定所有依赖 DOM 的交互。
 */
function bindInteractions() {
  revealCards();
  setupScrollProgress();
  setupMagneticTargets();
  setupProjectFocusOverlay();
  setupWorkbenchAvatar();
  setupWorkbenchScreens();
  setupProjectDeckMotion();
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

  const floatingWidth = 260;
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
