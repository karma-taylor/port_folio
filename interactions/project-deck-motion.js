function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(current, target, amount) {
  return current + (target - current) * amount;
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
  const scale = 0.924 + clampedFocus * 0.108;
  const translateY = 20 - clampedFocus * 36;
  const translateZ = -92 + clampedFocus * 184;
  const rotateX = 4.4 - clampedFocus * 4.6;
  const opacity = 0.46 + clampedFocus * 0.54;
  const saturate = 0.64 + clampedFocus * 0.36;
  const brightness = 0.76 + clampedFocus * 0.24;
  const coverScale = 0.988 + clampedFocus * 0.062;

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

function isGroupNearViewport(group, padding = 260) {
  const rect = group.getBoundingClientRect();
  return rect.bottom >= -padding && rect.top <= window.innerHeight + padding;
}

function measureGroupFocus(cards, stateMap) {
  const viewportCenterY = window.innerHeight * 0.5;
  const falloff = Math.max(window.innerHeight * 0.62, 420);

  let bestCard = cards[0] || null;
  let bestFocus = -1;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const centerY = rect.top + rect.height * 0.5;
    const distance = Math.abs(centerY - viewportCenterY);
    const distanceRatio = clamp(distance / falloff, 0, 1);

    let focus = 1 - distanceRatio;
    focus = 1 - Math.pow(1 - focus, 1.85);

    if (card.matches(":hover, :focus-within")) {
      focus = clamp(focus + 0.06, 0, 1);
    }

    const state = stateMap.get(card);
    if (state) state.target = focus;

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

export function setupProjectDeckMotion() {
  const groups = getDeckGroups();
  if (!groups.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) return;

  const stateMap = new Map();
  let rafId = 0;
  let needsMeasure = true;
  let lastFrame = 0;

  groups.forEach(({ cards }) => {
    cards.forEach((card, index) => {
      const initialFocus = index === 0 ? 1 : 0.05;
      stateMap.set(card, { current: initialFocus, target: initialFocus });
      updateCardState(card, initialFocus);
    });
  });

  const measure = () => {
    groups.forEach(({ group, cards }) => {
      if (!isGroupNearViewport(group)) return;
      measureGroupFocus(cards, stateMap);
    });
    needsMeasure = false;
  };

  const tick = (timestamp) => {
    rafId = 0;

    if (!lastFrame) {
      lastFrame = timestamp;
    }

    if (needsMeasure) {
      measure();
    }

    const delta = clamp((timestamp - lastFrame) / 16.667, 0.8, 2.4);
    const ease = 1 - Math.pow(0.12, delta);
    let shouldContinue = false;

    stateMap.forEach((state, card) => {
      state.current = lerp(state.current, state.target, ease);

      if (Math.abs(state.target - state.current) > 0.0015) {
        shouldContinue = true;
      } else {
        state.current = state.target;
      }

      updateCardState(card, state.current);
    });

    lastFrame = timestamp;

    if (shouldContinue || needsMeasure) {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  const schedule = () => {
    needsMeasure = true;
    if (!rafId) {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  groups.forEach(({ cards }) => {
    cards.forEach((card) => {
      card.addEventListener("focusin", schedule);
      card.addEventListener("pointerenter", schedule);
      card.addEventListener("pointerleave", schedule);
    });
  });

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });

  schedule();
}
