import { DEFAULT_REGISTRY } from './registry.js';

/**
 * Back-compat shims. The registry (registry.js) is the source of truth for
 * action schemas and default params. These exports reflect built-in actions
 * only; consumer-provided actions are resolved at runtime via the registry
 * carried in `ActionBuilderContext`.
 *
 * Field types: text | url | textarea | page-select | page-params | product-picker | collection-picker
 */
export const ACTION_SCHEMAS = Object.fromEntries(
  DEFAULT_REGISTRY.list.map((def) => [def.name, { fields: def.fields || [] }]),
);

export const DEFAULT_PARAMS_BY_ACTION = Object.fromEntries(
  DEFAULT_REGISTRY.list
    .filter((def) => def.defaultParams)
    .map((def) => [def.name, def.defaultParams]),
);
