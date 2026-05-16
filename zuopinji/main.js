/**
 * Portfolio 入口编排
 *
 * 执行顺序约束（参考 ARCHITECTURE_GUIDE.md §8）：
 *   1. boot loader 立即开始（盖屏，独立于卡片渲染）
 *   2. 等 DOMContentLoaded：精选项目 + 其余项目卡渲染
 *   3. 渲染完毕后绑定 reveal / scroll progress / magnetic / focus overlay / 卡片按钮
 *   4. 同步刷新 SEO JSON-LD（用 PROJECTS 当唯一数据源）
 */

import { PROJECTS, PROFILE } from "./data/projects.js?v=20260516-layout-fix";
import {
  renderAllProjects,
  renderFeaturedProject,
} from "./render/project-card.js?v=20260516-layout-fix";
import { runBootLoader } from "./interactions/boot-loader.js?v=20260516-layout-fix";
import { revealCards } from "./interactions/reveal.js?v=20260516-layout-fix";
import { setupScrollProgress } from "./interactions/scroll-progress.js?v=20260516-layout-fix";
import { setupMagneticTargets } from "./interactions/magnetic.js?v=20260516-layout-fix";
import { setupProjectFocusOverlay } from "./interactions/focus-overlay.js?v=20260516-layout-fix";
import { bindProjectCardDetailButtons } from "./interactions/project-card-actions.js?v=20260516-layout-fix";
import {
  buildPersonJsonLd,
  injectJsonLd,
} from "./seo/structured-data.js?v=20260516-layout-fix";

const CONTACT_CTA = [
  { type: "resume", label: "简历 PDF", href: "./resume.pdf", download: "郭伟南-简历.pdf" },
  { type: "email", label: "邮箱", href: "mailto:taylorkarma@163.com" },
  { type: "wechat", label: "微信", href: "./wechat-qr.png", target: "_blank" },
];

const CASE_ENHANCEMENTS = {
  calendar: {
    background:
      "面向施工与运维排班场景，把工单、人员分段和冲突校验整合到一个可上线工具里，替代高频 Excel 协调。",
    usersScene:
      "施工排班、运维统筹与项目协同角色会同时使用。典型场景是跨周工单安排、多角色参与、临时调班与名单变更。",
    goals:
      "目标是让冲突在保存前暴露、让名单与工单保持一致，并支持云端同步。约束是分段安排必须落在工单区间内，同人不可时间重叠。",
    solution:
      "采用月历视图承载工单占用，用“人员分段”而不是整单参与做排班粒度；先做强校验和持久化，再补充编辑效率与导入能力。",
    results: [
      { label: "交付形态", value: "React + Supabase 工具" },
      { label: "当前状态", value: "已上线" },
      { label: "效率变化", value: "减少撞期返工" },
      { label: "质量口径", value: "保存前拦截冲突" },
      { label: "结果说明", value: "定性：减少沟通成本" },
      { label: "验证方式", value: "真实场景试跑" },
    ],
    risks:
      "多人并发编辑与权限分层还可以继续细化；移动端体验和更复杂的排班规则尚未展开。",
    retro:
      "这类工具优先级最高的是正确性和可追溯，而不是编辑自由度。先锁定规则边界，后续再补效率优化会更稳。",
  },
  digest: {
    background:
      "面向需要持续跟踪行业信息的角色，把分散资讯收敛成按时送达的结构化日报，减少重复浏览与手工摘抄。",
    usersScene:
      "产品、运营与研究类角色需要关注多源资讯。典型场景是每天固定时间收到重点主题摘要，而不是反复切换渠道。",
    goals:
      "目标是按时区稳定生成结构化日报，并保留主题分桶与来源追溯。约束是不编造事实、要可复用到邮件模板与前端页面。",
    solution:
      "先做多源抓取、去重和主题分桶，再用 JSON 约束摘要结构；取舍上优先保证稳定送达与可消费格式，而不是一次性长文总结。",
    results: [
      { label: "交付形态", value: "定时资讯订阅工具" },
      { label: "当前状态", value: "已上线" },
      { label: "效率变化", value: "减少重复浏览" },
      { label: "质量口径", value: "主题分桶可追溯" },
      { label: "结果说明", value: "定性：稳定按时送达" },
      { label: "验证方式", value: "订阅链路试跑" },
    ],
    risks:
      "资讯源波动和抓取异常仍需要监控告警；更细粒度的个性化订阅与反馈闭环暂未展开。",
    retro:
      "信息订阅工具先要把“稳定、可读、可追溯”做扎实，再去追求更重的分析深度，这样更符合日常使用频率。",
  },
  money: {
    background:
      "面向薪酬配钞与批量现金分发场景，把单笔计算和 Excel 批处理合并到同一套工具中，减少人工拆分与复核。",
    usersScene:
      "财务、人力或协助发薪的运营角色会使用。典型场景是批量导入名单后快速得到各面额张数和剩余金额。",
    goals:
      "目标是算得对、导得出、便于复核。约束是面额组合固定、导出列顺序必须稳定、异常行不能阻塞整批处理。",
    solution:
      "用从大到小的贪心策略完成拆分，统一网页端与小程序端的核心口径；取舍上优先保证导入导出链路和复核稳定性，而不是复杂交互装饰。",
    results: [
      { label: "交付形态", value: "网页 + 小程序" },
      { label: "当前状态", value: "已上线" },
      { label: "效率变化", value: "30 分钟 → 3 分钟级" },
      { label: "质量口径", value: "余数与异常可复核" },
      { label: "结果说明", value: "「轻松配钞」已上线" },
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
    goals:
      "目标是输出可复核、可交付的换算结果。约束是 base / target 方向不能错、汇率来源要可说明、弱网下也要有可降级结果。",
    solution:
      "在输入后先校验方向和金额，再展示所用汇率口径；取舍上优先保证来源清楚和结果可审计，而不是只追求“秒出答案”。",
    results: [
      { label: "交付形态", value: "Web 汇率换算工具" },
      { label: "当前状态", value: "已上线" },
      { label: "效率变化", value: "快速出具结果" },
      { label: "质量口径", value: "方向纠偏 + 弱网降级" },
      { label: "结果说明", value: "定性：柜台场景更稳" },
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
    goals:
      "目标是缩短日结耗时并保持模板口径一致。约束是格式不能丢、规则不能漂移、异常必须可追溯。",
    solution:
      "用 pandas 清洗与勾稽规则做数据底座，再用 openpyxl 保持模板格式；取舍上先保证可复核和格式一致，再追求更高自动化深度。",
    results: [
      { label: "交付形态", value: "Python 自动化引擎" },
      { label: "当前状态", value: "待部署" },
      { label: "效率变化", value: "2 小时 → 10 分钟内" },
      { label: "质量口径", value: "异常清单可追溯" },
      { label: "结果说明", value: "人工统计约降 90%" },
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
