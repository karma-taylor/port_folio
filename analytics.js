// 在 cloud.umami.is 新建站点后，把 Website ID 填到这里；留空时不加载任何统计脚本。
const UMAMI_WEBSITE_ID = "";
const UMAMI_SCRIPT = "https://cloud.umami.is/script.js";
const SITE_HOSTNAME = "www.vinanverse.com";
const SOURCE_KEY = "portfolio_source";

function readSource() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("utm_source") || params.get("src");
  try {
    if (fromUrl) sessionStorage.setItem(SOURCE_KEY, fromUrl);
    return sessionStorage.getItem(SOURCE_KEY) || "direct";
  } catch {
    return fromUrl || "direct";
  }
}

function loadUmami() {
  if (!UMAMI_WEBSITE_ID || window.location.hostname !== SITE_HOSTNAME) return;
  const script = document.createElement("script");
  script.defer = true;
  script.src = UMAMI_SCRIPT;
  script.dataset.websiteId = UMAMI_WEBSITE_ID;
  script.dataset.domains = SITE_HOSTNAME;
  document.head.appendChild(script);
}

const source = readSource();
loadUmami();

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-track]") : null;
  if (!target) return;
  const payload = { source, page: window.location.pathname };
  if (target.dataset.trackLabel) payload.label = target.dataset.trackLabel;
  window.umami?.track(target.dataset.track, payload);
});
