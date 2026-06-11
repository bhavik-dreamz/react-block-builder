import { createContext, useContext, useMemo } from 'react';
import { createActionRegistry, DEFAULT_REGISTRY } from './registry.js';

/**
 * Host-provided integrations + action registry config for ActionBuilder.
 *
 * @typedef {object} ActionBuilderConfig
 * @property {import('./registry.js').ActionDef[]} [customActions] - Actions to add/override by name.
 * @property {string[]} [removeActions] - Built-in action names to remove.
 * @property {{ id: string, title: string }[]} [pages] - CMS pages for page-select fields.
 * @property {() => Promise<{ id: string, title: string }[]>} [fetchPages]
 * @property {() => Promise<{ productId: string, productHandle: string, productTitle?: string }>} [pickProduct]
 * @property {() => Promise<{ collectionId: string, collectionHandle: string, collectionTitle?: string }>} [pickCollection]
 */

export const ActionBuilderContext = createContext({
  host: null,
  registry: DEFAULT_REGISTRY,
});

export function ActionBuilderProvider({ actions, children }) {
  const value = useMemo(() => ({
    host: actions || null,
    registry: createActionRegistry({
      customActions: actions?.customActions,
      removeActions: actions?.removeActions,
    }),
  }), [actions]);

  return (
    <ActionBuilderContext.Provider value={value}>
      {children}
    </ActionBuilderContext.Provider>
  );
}

export function useActionBuilderHost() {
  return useContext(ActionBuilderContext)?.host || null;
}

export function useActionRegistry() {
  return useContext(ActionBuilderContext)?.registry || DEFAULT_REGISTRY;
}
