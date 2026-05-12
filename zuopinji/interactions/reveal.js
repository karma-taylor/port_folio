/**
 * 入场动画 (reveal)
 *
 * 监听所有 `.reveal` 元素，当其进入视口 20% 时加 `.is-visible`，
 * 触发 CSS 中预先定义的过渡效果。一次性观察，触发后立即解除监听。
 */

const REVEAL_THRESHOLD = 0.2;
const REVEAL_MARGIN = "0px 0px -40px 0px";

/**
 * 为所有 .reveal 元素绑定 IntersectionObserver。
 */
export function revealCards() {
  const cards = document.querySelectorAll(".reveal");
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
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
