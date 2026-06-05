/**
 * Demo-only: horizontal client stories slider on the frontend.
 */
export function initClientStories(root = document) {
  root.querySelectorAll('.myapp-client-stories').forEach((block) => {
    if (block.dataset.initialized === 'true') return;
    block.dataset.initialized = 'true';

    const track = block.querySelector('.myapp-client-stories__track');
    const cards = track ? [...track.querySelectorAll('.myapp-client-stories__card-wrap')] : [];
    if (cards.length <= 1) return;

    const cardWidth = Number(block.dataset.cardWidth || 78);
    const gap = Number(block.dataset.gap || 20);
    const prevBtn = block.querySelector('.myapp-client-stories__arrow--prev');
    const nextBtn = block.querySelector('.myapp-client-stories__arrow--next');
    let current = 0;

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(calc(-${current} * (${cardWidth}% + ${gap}px)))`;
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
  });
}
