import { createContext, useContext } from 'react';

/**
 * Host-provided integrations for ActionBuilder (Shopify pickers, CMS pages).
 *
 * @typedef {object} ActionBuilderHostConfig
 * @property {{ id: string, title: string }[]} [pages] - CMS pages for OPEN_INAPP_PAGE
 * @property {() => Promise<{ id: string, title: string }[]>} [fetchPages]
 * @property {() => Promise<{ productId: string, productHandle: string, productTitle?: string }>} [pickProduct]
 * @property {() => Promise<{ collectionId: string, collectionHandle: string, collectionTitle?: string }>} [pickCollection]
 */

export const ActionBuilderContext = createContext(null);

export function ActionBuilderProvider({ actions, children }) {
  return (
    <ActionBuilderContext.Provider value={actions || null}>
      {children}
    </ActionBuilderContext.Provider>
  );
}

export function useActionBuilderHost() {
  return useContext(ActionBuilderContext);
}
