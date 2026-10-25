import { setupNav } from './nav.js?v=20261025-eng3';

setupNav();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveal = document.querySelectorAll('.reveal, .case-section, .case-contact, .case-pagination');
if (reducedMotion) reveal.forEach((element) => element.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  reveal.forEach((element) => observer.observe(element));
}

const dialog = document.querySelector('.image-dialog');
const dialogImage = dialog?.querySelector('img');
let dialogTrigger;
document.querySelectorAll('[data-image-dialog]').forEach((button) => button.addEventListener('click', () => {
  dialogTrigger = button;
  dialogImage.src = button.dataset.imageSrc;
  dialogImage.alt = button.dataset.imageAlt;
  dialog.showModal();
}));
const closeDialog = () => {
  dialog?.close();
  dialogTrigger?.focus();
};
document.querySelector('[data-image-close]')?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
dialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});
const qrPopovers = document.querySelectorAll('.qr-pop');
document.addEventListener('click', (event) => {
  qrPopovers.forEach((popover) => {
    if (popover.open && !popover.contains(event.target)) popover.open = false;
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (dialog?.open) closeDialog();
  qrPopovers.forEach((popover) => { popover.open = false; });
});
