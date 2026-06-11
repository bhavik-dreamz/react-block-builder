/**
 * Action registry — single source of truth for available button actions.
 *
 * The package ships only a minimal generic core (`OPEN_URL`). Consumers extend
 * the registry through the `BlockEditor` `actions` prop (`customActions` /
 * `removeActions`) — see `ActionBuilderProvider`. Shopify/CMS actions are NOT
 * built in; they live in consumer config (see `examples/demo/actionsConfig.js`).
 *
 * Action definition shape:
 * @typedef {object} ActionDef
 * @property {string} name                         - Unique action name (persisted as `actionName`).
 * @property {string} label                        - Dropdown label.
 * @property {ActionField[]} [fields]              - Editable fields.
 * @property {object} [defaultParams]              - Applied only when the action type is selected.
 * @property {string[]} [editorOnlyKeys]           - Param keys stripped on save (e.g. 'pageParamsRaw').
 * @property {(params: object) => object} [normalizeParams]   - editor params -> persisted params.
 * @property {(params: object) => object} [denormalizeParams] - persisted params -> editor params.
 * @property {(params: object) => string[]} [validateParams]  - extra validation errors.
 * @property {(params: object) => string} [previewHref]       - web-preview href fallback.
 *
 * @typedef {object} ActionField
 * @property {string} key
 * @property {string} label
 * @property {'text'|'url'|'textarea'|'page-select'|'page-params'|'product-picker'|'collection-picker'} type
 * @property {boolean} [required]
 * @property {boolean} [readOnly]
 * @property {string} [help]
 */

/** Built-in actions shipped in the package. Generic + web-safe only. */
export const BUILTIN_ACTIONS = [
  {
    name: 'OPEN_URL',
    label: 'Open URL',
    fields: [
      { key: 'url', label: 'URL', type: 'url', required: true },
    ],
    defaultParams: { url: 'https://www.example.com' },
    previewHref: (params) => params.url || '#',
  },
];

/**
 * Merge built-in actions with consumer config.
 *
 * - `customActions`: override-by-name (keeps original position) or append (new names).
 * - `removeActions`: array of names to drop (can remove built-ins too).
 *
 * @param {{ customActions?: ActionDef[], removeActions?: string[] }} [config]
 */
export function createActionRegistry(config = {}) {
  const { customActions = [], removeActions = [] } = config || {};

  const list = BUILTIN_ACTIONS.map((def) => ({ ...def }));
  const indexByName = new Map(list.map((def, i) => [def.name, i]));

  for (const def of customActions) {
    if (!def || !def.name) continue;
    const at = indexByName.get(def.name);
    if (at === undefined) {
      indexByName.set(def.name, list.length);
      list.push({ ...def });
    } else {
      list[at] = { ...def };
    }
  }

  const removeSet = new Set(removeActions || []);
  const finalList = list.filter((def) => !removeSet.has(def.name));

  const byName = {};
  for (const def of finalList) byName[def.name] = def;

  return {
    list: finalList,
    byName,
    options: finalList.map((def) => ({ value: def.name, label: def.label || def.name })),
    getDef(name) {
      return byName[name] || null;
    },
    getSchema(name) {
      const def = byName[name];
      return { fields: def?.fields || [] };
    },
    getDefaultParams(name) {
      return byName[name]?.defaultParams || null;
    },
    getPreviewHref(action) {
      const name = action?.actionName;
      const params = action?.params || {};
      const def = byName[name];
      if (def?.previewHref) return def.previewHref(params) || '#';
      return params.url || '#';
    },
  };
}

/** Built-in-only registry. Fallback for render/SSR paths with no consumer config. */
export const DEFAULT_REGISTRY = createActionRegistry();
