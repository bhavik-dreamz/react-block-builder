import React from 'react';
import {
  __experimentalLibrary as InserterLibrary,
  __experimentalListView as ListView,
} from '@wordpress/block-editor';
import { useEditor } from '../context/EditorContext';

/**
 * Left sidebar (column 1 of the 3-column builder layout). Hosts the inline
 * block inserter (`__experimentalLibrary`) and the List View tree, each
 * toggled from the toolbar. Renders inline — no body-appended popover — so
 * both stay docked next to `.editor-main`.
 */
export default function InserterPanelHost() {
  const { inserterOpen, setInserterOpen, listViewOpen } = useEditor();
  const open = inserterOpen || listViewOpen;

  return (
    <div className="gbk-inserter-panel" aria-hidden={open ? undefined : 'true'}>
      {listViewOpen && (
        <div className="editor-list-view">
          <div className="sidebar-header">
            <span>List View</span>
          </div>
          <div className="sidebar-body">
            <ListView />
          </div>
        </div>
      )}

      {inserterOpen && !listViewOpen && (
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
