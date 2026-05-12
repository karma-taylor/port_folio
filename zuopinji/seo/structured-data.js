/**
 * JSON-LD 结构化数据生成
 *
 * 接收 projects 数据 + 个人资料，输出 Schema.org Person 对象（含 hasPart 项目列表）。
 * 用于动态注入 / 替换 <script type="application/ld+json"> 内容，保持单源真值。
 */

/**
 * 取项目的"对外可见链接"。优先：上线链接 > GitHub 链接 > hoverCta。
 * @param {object} project
 * @returns {string}
 */
function pickProjectUrl(project) {
  const liveLink = project.detail?.links?.find((l) => l.type === "live");
  if (liveLink?.href && !/example\.com/i.test(liveLink.href)) return liveLink.href;

  const githubLink = project.detail?.links?.find((l) => l.type === "github");
  if (githubLink?.href) return githubLink.href;

  return project.hoverCta?.href || project.github?.href || "";
}

/**
 * 把单个 project 映射成 schema.org CreativeWork。
 * @param {object} project
 * @returns {object}
 */
export function projectToCreativeWork(project) {
  return {
    "@type": "CreativeWork",
    name: project.title,
    url: pickProjectUrl(project),
    description: project.detail?.summary || project.hoverValue || "",
  };
}

/**
 * 构造完整 Person JSON-LD。
 * @param {object} profile 见 data/projects.js 中 PROFILE
 * @param {Array<object>} projects
 * @returns {object}
 */
export function buildPersonJsonLd(profile, projects) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.alternateName,
    url: profile.siteUrl,
    jobTitle: profile.jobTitle,
    sameAs: profile.sameAs,
    hasPart: projects.map(projectToCreativeWork),
  };
}

/**
 * 把 JSON-LD 注入到 head 中 <script id="structuredData"> 节点。
 * 若节点不存在则新建。
 * @param {object} jsonLd
 * @param {Document} [doc=document]
 */
export function injectJsonLd(jsonLd, doc = document) {
  let node = doc.getElementById("structuredData");
  if (!node) {
    node = doc.createElement("script");
    node.type = "application/ld+json";
    node.id = "structuredData";
    doc.head.appendChild(node);
  }
  node.textContent = JSON.stringify(jsonLd, null, 2);
}
