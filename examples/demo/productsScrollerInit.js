/**
 * Demo-only: horizontal products scroller on the frontend.
 */
export function initProductsScroller(root = document) {
  root.querySelectorAll('.myapp-products-scroller').forEach((block) => {
    if (block.dataset.initialized === 'true') return;
    block.dataset.initialized = 'true';

    const track = block.querySelector('.myapp-products-scroller__track');
    const items = track ? [...track.querySelectorAll('.myapp-products-scroller__item')] : [];
    if (items.length <= 1) return;

    const cardWidth = Number(block.dataset.cardWidth || 28);
    const gap = Number(block.dataset.gap || 20);
    const prevBtn = block.querySelector('.myapp-products-scroller__arrow--prev');
    const nextBtn = block.querySelector('.myapp-products-scroller__arrow--next');
    let current = 0;
    const maxIndex = items.length - 1;

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex));
      track.style.transform = `translateX(calc(-${current} * (${cardWidth}% + ${gap}px)))`;
      if (prevBtn) prevBtn.style.opacity = current === 0 ? '0.4' : '1';
      if (nextBtn) nextBtn.style.opacity = current >= maxIndex ? '0.4' : '1';
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    goTo(0);
  });
}
