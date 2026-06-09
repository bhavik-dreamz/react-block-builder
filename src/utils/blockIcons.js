import {
  addCard,
  cover,
  grid,
  info,
  layout,
  mediaAndText,
  megaphone,
  quote,
  separator,
  tag,
} from '@wordpress/icons';

/** Map dashicon / config icon names → @wordpress/icons SVG (shown in block inserter). */
const ICON_MAP = {
  info,
  tag,
  quote,
  'format-quote': quote,
  minus: separator,
  separator,
  'cover-image': cover,
  cover,
  megaphone,
  'align-pull-left': mediaAndText,
  'grid-view': grid,
  grid,
  'add-card': addCard,
  layout,
  page: addCard,
};

/**
 * @param {string|import('react').ComponentType} icon
 * @returns {string|import('react').ComponentType}
 */
export function resolveBlockIcon(icon) {
  if (!icon || typeof icon !== 'string') {
    return icon || 'block-default';
  }

  const key = icon.replace(/^dashicons-/, '');
  return ICON_MAP[key] || icon;
}
