// Notch navigation. Collapsed it shows only the "Vinan" logo.
// Desktop: hovering the notch widens it sideways; clicking the logo goes home.
// Touch: tapping the logo toggles the notch open/closed.
export function setupNav() {
  const wrap = document.getElementById("navwrap");
  const logo = wrap?.querySelector(".logo");
  if (!wrap || !logo) return () => {};
  const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)");

  const setOpen = (open) => {
    wrap.classList.toggle("is-open", open);
    logo.setAttribute("aria-expanded", String(open));
  };

  logo.addEventListener("click", (event) => {
    if (hoverable.matches) {
      setOpen(false);
      return; // follow the link (home)
    }
    event.preventDefault();
    setOpen(!wrap.classList.contains("is-open"));
  });
  document.addEventListener("click", (event) => {
    if (wrap.classList.contains("is-open") && !wrap.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  wrap.querySelectorAll(".notch__side a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

  return setOpen;
}
