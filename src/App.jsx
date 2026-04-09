import React, { useState, useEffect, useRef } from 'react';
import { useSelect, useDispatch } from "@wordpress/data";
import { select, subscribe } from "@wordpress/data";
// -d added the format library for text formatting options (bold, italic, etc.)
import {
  BlockEditorProvider,
  BlockList,
  BlockTools,
  WritingFlow,
  ObserveTyping,
  Inserter,
  BlockEditorKeyboardShortcuts,
  BlockInspector,
} from '@wordpress/block-editor';
// -d 
import { __experimentalListView as ListView } from '@wordpress/block-editor';
import { serialize, parse, createBlock } from '@wordpress/blocks';
import { SlotFillProvider, Popover } from '@wordpress/components';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';

import { blockTemplates } from './data/blockTemplates';
import { savePage, loadPage, listPages } from './data/api';
import logoimage from './images/editor-icon.png';
import {
  FaColumns, FaEye, FaEdit, FaTrash, FaSave, FaGlobe, FaPlus, FaRegSquare
} from "react-icons/fa";

import { LuUndo,LuRedo } from "react-icons/lu";
const DEFAULT_PAGE_ID = 'home';

// -d adding the styles
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/components/build-style/style.css';
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/theme.css';
import {
  InspectorControls,
} from "@wordpress/block-editor";

import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from "@wordpress/components";
// import '@wordpress/format-library';

// Database functions are now in src/data/api.js — swap the bodies there
// to point at any real backend (Express, WordPress REST API, Supabase, etc.)


