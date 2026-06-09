import { ACTION_NAMES, DEFAULT_BUTTON_ACTION } from './constants.js';
import { ACTION_SCHEMAS, DEFAULT_PARAMS_BY_ACTION } from './schemas.js';

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
} = {}) {
  const action = attributes?.[actionKey];
  if (action?.actionName) {
    return denormalizeAction(normalizeAction(action));
  }
  if (attributes?.[urlKey]) {
    return denormalizeAction(migrateUrlToAction(attributes[urlKey]));
  }
  return denormalizeAction(DEFAULT_BUTTON_ACTION);
}

/** Resolve action on nested items (carousel slide, story, etc.). */
export function resolveItemButtonAction(item, {
  actionKey = 'buttonAction',
  urlKey = 'buttonUrl',
} = {}) {
  if (item?.[actionKey]?.actionName) {
    return denormalizeAction(normalizeAction(item[actionKey]));
  }
  if (item?.[urlKey]) {
    return denormalizeAction(migrateUrlToAction(item[urlKey]));
  }
  return denormalizeAction(DEFAULT_BUTTON_ACTION);
}

/** Strip editor-only fields; output only persisted params. */
export function normalizeAction(action) {
  if (!action?.actionName) {
    return { ...DEFAULT_BUTTON_ACTION };
  }

  const schema = ACTION_SCHEMAS[action.actionName];
  if (!schema || !schema.fields.length) {
    return { actionName: action.actionName };
  }

  const source = action.params || {};
  const params = {};

  for (const field of schema.fields) {
    if (field.type === 'page-params') continue;
    if (field.key === 'manualPageId') continue;

    const value = source[field.key];
    if (value === undefined || value === null || value === '') continue;
    params[field.key] = value;
  }

  if (action.actionName === ACTION_NAMES.OPEN_INAPP_PAGE) {
    const pageId = source.manualPageId?.trim() || source.pageId?.trim();
    if (pageId) params.pageId = pageId;

    const pageParams = source.pageParams
      || parsePageParams(source.pageParamsRaw || '');
    if (Object.keys(pageParams).length) {
      params.pageParams = pageParams;
    }
  }

  const result = { actionName: action.actionName };
  if (Object.keys(params).length) {
    result.params = params;
  }
  return result;
}

/** Add editor-only fields (pageParamsRaw, manualPageId) for the form. */
export function denormalizeAction(action) {
  const normalized = normalizeAction(action);
  const schema = ACTION_SCHEMAS[normalized.actionName];
  if (!schema) return normalized;

  const params = { ...(normalized.params || {}) };

  if (normalized.actionName === ACTION_NAMES.OPEN_INAPP_PAGE) {
    params.pageParamsRaw = pageParamsToRaw(params.pageParams);
    params.manualPageId = '';
    if (params.pageId) {
      params.pageId = params.pageId;
    }
  }

  return {
    actionName: normalized.actionName,
    params: {
      ...(DEFAULT_PARAMS_BY_ACTION[normalized.actionName] || {}),
      ...params,
    },
  };
}

export function getDefaultActionForType(actionName) {
  const params = DEFAULT_PARAMS_BY_ACTION[actionName];
  if (!params) {
    return { actionName };
  }
  return denormalizeAction({ actionName, params: { ...params } });
}

export function validateAction(action) {
  const editorAction = denormalizeAction(action);
  let toValidate = editorAction;

  if (editorAction.actionName === ACTION_NAMES.OPEN_INAPP_PAGE) {
    const pageId = editorAction.params?.manualPageId?.trim()
      || editorAction.params?.pageId?.trim();
    toValidate = {
      ...editorAction,
      params: { ...editorAction.params, pageId },
    };
  }

  const normalized = normalizeAction(toValidate);
  const schema = ACTION_SCHEMAS[normalized.actionName];
  if (!schema) {
    return { valid: false, errors: ['Unknown action type'] };
  }

  const errors = [];
  for (const field of schema.fields) {
    if (!field.required) continue;
    const val = normalized.params?.[field.key];
    if (val === undefined || val === null || String(val).trim() === '') {
      errors.push(`${field.label} is required`);
    }
  }

  if (normalized.actionName === ACTION_NAMES.OPEN_INAPP_PAGE && !normalized.params?.pageId) {
    errors.push('Page ID is required');
  }

  return { valid: errors.length === 0, errors, normalized };
}

/** Preview href for editor / web fallback. Native app reads data-action. */
export function getActionPreviewHref(action) {
  const { actionName, params = {} } = normalizeAction(action);

  switch (actionName) {
    case ACTION_NAMES.OPEN_URL:
      return params.url || '#';
    case ACTION_NAMES.OPEN_WEBVIEW:
      return params.webViewUrl || '#';
    case ACTION_NAMES.OPEN_PRODUCT:
      return params.productHandle ? `/products/${params.productHandle}` : '#';
    case ACTION_NAMES.OPEN_COLLECTION:
      return params.collectionHandle ? `/collections/${params.collectionHandle}` : '#';
    case ACTION_NAMES.OPEN_CART_PAGE:
      return '/cart';
    case ACTION_NAMES.OPEN_WISHLIST_PAGE:
      return '/wishlist';
    case ACTION_NAMES.OPEN_SEARCH_PAGE:
      return '/search';
    case ACTION_NAMES.OPEN_HOME:
      return '/';
    case ACTION_NAMES.OPEN_LOGIN_PAGE:
      return '/account/login';
    case ACTION_NAMES.OPEN_MY_ACCOUNT:
      return '/account';
    case ACTION_NAMES.OPEN_ORDERS:
      return '/account/orders';
    default:
      return '#';
  }
}

export function serializeActionAttribute(action) {
  return JSON.stringify(normalizeAction(action));
}
