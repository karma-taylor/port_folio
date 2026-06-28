function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function setupWorkbenchAvatar() {
  const trackingArea = document.querySelector(".projects-masthead");
  const desk = document.querySelector(".pm-desk");
  if (!(trackingArea instanceof HTMLElement) || !(desk instanceof HTMLElement)) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  let rafId = 0;
  const current = { yaw: 0, pitch: 0, roll: 0 };
  const target = { yaw: 0, pitch: 0, roll: 0 };

  const render = () => {
    desk.style.setProperty("--head-yaw", `${current.yaw.toFixed(2)}`);
    desk.style.setProperty("--head-pitch", `${current.pitch.toFixed(2)}`);
    desk.style.setProperty("--head-roll", `${current.roll.toFixed(2)}`);
  };

  const tick = () => {
    current.yaw += (target.yaw - current.yaw) * 0.14;
    current.pitch += (target.pitch - current.pitch) * 0.14;
    current.roll += (target.roll - current.roll) * 0.14;

    render();

    const isSettled =
      Math.abs(target.yaw - current.yaw) < 0.02 &&
      Math.abs(target.pitch - current.pitch) < 0.02 &&
      Math.abs(target.roll - current.roll) < 0.02;

    if (isSettled) {
      current.yaw = target.yaw;
      current.pitch = target.pitch;
      current.roll = target.roll;
      render();
      rafId = 0;
      return;
    }

    rafId = window.requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(tick);
  };

  const reset = () => {
    target.yaw = 0;
    target.pitch = 0;
    target.roll = 0;
    schedule();
  };

  trackingArea.addEventListener("pointermove", (event) => {
    const rect = trackingArea.getBoundingClientRect();
    const offsetX = clamp((event.clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.5), -1, 1);
    const offsetY = clamp((event.clientY - (rect.top + rect.height * 0.48)) / (rect.height * 0.5), -1, 1);
    target.yaw = offsetX * 5.4;
    target.pitch = offsetY * -2.2;
    target.roll = offsetX * 3.2;
    schedule();
  });

  trackingArea.addEventListener("pointerleave", reset);
  window.addEventListener("blur", reset);
}
