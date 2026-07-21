/**
 * 入场动画 (reveal)
 *
 * 监听所有 `.reveal` 元素，当其进入视口 20% 时加 `.is-visible`，
 * 触发 CSS 中预先定义的过渡效果。一次性观察，触发后立即解除监听。
 */

const REVEAL_THRESHOLD = 0.18;
const REVEAL_MARGIN = "0px 0px -12% 0px";

function getRevealOrder(el) {
  const raw = Number(el.dataset.revealOrder || 0);
  return Number.isFinite(raw) ? raw : 0;
}

function getRevealDelay(el) {
  return getRevealOrder(el) * 80;
}

/**
 * 为所有 .reveal 元素绑定 IntersectionObserver。
 */
export function revealCards() {
  const cards = document.querySelectorAll(".reveal");
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = /** @type {HTMLElement} */ (entry.target);
          target.style.setProperty("--reveal-delay", `${getRevealDelay(target)}ms`);
          target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: REVEAL_THRESHOLD,
      rootMargin: REVEAL_MARGIN,
    }
  );

  cards.forEach((card) => observer.observe(card));
}
