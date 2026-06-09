/**
 * Client-only editor loader — safe to import in SSR route modules.
 * For public pages use `gutenberg-block-kit/renderer`.
 */
export {
  ClientBlockEditor,
  preloadBlockEditor,
  default,
} from './editor-client.jsx';
export { EditorSkeleton } from './EditorSkeleton.jsx';
