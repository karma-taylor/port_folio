/**
 * 顶部滚动进度条 (scroll progress)
 *
 * 监听 window scroll，按 (scrollTop / (scrollHeight - clientHeight)) 计算 0-1 进度，
 * 通过 transform: scaleX(progress) 驱动 .scroll-progress__bar。
 *
 * 用 requestAnimationFrame 节流，scroll 监听挂 passive: true。
 */

/**
 * 计算当前滚动进度 [0, 1]。提取为纯函数便于测试。
 * @param {{ scrollTop: number, scrollHeight: number, clientHeight: number }} metrics
 * @returns {number} 0~1 之间的进度
 */
export function computeScrollProgress({ scrollTop, scrollHeight, clientHeight }) {
  const max = scrollHeight - clientHeight;
  if (max <= 0) return 0;
  const raw = scrollTop / max;
  return Math.min(Math.max(raw, 0), 1);
}

/**
 * 绑定滚动进度条到 .scroll-progress__bar。
 * 元素不存在时静默 no-op。
 */
export function setupScrollProgress() {
  const bar = document.querySelector(".scroll-progress__bar");
  if (!bar) return;

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const progress = computeScrollProgress({
      scrollTop: doc.scrollTop,
      scrollHeight: doc.scrollHeight,
      clientHeight: doc.clientHeight,
    });
    bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    ticking = false;
  };

  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  update();
}
