/**
 * Proves gutenberg-block-kit/wp/blocks and editor share one wp-runtime chunk
 * (single @wordpress/blocks registry in the browser bundle).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const runtimeChunk = readdirSync(dist).find(
  (name) => name.startsWith('wp-runtime-') && name.endsWith('.mjs'),
);
if (!runtimeChunk) {
  throw new Error('Missing shared wp-runtime chunk in dist/');
}

const wpBlocksSrc = readFileSync(join(dist, 'wp', 'blocks.mjs'), 'utf8');
const editorSrc = readFileSync(join(dist, 'editor.mjs'), 'utf8');
const appSrc = readFileSync(
  join(dist, readdirSync(dist).find((n) => n.startsWith('App-') && n.endsWith('.mjs'))),
  'utf8',
);

function mustImportRuntime(source, label) {
  if (!source.includes(runtimeChunk) && !source.includes('wp-runtime')) {
    throw new Error(`${label} must import the shared wp-runtime chunk (${runtimeChunk})`);
  }
}

mustImportRuntime(wpBlocksSrc, 'wp/blocks.mjs');
mustImportRuntime(editorSrc, 'editor.mjs');
mustImportRuntime(appSrc, 'App chunk');

if (!wpBlocksSrc.includes('unregisterBlockType')) {
  throw new Error('wp/blocks.mjs must export unregisterBlockType');
}
if (!wpBlocksSrc.includes('registerBlockType')) {
  throw new Error('wp/blocks.mjs must export registerBlockType');
}
if (!existsSync(join(dist, 'actions.mjs'))) {
  throw new Error('dist/actions.mjs missing');
}

const actionsSrc = readFileSync(join(dist, 'actions.mjs'), 'utf8');
if (!actionsSrc.includes('ActionBuilder')) {
  throw new Error('actions entry must export ActionBuilder');
}

const editorJsSrc = readFileSync(join(root, 'src', 'editor.js'), 'utf8');
if (!editorJsSrc.includes('registerBlocks')) {
  throw new Error('editor.js must export registerBlocks');
}

console.log('OK: wp-runtime shared between editor and wp/blocks');
console.log(`  chunk: dist/${runtimeChunk}`);
console.log('  unregisterBlockType exported from wp/blocks');
console.log('  registerBlocks exported from editor');
