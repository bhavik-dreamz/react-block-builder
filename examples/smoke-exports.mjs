/**
 * Verifies built package exports (run after `pnpm run build:lib`).
 * Editor bundle is client-only — we only inspect entry stubs, not the full chunk.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { BlockRenderer } from '../dist/renderer.mjs';
import { gutenbergBlockKitVite } from '../dist/vite.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function assertExportsInFile(relPath, names) {
  const source = readFileSync(join(root, relPath), 'utf8');
  for (const name of names) {
    if (!source.includes(name)) {
      throw new Error(`Missing export "${name}" in ${relPath}`);
    }
  }
}

const editorExports = ['BlockEditor', 'App', 'initBlocks', 'EditorProvider', 'useEditor', 'default'];
const bootstrapExports = ['ensureReactOnWindow'];
const rendererExports = [
  'BlockRenderer',
  'BLOCK_LIBRARY_STYLES',
  'BLOCK_RENDERER_DEFAULT_CLASS',
  'default',
];
// Root entry is editor-only (renderer is a separate subpath)
const indexExports = [...editorExports];

assertExportsInFile('dist/renderer.mjs', rendererExports);
assertExportsInFile('dist/renderer.cjs', rendererExports);
assertExportsInFile('dist/editor.mjs', editorExports);
assertExportsInFile('dist/editor.cjs', editorExports);
assertExportsInFile('dist/index.mjs', indexExports);
assertExportsInFile('dist/index.cjs', indexExports);
assertExportsInFile('dist/bootstrap.mjs', bootstrapExports);
assertExportsInFile('dist/bootstrap.cjs', bootstrapExports);

readFileSync(join(root, 'dist/styles.css'), 'utf8');

if (typeof BlockRenderer !== 'function') {
  throw new Error('BlockRenderer should be a function');
}

if (typeof gutenbergBlockKitVite !== 'function') {
  throw new Error('gutenbergBlockKitVite should be a function');
}

assertExportsInFile('dist/vite.mjs', ['gutenbergBlockKitVite', 'default']);
assertExportsInFile('dist/vite.cjs', ['gutenbergBlockKitVite', 'exports.default']);

console.log('OK: public exports present');
console.log('  BlockRenderer:', typeof BlockRenderer);
console.log('  editor/index re-exports:', editorExports.join(', '));
console.log('  styles.css: ok');
