import React from 'react';

/** Assign React to window for Gutenberg (no-op in Node/SSR). */
export function ensureReactOnWindow() {
  if (typeof window !== 'undefined') {
    window.React = React;
  }
}

ensureReactOnWindow();
