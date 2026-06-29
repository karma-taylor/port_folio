/**
 * 项目详情弹层 (focus overlay)
 *
 * 点击 .project-trigger → 弹出全屏弹层，展示项目封面（带 FLIP 飞入动画）、标题、
 * 结构化正文（克隆自卡片内 .project-focus-export）、上线与 GitHub 链接。
 * Escape / 点背景 / 关闭按钮均可关闭。
 *
 * 状态机：
 *   - is-open       overlay 已展开
 *   - is-animating  FLIP 动画进行中
 *   - menu-ready    动画结束、可交互
 *   - overlay-open  body 上的类，用于锁滚动
 */

import { getSlot } from "../render/dom-helpers.js";

/* -------------------------------------------------------------------------- */
/*  DOM refs                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * 一次性查找弹层用到的所有 DOM 节点。
 * 任何一个缺失就返回 null，表示页面未集成 focus overlay。
 * @returns {object | null}
 */
function queryOverlayRefs() {
  const refs = {
    overlay: document.getElementById("focusOverlay"),
    closeButton: document.getElementById("focusClose"),
    image: document.getElementById("focusImage"),
    title: document.getElementById("focusTitle"),
    focusBodyScroll: document.getElementById("focusBodyScroll"),
    links: document.getElementById("focusLinks"),
  };
  refs.panel = refs.overlay?.querySelector(".focus-panel") || null;

  const required = [
    "overlay",
    "closeButton",
    "image",
    "title",
    "focusBodyScroll",
    "links",
    "panel",
  ];
  for (const k of required) {
    if (!refs[k]) return null;
  }
  return refs;
}

/* -------------------------------------------------------------------------- */
/*  Data extraction                                                           */
/* -------------------------------------------------------------------------- */

/**
 * 从触发它的 .project-trigger 抽出弹层所需数据。
 * @param {Element} trigger
 * @returns {null | { img: HTMLImageElement, title: string, exportClone: HTMLElement, links: NodeListOf<HTMLAnchorElement>, contactClone: HTMLElement | null }}
 */
function extractCardData(trigger) {
  const card = trigger.closest(".project-card");
  const img = trigger.querySelector("img");
  const titleEl = card?.querySelector(".project-title");
  const exportRoot = card ? getSlot(card, "focus-export") : null;
  const links = card?.querySelectorAll(".project-links a");
  const contactRoot = card?.querySelector(".project-contact-cta");

  if (!card || !img || !titleEl || !exportRoot || !links?.length) return null;

  return {
    img,
    title:
      (card.dataset.titleLong && card.dataset.titleLong.trim()) ||
      titleEl.textContent ||
      "",
    exportClone: /** @type {HTMLElement} */ (exportRoot.cloneNode(true)),
    links,
    contactClone: contactRoot ? /** @type {HTMLElement} */ (contactRoot.cloneNode(true)) : null,
  };
}

/* -------------------------------------------------------------------------- */
/*  Fill overlay panel                                                        */
/* -------------------------------------------------------------------------- */

/**
 * 把卡片数据填进弹层 DOM。
 * @param {object} refs
 * @param {ReturnType<typeof extractCardData>} cardData
 */
function fillOverlay(refs, cardData) {
  refs.image.src = cardData.img.src;
  refs.image.alt = cardData.img.alt;
  refs.title.textContent = cardData.title;

  refs.focusBodyScroll.innerHTML = "";
  refs.focusBodyScroll.appendChild(cardData.exportClone);
  if (cardData.contactClone) {
    refs.focusBodyScroll.appendChild(cardData.contactClone);
  }

  refs.links.innerHTML = "";
  cardData.links.forEach((link) => refs.links.appendChild(link.cloneNode(true)));

  refs.overlay
    .querySelectorAll(".focus-stage")
    .forEach((node, index) => node.style.setProperty("--focus-stage-delay", `${index * 70}ms`));
}

/* -------------------------------------------------------------------------- */
/*  Flying image FLIP animation                                               */
/* -------------------------------------------------------------------------- */

