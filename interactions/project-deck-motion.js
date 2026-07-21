function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDeckGroups() {
  return [
    document.querySelector(".featured-hero"),
    document.getElementById("coreProjectsGrid"),
    document.getElementById("supportProjectsGrid"),
  ]
    .filter((group) => group instanceof HTMLElement)
    .map((group) => ({
      group,
      cards: [...group.querySelectorAll(".project-card")].filter(
        (card) => card instanceof HTMLElement
      ),
    }))
    .filter(({ cards }) => cards.length > 0);
}

function updateCardState(card, focus) {
  const clampedFocus = clamp(focus, 0, 1);
  const scale = 0.92 + clampedFocus * 0.112;
  const translateY = 18 - clampedFocus * 34;
  const translateZ = -88 + clampedFocus * 176;
  const rotateX = 4 - clampedFocus * 4.2;
  const opacity = 0.5 + clampedFocus * 0.5;
  const saturate = 0.66 + clampedFocus * 0.34;
  const brightness = 0.78 + clampedFocus * 0.22;
  const coverScale = 0.992 + clampedFocus * 0.055;

  card.style.setProperty("--deck-focus", clampedFocus.toFixed(4));
  card.style.setProperty("--deck-scale", scale.toFixed(4));
  card.style.setProperty("--deck-translate-y", `${translateY.toFixed(2)}px`);
  card.style.setProperty("--deck-translate-z", `${translateZ.toFixed(2)}px`);
  card.style.setProperty("--deck-rotate-x", `${rotateX.toFixed(2)}deg`);
  card.style.setProperty("--deck-opacity", opacity.toFixed(4));
  card.style.setProperty("--deck-saturate", saturate.toFixed(4));
  card.style.setProperty("--deck-brightness", brightness.toFixed(4));
  card.style.setProperty("--deck-cover-scale", coverScale.toFixed(4));
}

function applyGroupFocus(cards) {
  const viewportCenterY = window.innerHeight * 0.5;
  const falloff = Math.max(window.innerHeight * 0.58, 360);

  let bestCard = cards[0] || null;
  let bestFocus = -1;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const centerY = rect.top + rect.height * 0.5;
    const distance = Math.abs(centerY - viewportCenterY);
    const distanceRatio = clamp(distance / falloff, 0, 1);
    let focus = 1 - distanceRatio;
    focus = 1 - Math.pow(1 - focus, 1.55);

    if (card.matches(":hover, :focus-within")) {
      focus = clamp(focus + 0.08, 0, 1);
    }

    updateCardState(card, focus);

    if (focus > bestFocus) {
      bestFocus = focus;
      bestCard = card;
    }
  });

  cards.forEach((card) => {
    const isActive = card === bestCard;
    card.classList.toggle("is-deck-active", isActive);
    card.classList.toggle("is-deck-muted", !isActive);
  });
}

function isGroupNearViewport(group, padding = 220) {
  const rect = group.getBoundingClientRect();
  return rect.bottom >= -padding && rect.top <= window.innerHeight + padding;
}

export function setupProjectDeckMotion() {
  const groups = getDeckGroups();
  if (!groups.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  let rafId = 0;

  const apply = () => {
    groups.forEach(({ group, cards }) => {
      if (!isGroupNearViewport(group)) return;
      applyGroupFocus(cards);
    });
  };

  const schedule = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      apply();
    });
  };

  groups.forEach(({ cards }) => {
    cards.forEach((card) => {
      updateCardState(card, card === cards[0] ? 1 : 0.06);
      card.addEventListener("focusin", schedule);
      card.addEventListener("pointerenter", schedule);
    });
  });

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  schedule();
}
