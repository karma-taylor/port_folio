function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function setupWorkbenchAvatar() {
  const trackingArea = document.querySelector(".projects-masthead");
  const desk = document.querySelector(".pm-desk");
  if (!(trackingArea instanceof HTMLElement) || !(desk instanceof HTMLElement)) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  const render = (yaw, pitch) => {
    desk.style.setProperty("--head-yaw", `${yaw.toFixed(2)}`);
    desk.style.setProperty("--head-pitch", `${pitch.toFixed(2)}`);
  };

  const reset = () => render(0, 0);

  trackingArea.addEventListener("pointermove", (event) => {
    const rect = trackingArea.getBoundingClientRect();
    const offsetX = clamp((event.clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.5), -1, 1);
    const offsetY = clamp((event.clientY - (rect.top + rect.height * 0.48)) / (rect.height * 0.5), -1, 1);
    const yaw = offsetX * 7;
    const pitch = offsetY * -2.4;
    render(yaw, pitch);
  });

  trackingArea.addEventListener("pointerleave", reset);
  window.addEventListener("blur", reset);
}
