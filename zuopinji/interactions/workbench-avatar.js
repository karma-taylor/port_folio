function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function setupWorkbenchAvatar() {
  const trackingArea = document.querySelector(".projects-masthead");
  const desk = document.querySelector(".pm-desk");
  if (!(trackingArea instanceof HTMLElement) || !(desk instanceof HTMLElement)) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  const render = (x, y, rotate) => {
    desk.style.setProperty("--head-track-x", `${x.toFixed(2)}px`);
    desk.style.setProperty("--head-track-y", `${y.toFixed(2)}px`);
    desk.style.setProperty("--head-rotate", `${rotate.toFixed(2)}`);
  };

  const reset = () => render(0, 0, 0);

  trackingArea.addEventListener("pointermove", (event) => {
    const rect = trackingArea.getBoundingClientRect();
    const offsetX = clamp((event.clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.5), -1, 1);
    const offsetY = clamp((event.clientY - (rect.top + rect.height * 0.48)) / (rect.height * 0.5), -1, 1);
    const moveX = offsetX * 10;
    const moveY = offsetY * 4;
    const rotate = offsetX * 5.5;
    render(moveX, moveY, rotate);
  });

  trackingArea.addEventListener("pointerleave", reset);
  window.addEventListener("blur", reset);
}
