import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

function getPackageRoot() {
  return dirname(require.resolve('gutenberg-block-kit/package.json'));
}

function resolveFromKit(id) {
  try {
    return require.resolve(id, { paths: [getPackageRoot()] });
  } catch {
    return null;
  }
}

/**
 * Vite plugin for consumer apps using gutenberg-block-kit.
 * Resolves @wordpress/* from this package's dependencies (npm/pnpm nested installs)
 * and avoids broken optimizeDeps pre-bundling when WordPress isn't at the app root.
 *
 * @example
 * // vite.config.js
 * import { defineConfig } from 'vite';
 * import react from '@vitejs/plugin-react';
 * import { gutenbergBlockKitVite } from 'gutenberg-block-kit/vite';
 *
 * export default defineConfig({
 *   plugins: [react(), gutenbergBlockKitVite()],
 * });
 */
export function gutenbergBlockKitVite() {
  return {
    name: 'gutenberg-block-kit-vite',
    config() {
      return {
        resolve: {
          dedupe: ['react', 'react-dom', '@wordpress/element'],
        },
        optimizeDeps: {
          // Pre-bundling the editor duplicates React → cloneElement / hook errors.
          exclude: [
            'gutenberg-block-kit',
            'gutenberg-block-kit/editor',
            'gutenberg-block-kit/editor-client',
            'gutenberg-block-kit/wp',
            'gutenberg-block-kit/wp/blocks',
            'gutenberg-block-kit/wp/block-editor',
            'gutenberg-block-kit/wp/components',
            'gutenberg-block-kit/wp/element',
            'gutenberg-block-kit/wp/data',
            'gutenberg-block-kit/wp/icons',
            'gutenberg-block-kit/actions',
          ],
        },
        ssr: {
          external: ['gutenberg-block-kit', 'gutenberg-block-kit/editor'],
        },
      };
    },
    resolveId(source) {
      if (source.startsWith('gutenberg-block-kit/wp')) {
        const sub = source.replace('gutenberg-block-kit/', '');
        return resolveFromKit(`gutenberg-block-kit/${sub}`) || resolveFromKit(source);
      }
      if (source === 'gutenberg-block-kit/actions') {
        return resolveFromKit('gutenberg-block-kit/actions');
      }
      if (!source.startsWith('@wordpress/')) {
        return null;
      }
      return resolveFromKit(source);
    },
  };
}

export default gutenbergBlockKitVite;
