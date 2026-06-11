import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { serialize, parse, createBlock } from '@wordpress/blocks';
import { blockTemplates as bundledTemplates } from '../data/blockTemplates';

const EditorContext = createContext(null);

const DEFAULT_PAGE_ID = 'home';

const DEFAULT_HEADER_BUTTONS = {
  deviceSwitcher: true,
  sidebar: true,
  preview: true,
  clear: true,
  save: true,
  viewSite: true,
  options: true,
};

export function EditorProvider({
  children,
  onViewSite,
  onSave,
  onLoad,
  onClear,
  initialContent,
  initialTitle = 'Home',
  initialPageId = DEFAULT_PAGE_ID,
  headerButtons,
  confirmClear = true,
  confirmClearMessage = 'Clear all content? This cannot be undone.',
  devices,
  defaultDevice,
  customButtons,
  templates,
  disableBundledTemplates = false,
}) {
  const headerButtonsConfig = { ...DEFAULT_HEADER_BUTTONS, ...(headerButtons || {}) };

  const customTemplates = (Array.isArray(templates) ? templates : []).filter(
    (tpl) => tpl && Array.isArray(tpl.blocks),
  );
  const blockTemplates = disableBundledTemplates
    ? customTemplates
    : [...bundledTemplates, ...customTemplates];
  const deviceList = devices?.length ? devices : ['desktop', 'tablet', 'mobile'];
  const initialDevice = deviceList.includes(defaultDevice) ? defaultDevice : deviceList[0];
  const [blocks, setBlocks] = useState([]);
  const [output, setOutput] = useState(null);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pageTitle, setPageTitle] = useState(initialTitle);
  const [pageId] = useState(initialPageId);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templateReplaceMode, setTemplateReplaceMode] = useState(false);
  const [listViewOpen, setListViewOpen] = useState(false);
  const [inserterOpen, setInserterOpen] = useState(true);
  const [deviceType, setDeviceType] = useState(initialDevice); // 'desktop' | 'tablet' | 'mobile'
  // Options menu state
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' | 'code'
  const [fullscreen, setFullscreen] = useState(false);
  const [spotlightMode, setSpotlightMode] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);
  const [topToolbar, setTopToolbar] = useState(false);

  const historyRef = useRef({ past: [], future: [] });
  const blocksRef = useRef([]);

  // Keep blocksRef in sync
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);

  useEffect(() => { loadBlocks(); }, []);

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
      if (initialContent) {
        if (typeof initialContent === 'string') {
          try {
            setBlocks(JSON.parse(initialContent));
          } catch {
            setBlocks(parse(initialContent));
          }
        } else if (Array.isArray(initialContent)) {
          setBlocks(initialContent);
        }
        return;
      }
      if (onLoad) {
        const page = await onLoad(pageId);
        if (page?.json) {
          setBlocks(typeof page.json === 'string' ? JSON.parse(page.json) : page.json);
          if (page.title) setPageTitle(page.title);
        } else if (page?.html) {
          setBlocks(parse(page.html));
        } else if (Array.isArray(page)) {
          setBlocks(page);
        }
      }
    } catch (e) {
      console.error('Failed to load blocks:', e);
    }
  }

  async function handleSave() {
    try {
      const html = serialize(blocks);
      const json = JSON.stringify(blocks, null, 2);
      if (onSave) {
        await onSave({ id: pageId, title: pageTitle, html, json });
      }
      setOutput({ html, json });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save blocks:', e);
    }
  }

  async function handleClear() {
    if (confirmClear && typeof window !== 'undefined') {
      const ok = window.confirm(confirmClearMessage);
      if (!ok) {
        return;
      }
    }
    try {
      setBlocks([]);
      setOutput(null);
      if (onClear) {
        await onClear(pageId);
      } else if (onSave) {
        await onSave({ id: pageId, title: pageTitle, html: '', json: '[]' });
      }
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
    inserterOpen, setInserterOpen,
    deviceType, setDeviceType,
    devices: deviceList,
    // options menu
    editorMode, setEditorMode,
    fullscreen, setFullscreen,
    spotlightMode, setSpotlightMode,
    distractionFree, setDistractionFree,
    topToolbar, setTopToolbar,
    historyRef, blocksRef,
    blockTemplates,
    // header button visibility config
    headerButtons: headerButtonsConfig,
    customButtons: Array.isArray(customButtons) ? customButtons : [],
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