const EDITOR_SETTINGS = {
  hasFixedToolbar: true,
  hasInlineToolbar: true,
  focusMode: false,
  isRTL: false,
  keepCaretInsideBlock: false,
  bodyPlaceholder: 'Click + to add your first block...',
  supportsLayout: true,
  disableCustomColors: false,
  disableCustomFontSizes: false,
  disableCustomGradients: false,
  enableCustomLineHeight: true,
  enableCustomSpacingSize: true,
  enableCustomUnits: ['px', 'em', 'rem', '%', 'vw', 'vh'],
  fontSizes: [
    { name: 'Small',   slug: 'small',     size: 12 },
    { name: 'Normal',  slug: 'normal',    size: 16 },
    { name: 'Medium',  slug: 'medium',    size: 20 },
    { name: 'Large',   slug: 'large',     size: 24 },
    { name: 'XL',      slug: 'x-large',   size: 32 },
    { name: '2XL',     slug: 'xx-large',  size: 40 },
    { name: '3XL',     slug: 'xxx-large', size: 48 },
    { name: 'Huge',    slug: 'huge',      size: 64 },
  ],
  colors: [
    { name: 'Black',      slug: 'black',      color: '#000000' },
    { name: 'White',      slug: 'white',      color: '#ffffff' },
    { name: 'Gray 100',   slug: 'gray-100',   color: '#f3f4f6' },
    { name: 'Gray 300',   slug: 'gray-300',   color: '#d1d5db' },
    { name: 'Gray 500',   slug: 'gray-500',   color: '#6b7280' },
    { name: 'Gray 700',   slug: 'gray-700',   color: '#374151' },
    { name: 'Gray 900',   slug: 'gray-900',   color: '#111827' },
    { name: 'Blue 100',   slug: 'blue-100',   color: '#dbeafe' },
    { name: 'Blue 500',   slug: 'blue-500',   color: '#3b82f6' },
    { name: 'Blue 700',   slug: 'blue-700',   color: '#1d4ed8' },
    { name: 'Green 500',  slug: 'green-500',  color: '#22c55e' },
    { name: 'Green 700',  slug: 'green-700',  color: '#15803d' },
    { name: 'Red 500',    slug: 'red-500',    color: '#ef4444' },
    { name: 'Red 700',    slug: 'red-700',    color: '#b91c1c' },
    { name: 'Yellow 500', slug: 'yellow-500', color: '#eab308' },
    { name: 'Purple 500', slug: 'purple-500', color: '#a855f7' },
    { name: 'Purple 700', slug: 'purple-700', color: '#7e22ce' },
    { name: 'Pink 500',   slug: 'pink-500',   color: '#ec4899' },
    { name: 'Primary',    slug: 'primary',    color: '#3858e9' },
    { name: 'Secondary',  slug: 'secondary',  color: '#1e1e1e' },
  ],
  gradients: [
    { name: 'Blue to Purple', slug: 'blue-purple',   gradient: 'linear-gradient(135deg,#3b82f6 0%,#a855f7 100%)' },
    { name: 'Green to Blue',  slug: 'green-blue',    gradient: 'linear-gradient(135deg,#22c55e 0%,#3b82f6 100%)' },
    { name: 'Pink to Orange', slug: 'pink-orange',   gradient: 'linear-gradient(135deg,#ec4899 0%,#f97316 100%)' },
    { name: 'Purple to Pink', slug: 'purple-pink',   gradient: 'linear-gradient(135deg,#a855f7 0%,#ec4899 100%)' },
    { name: 'Yellow to Red',  slug: 'yellow-red',    gradient: 'linear-gradient(135deg,#eab308 0%,#ef4444 100%)' },
    { name: 'Sunset',         slug: 'sunset',        gradient: 'linear-gradient(135deg,#f97316 0%,#ec4899 50%,#a855f7 100%)' },
    { name: 'Ocean',          slug: 'ocean',         gradient: 'linear-gradient(135deg,#0ea5e9 0%,#22c55e 100%)' },
    { name: 'Midnight',       slug: 'midnight',      gradient: 'linear-gradient(135deg,#1e3a8a 0%,#7e22ce 100%)' },
  ],
  __experimentalFeatures: {
    color: { text: true, background: true, customColor: true, link: true, gradients: true, customGradient: true },
    typography: { fontSize: true, lineHeight: true, fontStyle: true, fontWeight: true, letterSpacing: true, textDecoration: true, textTransform: true },
    spacing: { padding: true, margin: true, blockGap: true, units: ['px','em','rem','%','vw','vh'] },
    border: { color: true, radius: true, style: true, width: true },
    layout: { contentSize: '800px', wideSize: '1200px' },
  },
  __experimentalBlockPatterns: [],
  __experimentalBlockPatternCategories: [],
  __experimentalDragAndDrop: true,
  imageEditing: false,
  mediaUpload: null,
  allowedBlockTypes: true,
  styles: [
    {
      css: `
        .wp-block { max-width: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .wp-block-button__link { border-radius: 4px; padding: 10px 24px; font-size: 16px; font-weight: 500; cursor: pointer; display: inline-block; text-decoration: none; }
        .is-style-outline .wp-block-button__link { background: transparent !important; border: 2px solid currentColor !important; }
        .is-style-squared .wp-block-button__link { border-radius: 0 !important; }
        .wp-block-heading { line-height: 1.3; margin-bottom: 16px; }
        .wp-block-paragraph { line-height: 1.7; margin-bottom: 16px; }
        .wp-block-quote { border-left: 4px solid #3858e9; padding: 8px 0 8px 20px; margin: 0 0 16px; }
        .wp-block-pullquote { border-top: 4px solid #1e1e1e; border-bottom: 4px solid #1e1e1e; padding: 24px; text-align: center; font-size: 22px; font-style: italic; }
        .is-style-solid-color.wp-block-pullquote { background: #1e1e1e; color: #fff; border: none; padding: 32px; }
        .wp-block-code { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 14px; }
        .wp-block-list { padding-left: 24px; margin-bottom: 16px; }
        .wp-block-list li { margin-bottom: 6px; line-height: 1.7; }
        .wp-block-image img { max-width: 100%; height: auto; display: block; }
        .wp-block-image figcaption { font-size: 13px; color: #6b7280; text-align: center; margin-top: 8px; }
        .is-style-rounded img { border-radius: 50% !important; }
        .wp-block-table table { width: 100%; border-collapse: collapse; }
        .wp-block-table td, .wp-block-table th { border: 1px solid #e0e0e0; padding: 10px 14px; }
        .wp-block-table th { background: #f5f5f5; font-weight: 600; }
        .is-style-stripes tr:nth-child(odd) td { background: #f9fafb; }
        .wp-block-separator { border: none; border-top: 2px solid #e0e0e0; margin: 24px auto; }
        .wp-block-separator.is-style-dots { border: none; text-align: center; }
        .wp-block-separator.is-style-dots::before { content: '· · ·'; font-size: 24px; letter-spacing: 12px; color: #6b7280; }
        .wp-block-columns { display: flex; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
        .wp-block-column { flex: 1; min-width: 160px; }
        .wp-block-cover { position: relative; min-height: 300px; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; }
        .has-text-align-left { text-align: left; }
        .has-text-align-center { text-align: center; }
        .has-text-align-right { text-align: right; }
        .has-small-font-size { font-size: 12px !important; }
        .has-normal-font-size { font-size: 16px !important; }
        .has-medium-font-size { font-size: 20px !important; }
        .has-large-font-size { font-size: 24px !important; }
        .has-x-large-font-size { font-size: 32px !important; }
        .has-huge-font-size { font-size: 64px !important; }
      `,
      isGlobalStyles: true,
    }
  ],
};


