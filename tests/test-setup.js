/**
 * 测试设置：把生产环境 index.html 中的 <template> 加载到测试页 DOM，
 * 让 renderProjectCard 能在测试环境正常 cloneTemplate。
 */

const TEMPLATE_IDS = [
  "projectCardTemplate",
  "techBadgeTemplate",
  "flowStepTemplate",
  "detailLinkTemplate",
];

let cached = null;

/**
 * 拉取 zuopinji/index.html，解析后把 4 个 template 节点克隆到本测试页 body 上。
 * 幂等：多次调用只加载一次。
 */
export async function loadProductionTemplates() {
  if (cached) return cached;

  const res = await fetch("../zuopinji/index.html");
  if (!res.ok) {
    throw new Error(`无法加载 zuopinji/index.html (HTTP ${res.status})`);
  }
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  TEMPLATE_IDS.forEach((id) => {
    if (document.getElementById(id)) return; // 已存在
    const tpl = doc.getElementById(id);
    if (!tpl) {
      throw new Error(`生产页缺少 <template id="${id}">`);
    }
    document.body.appendChild(tpl.cloneNode(true));
  });

  cached = true;
  return cached;
}
