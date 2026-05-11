const revealCards = () => {
  const cards = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));
};

revealCards();

const setupHoverOverlays = () => {
  document.querySelectorAll(".project-card").forEach((card) => {
    const target = card.querySelector(".project-hover-overlay .hover-tech");
    const source = card.querySelector(".project-meta .project-tech");
    if (!target || !source) return;
    target.innerHTML = "";
    source.querySelectorAll("li").forEach((li) => {
      target.appendChild(li.cloneNode(true));
    });
  });
};

setupHoverOverlays();

const setupProjectFocusOverlay = () => {
  const triggers = document.querySelectorAll(".project-trigger");
  const overlay = document.getElementById("focusOverlay");
  const closeButton = document.getElementById("focusClose");
  const focusImage = document.getElementById("focusImage");
  const focusTitle = document.getElementById("focusTitle");
  const focusPromptCard = document.getElementById("focusPromptCard");
  const focusPromptText = document.getElementById("focusPromptText");
  const focusDesc = document.getElementById("focusDesc");
  const focusLinks = document.getElementById("focusLinks");
  const focusPanel = overlay?.querySelector(".focus-panel");

  if (
    !overlay ||
    !closeButton ||
    !focusImage ||
    !focusTitle ||
    !focusPromptCard ||
    !focusPromptText ||
    !focusDesc ||
    !focusLinks ||
    !focusPanel
  ) {
    return;
  }

  let activeTrigger = null;

  const closeOverlay = () => {
    overlay.classList.remove("is-open");
    overlay.classList.remove("is-animating");
    overlay.classList.remove("menu-ready");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
    focusPromptCard.classList.remove("is-open");
    focusPromptCard.setAttribute("aria-hidden", "true");
    if (activeTrigger) {
      activeTrigger.setAttribute("aria-expanded", "false");
      activeTrigger.focus();
      activeTrigger = null;
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (overlay.classList.contains("is-open")) return;

      const card = trigger.closest(".project-card");
      const img = trigger.querySelector("img");
      const title = card?.querySelector(".project-title");
      const prompt = card?.querySelector(".project-prompt");
      const desc = card?.querySelector(".project-summary");
      const sourceLinks = card?.querySelectorAll(".project-links a");
      if (!card || !img || !title || !sourceLinks?.length) return;

      focusImage.src = img.src;
      focusImage.alt = img.alt;
      focusTitle.textContent = title.textContent || "";
      focusPromptText.textContent =
        prompt?.textContent?.trim() || "Prompt：突出产品定位与核心使用场景。";
      focusPromptCard.classList.remove("is-open");
      focusPromptCard.setAttribute("aria-hidden", "true");
      focusDesc.textContent = desc?.textContent?.trim() || "";
      focusLinks.innerHTML = "";

      const promptButton = document.createElement("button");
      promptButton.type = "button";
      promptButton.className = "focus-menu-btn";
      promptButton.setAttribute("aria-expanded", "false");
      promptButton.innerHTML = `
        <span class="prompt-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M11.24 2.54a.8.8 0 0 1 1.52 0l1.01 3.31a2.6 2.6 0 0 0 1.73 1.73l3.31 1.01a.8.8 0 0 1 0 1.52l-3.31 1.01a2.6 2.6 0 0 0-1.73 1.73l-1.01 3.31a.8.8 0 0 1-1.52 0l-1.01-3.31A2.6 2.6 0 0 0 8.5 11.12L5.2 10.11a.8.8 0 0 1 0-1.52L8.5 7.58a2.6 2.6 0 0 0 1.73-1.73l1.01-3.31Zm8.07 12.18a.8.8 0 0 1 .76.57l.45 1.47a1.3 1.3 0 0 0 .86.86l1.47.45a.8.8 0 0 1 0 1.52l-1.47.45a1.3 1.3 0 0 0-.86.86l-.45 1.47a.8.8 0 0 1-1.52 0l-.45-1.47a1.3 1.3 0 0 0-.86-.86l-1.47-.45a.8.8 0 0 1 0-1.52l1.47-.45a1.3 1.3 0 0 0 .86-.86l.45-1.47a.8.8 0 0 1 .76-.57Z"></path>
          </svg>
        </span>
        Prompt
      `;
      promptButton.addEventListener("click", () => {
        const shouldOpen = !focusPromptCard.classList.contains("is-open");
        if (shouldOpen) {
          focusPromptCard.classList.add("is-open");
          focusPromptCard.setAttribute("aria-hidden", "false");
          promptButton.setAttribute("aria-expanded", "true");
          promptButton.classList.add("is-active");
        } else {
          focusPromptCard.classList.remove("is-open");
          focusPromptCard.setAttribute("aria-hidden", "true");
          promptButton.setAttribute("aria-expanded", "false");
          promptButton.classList.remove("is-active");
        }
      });
      focusLinks.appendChild(promptButton);

      sourceLinks.forEach((link) => {
        focusLinks.appendChild(link.cloneNode(true));
      });

      overlay.classList.add("is-open");
      overlay.classList.add("is-animating");
      overlay.classList.remove("menu-ready");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("overlay-open");
      trigger.setAttribute("aria-expanded", "true");
      activeTrigger = trigger;

      const startRect = img.getBoundingClientRect();
      const endRect = focusImage.getBoundingClientRect();
      const flyingImage = img.cloneNode(true);
      flyingImage.classList.add("flying-image");
      flyingImage.style.left = `${startRect.left}px`;
      flyingImage.style.top = `${startRect.top}px`;
      flyingImage.style.width = `${startRect.width}px`;
      flyingImage.style.height = `${startRect.height}px`;
      document.body.appendChild(flyingImage);

      focusImage.style.visibility = "hidden";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flyingImage.style.left = `${endRect.left}px`;
          flyingImage.style.top = `${endRect.top}px`;
          flyingImage.style.width = `${endRect.width}px`;
          flyingImage.style.height = `${endRect.height}px`;
        });
      });

      flyingImage.addEventListener(
        "transitionend",
        () => {
          focusImage.style.visibility = "visible";
          flyingImage.remove();
          overlay.classList.remove("is-animating");
          overlay.classList.add("menu-ready");
        },
        { once: true }
      );
    });
  });

  closeButton.addEventListener("click", closeOverlay);

  overlay.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.hasAttribute("data-close-overlay") || target === overlay) {
      closeOverlay();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeOverlay();
    }
  });

  // Avoid clicks inside panel bubbling to backdrop close logic.
  focusPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });
};

setupProjectFocusOverlay();
