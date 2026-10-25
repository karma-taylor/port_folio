import { CASES } from "./data/case-manifest.js?v=20261025-vivid";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const esc = (value = "") =>
  String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);

function caseLinks(project) {
  const href = `./cases/${project.slug}/`;
  const external = project.live || project.github;
  const externalLabel = project.live ? "访问产品" : "查看 GitHub";
  const externalTrack = project.live ? "live_open" : "github_open";
  const primary = `<a class="project-cta project-cta--primary" href="${href}" data-track="case_open" data-track-label="${esc(project.slug)}">查看案例 <span aria-hidden="true">→</span></a>`;
  const secondary = external
    ? `<a class="project-cta project-cta--secondary" href="${esc(external.href)}" target="_blank" rel="noopener noreferrer" data-track="${externalTrack}" data-track-label="${esc(project.slug)}">${externalLabel} <span aria-hidden="true">↗</span></a>`
    : "";
  return `<div class="project-ctas">${primary}${secondary}</div>`;
}

function coreCard(project, position) {
  const href = `./cases/${project.slug}/`;
  const results = (project.results || [])
    .filter((item) => !(project.verification && item.label === "验证方式"))
    .slice(0, 4)
    .map((item) => `<li><small>${esc(item.label)}</small><strong>${esc(item.value)}</strong></li>`)
    .join("");
  const meta = [
    ["我的角色", project.role],
    ["验证方式", project.verification],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`)
    .join("");
  return `<article class="core-case reveal${position % 2 ? " core-case--flip" : ""}">
    <a class="core-case__media" href="${href}" tabindex="-1" aria-hidden="true" data-track="case_open" data-track-label="${esc(project.slug)}-cover"><img src="${esc(project.cover)}" alt="" loading="${position ? "lazy" : "eager"}" /></a>
    <div class="core-case__body">
      <p class="case-type">${esc(project.index)} · ${esc(project.statusLabel)}</p>
      <h3><a href="${href}" data-track="case_open" data-track-label="${esc(project.slug)}-title">${esc(project.title)}</a></h3>
      <p class="core-case__tagline">${esc(project.tagline)}</p>
      ${meta ? `<dl class="core-case__meta">${meta}</dl>` : ""}
      ${results ? `<ul class="core-case__results" aria-label="关键结果">${results}</ul>` : ""}
      ${caseLinks(project)}
    </div>
  </article>`;
}

function moreCard(project) {
  const href = `./cases/${project.slug}/`;
  return `<article class="more-case reveal">
    <a class="more-case__media" href="${href}" tabindex="-1" aria-hidden="true" data-track="case_open" data-track-label="${esc(project.slug)}-cover"><img src="${esc(project.cover)}" alt="" loading="lazy" /></a>
    <p class="case-type">${esc(project.index)} · ${esc(project.statusLabel)}</p>
    <h4><a href="${href}" data-track="case_open" data-track-label="${esc(project.slug)}-title">${esc(project.title)}</a></h4>
    <p>${esc(project.tagline)}</p>
    ${caseLinks(project)}
  </article>`;
}

function renderCases() {
  const coreRoot = document.getElementById("coreCases");
  const moreRoot = document.getElementById("moreCases");
  if (!coreRoot || !moreRoot) return;
  const core = CASES.filter((project) => project.tier === "core");
  const more = CASES.filter((project) => project.tier !== "core");
  coreRoot.innerHTML = core.map(coreCard).join("");
  moreRoot.innerHTML = more.map(moreCard).join("");
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
}

function setupQrPopovers() {
  const popovers = document.querySelectorAll(".qr-pop");
  document.addEventListener("click", (event) => {
    popovers.forEach((popover) => {
      if (popover.open && !popover.contains(event.target)) popover.open = false;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    popovers.forEach((popover) => {
      popover.open = false;
    });
  });
}

function setupRotatingWord() {
  const el = document.querySelector("[data-rotate]");
  if (!el || prefersReducedMotion) return;
  const words = el.dataset.rotate.split("|").filter(Boolean);
  if (words.length < 2) return;
  let index = 0;
  setInterval(() => {
    el.classList.add("is-swapping");
    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.classList.remove("is-swapping");
    }, 260);
  }, 2600);
}

function setupCounters() {
  const nodes = document.querySelectorAll("[data-count]");
  if (!nodes.length || prefersReducedMotion || !("IntersectionObserver" in window)) return;
  const run = (node) => {
    const target = Number(node.dataset.count) || 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  nodes.forEach((node) => observer.observe(node));
}

function setupMarquee() {
  const track = document.querySelector(".marquee__track");
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

function setupTilt() {
  if (prefersReducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".core-case").forEach((card) => {
    const media = card.querySelector(".core-case__media img");
    if (!media) return;
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      media.style.transform = `scale(1.04) translate(${x * -10}px, ${y * -10}px)`;
      card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
      card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      media.style.transform = "";
    });
  });
}

renderCases();
setupReveal();
setupQrPopovers();
setupRotatingWord();
setupCounters();
setupMarquee();
setupTilt();