/**
 * 把节点定位到指定矩形。
 * @param {HTMLElement} el
 * @param {DOMRect} rect
 */
function placeAt(el, rect) {
  el.style.left = `${rect.left}px`;
  el.style.top = `${rect.top}px`;
  el.style.width = `${rect.width}px`;
  el.style.height = `${rect.height}px`;
}

/**
 * 让源图片"飞"到目标位置，落地后调 onLanded。
 * @param {HTMLImageElement} sourceImg
 * @param {HTMLImageElement} targetImg
 * @param {() => void} onLanded
 */
function flyImageIntoPlace(sourceImg, targetImg, onLanded) {
  const startRect = sourceImg.getBoundingClientRect();
  const endRect = targetImg.getBoundingClientRect();

  const flying = sourceImg.cloneNode(true);
  flying.classList.add("flying-image");
  placeAt(flying, startRect);
  document.body.appendChild(flying);

  targetImg.style.visibility = "hidden";

  // 双 rAF 确保浏览器先完成布局，再触发过渡
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      placeAt(flying, endRect);
    });
  });

  flying.addEventListener(
    "transitionend",
    () => {
      targetImg.style.visibility = "visible";
      flying.remove();
      onLanded();
    },
    { once: true }
  );
}

/* -------------------------------------------------------------------------- */
/*  Open / close                                                              */
/* -------------------------------------------------------------------------- */

/**
 * 打开弹层。
 * @param {object} refs
 * @param {HTMLElement} trigger
 * @param {ReturnType<typeof extractCardData>} cardData
 */
function openOverlay(refs, trigger, cardData) {
  fillOverlay(refs, cardData);

  refs.overlay.classList.add("is-open", "is-animating");
  refs.overlay.classList.remove("is-closing");
  refs.overlay.classList.remove("menu-ready");
  refs.overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-open");
  trigger.setAttribute("aria-expanded", "true");

  flyImageIntoPlace(cardData.img, refs.image, () => {
    refs.overlay.classList.remove("is-animating");
    refs.overlay.classList.add("menu-ready");
  });
}

/**
 * 关闭弹层。
 * @param {object} refs
 * @param {{ trigger: HTMLElement | null }} state
 */
function closeOverlay(refs, state) {
  refs.overlay.classList.add("is-closing");
  refs.overlay.classList.remove("menu-ready", "is-animating");

  window.setTimeout(() => {
    refs.overlay.classList.remove("is-open", "is-closing");
    refs.overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");

    if (state.trigger) {
      state.trigger.setAttribute("aria-expanded", "false");
      state.trigger.focus();
      state.trigger = null;
    }
  }, 260);
}

/* -------------------------------------------------------------------------- */
/*  Wire global handlers                                                      */
/* -------------------------------------------------------------------------- */

/**
 * 绑定关闭按钮、背景、Escape、panel 点击不冒泡。
 * @param {object} refs
 * @param {{ trigger: HTMLElement | null }} state
 */
function bindCloseHandlers(refs, state) {
  const close = () => closeOverlay(refs, state);

  refs.closeButton.addEventListener("click", close);

  refs.overlay.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.hasAttribute("data-close-overlay") || target === refs.overlay) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && refs.overlay.classList.contains("is-open")) {
      close();
    }
  });

  refs.panel.addEventListener("click", (event) => event.stopPropagation());
}

/* -------------------------------------------------------------------------- */
/*  Entry point                                                               */
/* -------------------------------------------------------------------------- */

/**
 * 给所有 .project-trigger 绑定点击打开弹层。
 * 须在卡片渲染完成之后调用。
 */
export function setupProjectFocusOverlay() {
  const refs = queryOverlayRefs();
  if (!refs) return;

  /** @type {{ trigger: HTMLElement | null }} */
  const state = { trigger: null };

  bindCloseHandlers(refs, state);

  document.querySelectorAll(".project-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (refs.overlay.classList.contains("is-open")) return;

      const data = extractCardData(trigger);
      if (!data) return;

      state.trigger = trigger;
      openOverlay(refs, trigger, data);
    });
  });
}
