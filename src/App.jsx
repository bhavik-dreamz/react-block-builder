import React, { useEffect, useMemo, useState } from "react";
import {
  BlockEditorProvider,
  BlockList,
  BlockTools,
  WritingFlow,
  ObserveTyping,
  Inserter,
  BlockEditorKeyboardShortcuts,
  BlockInspector,
} from "@wordpress/block-editor";
import { serialize, parse } from "@wordpress/blocks";
import { SlotFillProvider, Popover } from "@wordpress/components";
import { ShortcutProvider } from "@wordpress/keyboard-shortcuts";
import { BlockSelectionClearer } from "@wordpress/block-editor";
import { EDITOR_SETTINGS, mergeEditorSettings } from "./config/editorSettings";
import { EditorProvider, useEditor } from "./context/EditorContext";
import { initBlocks } from "./registerBlocks";
import { MediaLibrarySetup, applyMediaToSettings } from "./media";
import { ActionBuilderSetup } from "./actions";

import Header from "./components/Header";
import TemplatePicker from "./components/TemplatePicker";
import InserterPanelHost from "./components/InserterPanelHost";
import { EditorSkeleton } from "./EditorSkeleton.jsx";

function EditorApp({ settings }) {
  const {
    blocks,
    setBlocks,
    output,
    preview,
    sidebarOpen,
    listViewOpen,
    inserterOpen,
    blocksRef,
    pushHistory,
    editorMode,
    setEditorMode,
    fullscreen,
    spotlightMode,
    distractionFree,
  } = useEditor();

  return (
    <>
      <div
        className={`builder-wrapper editor-wrapper${fullscreen ? " is-fullscreen" : ""}${spotlightMode ? " is-spotlight" : ""}${distractionFree ? " is-distraction-free" : ""}`}
      >
        {/* ---- HEADER ---- */}
        <Header />

        {preview ? (
          /* ---- PREVIEW MODE ---- */
          <div className='preview-container'>
            <div className='preview-label'>Frontend Preview</div>
            <div
              className='preview-content'
              dangerouslySetInnerHTML={{ __html: serialize(blocks) }}
            />
          </div>
        ) : editorMode === "code" ? (
          /* ---- CODE EDITOR MODE ---- */
          <div className='code-editor-mode'>
            <div className='code-editor-header'>
              <span>Editing code</span>
              <button
                className='code-editor-exit-btn'
                onClick={() => setEditorMode("visual")}
              >
                Exit code editor
              </button>
            </div>
            <textarea
              className='code-editor-textarea'
              value={serialize(blocks)}
              onChange={(e) => {
                try {
                  setBlocks(parse(e.target.value));
                } catch (_) {}
              }}
              spellCheck={false}
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
                settings={settings}
                useSubRegistry={true}
              >
                <BlockEditorKeyboardShortcuts>
                  <BlockEditorKeyboardShortcuts.Register />
                </BlockEditorKeyboardShortcuts>

                <div
                  className={`editor-layout ${sidebarOpen ? "sidebar-open" : ""} ${(inserterOpen || listViewOpen) ? "left-open" : ""} ${sidebarOpen ? "split-open" : "split-closed"}`}
                >
                  <InserterPanelHost />

                  {/* ---- MIDDLE: MAIN EDITOR ---- */}
                  <div className='editor-main'>
                    <TemplatePicker />
                    <div className='editor-content'>
                      <BlockTools>
                        <BlockSelectionClearer>
                          <div className='editor-canvas-wrapper'>
                            <WritingFlow>
                              <ObserveTyping>
                                <div className='editor-canvas'>
                                  <BlockList />

                                  {blocks.length > 0 && (
                                    <div className='bottom-inserter'>
                                      <Inserter
                                        rootClientId={undefined}
                                        clientId={undefined}
                                        isAppender
                                        renderToggle={({ onToggle }) => (
                                          <button
                                            className='inline-inserter-btn'
                                            onClick={onToggle}
                                            title='Add block below'
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
                        </BlockSelectionClearer>
                      </BlockTools>
                    </div>
                  </div>

                  {/* ---- RIGHT: SPLIT PANEL (Inspector) ---- */}
                  {sidebarOpen && (
                    <div className='editor-split-layout'>
                      <div className='editor-sidebar'>
                        <div className='sidebar-header'>
                          <span>Block Settings</span>
                        </div>
                        <div className='sidebar-body'>
                          <BlockInspector />
                        </div>
                      </div>
                    </div>
                  )}
                  <Popover.Slot />
                </div>
              </BlockEditorProvider>
            </ShortcutProvider>
          </SlotFillProvider>
        )}

        {/* ---- OUTPUT PANEL ---- */}
        {output && !preview && (
          <div className='output-panel'>
            <div className='output-section'>
              <div className='output-header'>
                <span>HTML Output</span>
                <button
                  className='copy-btn'
                  onClick={() => navigator.clipboard.writeText(output.html)}
                >
                  Copy
                </button>
              </div>
              <pre className='output-code'>{output.html}</pre>
            </div>

            <div className='output-section'>
              <div className='output-header'>
                <span>JSON Output</span>
                <button
                  className='copy-btn'
                  onClick={() => navigator.clipboard.writeText(output.json)}
                >
                  Copy
                </button>
              </div>
              <pre className='output-code'>{output.json}</pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function App({
  onViewSite,
  onSave,
  onLoad,
  onClear,
  initialContent,
  initialTitle,
  initialPageId,
  blockRegistry = [],
  customBlocksConfig = [],
  disableBundledBlocks = false,
  unregisterBlocks = [],
  editorSettings,
  media,
  actions,
}) {
  const [blocksReady, setBlocksReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    initBlocks(blockRegistry, {
      customBlocksConfig,
      disableBundledBlocks,
      unregisterBlocks,
    }).then(() => {
      if (!cancelled) setBlocksReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [blockRegistry, customBlocksConfig, disableBundledBlocks, unregisterBlocks]);

  const settings = useMemo(() => {
    const merged = mergeEditorSettings(EDITOR_SETTINGS, editorSettings);
    return applyMediaToSettings(merged, media);
  }, [editorSettings, media]);

  if (!blocksReady) {
    return <EditorSkeleton />;
  }

  return (
    <ActionBuilderSetup actions={actions}>
    <MediaLibrarySetup media={media}>
      <EditorProvider
        onViewSite={onViewSite}
        onSave={onSave}
        onLoad={onLoad}
        onClear={onClear}
        initialContent={initialContent}
        initialTitle={initialTitle}
        initialPageId={initialPageId}
      >
        <EditorApp settings={settings} />
      </EditorProvider>
    </MediaLibrarySetup>
    </ActionBuilderSetup>
  );
}

export default App;
