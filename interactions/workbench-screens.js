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

  let rafId = 0;
  const current = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const renderParallax = () => {
    workbench.style.setProperty("--hero-parallax-x", current.x.toFixed(4));
    workbench.style.setProperty("--hero-parallax-y", current.y.toFixed(4));
  };

  const tick = () => {
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;
    renderParallax();

    const settled =
      Math.abs(target.x - current.x) < 0.002 &&
      Math.abs(target.y - current.y) < 0.002;

    if (settled) {
      current.x = target.x;
      current.y = target.y;
      renderParallax();
      rafId = 0;
      return;
    }

    rafId = window.requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(tick);
  };

  const resetParallax = () => {
    target.x = 0;
    target.y = 0;
    schedule();
  };

  setActiveScreen(workbench, "");
  renderParallax();

  screens.forEach((screen) => {
    if (!(screen instanceof HTMLElement)) return;
    const key = screen.dataset.workbenchScreen || "";
    screen.addEventListener("pointerenter", () => setActiveScreen(workbench, key));
    screen.addEventListener("focus", () => setActiveScreen(workbench, key));
  });

  workbench.addEventListener("pointermove", (event) => {
    const rect = workbench.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    target.x = Math.max(-1, Math.min(1, x));
    target.y = Math.max(-1, Math.min(1, y));
    schedule();
  });

  workbench.addEventListener("pointerleave", () => {
    resetParallax();
    window.setTimeout(() => setActiveScreen(workbench, ""), 90);
  });

  window.addEventListener("blur", resetParallax);
}
