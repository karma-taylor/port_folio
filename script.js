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

const setupProjectFocusOverlay = () => {
  const triggers = document.querySelectorAll(".project-trigger");
  const overlay = document.getElementById("focusOverlay");
  const closeButton = document.getElementById("focusClose");
  const focusImage = document.getElementById("focusImage");
  const focusTitle = document.getElementById("focusTitle");
  const focusPromptText = document.getElementById("focusPromptText");
  const focusDesc = document.getElementById("focusDesc");
  const focusLinks = document.getElementById("focusLinks");
  const focusPanel = overlay?.querySelector(".focus-panel");

  if (
    !overlay ||
    !closeButton ||
    !focusImage ||
    !focusTitle ||
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
      const title = trigger.querySelector(".project-name-tag");
      const prompt = card?.querySelector(".project-prompt");
      const desc = card?.querySelector(".project-summary");
      const sourceLinks = card?.querySelectorAll(".project-links a");
      if (!card || !img || !title || !sourceLinks?.length) return;

      focusImage.src = img.src;
      focusImage.alt = img.alt;
      focusTitle.textContent = title.textContent || "";
      focusPromptText.textContent =
        prompt?.textContent?.trim() || "Prompt：突出产品定位与核心使用场景。";
      focusDesc.textContent = desc?.textContent?.trim() || "";
      focusLinks.innerHTML = "";
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

const setupTrueFullscreenHeroStyle = () => {
  const applyState = () => {
    const isFullscreen =
      Boolean(document.fullscreenElement) || Boolean(document.webkitFullscreenElement);
    document.body.classList.toggle("is-true-fullscreen", isFullscreen);
  };

  document.addEventListener("fullscreenchange", applyState);
  document.addEventListener("webkitfullscreenchange", applyState);
  applyState();
};

setupTrueFullscreenHeroStyle();
