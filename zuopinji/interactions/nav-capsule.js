function shouldUseCompactNav() {
  return window.matchMedia("(max-width: 860px)").matches || window.matchMedia("(hover: none)").matches;
}

export function setupNavCapsule() {
  const topbar = document.querySelector("[data-nav-capsule]");
  const pill = document.querySelector("[data-nav-pill]");
  if (!(topbar instanceof HTMLElement) || !(pill instanceof HTMLElement)) return;

  let collapseTimer = 0;

  const clearTimer = () => {
    if (collapseTimer) {
      window.clearTimeout(collapseTimer);
      collapseTimer = 0;
    }
  };

  const expand = () => {
    clearTimer();
    if (shouldUseCompactNav()) {
      topbar.dataset.navExpanded = "mobile";
      return;
    }
    topbar.dataset.navExpanded = "true";
  };

  const collapse = () => {
    clearTimer();
    if (shouldUseCompactNav()) {
      topbar.dataset.navExpanded = "mobile";
      return;
    }
    collapseTimer = window.setTimeout(() => {
      delete topbar.dataset.navExpanded;
      collapseTimer = 0;
    }, 120);
  };

  const syncMode = () => {
    clearTimer();
    if (shouldUseCompactNav()) {
      topbar.dataset.navExpanded = "mobile";
    } else if (!pill.matches(":hover") && !pill.matches(":focus-within")) {
      delete topbar.dataset.navExpanded;
    }
  };

  topbar.addEventListener("pointerenter", expand);
  topbar.addEventListener("pointerleave", collapse);
  pill.addEventListener("focusin", expand);
  pill.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      if (!pill.matches(":focus-within")) collapse();
    });
  });
  window.addEventListener("resize", syncMode, { passive: true });

  syncMode();
}
