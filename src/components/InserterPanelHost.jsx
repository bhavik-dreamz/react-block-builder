import { useEffect, useRef } from 'react';

const INSERTER_POPOVER =
  '.components-popover.components-dropdown__content.block-editor-inserter__popover';

function isInserterSidebarPopover(node) {
  return (
    node?.nodeType === 1 &&
    node.classList.contains('components-popover') &&
    node.classList.contains('components-dropdown__content') &&
    node.classList.contains('block-editor-inserter__popover') &&
    !node.classList.contains('is-quick')
  );
}

function getOrCreateBodyFallback() {
  let el = document.body.querySelector(':scope > .components-popover__fallback-container');
  if (!el) {
    el = document.createElement('div');
    el.className = 'components-popover__fallback-container';
    document.body.appendChild(el);
  }
  return el;
}

function isAnyInserterOpen() {
  return document.querySelector('.block-editor-inserter [aria-expanded="true"]') != null;
}

function restoreInserterPopoversToFallback(panel) {
  const fallback = getOrCreateBodyFallback();
  panel.querySelectorAll(INSERTER_POPOVER).forEach((node) => {
    if (!node.classList.contains('is-quick')) {
      fallback.appendChild(node);
    }
  });
}

function relocateInserterPopoversToPanel(panel) {
  const fallback = getOrCreateBodyFallback();
  fallback.querySelectorAll(INSERTER_POPOVER).forEach((node) => {
    if (!node.classList.contains('is-quick')) {
      panel.appendChild(node);
    }
  });
}

/**
 * Docks the block inserter popover in the left panel while open.
 * Restores to the body fallback before close so React can unmount cleanly.
 */
export default function InserterPanelHost() {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const syncAria = () => {
      if (panel.querySelector(INSERTER_POPOVER)) {
        panel.removeAttribute('aria-hidden');
      } else {
        panel.setAttribute('aria-hidden', 'true');
      }
    };

    const relocate = (node) => {
      if (!isInserterSidebarPopover(node) || panel.contains(node)) return;
      if (isAnyInserterOpen()) panel.appendChild(node);
      syncAria();
    };

    const scan = (root) => {
      root?.querySelectorAll?.(INSERTER_POPOVER).forEach((node) => {
        if (!node.classList.contains('is-quick')) relocate(node);
      });
    };

    const reconcile = () => {
      if (isAnyInserterOpen()) {
        relocateInserterPopoversToPanel(panel);
      }
      syncAria();
    };

    // Move popovers back before close so React removeChild succeeds.
    const onBeforeClose = (event) => {
      const target = event.target;
      if (target?.closest?.('.block-editor-block-types-list__item, .block-editor-block-patterns-list__list-item')) {
        restoreInserterPopoversToFallback(panel);
        return;
      }
      if (panel.contains(target)) return;
      restoreInserterPopoversToFallback(panel);
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (isInserterSidebarPopover(node)) relocate(node);
          else if (node.nodeType === 1) scan(node);
        });
      }
      reconcile();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('pointerdown', onBeforeClose, true);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') restoreInserterPopoversToFallback(panel);
    }, true);

    scan(document.body);
    reconcile();

    return () => {
      observer.disconnect();
      document.removeEventListener('pointerdown', onBeforeClose, true);
      restoreInserterPopoversToFallback(panel);
    };
  }, []);

  return <div ref={panelRef} className="gbk-inserter-panel" aria-hidden="true" />;
}
