/**
 * Regression guard for the html-react-parser "cloneElement of undefined" bug.
 *
 * Bundled CJS deps call `require("react")`. In ESM output that becomes
 * `__require("react")`, which throws in the browser, so the
 * `patch-esm-react-require` plugin rewrites those calls to a real react import.
 *
 * The plugin MUST NOT rewrite them to a bare `React` binding: html-react-parser
 * (lib/dom-to-react.js) redeclares `var React = {...}` in the same function
 * scope, and `var` hoisting then makes the rewritten `var react_1 = React`
 * read the local (undefined) shadow — producing at runtime:
 *
 *     Cannot read properties of undefined (reading 'cloneElement')
 *
 * This check fails the build if that collision pattern is present in any ESM
 * chunk, and asserts the collision-proof `__esmReact_*` namespace import is used.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const esmChunks = readdirSync(dist).filter((name) => name.endsWith('.mjs'));

// The exact shadow-collision signature: `var react_1 = React` immediately
// before a local `var React = { cloneElement: ... }`.
const collisionRe = /var\s+react_1\s*=\s*React\s*;[\s\S]{0,200}?var\s+React\s*=\s*\{[\s\S]{0,120}?cloneElement/;

let sawHtmlReactParser = false;

for (const name of esmChunks) {
  const src = readFileSync(join(dist, name), 'utf8');

  if (src.includes('html-react-parser')) {
    sawHtmlReactParser = true;
  }

  if (collisionRe.test(src)) {
    throw new Error(
      `${name}: html-react-parser react binding collides with a local "var React" ` +
        `shadow — this is the "cloneElement of undefined" runtime bug. ` +
        `Check scripts/patch-esm-react-require.mjs.`,
    );
  }

  // Bare __require("react") must never survive into ESM output.
  if (src.includes('__require("react")')) {
    throw new Error(`${name}: contains unpatched __require("react") (throws in the browser).`);
  }
}

if (!sawHtmlReactParser) {
  throw new Error(
    'No ESM chunk references html-react-parser — build output looks wrong; ' +
      'cannot verify the react-binding fix.',
  );
}

console.log('OK: react binding is collision-proof (no html-react-parser cloneElement shadow)');
console.log(`  scanned ${esmChunks.length} ESM chunk(s)`);