const FullInspector = () => {
  const selected = useSelect(
    (select) => select("core/block-editor").getSelectedBlock()
  ); // ❌ REMOVE [] dependency

  const { updateBlockAttributes } = useDispatch("core/block-editor");

  if (!selected) return <div style={{ padding: 12 }}>No block selected</div>;

  const style = selected.attributes.style || {};

  // ✅ SAFE FONT SIZE VALUE
  const fontSize = parseInt(style?.typography?.fontSize) || 50;

  const updateStyle = (path, value) => {
    const newStyle = JSON.parse(JSON.stringify(style || {}));

    const keys = path.split(".");
    let obj = newStyle;

    while (keys.length > 1) {
      const key = keys.shift();
      obj[key] = obj[key] || {};
      obj = obj[key];
    }

    obj[keys[0]] = value;

    updateBlockAttributes(selected.clientId, {
      style: newStyle,
    });
  };

  return (
    <div style={{ padding: "12px" }}>

      {/* Typography */}
      <div className="panel">
        <h4>Typography</h4>

        <RangeControl
          label="Font Size"
          min={10}
          max={100}
          value={fontSize}
          onChange={(val) =>
            updateStyle("typography.fontSize", `${val}px`)
          }
        />
      </div>

      {/* Dimensions */}
      <div className="panel">
        <h4>Dimensions</h4>

        <label>Margin</label>
        <input
          type="range"
          min="0"
          max="100"
          value={parseInt(style?.spacing?.margin) || 0}
          onChange={(e) =>
            updateStyle("spacing.margin", `${e.target.value}px`)
          }
        />

        <label>Padding</label>
        <input
          type="range"
          min="0"
          max="100"
          value={parseInt(style?.spacing?.padding) || 0}
          onChange={(e) =>
            updateStyle("spacing.padding", `${e.target.value}px`)
          }
        />
      </div>

      {/* Border */}
      <div className="panel">
        <h4>Border</h4>

        <label>Width</label>
        <input
          type="range"
          min="0"
          max="20"
          value={parseInt(style?.border?.width) || 0}
          onChange={(e) =>
            updateStyle("border.width", `${e.target.value}px`)
          }
        />

        <label>Radius</label>
        <input
          type="range"
          min="0"
          max="50"
          value={parseInt(style?.border?.radius) || 0}
          onChange={(e) =>
            updateStyle("border.radius", `${e.target.value}px`)
          }
        />
      </div>

      {/* Height */}
      <div className="panel">
        <h4>Height</h4>
        <select
          value={style?.dimensions?.height || "auto"}
          onChange={(e) =>
            updateStyle("dimensions.height", e.target.value)
          }
        >
          <option value="auto">Fit</option>
          <option value="100%">Grow</option>
          <option value="300px">Fixed</option>
        </select>
      </div>

      {/* Shadow */}
      <div className="panel">
        <h4>Shadow</h4>
        <input
          type="checkbox"
          checked={!!style?.shadow}
          onChange={(e) =>
            updateStyle(
              "shadow",
              e.target.checked
                ? "0px 4px 10px rgba(0,0,0,0.2)"
                : undefined
            )
          }
        />
      </div>

    </div>
  );
};

