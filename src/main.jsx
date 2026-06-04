// ── MUST BE FIRST — fixes "conversionMap" error ───────────────────────────────
import './bootstrap.js';

// ── Styles ────────────────────────────────────────────────────────────────────
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/editor.css';
import '@wordpress/components/build-style/style.css';

import './index.css';

// ── App ───────────────────────────────────────────────────────────────────────
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PageList from './pages/PageList';
import PageViewer from './pages/PageViewer';
import { RouterProvider, useRouter } from './router/RouterContext';
import { initBlocks } from './registerBlocks.jsx';

initBlocks();

function Root() {
  const { route, navigate } = useRouter();

  if (route.name === 'editor') {
    return (
      <App
        pageId={route.params.pageId}
        initialTitle={route.params.pageTitle || ''}
        onNavigate={navigate}
        onViewSite={() => navigate('viewer', { pageId: route.params.pageId })}
      />
    );
  }

  if (route.name === 'viewer') {
    return <PageViewer pageId={route.params.pageId} />;
  }

  // Default: page list
  return <PageList />;
}

function renderApp() {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;
  ReactDOM.createRoot(rootEl).render(
    <RouterProvider>
      <Root />
    </RouterProvider>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}