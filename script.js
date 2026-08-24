const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => observer.observe(item));
}

const heroSystem = document.querySelector('.hero-system');
const variableWord = document.querySelector('.variable-word');
if (heroSystem && variableWord && !prefersReducedMotion) {
  heroSystem.addEventListener('pointermove', (event) => {
    const bounds = heroSystem.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    variableWord.style.setProperty('--word-weight', Math.round(500 + ratio * 300));
  });
  heroSystem.addEventListener('pointerleave', () => variableWord.style.removeProperty('--word-weight'));
}

const cardsRoot = document.querySelector('#caseCards');
if (cardsRoot) {
  const { CASES } = await import('./data/case-manifest.js');
  cardsRoot.innerHTML = CASES.map((project, index) => {
    const external = project.live || project.github;
    const externalLabel = project.live ? '访问产品' : '查看 GitHub';
    const primary = `<a class="project-cta project-cta--primary" href="./cases/${project.slug}/">查看案例 <span aria-hidden="true">→</span></a>`;
    const secondary = external ? `<a class="project-cta project-cta--secondary" href="${external.href}" target="_blank" rel="noopener noreferrer">${externalLabel} <span aria-hidden="true">↗</span></a>` : '';
    if (index === 0) return `<article class="featured-case reveal is-visible"><img src="${project.cover}" alt="${project.coverAlt}" /><div class="featured-case__copy"><p>${project.index} / 05 · ${project.statusLabel}</p><h3>${project.title}</h3><p>${project.tagline}</p><div class="project-ctas">${primary}${secondary}</div></div></article>`;
    return `<article class="project-row reveal is-visible"><span class="project-number">${project.index}</span><img src="${project.cover}" alt="${project.coverAlt}" loading="lazy" /><div class="project-title"><small>${project.statusLabel}</small><h3>${project.title}</h3></div><p>${project.summary}</p><div class="project-ctas">${primary}${secondary}</div></article>`;
  }).join('');
}
