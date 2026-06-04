/**
 * Ensures the renderer entry does not pull @wordpress/block-editor into its graph.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const forbidden = [
  '@wordpress/block-editor',
  'block-editor/build-style',
  'editor-B', // hashed editor chunks from prior builds
  '/editor-',
];

function collectRendererFiles() {
  return readdirSync(dist).filter(
    (name) =>
      name.startsWith('renderer') &&
      (name.endsWith('.mjs') || name.endsWith('.js') || name.endsWith('.cjs')),
  );
}

function readImportedChunks(entrySource) {
  const imports = [];
  const re = /from\s+["'](\.\/[^"']+)["']/g;
  let m;
  while ((m = re.exec(entrySource))) {
    imports.push(m[1].replace(/^\.\//, ''));
  }
  return imports;
}

const entryFiles = ['renderer.mjs', 'renderer.cjs'];
for (const entry of entryFiles) {
  const entryPath = join(dist, entry);
  const source = readFileSync(entryPath, 'utf8');

  for (const needle of forbidden) {
    if (source.includes(needle) && needle !== '/editor-') {
      throw new Error(`${entry} must not reference ${needle}`);
    }
  }

  for (const chunk of readImportedChunks(source)) {
    const chunkPath = join(dist, chunk);
    const chunkSource = readFileSync(chunkPath, 'utf8');
    if (
      chunkSource.includes('@wordpress/block-editor') ||
      chunkSource.includes('registerCoreBlocks') ||
      chunkSource.includes('BlockEditorProvider')
    ) {
      throw new Error(`Renderer chunk ${chunk} includes editor-only code`);
    }
  }
}

for (const file of collectRendererFiles()) {
  const content = readFileSync(join(dist, file), 'utf8');
  if (content.includes('@wordpress/block-editor')) {
    throw new Error(`${file} contains @wordpress/block-editor`);
  }
}

const stylesPath = join(dist, 'styles.css');
readFileSync(stylesPath, 'utf8');

console.log('OK: renderer bundle is isolated from block-editor');
console.log('  renderer files:', collectRendererFiles().join(', '));
console.log('  styles.css present');
