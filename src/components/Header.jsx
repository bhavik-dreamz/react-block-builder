import React from 'react';
import { useEditor } from '../context/EditorContext';
import logoimage from '../images/editor-icon.png';
import { FaColumns, FaEye, FaEdit, FaTrash, FaSave, FaGlobe } from 'react-icons/fa';
import OptionsMenu from './OptionsMenu';
import LeftToolbarButtonSet from './LeftToolbarButtonSet';

export default function Header() {
  const {
    preview, setPreview,
    saved,
    sidebarOpen, setSidebarOpen,
    pageTitle, setPageTitle,
    handleSave,
    handleClear,
    onViewSite,
  } = useEditor();

  return (
    <div className="editor-header">
      <div className="fp-editor-title-row">
        <a href="/">
          <div className="logo-image">
            <img src={logoimage} alt="Logo" />
          </div>
        </a>
        {/* ✅ Fixed top toolbar with + inserter, Templates, Undo/Redo */}
        <LeftToolbarButtonSet />
      </div>
      <div className="header-center">
        <input
          className="page-title-input"
          value={pageTitle}
          onChange={e => setPageTitle(e.target.value)}
          placeholder="Page title…"
        />
      </div>
      <div className="header-actions">
        <button className="sidebar-toggle-btn header-btn-wrap" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaColumns />
        </button>

        <button className="preview-btn header-btn-wrap" onClick={() => setPreview(!preview)}>
          {preview ? <FaEdit /> : <FaEye />}
        </button>

        <button className="clear-btn header-btn-wrap" onClick={handleClear}>
          <FaTrash />
        </button>

        <button className="save-btn header-btn-wrap" onClick={handleSave}>
          <FaSave />
          {saved ? '' : ''}
        </button>

        <button className="view-site-btn" onClick={onViewSite} title="View the saved page as a visitor would see it">
          <FaGlobe />
          View Site
        </button>

        <OptionsMenu />
      </div>
    </div>
  );
}
