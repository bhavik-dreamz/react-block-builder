/**
 * Concatenates editor CSS into dist/styles.css (run after vite lib build).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');

const sources = [
  '@wordpress/block-editor/build-style/style.css',
  '@wordpress/block-library/build-style/style.css',
  '@wordpress/block-library/build-style/editor.css',
  '@wordpress/components/build-style/style.css',
  'src/index.css',
];

function readSource(rel) {
  if (rel.startsWith('src/')) {
    return readFileSync(join(root, rel), 'utf8');
  }
  const local = join(root, 'node_modules', rel);
  if (existsSync(local)) {
    return readFileSync(local, 'utf8');
  }
  const hoisted = join(root, '../../node_modules', rel);
  if (existsSync(hoisted)) {
    return readFileSync(hoisted, 'utf8');
  }
  throw new Error(`CSS source not found: ${rel}`);
}

mkdirSync(distDir, { recursive: true });

const css = sources
  .map((rel) => `/* ${rel} */\n${readSource(rel)}`)
  .join('\n\n');

writeFileSync(join(distDir, 'styles.css'), css, 'utf8');
console.log(`Wrote dist/styles.css (${(css.length / 1024).toFixed(1)} KB)`);
