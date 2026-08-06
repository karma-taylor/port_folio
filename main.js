import { PROJECTS, PROFILE, DELIVERY_SUMMARY, PROJECT_MANAGEMENT_META } from "./data/projects.js?v=20260806-delivery-briefing";
import { renderAllProjects, renderFeaturedProject } from "./render/project-card.js?v=20260806-delivery-briefing";
import { runBootLoader } from "./interactions/boot-loader.js?v=20260517-case-study";
import { revealCards } from "./interactions/reveal.js?v=20260517-case-study";
import { setupScrollProgress } from "./interactions/scroll-progress.js?v=20260517-case-study";
import { setupMagneticTargets } from "./interactions/magnetic.js?v=20260517-case-study";
import { setupProjectFocusOverlay } from "./interactions/focus-overlay.js?v=20260806-delivery-briefing";
import { bindProjectCardDetailButtons } from "./interactions/project-card-actions.js?v=20260517-case-study";
import { setupWorkbenchAvatar } from "./interactions/workbench-avatar.js?v=20260628-neck-pivot-2";
import { setupWorkbenchScreens } from "./interactions/workbench-screens.js?v=20260628-hero-hover-balance";
import { setupProjectDeckMotion } from "./interactions/project-deck-motion.js?v=20260722-motion-refresh-1";
import { setupHeroOpening } from "./interactions/hero-opening.js?v=20260722-motion-refresh-1";
import { setupNavCapsule } from "./interactions/nav-capsule.js?v=20260722-motion-refresh-1";
import { buildPersonJsonLd, injectJsonLd } from "./seo/structured-data.js?v=20260517-case-study";

const CONTACT_CTA = [
  { type: "resume", label: "简历 PDF", href: "./resume.pdf", download: "郭伟南 简历.pdf" },
  { type: "email", label: "邮箱", href: "mailto:taylorkarma@163.com" },
  { type: "wechat", label: "微信", href: "./wechat-qr.png", target: "_blank" },
];

const CASE_ENHANCEMENTS = {
  calendar: {
    background:
      "以脱敏的钢结构遮阳棚施工调度为例，把原本依赖 Excel 和人工确认的班组排期，产品化为有规则约束的系统。",
    usersScene:
      "适用于多人协同排期、资源分配和任务统筹场景，尤其是跨周任务安排、多角色参与与名单频繁变更的环境。",
    researchScope:
      "围绕钢构吊装、节点焊接与照明预埋的人员、角色、工期和分段参与梳理规则；本轮只处理保存前冲突，不扩展权限和多人并发编辑。",
    coreProblem:
      "钢构吊装、节点焊接与照明预埋必须衔接；人员、时间窗、角色和分段参与交织，人工对齐容易让同一焊工被重复占用。",
    results: [
      { label: "规则 01", value: "保存前阻断人员撞期" },
      { label: "规则 02", value: "任务边界内的分段参与" },
      { label: "交付方式", value: "月历 + 可复核详情" },
      { label: "验证方式", value: "脱敏工程场景试排" },
    ],
    delivery:
      "交付月视图、人员分段表单、前端冲突阻断和可复核详情；用脱敏工程班组试排验证焊工撞期不可保存、调整后可保存，并发布至 Cloudflare Pages。",
    risks: "公开演示只保留本地草稿；多人并发编辑、权限分层与更复杂的排期规则仍是后续方向。",
  },
  digest: {
    background:
      "把分散在多来源里的资讯内容，加工成能按时送达、可直接消费的结构化日报。",
    usersScene:
      "适用于产品、运营和研究角色的行业订阅场景，希望每天稳定收到主题摘要而不是反复切换渠道。",
    coreProblem:
      "难点不是信息多，而是用户需要自己切换来源、重复阅读、再二次整理；没有主题分栏和时区对齐就很难长期可用。",
    results: [
      { label: "结果 01", value: "减少二次整理成本" },
      { label: "结果 02", value: "摘要可复用到邮件与前端" },
      { label: "结果 03", value: "按时区稳定送达" },
      { label: "验证方式", value: "订阅链路试跑" },
    ],
    risks: "后续仍需继续增强抓取监控、标签细分和反馈闭环。",
  },
  money: {
    background:
      "把规则明确、重复频繁、又容易出错的薪资配钞流程，做成网页和小程序双端工具。",
    usersScene:
      "适用于财务、人力和协助发薪的运营角色，典型场景是批量导入名单后快速得到各面额张数与余数。",
    coreProblem:
      "问题不在算法本身，而在发薪场景里人工拆分、核对、导出和异常处理都很琐碎，如果口径不一致就无法复核。",
    results: [
      { label: "结果 01", value: "人工核对压缩到 3 分钟内" },
      { label: "结果 02", value: "双端拆分口径保持一致" },
      { label: "结果 03", value: "导入导出与异常校验可复核" },
      { label: "验证方式", value: "单笔 + 批量试跑" },
    ],
    risks: "当前以固定面额组为主，后续仍可继续补足更复杂的库存约束。",
  },
  fx: {
    background:
      "面向跨币种换算与报价辅助场景，把多来源汇率、防呆校验和弱网策略做成可直接使用的工具。",
    usersScene:
      "适用于柜台、差旅报销、跨境结算和业务报价场景，需要快速得到可复核的换算结果。",
    coreProblem:
      "难点不是给出一个数字，而是让用户知道结果按什么口径算出来，同时避免方向输错、汇率缺失和弱网失真。",
    results: [
      { label: "结果 01", value: "换算口径可解释可复核" },
      { label: "结果 02", value: "方向纠偏前置到输入阶段" },
      { label: "结果 03", value: "弱网场景仍可快速出数" },
      { label: "验证方式", value: "多源交叉比对" },
    ],
    risks: "后续仍可继续增强历史汇率与更完整的审计留痕。",
  },
  report: {
    background:
      "面向企业业务日结场景，用脚本把多表清洗、模板渲染和异常勾核串成自动化流程，替代重复手工搬数。",
    usersScene:
      "适用于结算、运营和日报台账场景，需要按固定模板产出多张表并同步保留异常清单。",
    coreProblem:
      "难点不是生成报表，而是既要保持模板格式不变，又要把多表清洗、规则勾稽和异常留痕串成可复核链路。",
    results: [
      { label: "结果 01", value: "日结耗时压缩到 10 分钟内" },
      { label: "结果 02", value: "异常清单支持追溯" },
      { label: "结果 03", value: "模板口径稳定输出" },
      { label: "验证方式", value: "历史模板回放" },
    ],
    risks: "若规则持续膨胀，后续需要拆出更清晰的配置层。",
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
      ...project.detail.recruiting,
    };
  });
}

