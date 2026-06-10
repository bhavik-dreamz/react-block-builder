/**
 * Default package entry — editor only (client).
 * For SSR HTML output use `gutenberg-block-kit/renderer`.
 * For styles use `gutenberg-block-kit/styles`.
 */
export {
  BlockEditor,
  App,
  initBlocks,
  registerBlocks,
  getWpRuntime,
  unregisterBlockType,
  EditorProvider,
  useEditor,
  resolveBlockIcon,
} from './editor.js';

export { default } from './editor.js';