function App({ onViewSite }) {
    const [blocks, setBlocks] = useState([]);
  const [output, setOutput] = useState(null);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState('Home');
  const [pageId] = useState(DEFAULT_PAGE_ID);

  // Step 20 — Undo / Redo
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef({ past: [], future: [] });
  const blocksRef = useRef([]);
  // -d adding list view 
  const [listViewOpen, setListViewOpen] = useState(false);

  // Step 19 — Template picker
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templateReplaceMode, setTemplateReplaceMode] = useState(false);

  // Keep blocksRef in sync so history closures always snapshot the latest state
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  useEffect(() => {
    loadBlocks();
  }, []);

  useEffect(() => {
    const handleBlockClick = (e) => {
      if (e.target.closest(".block-editor-block-types-list__list-item")) {
        document.body.classList.remove("inserter-active");
      }
    };
  
    document.addEventListener("click", handleBlockClick);
  
    return () => {
      document.removeEventListener("click", handleBlockClick);
    };
  }, []);

  useEffect(() => {
    if (listViewOpen) {
      document.body.classList.add('list-view-active');
    } else {
      document.body.classList.remove('list-view-active');
    }
  
    return () => {
      document.body.classList.remove('list-view-active');
    };
  }, [listViewOpen]);

  useEffect(() => {
    const btns = document.querySelectorAll(
      ".block-editor-block-mover__drag-handle"
    );
  
    btns.forEach((btn) => {
      btn.classList.add("my-custom-class");
    });
  }, []);
  
  async function loadBlocks() {
    try {
      // loadPage() is defined in src/data/api.js
      // Swap the body there to use fetch() against your real backend
      const page = await loadPage(pageId);
      if (page?.json) {
        setBlocks(JSON.parse(page.json));
        if (page.title) setPageTitle(page.title);
      } else if (page?.html) {
        setBlocks(parse(page.html));
      }
    } catch (e) {
      console.error('Failed to load blocks:', e);
    }
  }

  async function handleSave() {
    try {
      const html = serialize(blocks);
      const json = JSON.stringify(blocks, null, 2);

      // savePage() is defined in src/data/api.js
      // Swap the body there to use fetch() against your real backend
      await savePage(pageId, pageTitle, html, json);

      setOutput({ html, json });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save blocks:', e);
    }
  }

  async function handleClear() {
    try {
      setBlocks([]);
      setOutput(null);
      // Also persist the empty state so the viewer shows nothing
      await savePage(pageId, pageTitle, '', '[]');
    } catch (e) {
      console.error('Failed to clear blocks:', e);
    }
  }

  // ── Undo / Redo ────────────────────────────────────────────────────────────
  function pushHistory(snapshot) {
    historyRef.current.past.push(snapshot);
    historyRef.current.future = [];
    setCanUndo(true);
    setCanRedo(false);
  }

  function handleUndo() {
    if (!historyRef.current.past.length) return;
    historyRef.current.future.unshift(blocksRef.current);
    const prev = historyRef.current.past.pop();
    setBlocks(prev);
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(true);
  }

  function handleRedo() {
    if (!historyRef.current.future.length) return;
    historyRef.current.past.push(blocksRef.current);
    const next = historyRef.current.future.shift();
    setBlocks(next);
    setCanUndo(true);
    setCanRedo(historyRef.current.future.length > 0);
  }

  // ── Templates ────────────────────────────────────────────────────────────────
  function makeBlock({ name, attributes = {}, innerBlocks = [] }) {
    return createBlock(name, attributes, innerBlocks.map(makeBlock));
  }

  function applyTemplate(tpl) {
    const newBlocks = tpl.blocks.map(makeBlock);
    const result = templateReplaceMode ? newBlocks : [...blocksRef.current, ...newBlocks];
    pushHistory(blocksRef.current);
    setBlocks(result);
    setTemplatePickerOpen(false);
  }

  return (
    <div className="editor-wrapper">

      {/* ---- HEADER ---- */}
      <div className="editor-header">
      <div className="fp-editor-title-row">
          <a href="/">
            <div className="logo-image">
              <img src={logoimage} alt="Logo" />
            </div>
          </a>
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
          <button className="sidebar-toggle-btn header-btn-wrap" onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaColumns />
            {sidebarOpen ? '' : ''}
          </button>

          <button className="preview-btn header-btn-wrap" onClick={() => setPreview(!preview)}
          >
            {preview ?
              <FaEdit /> :
              <FaEye />}
            {preview ? '' : ''}
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
        </div>
      </div>

      {preview ? (
        /* ---- PREVIEW MODE ---- */
        <div className="preview-container">
          <div className="preview-label">Frontend Preview</div>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: serialize(blocks) }}
          />
        </div>
      ) : (
        /* ---- EDITOR MODE ---- */
        <SlotFillProvider>
          <ShortcutProvider>
            <BlockEditorProvider
              value={blocks}
              onInput={setBlocks}
              onChange={(newBlocks) => {
                if (newBlocks !== blocksRef.current) {
                  pushHistory(blocksRef.current);
                }
                setBlocks(newBlocks);
              }}
              settings={EDITOR_SETTINGS}
              useSubRegistry={false} 
            >
              <BlockEditorKeyboardShortcuts.Register />

              <div className={`editor-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>

                {/* ---- MAIN EDITOR ---- */}
                <div className="editor-main">

                  {/* ✅ Fixed top toolbar with + inserter, Templates, Undo/Redo */}
                  <div className="editor-toolbar">
                  <Inserter
                      rootClientId={undefined}
                      clientId={undefined}
                      isAppender
                      renderToggle={({ onToggle }) => {
                        const handleClick = () => {
                          onToggle();
                          document.body.classList.toggle("inserter-active");
                        };

                        return (
                          <button
                            className="toolbar-inserter-btn"
                            onClick={handleClick}
                            title="Add block"
                          >
                            <FaPlus />
                          </button>
                        );
                      }}
                    />

                    <div className="toolbar-divider" />

                    {/* Step 19 — Templates button */}
                    <button
                      className={`toolbar-btn${templatePickerOpen ? ' active' : ''}`}
                      onClick={() => setTemplatePickerOpen(o => !o)}
                      title="Insert a pre-built block template"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0F172A" strokeWidth="2" />

                        {/* Top full width */}
                        <rect x="6" y="6" width="12" height="3" stroke="#0F172A" strokeWidth="2" />

                        {/* Bottom split */}
                        <rect x="6" y="11" width="5" height="7" stroke="#0F172A" strokeWidth="2" />
                        <rect x="13" y="11" width="5" height="7" stroke="#0F172A" strokeWidth="2" />
                      </svg>
                    </button>

                    <div className="toolbar-divider" />

                    {/* Step 20 — Undo / Redo */}
                    <button
                      className="toolbar-btn"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      title="Undo (Ctrl+Z)"
                    >
                      <LuUndo />
                    </button>
                    <button
                      className="toolbar-btn"
                      onClick={handleRedo}
                      disabled={!canRedo}
                      title="Redo (Ctrl+Y)"
                    >
                      <LuRedo />
                    </button>
                    <button
                        className={`toolbar-btn ${listViewOpen ? 'active' : ''}`}
                        onClick={() => setListViewOpen(prev => !prev)}
                        title="List View"
                      >
                      ☰
                    </button>

                  </div>
            
                  {/* ── Template Picker Panel (Step 19) ── */}
                  {templatePickerOpen && (
                    <div className="template-picker">
                      <div className="template-picker-header">
                        <span className="template-picker-title">Choose a Template</span>
                        <label className="template-replace-toggle">
                          <input
                            type="checkbox"
                            checked={templateReplaceMode}
                            onChange={e => setTemplateReplaceMode(e.target.checked)}
                          />
                          Replace existing content
                        </label>
                        <button
                          className="template-picker-close"
                          onClick={() => setTemplatePickerOpen(false)}
                          title="Close"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="template-picker-grid">
                        {blockTemplates.map(tpl => (
                          <button
                            key={tpl.slug}
                            className="template-card"
                            onClick={() => applyTemplate(tpl)}
                            title={tpl.description}
                          >
                            <span className="template-card-icon">{tpl.icon}</span>
                            <span className="template-card-label">{tpl.label}</span>
                            <span className="template-card-meta">{tpl.category}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ✅ BlockTools wraps everything for drag and toolbar */}
                        {/* -d addrd editor-layout and list view */}
                  <div className="editor-split-layout">

                    {/* LEFT: List View */}
                    {listViewOpen && (
                      <div className="editor-list-view">
                        <ListView />
                      </div>
                    )}

                    {/* RIGHT: Editor */}
                    <div className="editor-content">

                    <BlockTools>
                    <div className="editor-canvas-wrapper">
                      <WritingFlow>
                        <ObserveTyping>
                          <div className="editor-canvas">

                            {/* ✅ Empty state */}
                     

                            {/* ✅ Main block list — drag and drop built in */}
                            <BlockList />

                            {/* ✅ Bottom inline + inserter */}
                            {blocks.length > 0 && (
                              <div className="bottom-inserter">
                                <Inserter
                                  rootClientId={undefined}
                                  clientId={undefined}
                                  isAppender
                                  renderToggle={({ onToggle }) => (
                                    <button
                                      className="inline-inserter-btn"
                                      onClick={onToggle}
                                      title="Add block below"
                                    >
                                      +
                                    </button>
                                  )}
                                />
                              </div>
                            )}

                          </div>
                        </ObserveTyping>
                      </WritingFlow>
                    </div>
                  </BlockTools>

                    </div>
                  </div>
                </div>
                {/* ---- SIDEBAR ---- */}
                {sidebarOpen && (
                  <div className="editor-sidebar">
                    <div className="sidebar-header">
                      <span>Block Settings</span>
                    </div>
                    <div className="sidebar-body">
                      <BlockInspector />
                      <FullInspector />

                    </div>
                  </div>
                )}
              </div>
              <Popover.Slot />

            </BlockEditorProvider>
          </ShortcutProvider>
        </SlotFillProvider>
      )}

      {/* ---- OUTPUT PANEL ---- */}
      {output && !preview && (
        <div className="output-panel">
          <div className="output-section">
            <div className="output-header">
              <span>HTML Output</span>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(output.html)}
              >
                Copy
              </button>
            </div>
            <pre className="output-code">{output.html}</pre>
          </div>

          <div className="output-section">
            <div className="output-header">
              <span>JSON Output</span>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(output.json)}
              >
                Copy
              </button>
            </div>
            <pre className="output-code">{output.json}</pre>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;