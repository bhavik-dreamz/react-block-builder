import { DEFAULT_REGISTRY } from './registry.js';

/**
 * Built-in action names. Only the generic core ships in the package; consumers
 * add their own via the `actions.customActions` prop on `BlockEditor`.
 */
export const ACTION_NAMES = {
  OPEN_URL: 'OPEN_URL',
};

/** Dropdown options for built-in actions (derived from the default registry). */
export const ACTION_OPTIONS = DEFAULT_REGISTRY.options;

export const DEFAULT_BUTTON_ACTION = {
  actionName: ACTION_NAMES.OPEN_URL,
  params: { url: '#' },
};
