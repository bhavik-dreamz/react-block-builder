/**
 * Vite renderChunk hook: bundled CJS deps call __require("react") in .mjs output,
 * which throws in the browser. Map those calls to the chunk's existing react import.
 */
export function patchEsmReactRequire() {
  return {
    name: 'patch-esm-react-require',
    apply: 'build',
    renderChunk(code, _chunk, outputOptions) {
      const format = outputOptions.format;
      if (format !== 'es' && format !== 'esm') return null;
      if (!code.includes('__require("react")')) return null;

      const nsImport = code.match(/^import \* as (\w+) from "react";/m);
      const defaultImport = code.match(/^import (\w+), \{[\s\S]*?\} from "react";/m);
      const reactBinding = nsImport?.[1] || defaultImport?.[1];

      if (!reactBinding) {
        return null;
      }

      const patched = code.replace(/__require\("react"\)/g, reactBinding);

      if (patched.length < code.length * 0.5) {
        return null;
      }

      return { code: patched, map: null };
    },
  };
}
