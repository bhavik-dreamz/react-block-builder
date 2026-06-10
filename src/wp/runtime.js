/**
 * Single @wordpress runtime object — editor and gutenberg-block-kit/wp/* must share this.
 */
import * as blocks from '@wordpress/blocks';
import * as blockEditor from '@wordpress/block-editor';
import * as components from '@wordpress/components';
import * as element from '@wordpress/element';
import * as data from '@wordpress/data';
import * as icons from '@wordpress/icons';

/** @type {{ blocks: typeof blocks, blockEditor: typeof blockEditor, components: typeof components, element: typeof element, data: typeof data, icons: typeof icons }} */
let wpRuntime = null;

export function getWpRuntime() {
  if (!wpRuntime) {
    wpRuntime = { blocks, blockEditor, components, element, data, icons };
  }
  return wpRuntime;
}

/** Classic WordPress global — fallback for load-order edge cases. */
export function exposeWpOnWindow() {
  if (typeof window === 'undefined') return;
  const wp = getWpRuntime();
  window.wp = { ...window.wp, ...wp };
}
