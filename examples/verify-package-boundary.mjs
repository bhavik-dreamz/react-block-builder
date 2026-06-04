/**
 * Ensures published dist/ does not reference demo-only modules.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const forbidden = [
  'supabase',
  'savePage',
  'loadPage',
  'listPages',
  'deletePage',
  'FrontendPage',
  'rbb_pages',
  'supabaseClient',
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path, files);
    } else if (/\.(mjs|cjs|js)$/.test(name)) {
      files.push(path);
    }
  }
  return files;
}

for (const file of walk(dist)) {
  const content = readFileSync(file, 'utf8');
  for (const needle of forbidden) {
    if (content.includes(needle)) {
      throw new Error(`${file} contains demo-only reference: ${needle}`);
    }
  }
}

console.log('OK: dist/ has no demo persistence or Supabase references');
