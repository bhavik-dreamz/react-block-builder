/**
 * Renders BlockRenderer with react-dom/server (SSR smoke test).
 */
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import {
  BlockRenderer,
  BLOCK_LIBRARY_STYLES,
  BLOCK_RENDERER_DEFAULT_CLASS,
} from '../dist/renderer.mjs';

const sample =
  '<!-- wp:paragraph --><p class="wp-block-paragraph">Hello SSR</p><!-- /wp:paragraph -->';

const markup = renderToStaticMarkup(
  React.createElement(BlockRenderer, { html: sample }),
);

if (!markup.includes('Hello SSR') || !markup.includes('wp-block-paragraph')) {
  throw new Error('SSR markup missing expected block HTML');
}

if (!markup.includes(BLOCK_RENDERER_DEFAULT_CLASS.split(' ')[0])) {
  throw new Error('SSR markup missing default entry-content class');
}

if (BLOCK_LIBRARY_STYLES !== '@wordpress/block-library/build-style/style.css') {
  throw new Error('BLOCK_LIBRARY_STYLES constant mismatch');
}

const empty = renderToStaticMarkup(React.createElement(BlockRenderer, { html: '' }));
if (empty !== '') {
  throw new Error('Empty html should render nothing');
}

console.log('OK: BlockRenderer SSR renderToStaticMarkup');
console.log('  sample:', markup.slice(0, 80) + '...');
