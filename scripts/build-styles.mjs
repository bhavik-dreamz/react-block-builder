/**
 * Concatenates editor CSS into dist/styles.css (run after vite lib build).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const sources = [
  'node_modules/@wordpress/block-editor/build-style/style.css',
  'node_modules/@wordpress/block-library/build-style/style.css',
  'node_modules/@wordpress/block-library/build-style/editor.css',
  'node_modules/@wordpress/components/build-style/style.css',
  'src/index.css',
];

mkdirSync(distDir, { recursive: true });

const css = sources
  .map((rel) => {
    const path = join(root, rel);
    return `/* ${rel} */\n${readFileSync(path, 'utf8')}`;
  })
  .join('\n\n');

writeFileSync(join(distDir, 'styles.css'), css, 'utf8');
console.log(`Wrote dist/styles.css (${(css.length / 1024).toFixed(1)} KB)`);
