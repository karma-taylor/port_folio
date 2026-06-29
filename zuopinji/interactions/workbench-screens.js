function setActiveScreen(workbench, activeKey) {
  const screens = [...workbench.querySelectorAll("[data-workbench-screen]")];
  if (activeKey) {
    workbench.dataset.activeScreen = activeKey;
  } else {
    delete workbench.dataset.activeScreen;
  }
  screens.forEach((screen) => {
    const isActive = screen.dataset.workbenchScreen === activeKey;
    screen.classList.toggle("is-active", isActive);
  });
}

export function setupWorkbenchScreens() {
  const workbench = document.querySelector("[data-workbench]");
  if (!(workbench instanceof HTMLElement)) return;

  const screens = [...workbench.querySelectorAll("[data-workbench-screen]")];
  if (!screens.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  setActiveScreen(workbench, "");

  screens.forEach((screen) => {
    if (!(screen instanceof HTMLElement)) return;
    const key = screen.dataset.workbenchScreen || "";
    screen.addEventListener("pointerenter", () => setActiveScreen(workbench, key));
    screen.addEventListener("focus", () => setActiveScreen(workbench, key));
  });

  workbench.addEventListener("pointerleave", () => {
    window.setTimeout(() => setActiveScreen(workbench, ""), 90);
  });
}
