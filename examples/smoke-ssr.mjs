/**
 * Ensures SSR-safe modules do not throw when evaluated in Node.
 */
import { ensureReactOnWindow } from '../dist/bootstrap.mjs';
import { BlockRenderer } from '../dist/renderer.mjs';

ensureReactOnWindow();

if (typeof BlockRenderer !== 'function') {
  throw new Error('BlockRenderer failed to load in Node');
}

console.log('OK: bootstrap.js and renderer load in Node without window errors');
