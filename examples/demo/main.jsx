/**
 * Demo app — not published with the package.
 * Shows BlockEditor + local persistence via onSave / onLoad.
 */
import 'gutenberg-block-kit/styles';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BlockEditor, initBlocks } from 'gutenberg-block-kit/editor';
import FrontendPage from './FrontendPage.jsx';
import { savePage, loadPage } from './api.js';
import { demoMediaHandlers } from './mediaHandlers.js';

initBlocks();

function Root() {
  const [view, setView] = useState('editor');

  if (view === 'site') {
    return <FrontendPage onBackToEditor={() => setView('editor')} />;
  }

  return (
    <BlockEditor
      media={demoMediaHandlers}
      onViewSite={() => setView('site')}
      onSave={({ id, title, html, json }) => savePage(id, title, html, json)}
      onLoad={(id) => loadPage(id)}
    />
  );
}

function renderApp() {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;
  ReactDOM.createRoot(rootEl).render(<Root />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
