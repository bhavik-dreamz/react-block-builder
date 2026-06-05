import React from 'react';

/**
 * Import this stylesheet in your host app so core block markup is styled:
 *   import '@wordpress/block-library/build-style/style.css';
 */
export const BLOCK_LIBRARY_STYLES =
  '@wordpress/block-library/build-style/style.css';

/** Default wrapper class — matches WordPress `entry-content` / block post content. */
export const BLOCK_RENDERER_DEFAULT_CLASS = 'entry-content wp-block-post-content';

/**
 * SSR-safe renderer for serialized Gutenberg HTML.
 * No block editor, no `initBlocks`, no browser APIs — safe in RSC/Node.
 *
 * @param {object} props
 * @param {string} props.html - Serialized block HTML from `serialize(blocks)` or your API
 * @param {string} [props.className] - Wrapper class names
 * @param {string} [props.id] - Optional wrapper id
 * @param {string|React.ElementType} [props.as] - Wrapper element (default `div`)
 */
export function BlockRenderer({
  html = '',
  className = BLOCK_RENDERER_DEFAULT_CLASS,
  id,
  as: Wrapper = 'div',
}) {
  if (html == null || html === '') {
    return null;
  }

  return (
    <Wrapper
      id={id}
      className={className || undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default BlockRenderer;
