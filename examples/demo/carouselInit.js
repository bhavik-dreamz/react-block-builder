/**
 * Demo-only: wire up saved carousel HTML after BlockRenderer mounts.
 * Not part of the published npm package.
 */
export function initCarousels(root = document) {
  root.querySelectorAll('.myapp-carousel').forEach((carousel) => {
    if (carousel.dataset.initialized === 'true') return;
    carousel.dataset.initialized = 'true';

    const track = carousel.querySelector('.myapp-carousel__track');
    if (!track) return;

    const slides = [...track.querySelectorAll('.myapp-carousel__slide')];
    if (slides.length <= 1) return;

    const dots = [...track.querySelectorAll('.myapp-carousel__dot')];
    const prevBtn = track.querySelector('.myapp-carousel__arrow--prev');
    const nextBtn = track.querySelector('.myapp-carousel__arrow--next');
    let current = 0;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.style.display = active ? 'block' : 'none';
        slide.style.position = active ? 'relative' : 'absolute';
        slide.style.inset = active ? '' : '0';
      });
      dots.forEach((dot, i) => {
        dot.style.width = i === current ? '24px' : '10px';
        dot.style.background = i === current ? '#ffffff' : 'rgba(255,255,255,0.5)';
      });
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  });
}
