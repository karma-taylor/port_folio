export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pickBlurb(project) {
  return project.hoverValue || project.detail?.summary || "";
}

function pickFallbackLinks(project) {
  const links = [];
  const live = project.detail?.links?.find((item) => item.type === "live");
  if (live?.href && !/example\.com/i.test(live.href)) {
    links.push({ href: live.href, label: "演示" });
  }
  const github = project.detail?.links?.find((item) => item.type === "github");
  if (github?.href) {
    links.push({ href: github.href, label: "GitHub" });
  }
  return links;
}

export function projectToNoscriptItem(project) {
  const title = escapeHtml(project.title);
  const blurb = escapeHtml(pickBlurb(project));
  const links = pickFallbackLinks(project)
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join(" · ");

  return `<li><strong>${title}</strong> — ${blurb}${links ? ` · ${links}` : ""}</li>`;
}

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
