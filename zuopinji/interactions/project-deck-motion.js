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

function setActiveCard(cards, activeCard) {
  cards.forEach((card) => {
    const isActive = card === activeCard;
    card.classList.toggle("is-deck-active", isActive);
    card.classList.toggle("is-deck-muted", !isActive);
  });
}

function getViewportFocusedCard(cards) {
  const viewportCenterY = window.innerHeight * 0.5;
  let nearestCard = cards[0] || null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const centerY = rect.top + rect.height * 0.5;
    const distance = Math.abs(centerY - viewportCenterY);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCard = card;
    }
  });

  return nearestCard;
}

function isGroupNearViewport(group, padding = 180) {
  const rect = group.getBoundingClientRect();
  return rect.bottom >= -padding && rect.top <= window.innerHeight + padding;
}

export function setupProjectDeckMotion() {
  const groups = getDeckGroups();
  if (!groups.length) return;

  let rafId = 0;

  const applyScrollFocus = () => {
    groups.forEach(({ group, cards }) => {
      if (!isGroupNearViewport(group)) return;
      const nextCard = getViewportFocusedCard(cards);
      if (nextCard) setActiveCard(cards, nextCard);
    });
  };

  const schedule = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      applyScrollFocus();
    });
  };

  groups.forEach(({ cards }) => {
    setActiveCard(cards, cards[0]);
    cards.forEach((card) => {
      card.addEventListener("focusin", () => setActiveCard(cards, card));
    });
  });

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  schedule();
}
