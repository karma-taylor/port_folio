/**
 * 启动遮罩 (boot loader)
 *
 * 文档加载后立刻显示一个全屏 #0a0a0a 遮罩，依次显示几行终端文字，
 * 然后平滑淡出，露出真实页面。仅在用户 session 首次访问时执行。
 *
 * sessionStorage key "pf_boot_shown" 由 index.html 顶部的内联脚本预先检查并
 * 给 <html> 加 .boot-skipped 类，避免出现 FOUC。
 */

const SESSION_KEY = "pf_boot_shown";

// 关键时间节点（毫秒）
const STEP_DELAY = 250; // 每行终端文字之间的延迟
const HIDE_AT = 1400; // 开始执行淡出
const REMOVE_AT = 1820; // 完全移除遮罩（含淡出时长）
const FOOTER_REVEAL_PADDING = 60; // 最后一行显示后多久再露出 footer

/**
 * 标记本次 session 已经展示过 boot loader。
 * 异常静默处理（隐私模式 / 关闭 storage 的用户）。
 */
function markBootShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch (_e) {
    /* sessionStorage 不可用，忽略 */
  }
}

/**
 * 依次显示每一行终端文字。
 * @param {NodeListOf<Element>} lines
 * @returns {number} 总展示时长（毫秒）
 */
function animateLines(lines) {
  lines.forEach((line, idx) => {
    setTimeout(() => line.classList.add("is-shown"), idx * STEP_DELAY);
  });
  return lines.length * STEP_DELAY;
}

/**
 * 隐藏遮罩，并在动画结束后移出渲染流。
 * @param {Element} loader
 */
function scheduleHide(loader) {
  setTimeout(() => loader.classList.add("is-hiding"), HIDE_AT);
  setTimeout(() => {
    loader.classList.add("is-gone");
    document.body.classList.remove("boot-active");
  }, REMOVE_AT);
}

/**
 * 立即收起遮罩（用于跳过 / 无内容兜底）。
 * @param {Element} loader
 */
function dismissImmediately(loader) {
  loader.classList.add("is-gone");
}

/**
 * 启动 boot loader 动画。安全幂等，元素不存在时直接返回。
 */
export function runBootLoader() {
  const loader = document.getElementById("bootLoader");
  if (!loader) return;

  const skipped = document.documentElement.classList.contains("boot-skipped");
  if (skipped) {
    dismissImmediately(loader);
    return;
  }

  const lines = loader.querySelectorAll(".boot-loader__lines span");
  if (!lines.length) {
    dismissImmediately(loader);
    return;
  }

  document.body.classList.add("boot-active");
  markBootShown();

  const linesDuration = animateLines(lines);
  setTimeout(
    () => loader.classList.add("has-revealed"),
    linesDuration + FOOTER_REVEAL_PADDING
  );
  scheduleHide(loader);
}
