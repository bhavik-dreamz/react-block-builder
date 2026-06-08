import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { patchEsmReactRequire } from './scripts/patch-esm-react-require.mjs';

const reactExternals = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-dom/client',
];

function isReactExternal(id) {
  return reactExternals.includes(id) || id.startsWith('react/') || id.startsWith('react-dom/');
}

function isNodeBuiltin(id) {
  return id.startsWith('node:');
}

export default defineConfig({
  plugins: [react(), patchEsmReactRequire()],
  define: {
    'process.env': {},
    'process.env.NODE_ENV': '"production"',
  },
  resolve: {
    dedupe: ['react', 'react-dom', '@wordpress/element'],
    alias: {
      path: 'path-browserify',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        // Default export (package root) — editor graph only
        index: resolve(__dirname, 'src/index.js'),
        editor: resolve(__dirname, 'src/editor.js'),
        // Isolated from editor — no @wordpress/block-editor
        renderer: resolve(__dirname, 'src/renderer.js'),
        bootstrap: resolve(__dirname, 'src/bootstrap.js'),
        vite: resolve(__dirname, 'src/vite-plugin.js'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'mjs' : 'cjs';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      external: (id) => isReactExternal(id) || isNodeBuiltin(id),
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react/jsx-dev-runtime': 'jsxDevRuntime',
          'react-dom/client': 'ReactDOMClient',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
});
