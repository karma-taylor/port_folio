function getDeckGroups() {
  return [
    document.querySelector(".featured-hero"),
    document.getElementById("coreProjectsGrid"),
    document.getElementById("supportProjectsGrid"),
  ]
    .filter((group) => group instanceof HTMLElement)
    .map((group) => ({
      group,
      trackingArea: group.closest(".projects-group") || group,
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

function getNearestCard(cards, clientX, clientY) {
  let nearestCard = cards[0] || null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = dx * dx + dy * dy;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCard = card;
    }
  });

  return nearestCard;
}

function isWithinTrackingArea(area, clientX, clientY, padding = 140) {
  const rect = area.getBoundingClientRect();
  return (
    clientX >= rect.left - padding &&
    clientX <= rect.right + padding &&
    clientY >= rect.top - padding &&
    clientY <= rect.bottom + padding
  );
}

export function setupProjectDeckMotion() {
  const groups = getDeckGroups();
  if (!groups.length) return;

  groups.forEach(({ group, trackingArea, cards }) => {
    let activeCard = cards[0];
    let rafId = 0;
    let lastPoint = null;

    const applyActive = (nextCard) => {
      if (!nextCard || nextCard === activeCard) return;
      activeCard = nextCard;
      setActiveCard(cards, activeCard);
    };

    const scheduleFromPointer = (clientX, clientY) => {
      lastPoint = { clientX, clientY };
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        if (!lastPoint) return;
        applyActive(getNearestCard(cards, lastPoint.clientX, lastPoint.clientY));
      });
    };

    setActiveCard(cards, activeCard);

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") return;
      if (!isWithinTrackingArea(trackingArea, event.clientX, event.clientY)) return;
      scheduleFromPointer(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);

    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => applyActive(card));
      card.addEventListener("focusin", () => applyActive(card));
    });
  });
}
