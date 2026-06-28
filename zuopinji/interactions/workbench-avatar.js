const MAX_ROTATE_X = 8;
const MAX_ROTATE_Y = 10;
const MAX_SHIFT_X = 7;
const MAX_FACE_SHIFT_X = 5;
const MAX_EYE_SHIFT_X = 4;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function setupWorkbenchAvatar() {
  const workbench = document.querySelector("[data-workbench]");
  const trackingArea = document.querySelector(".projects-masthead");
  const head = document.querySelector("[data-workbench-head]");
  if (!(workbench instanceof HTMLElement) || !(head instanceof Element)) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  let frame = 0;
  let rotateX = 0;
  let rotateY = 0;
  let shiftX = 0;
  let faceShiftX = 0;
  let eyeShiftX = 0;

  const render = () => {
    frame = 0;
    head.style.setProperty("--head-rotate-x", `${rotateX.toFixed(2)}deg`);
    head.style.setProperty("--head-rotate-y", `${rotateY.toFixed(2)}deg`);
    head.style.setProperty("--head-shift-x", `${shiftX.toFixed(2)}px`);
    head.style.setProperty("--face-shift-x", `${faceShiftX.toFixed(2)}px`);
    head.style.setProperty("--eye-shift-x", `${eyeShiftX.toFixed(2)}px`);
  };

  const update = (clientX, clientY) => {
    const rect = workbench.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.64;
    const offsetX = clamp((clientX - centerX) / (rect.width / 2), -1, 1);
    const offsetY = clamp((clientY - centerY) / (rect.height / 2), -1, 1);

    rotateY = offsetX * MAX_ROTATE_Y;
    rotateX = offsetY * -MAX_ROTATE_X;
    shiftX = offsetX * MAX_SHIFT_X;
    faceShiftX = offsetX * MAX_FACE_SHIFT_X;
    eyeShiftX = offsetX * MAX_EYE_SHIFT_X;

    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const reset = () => {
    rotateX = 0;
    rotateY = 0;
    shiftX = 0;
    faceShiftX = 0;
    eyeShiftX = 0;
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const area = trackingArea instanceof HTMLElement ? trackingArea : workbench;

  area.addEventListener("pointermove", (event) => update(event.clientX, event.clientY));
  area.addEventListener("pointerleave", reset);
  window.addEventListener("blur", reset);
}
