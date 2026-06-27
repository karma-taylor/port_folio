function getDeckCards() {
  return [
    ...document.querySelectorAll(".featured-hero .project-card, #coreProjectsGrid .project-card"),
  ].filter((card) => card instanceof HTMLElement);
}

function setActiveCard(cards, activeCard) {
  cards.forEach((card) => {
    const isActive = card === activeCard;
    card.classList.toggle("is-deck-active", isActive);
    card.classList.toggle("is-deck-muted", !isActive);
  });
}

export function setupProjectDeckMotion() {
  const cards = getDeckCards();
  if (!cards.length) return;

  setActiveCard(cards, cards[0]);

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => setActiveCard(cards, card));
    card.addEventListener("focusin", () => setActiveCard(cards, card));
  });
}
