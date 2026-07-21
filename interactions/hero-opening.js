const ENTER_CLASS = "is-hero-entered";

export function setupHeroOpening() {
  const hero = document.querySelector(".projects-masthead");
  if (!(hero instanceof HTMLElement)) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    hero.dataset.heroStage = "settled";
    hero.classList.add(ENTER_CLASS);
    return;
  }

  hero.dataset.heroStage = "primed";

  window.requestAnimationFrame(() => {
    hero.dataset.heroStage = "entering";

    window.setTimeout(() => {
      hero.dataset.heroStage = "settled";
      hero.classList.add(ENTER_CLASS);
    }, 1320);
  });
}
