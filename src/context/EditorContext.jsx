import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { serialize, parse, createBlock } from '@wordpress/blocks';
import { savePage, loadPage } from '../data/api';
import { blockTemplates } from '../data/blockTemplates';

const EditorContext = createContext(null);

const DEFAULT_PAGE_ID = 'home';

export function EditorProvider({ children, onViewSite }) {
  const [blocks, setBlocks] = useState([]);
  const [output, setOutput] = useState(null);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState('Home');
  const [pageId] = useState(DEFAULT_PAGE_ID);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templateReplaceMode, setTemplateReplaceMode] = useState(false);
  const [listViewOpen, setListViewOpen] = useState(false);

  const historyRef = useRef({ past: [], future: [] });
  const blocksRef = useRef([]);

  // Keep blocksRef in sync
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  useEffect(() => { loadBlocks(); }, []);

  useEffect(() => {
    const handleBlockClick = (e) => {
      if (e.target.closest('.block-editor-block-types-list__list-item')) {
        document.body.classList.remove('inserter-active');
      }
    };
    document.addEventListener('click', handleBlockClick);
    return () => document.removeEventListener('click', handleBlockClick);
  }, []);

  useEffect(() => {
    if (listViewOpen) {
      document.body.classList.add('list-view-active');
    } else {
      document.body.classList.remove('list-view-active');
    }
    return () => document.body.classList.remove('list-view-active');
  }, [listViewOpen]);

  async function loadBlocks() {
    try {
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
      await savePage(pageId, pageTitle, '', '[]');
    } catch (e) {
      console.error('Failed to clear blocks:', e);
    }
  }

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

  const value = {
    // state
    blocks, setBlocks,
    output,
    preview, setPreview,
    saved,
    sidebarOpen, setSidebarOpen,
    pageTitle, setPageTitle,
    pageId,
    canUndo, canRedo,
    templatePickerOpen, setTemplatePickerOpen,
    templateReplaceMode, setTemplateReplaceMode,
    listViewOpen, setListViewOpen,
    historyRef, blocksRef,
    blockTemplates,
    // actions
    onViewSite,
    handleSave,
    handleClear,
    handleUndo,
    handleRedo,
    pushHistory,
    applyTemplate,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used inside <EditorProvider>');
  return ctx;
}
