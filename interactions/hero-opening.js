const ENTER_CLASS = "is-hero-entered";
const STAGE_PRIMED = "primed";
const STAGE_ENTERING = "entering";
const STAGE_SETTLING = "settling";
const STAGE_SETTLED = "settled";

export function setupHeroOpening() {
  const hero = document.querySelector(".projects-masthead");
  if (!(hero instanceof HTMLElement)) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    hero.dataset.heroStage = STAGE_SETTLED;
    hero.classList.add(ENTER_CLASS);
    return;
  }

  hero.classList.remove(ENTER_CLASS);
  hero.dataset.heroStage = STAGE_PRIMED;

  const timers = [];

  const queue = (delay, callback) => {
    timers.push(window.setTimeout(callback, delay));
  };

  window.requestAnimationFrame(() => {
    queue(70, () => {
      hero.dataset.heroStage = STAGE_ENTERING;
    });

    queue(760, () => {
      hero.dataset.heroStage = STAGE_SETTLING;
    });

    queue(1460, () => {
      hero.dataset.heroStage = STAGE_SETTLED;
      hero.classList.add(ENTER_CLASS);
    });
  });

  window.addEventListener(
    "pagehide",
    () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    },
    { once: true }
  );
}
