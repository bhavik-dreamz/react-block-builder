import { useEffect, useState } from 'react';

/**
 * SSR-safe shell — loads BlockEditor only in the browser (dynamic import).
 * Use this in React Router / Remix SSR routes instead of importing
 * `gutenberg-block-kit/editor` at the top level.
 *
 * Load editor CSS on the client too:
 *   useEffect(() => { import('gutenberg-block-kit/styles'); }, []);
 */
export function ClientBlockEditor({ fallback = null, ...props }) {
  const [BlockEditor, setBlockEditor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    import('./App.jsx').then((mod) => {
      if (!cancelled) {
        setBlockEditor(() => mod.default);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!BlockEditor) {
    return fallback;
  }

  return <BlockEditor {...props} />;
}

export default ClientBlockEditor;
