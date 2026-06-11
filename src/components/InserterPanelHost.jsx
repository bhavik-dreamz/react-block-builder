import React from 'react';
import { __experimentalLibrary as InserterLibrary } from '@wordpress/block-editor';
import { useEditor } from '../context/EditorContext';

/**
 * Permanent block inserter docked in the left sidebar (column 1 of the
 * 3-column builder layout). Renders the inserter menu inline via
 * `__experimentalLibrary` instead of the body-appended popover, so the
 * block list stays sticky next to `.editor-main` / `.editor-split-layout`.
 */
export default function InserterPanelHost() {
  const { inserterOpen, setInserterOpen } = useEditor();

  return (
    <div
      className="gbk-inserter-panel"
      aria-hidden={inserterOpen ? undefined : 'true'}
    >
      {inserterOpen && (
        <InserterLibrary
          rootClientId={undefined}
          clientId={undefined}
          isAppender
          showInserterHelpPanel={false}
          onClose={() => setInserterOpen(false)}
        />
      )}
    </div>
  );
}
