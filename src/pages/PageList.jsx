import React, { useState, useEffect } from 'react';
import { listPages, deletePage, generatePageId } from '../data/api';
import { useRouter } from '../router/RouterContext';
import logoimage from '../images/editor-icon.png';
import { FaEdit, FaEye, FaTrash, FaPlus, FaFileAlt } from 'react-icons/fa';

export default function PageList() {
  const { navigate } = useRouter();
  const [pages, setPages] = useState([]);
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
    } catch (e) {
      setError('Failed to load pages.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await deletePage(id);
    setPages(prev => prev.filter(p => p.id !== id));
  }

  function handleAddNew() {
    const newId = generatePageId();
    navigate('editor', { pageId: newId, pageTitle: '', isNew: true });
  }

  function handleEdit(page) {
    navigate('editor', { pageId: page.id, pageTitle: page.title });
  }

  function handleView(page) {
    navigate('viewer', { pageId: page.id });
  }

  return (
    <div className="pl-shell">
      {/* ── Top bar ── */}
      <div className="pl-topbar">
        <div className="pl-topbar-left">
          <div className="pl-logo">
            <img src={logoimage} alt="Logo" />
          </div>
          <span className="pl-site-name">Pages</span>
        </div>
        <button className="pl-add-btn" onClick={handleAddNew}>
          <FaPlus />
          Add New Page
        </button>
      </div>

      {/* ── Content ── */}
      <div className="pl-content">
        <div className="pl-content-header">
          <h2 className="pl-content-title">All Pages</h2>
          <span className="pl-page-count">{pages.length} page{pages.length !== 1 ? 's' : ''}</span>
        </div>

        {loading && (
          <div className="pl-loading">
            <div className="pl-loading-spinner" />
            Loading pages…
          </div>
        )}

        {error && <div className="pl-error">{error}</div>}

        {!loading && pages.length === 0 && (
          <div className="pl-empty">
            <div className="pl-empty-icon"><FaFileAlt /></div>
            <h3>No pages yet</h3>
            <p>Click "Add New Page" to create your first page.</p>
            <button className="pl-add-btn" onClick={handleAddNew}>
              <FaPlus />
              Add New Page
            </button>
          </div>
        )}

        {!loading && pages.length > 0 && (
          <table className="pl-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="pl-row">
                  <td className="pl-cell-title">
                    <button className="pl-title-link" onClick={() => handleEdit(page)}>
                      {page.title || <em>Untitled</em>}
                    </button>
                    <div className="pl-row-actions">
                      <button className="pl-row-action pl-action-edit" onClick={() => handleEdit(page)}>
                        Edit
                      </button>
                      <span className="pl-row-sep">|</span>
                      <button className="pl-row-action pl-action-view" onClick={() => handleView(page)}>
                        View
                      </button>
                      <span className="pl-row-sep">|</span>
                      <button className="pl-row-action pl-action-delete" onClick={() => handleDelete(page.id, page.title)}>
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="pl-cell-slug">{page.id}</td>
                  <td className="pl-cell-date">
                    {new Date(page.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="pl-cell-actions">
                    <button className="pl-action-btn pl-action-btn-edit" onClick={() => handleEdit(page)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="pl-action-btn pl-action-btn-view" onClick={() => handleView(page)} title="View">
                      <FaEye />
                    </button>
                    <button className="pl-action-btn pl-action-btn-delete" onClick={() => handleDelete(page.id, page.title)} title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
