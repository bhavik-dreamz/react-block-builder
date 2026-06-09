/**
 * Vite renderChunk hook.
 *
 * Bundled CJS deps (e.g. html-react-parser) call `__require("react")` in the
 * .mjs output, which throws in the browser. We rewrite those calls to a real
 * ESM react binding.
 *
 * IMPORTANT — do NOT reuse an existing binding such as the default `React`
 * import. Some CJS modules redeclare `var React` locally in the same scope,
 * e.g. html-react-parser/lib/dom-to-react.js:
 *
 *     var react_1 = require("react");      // we rewrite the require(...) here
 *     var React = { cloneElement: react_1.cloneElement, ... };  // local shadow
 *
 * If we rewrite the require to the bare name `React`, `var` hoisting makes
 * `react_1` read the local (still-undefined) `React`, so `react_1.cloneElement`
 * throws "Cannot read properties of undefined (reading 'cloneElement')".
 *
 * To stay collision-proof we inject a fresh namespace import with a unique,
 * mangled name and map the require calls to that. This survives a downstream
 * re-bundle (Next.js/webpack/Turbopack, Vite, Remix) too, because the name
 * never clashes with module-internal declarations.
 */

// react entry points that bundled CJS deps may require() at runtime.
const REACT_SPECIFIERS = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
];

function bindingName(spec) {
  return '__esmReact_' + spec.replace(/[^A-Za-z0-9]/g, '_');
}

export function patchEsmReactRequire() {
  return {
    name: 'patch-esm-react-require',
    apply: 'build',
    renderChunk(code, _chunk, outputOptions) {
      const format = outputOptions.format;
      if (format !== 'es' && format !== 'esm') return null;

      const prelude = [];
      let patched = code;

      for (const spec of REACT_SPECIFIERS) {
        const needle = `__require("${spec}")`;
        if (!patched.includes(needle)) continue;
        const local = bindingName(spec);
        prelude.push(`import * as ${local} from "${spec}";`);
        // Plain string replace (split/join) avoids regex escaping of `/`.
        patched = patched.split(needle).join(local);
      }

      if (prelude.length === 0) return null;

      return { code: prelude.join('\n') + '\n' + patched, map: null };
    },
  };
}
