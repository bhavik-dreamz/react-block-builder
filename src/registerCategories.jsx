import { getCategories, setCategories } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

export const MYAPP_BLOCKS_CATEGORY_SLUG = 'myapp-blocks';

export const myappBlocksCategory = {
  slug: MYAPP_BLOCKS_CATEGORY_SLUG,
  title: 'My Custom Blocks',
  icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
    </svg>
  ),
};

/** Keep "My Custom Blocks" first in the inserter sidebar (deduped). */
export function ensureCustomCategoryFirst() {
  const rest = getCategories().filter((c) => c.slug !== MYAPP_BLOCKS_CATEGORY_SLUG);
  setCategories([myappBlocksCategory, ...rest]);
}

// Must run before any `registerBlockType` import side effects.
ensureCustomCategoryFirst();

addFilter(
  'blocks.registerBlockType',
  'myapp/force-custom-category',
  (settings, name) => {
    if (typeof name === 'string' && name.startsWith('myapp/')) {
      return { ...settings, category: MYAPP_BLOCKS_CATEGORY_SLUG };
    }
    return settings;
  },
);
