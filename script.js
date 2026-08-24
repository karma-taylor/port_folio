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
