/**
 * Demo public site viewer — not part of the published package.
 */
import React, { useState, useEffect } from 'react';
import { BlockRenderer } from 'react-block-builder/renderer';
import { listPages, loadPage, deletePage } from './api.js';

import '@wordpress/block-library/build-style/style.css';

export default function FrontendPage({ onBackToEditor }) {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    setLoading(true);
    setError(null);
    try {
      const list = await listPages();
      setPages(list);
      if (list.length > 0) {
        setActivePage(list[0]);
      }
    } catch {
      setError('Failed to load pages.');
    } finally {
      setLoading(false);
    }
  }

  async function openPage(id) {
    setLoading(true);
    try {
      const page = await loadPage(id);
      setActivePage(page);
    } catch {
      setError('Failed to load page.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this page?')) return;
    await deletePage(id);
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (activePage?.id === id) setActivePage(null);
  }

  return (
    <div className="fp-shell">
      <div className="fp-topbar">
        <div className="fp-topbar-left">
          <span className="fp-site-name">🌐 My Site</span>
          {activePage && (
            <span className="fp-breadcrumb">
              / <strong>{activePage.title}</strong>
            </span>
          )}
        </div>
        <div className="fp-topbar-right">
          {activePage && (
            <span className="fp-updated">
              Saved {new Date(activePage.updatedAt).toLocaleString()}
            </span>
          )}
          <button className="fp-edit-btn" onClick={onBackToEditor}>
            ✏️ Back to Editor
          </button>
        </div>
      </div>

      <div className="fp-body">
        <aside className="fp-sidebar">
          <div className="fp-sidebar-title">Pages</div>

          {loading && <div className="fp-sidebar-loading">Loading…</div>}
          {error && <div className="fp-sidebar-error">{error}</div>}

          {pages.length === 0 && !loading && (
            <div className="fp-sidebar-empty">
              No saved pages yet.
              <br />
              Go back to the editor and hit Save.
            </div>
          )}

          <ul className="fp-page-list">
            {pages.map((p) => (
              <li
                key={p.id}
                className={`fp-page-item${activePage?.id === p.id ? ' active' : ''}`}
              >
                <button
                  className="fp-page-item-btn"
                  onClick={() => openPage(p.id)}
                >
                  <span className="fp-page-item-title">{p.title || p.id}</span>
                  <span className="fp-page-item-date">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </span>
                </button>
                <button
                  className="fp-page-delete"
                  onClick={() => handleDelete(p.id)}
                  title="Delete page"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="fp-main">
          {!activePage && !loading && (
            <div className="fp-empty-state">
              <div className="fp-empty-icon">📄</div>
              <h2>No page selected</h2>
              <p>Select a page from the sidebar, or go back to the editor to create one.</p>
              <button className="fp-cta-btn" onClick={onBackToEditor}>
                Open Editor
              </button>
            </div>
          )}

          {activePage && (
            <>
              <header className="fp-page-header">
                <h1 className="fp-page-title">{activePage.title}</h1>
              </header>

              <BlockRenderer
                html={activePage.html}
                className="fp-page-content entry-content"
              />

              <details className="fp-debug">
                <summary>🔍 Raw data (for debugging)</summary>
                <div className="fp-debug-body">
                  <h4>HTML (what gets stored / fetched)</h4>
                  <pre>{activePage.html}</pre>
                  <h4>Block JSON (used to re-open in editor)</h4>
                  <pre>{activePage.json}</pre>
                </div>
              </details>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
