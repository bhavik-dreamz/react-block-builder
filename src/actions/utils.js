import { ACTION_NAMES, DEFAULT_BUTTON_ACTION } from './constants.js';
import { DEFAULT_REGISTRY } from './registry.js';

/** Param keys that are always editor-only and never persisted. */
const BASE_EDITOR_ONLY_KEYS = ['pageParamsRaw', 'manualPageId'];

function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

function dropKeysFor(def) {
  return new Set([...BASE_EDITOR_ONLY_KEYS, ...(def?.editorOnlyKeys || [])]);
}

/** Block attribute definition for button actions. */
export const buttonActionAttribute = {
  type: 'object',
  default: DEFAULT_BUTTON_ACTION,
};

export function parsePageParams(raw) {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return {};
  }

  return raw.split(',').reduce((acc, segment) => {
    const trimmed = segment.trim();
    if (!trimmed) return acc;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return acc;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key) acc[key] = value;
    return acc;
  }, {});
}

export function pageParamsToRaw(pageParams) {
  if (!pageParams || typeof pageParams !== 'object') return '';
  return Object.entries(pageParams)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');
}

export function migrateUrlToAction(url) {
  return {
    actionName: ACTION_NAMES.OPEN_URL,
    params: { url: url || '#' },
  };
}

/** Merge legacy `buttonUrl` with new `buttonAction` attribute. */
export function resolveButtonAction(attributes, {
  actionKey = 'buttonAction',
  urlKey = 'buttonUrl',
  registry = DEFAULT_REGISTRY,
} = {}) {
  const action = attributes?.[actionKey];
  if (action?.actionName) {
    return denormalizeAction(normalizeAction(action, registry), registry);
  }
  if (attributes?.[urlKey]) {
    return denormalizeAction(migrateUrlToAction(attributes[urlKey]), registry);
  }
  return denormalizeAction(DEFAULT_BUTTON_ACTION, registry);
}

/** Resolve action on nested items (carousel slide, story, etc.). */
export function resolveItemButtonAction(item, {
  actionKey = 'buttonAction',
  urlKey = 'buttonUrl',
  registry = DEFAULT_REGISTRY,
} = {}) {
  if (item?.[actionKey]?.actionName) {
    return denormalizeAction(normalizeAction(item[actionKey], registry), registry);
  }
  if (item?.[urlKey]) {
    return denormalizeAction(migrateUrlToAction(item[urlKey]), registry);
  }
  return denormalizeAction(DEFAULT_BUTTON_ACTION, registry);
}

/**
 * Strip editor-only fields; output only persisted params.
 *
 * Known actions (in `registry`) are stripped to their schema fields (or to the
 * output of `def.normalizeParams`). Unknown actions — e.g. consumer actions seen
 * in a render/SSR path with no registry — pass params through unchanged so their
 * data is never lost.
 */
export function normalizeAction(action, registry = DEFAULT_REGISTRY) {
  if (!action?.actionName) {
    return { ...DEFAULT_BUTTON_ACTION };
  }

  const name = action.actionName;
  const def = registry.getDef(name);
  const source = action.params || {};
  let params = {};

  if (!def) {
    // Unknown action: lenient passthrough (drop empty + editor-only keys).
    const drop = new Set(BASE_EDITOR_ONLY_KEYS);
    for (const [key, value] of Object.entries(source)) {
      if (drop.has(key) || isEmpty(value)) continue;
      params[key] = value;
    }
  } else if (def.normalizeParams) {
    const drop = dropKeysFor(def);
    const produced = def.normalizeParams(source) || {};
    for (const [key, value] of Object.entries(produced)) {
      if (drop.has(key) || isEmpty(value)) continue;
      params[key] = value;
    }
  } else {
    const fields = def.fields || [];
    if (!fields.length) {
      return { actionName: name };
    }
    const drop = dropKeysFor(def);
    for (const field of fields) {
      if (drop.has(field.key)) continue;
      const value = source[field.key];
      if (isEmpty(value)) continue;
      params[field.key] = value;
    }
  }

  const result = { actionName: name };
  if (Object.keys(params).length) {
    result.params = params;
  }
  return result;
}

/**
 * Add editor-only derived fields (e.g. `pageParamsRaw`) for the form.
 * Does NOT apply default params — defaults belong to `getDefaultActionForType`,
 * applied only when the action type is selected.
 */
export function denormalizeAction(action, registry = DEFAULT_REGISTRY) {
  const normalized = normalizeAction(action, registry);
  const def = registry.getDef(normalized.actionName);
  const params = { ...(normalized.params || {}) };

  if (def?.denormalizeParams) {
    Object.assign(params, def.denormalizeParams(params) || {});
  }

  return {
    actionName: normalized.actionName,
    params,
  };
}

export function getDefaultActionForType(actionName, registry = DEFAULT_REGISTRY) {
  const defaultParams = registry.getDefaultParams(actionName);
  const base = defaultParams
    ? { actionName, params: { ...defaultParams } }
    : { actionName };
  return denormalizeAction(base, registry);
}

export function validateAction(action, registry = DEFAULT_REGISTRY) {
  const normalized = normalizeAction(action, registry);
  const def = registry.getDef(normalized.actionName);
  if (!def) {
    return { valid: false, errors: ['Unknown action type'], normalized };
  }

  const errors = [];
  const drop = dropKeysFor(def);
  for (const field of (def.fields || [])) {
    if (!field.required || drop.has(field.key)) continue;
    const val = normalized.params?.[field.key];
    if (isEmpty(val) || String(val).trim() === '') {
      errors.push(`${field.label} is required`);
    }
  }

  if (def.validateParams) {
    errors.push(...(def.validateParams(normalized.params || {}) || []));
  }

  return { valid: errors.length === 0, errors, normalized };
}

/** Preview href for editor / web fallback. Native app reads data-action. */
export function getActionPreviewHref(action, registry = DEFAULT_REGISTRY) {
  return registry.getPreviewHref(normalizeAction(action, registry));
}

export function serializeActionAttribute(action, registry = DEFAULT_REGISTRY) {
  return JSON.stringify(normalizeAction(action, registry));
}