function renderExperience() {
  const mount = document.getElementById("experienceTimeline");
  if (!mount || !Array.isArray(PROFILE.experience)) return;

  const fragment = document.createDocumentFragment();
  PROFILE.experience.forEach((item) => {
    const article = document.createElement("article");
    article.className = "experience-entry reveal";
    article.dataset.revealGroup = "experience-cards";

    const period = document.createElement("p");
    period.className = "experience-entry__period";
    period.textContent = item.period;

    const title = document.createElement("h4");
    title.textContent = item.title;

    const context = document.createElement("p");
    context.className = "experience-entry__context";
    const contextLabel = document.createElement("span");
    contextLabel.textContent = "场景";
    context.append(contextLabel, document.createTextNode(item.context));

    const detail = document.createElement("p");
    const detailLabel = document.createElement("span");
    detailLabel.textContent = "管理难点";
    detail.append(detailLabel, document.createTextNode(item.detail));

    const proof = document.createElement("p");
    proof.className = "experience-entry__proof";
    const proofLabel = document.createElement("span");
    proofLabel.textContent = "迁移动作 / 已识别边界";
    proof.append(proofLabel, document.createTextNode(item.proof));

    article.append(period, title, context, detail, proof);
    fragment.appendChild(article);
  });
  mount.replaceChildren(fragment);
}

function renderDeliverySummary() {
  const mount = document.getElementById("deliverySummary");
  if (!mount || !Array.isArray(DELIVERY_SUMMARY)) return;

  const fragment = document.createDocumentFragment();
  DELIVERY_SUMMARY.forEach((item) => {
    const article = document.createElement("article");
    article.className = "delivery-summary__item";
    const label = document.createElement("span");
    label.textContent = item.label;
    const value = document.createElement("strong");
    value.textContent = item.value;
    article.append(label, value);
    fragment.appendChild(article);
  });
  mount.replaceChildren(fragment);
}

function buildProjectData(project) {
  const managementMeta = PROJECT_MANAGEMENT_META[project.id] || {};
  return { ...project, managementMeta };
}

const PROJECT_DATA = PROJECTS.map(buildProjectData);
applyRecruitingEnhancements(PROJECT_DATA);

function renderProjects() {
  const hero = document.getElementById("featuredHero");
  const coreGrid = document.getElementById("coreProjectsGrid");
  const supportGrid = document.getElementById("supportProjectsGrid");

  if (!hero || !coreGrid || !supportGrid) {
    console.warn("[main] 项目分组挂载点缺失，跳过项目渲染");
    return;
  }

  const [featured, ...rest] = PROJECT_DATA;
  const coreCases = rest.slice(0, 2);
  const supportCases = rest.slice(2);

  renderFeaturedProject(hero, featured);
  renderAllProjects(coreCases, coreGrid, { layout: "compact" });
  renderAllProjects(supportCases, supportGrid, { layout: "compact" });
}

function setupWechatQrHover() {
  const floating = document.getElementById("wechatQrFloating");
  const triggers = [
    document.getElementById("wechatIcon"),
    document.querySelector(".about-contact__item--wechat"),
  ].filter((node) => node instanceof HTMLElement);
  if (!triggers.length || !(floating instanceof HTMLElement)) return;

  const floatingWidth = 260;
  const offsetY = 10;

  const show = (trigger) => {
    const rect = trigger.getBoundingClientRect();
    const isAboutContact = trigger.classList.contains("about-contact__item--wechat");
    const rawLeft = isAboutContact
      ? rect.left - floatingWidth - 14
      : rect.left + rect.width / 2 - floatingWidth / 2;
    const maxLeft = window.innerWidth - floatingWidth - 12;
    const left = Math.min(Math.max(12, rawLeft), maxLeft);
    const top = isAboutContact
      ? Math.min(Math.max(12, rect.top + rect.height / 2 - floatingWidth / 2), window.innerHeight - floatingWidth - 12)
      : rect.bottom + offsetY;

    floating.style.left = `${left}px`;
    floating.style.top = `${top}px`;
    floating.style.transform = "translate3d(0, 0, 0)";
    floating.classList.add("is-visible");
  };

  const hide = () => {
    floating.classList.remove("is-visible");
    floating.style.transform = "translate3d(-9999px, -9999px, 0)";
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => show(trigger));
    trigger.addEventListener("mouseleave", hide);
    trigger.addEventListener("focusin", () => show(trigger));
    trigger.addEventListener("focusout", hide);
  });
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide);
}

function bindInteractions() {
  setupHeroOpening();
  setupNavCapsule();
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

function refreshStructuredData() {
  injectJsonLd(buildPersonJsonLd(PROFILE, PROJECTS));
}

function init() {
  renderDeliverySummary();
  renderExperience();
  renderProjects();
  bindInteractions();
  refreshStructuredData();
}

runBootLoader();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
