import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const repoRoot = __dirname;
// `pnpm run build:demo` uses dist/; `pnpm run dev` uses src/
const useDist = process.env.npm_lifecycle_event === 'build:demo';

function pkgAlias(subpath, srcFile) {
  if (useDist) {
    const map = {
      editor: 'editor.mjs',
      renderer: 'renderer.mjs',
      bootstrap: 'bootstrap.mjs',
      styles: 'styles.css',
      index: 'editor.mjs',
    };
    return resolve(repoRoot, 'dist', map[subpath]);
  }
  return resolve(repoRoot, 'src', srcFile);
}

export default defineConfig({
  root: resolve(repoRoot, 'examples/demo'),
  envDir: repoRoot,
  plugins: [react()],
  build: {
    outDir: resolve(repoRoot, 'dist-demo'),
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom', '@wordpress/element'],
    // More specific aliases first (avoid gutenberg-block-kit → …/editor resolution)
    alias: [
      { find: 'gutenberg-block-kit/editor', replacement: pkgAlias('editor', 'editor.js') },
      { find: 'gutenberg-block-kit/renderer', replacement: pkgAlias('renderer', 'renderer.js') },
      { find: 'gutenberg-block-kit/bootstrap', replacement: pkgAlias('bootstrap', 'bootstrap.js') },
      { find: 'gutenberg-block-kit/styles', replacement: pkgAlias('styles', 'styles.js') },
      { find: 'gutenberg-block-kit', replacement: pkgAlias('index', 'index.js') },
      { find: 'path', replacement: 'path-browserify' },
    ],
  },
  define: {
    'process.env': {},
    'process.env.NODE_ENV': '"development"',
  },
  optimizeDeps: {
    include: [
      '@wordpress/block-editor',
      '@wordpress/blocks',
      '@wordpress/components',
      '@wordpress/block-library',
      '@wordpress/data',
      '@wordpress/element',
      '@wordpress/rich-text',
      'path-browserify',
    ],
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
