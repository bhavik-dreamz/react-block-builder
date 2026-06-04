import React, { createContext, useContext, useState } from 'react';

const RouterContext = createContext(null);

// Routes:
//   { name: 'list' }
//   { name: 'editor', params: { pageId, pageTitle } }
//   { name: 'viewer', params: { pageId } }

export function RouterProvider({ children }) {
  const [route, setRoute] = useState({ name: 'list', params: {} });

  function navigate(name, params = {}) {
    setRoute({ name, params });
  }

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}
