import React, { useState, useEffect } from 'react';
import { loadPage } from '../data/api';
import { useRouter } from '../router/RouterContext';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

import '@wordpress/block-library/build-style/style.css';

export default function PageViewer({ pageId }) {
  const { navigate } = useRouter();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      setLoading(true);
      try {
        const data = await loadPage(pageId);
        setPage(data);
      } catch (e) {
        setError('Failed to load page.');
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [pageId]);

  return (
    <div className="pv-shell">
      {/* ── Admin bar ── */}
      <div className="pv-adminbar">
        <button className="pv-back-btn" onClick={() => navigate('list')}>
          <FaArrowLeft />
          All Pages
        </button>

        <div className="pv-adminbar-center">
          {page && <span className="pv-page-name">{page.title}</span>}
        </div>

        <div className="pv-adminbar-right">
          {page && (
            <>
              <span className="pv-updated">
                Updated {new Date(page.updatedAt).toLocaleString()}
              </span>
              <button
                className="pv-edit-btn"
                onClick={() => navigate('editor', { pageId: page.id, pageTitle: page.title })}
              >
                <FaEdit />
                Edit Page
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="pv-body">
        {loading && (
          <div className="pv-loading">
            <div className="pl-loading-spinner" />
            Loading…
          </div>
        )}

        {error && <div className="pv-error">{error}</div>}

        {!loading && !page && !error && (
          <div className="pv-not-found">
            <h2>Page not found</h2>
            <button className="pl-add-btn" onClick={() => navigate('list')}>← Back to Pages</button>
          </div>
        )}

        {page && (
          <article className="pv-article">
            <header className="pv-article-header">
              <h1 className="pv-article-title">{page.title}</h1>
            </header>
            <div
              className="pv-article-content entry-content"
              dangerouslySetInnerHTML={{ __html: page.html }}
            />
          </article>
        )}
      </div>
    </div>
  );
}
