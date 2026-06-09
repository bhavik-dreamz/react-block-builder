import React, { useEffect, useState } from 'react';
import { EditorSkeleton } from './EditorSkeleton.jsx';

/**
 * Set React on window for Gutenberg internals. Runs as soon as this (small)
 * chunk loads — before the heavy editor bundle resolves — so we don't need a
 * separate `bootstrap` round-trip. No-op on the server.
 */
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

let editorModulePromise = null;

/**
 * Begin downloading the editor bundle. Memoised, so it's safe to call many
 * times. Call it on user intent — e.g. hovering/focusing a link to your editor
 * route — to warm the cache before the editor mounts:
 *
 *   import { preloadBlockEditor } from 'gutenberg-block-kit/editor-client';
 *   <Link href="/admin/editor" onMouseEnter={() => preloadBlockEditor()} />
 *
 * Returns the module promise (or `null` on the server).
 */
export function preloadBlockEditor() {
  if (typeof window === 'undefined') return null;
  if (!editorModulePromise) {
    editorModulePromise = import('./App.jsx').then((mod) => mod.default);
  }
  return editorModulePromise;
}

/**
 * SSR-safe shell — server-renders a placeholder and loads the BlockEditor only
 * in the browser. Use this in React Router / Remix / Next.js route modules
 * instead of importing `gutenberg-block-kit/editor` at the top level.
 *
 * The default `fallback` is an editor-shaped skeleton; pass your own to
 * override (pass `null` for nothing). Load editor CSS on the client too:
 *   import 'gutenberg-block-kit/styles';
 */
export function ClientBlockEditor({ fallback, ...props }) {
  const [BlockEditor, setBlockEditor] = useState(null);

  // Kick off the download at first client render (before effects run) so the
  // network request starts as early as possible.
  if (typeof window !== 'undefined') {
    preloadBlockEditor();
  }

  useEffect(() => {
    let cancelled = false;
    preloadBlockEditor()?.then((Editor) => {
      if (!cancelled) setBlockEditor(() => Editor);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!BlockEditor) {
    return fallback !== undefined ? fallback : <EditorSkeleton />;
  }

  return <BlockEditor {...props} />;
}

export default ClientBlockEditor;
