/**
 * Client-only editor entry — do not import in Server Components or Node SSR.
 * Includes bootstrap side effects. Import styles separately:
 *   import 'react-block-builder/styles'
 *
 * For SSR HTML use `react-block-builder/renderer`.
 *
 * Custom blocks: pass `blockRegistry` or `customBlocksConfig` to BlockEditor,
 * or call `initBlocks(blocks, { customBlocksConfig })` before mount.
 */
import './bootstrap.js';

export { default as BlockEditor } from './App.jsx';
/** @deprecated Use BlockEditor — same component */
export { default as App } from './App.jsx';
export { default } from './App.jsx';

export { initBlocks } from './registerBlocks.jsx';
export { EditorProvider, useEditor } from './context/EditorContext.jsx';
export { EDITOR_SETTINGS, mergeEditorSettings } from './config/editorSettings.js';
export {
  createMediaUploadHandler,
  applyMediaToSettings,
  normalizeMediaItem,
} from './media/index.js';
