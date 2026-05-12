/**
 * <noscript> 兜底列表生成
 *
 * 当用户禁用 JS / 老爬虫无法跑 JS 时，仍然能从初始 HTML 看到 5 个项目的精简清单。
 *
 * 注意：本模块输出**字符串**给生产期注入。运行时 JS 已禁用的话，这段模块当然也不会执行；
 * 所以正确做法是：把生成的 HTML 字符串作为 fallback 写进 index.html 中的 <noscript>。
 * 本模块同时给单元测试用。
 */

/**
 * 极简 HTML escape。仅处理 < > & " '，足以覆盖文本节点和属性值。
 * @param {string} s
 * @returns {string}
 */
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * 取一句话简介（hoverValue 优先，detail.summary 兜底）。
 * @param {object} project
 * @returns {string}
 */
function pickBlurb(project) {
  return project.hoverValue || project.detail?.summary || "";
}

/**
 * 取两个外链：演示链接 + GitHub 链接（顺序固定）。
 * 若没有 live，则只输出 GitHub。
 * @param {object} project
 * @returns {Array<{href: string, label: string}>}
 */
function pickFallbackLinks(project) {
  const out = [];
  const live = project.detail?.links?.find((l) => l.type === "live");
  if (live?.href && !/example\.com/i.test(live.href)) {
    out.push({ href: live.href, label: "演示" });
  }
  const gh = project.detail?.links?.find((l) => l.type === "github");
  if (gh?.href) out.push({ href: gh.href, label: "GitHub" });
  return out;
}

/**
 * 渲染单个项目为一条 <li>...</li>。
 * @param {object} project
 * @returns {string}
 */
export function projectToNoscriptItem(project) {
  const title = escapeHtml(project.title);
  const blurb = escapeHtml(pickBlurb(project));
  const links = pickFallbackLinks(project)
    .map(
      (l) =>
        `<a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a>`
    )
    .join(" · ");
  return `<li><strong>${title}</strong> — ${blurb}${links ? ` — ${links}` : ""}</li>`;
}

/**
 * 渲染整个 noscript 兜底节内容（不含 <noscript> 标签本身）。
 * @param {Array<object>} projects
 * @returns {string}
 */
export function buildNoscriptList(projects) {
  const items = projects.map(projectToNoscriptItem).join("\n      ");
  return `<section class="noscript-fallback">
  <h2>作品集（精简版）</h2>
  <p>请开启 JavaScript 以获得完整体验。以下是项目清单的精简文本：</p>
  <ol>
      ${items}
  </ol>
</section>`;
}
