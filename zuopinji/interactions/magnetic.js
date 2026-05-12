/**
 * 磁吸交互 (magnetic targets)
 *
 * 鼠标接近带 [data-magnetic] 的元素时，元素轻微向鼠标方向偏移，
 * 模拟"被磁场吸引"的微动效。偏移量通过 CSS 变量 --mag-x / --mag-y 传递，
 * 配合 styles.css 中的 `translate: var(--mag-x) var(--mag-y)` 应用。
 *
 * 在 reduced-motion 或粗指针（触屏）环境下自动跳过。
 */

const ACTIVATION_RADIUS = 110; // 像素，超过该半径就不再吸附
const DEFAULT_STRENGTH = 0.3;

/**
 * 当前环境是否应跳过磁吸。
 * 抽成纯函数便于测试。
 * @returns {boolean}
 */
export function shouldSkipMagnetic() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isCoarsePointer = window.matchMedia("(hover: none)").matches;
  return reduceMotion || isCoarsePointer;
}

/**
 * 计算单个目标在给定指针位置下的偏移。
 * 纯函数，便于单元测试。
 * @param {{cx: number, cy: number, strength: number}} target 元素中心 + 强度
 * @param {{x: number, y: number, active: boolean}} pointer
 * @returns {{ tx: number, ty: number }} 偏移量（像素）
 */
export function computeMagneticOffset(target, pointer) {
  if (!pointer.active) return { tx: 0, ty: 0 };

  const dx = pointer.x - target.cx;
  const dy = pointer.y - target.cy;
  const dist = Math.hypot(dx, dy);
  if (dist > ACTIVATION_RADIUS) return { tx: 0, ty: 0 };

  const falloff = 1 - dist / ACTIVATION_RADIUS;
  return {
    tx: dx * target.strength * falloff,
    ty: dy * target.strength * falloff,
  };
}

/**
 * 缓存目标的中心点 + 强度。
 * @param {HTMLElement} el
 * @returns {{ el: HTMLElement, cx: number, cy: number, strength: number }}
 */
function measureTarget(el) {
  const rect = el.getBoundingClientRect();
  return {
    el,
    cx: rect.left + rect.width / 2,
    cy: rect.top + rect.height / 2,
    strength: parseFloat(el.dataset.magneticStrength) || DEFAULT_STRENGTH,
  };
}

/**
 * 把偏移量写到元素 CSS 变量上。
 * @param {HTMLElement} el
 * @param {number} tx
 * @param {number} ty
 */
function applyOffset(el, tx, ty) {
  el.style.setProperty("--mag-x", `${tx.toFixed(2)}px`);
  el.style.setProperty("--mag-y", `${ty.toFixed(2)}px`);
}

/**
 * 启动磁吸交互。
 */
export function setupMagneticTargets() {
  const targets = Array.from(document.querySelectorAll("[data-magnetic]"));
  if (!targets.length) return;
  if (shouldSkipMagnetic()) return;

  let pending = false;
  let pointer = { x: -9999, y: -9999, active: false };
  let cache = [];

  const measure = () => {
    cache = targets.map(measureTarget);
  };

  const apply = () => {
    pending = false;
    cache.forEach((item) => {
      const { tx, ty } = computeMagneticOffset(item, pointer);
      applyOffset(item.el, tx, ty);
    });
  };

  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(apply);
  };

  measure();

  window.addEventListener(
    "mousemove",
    (e) => {
      pointer = { x: e.clientX, y: e.clientY, active: true };
      schedule();
    },
    { passive: true }
  );

  document.addEventListener(
    "mouseleave",
    () => {
      pointer = { ...pointer, active: false };
      schedule();
    },
    { passive: true }
  );

  let resizeRaf = null;
  const onResizeOrScroll = () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      measure();
      schedule();
    });
  };
  window.addEventListener("resize", onResizeOrScroll, { passive: true });
  window.addEventListener("scroll", onResizeOrScroll, { passive: true });
}
