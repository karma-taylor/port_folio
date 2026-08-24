const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveal = document.querySelectorAll('.reveal, .case-section, .case-pagination');
if (reducedMotion) reveal.forEach((element) => element.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  reveal.forEach((element) => observer.observe(element));
}

const dialog = document.querySelector('.image-dialog');
const dialogImage = dialog?.querySelector('img');
document.querySelectorAll('[data-image-dialog]').forEach((button) => button.addEventListener('click', () => {
  dialogImage.src = button.dataset.imageSrc;
  dialogImage.alt = button.dataset.imageAlt;
  dialog.showModal();
}));
document.querySelector('[data-image-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
