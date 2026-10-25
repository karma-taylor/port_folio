// Hidden top navigation: hover the「郭」tab (desktop) or tap it (touch) to reveal.
export function setupNav() {
  const wrap = document.getElementById("navwrap");
  const tab = wrap?.querySelector(".bezel__tab");
  if (!wrap || !tab) return () => {};

  const setOpen = (open) => {
    wrap.classList.toggle("is-open", open);
    tab.setAttribute("aria-expanded", String(open));
    tab.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  };

  tab.addEventListener("click", () => setOpen(!wrap.classList.contains("is-open")));
  document.addEventListener("click", (event) => {
    if (wrap.classList.contains("is-open") && !wrap.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  wrap.querySelectorAll(".top a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

  return setOpen;
}
