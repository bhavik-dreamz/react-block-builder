// ── MUST BE FIRST — fixes "conversionMap" error ───────────────────────────────
import './bootstrap.js';

// ── Styles ────────────────────────────────────────────────────────────────────
// main.js — import order matters
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/editor.css';
import '@wordpress/components/build-style/style.css';

//import './editor-defaults.css'; // ← add this after WP styles
import './index.css';

// ── App ───────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import FrontendPage from './FrontendPage';
import { initBlocks } from './registerBlocks.jsx';
import { savePage, loadPage } from './data/api';

initBlocks();

function Root() {
  const [view, setView] = useState('editor');

  if (view === 'site') {
    return <FrontendPage onBackToEditor={() => setView('editor')} />;
  }
  return (
    <App
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