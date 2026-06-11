import React from "react";
import { LuUndo, LuRedo } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { useEditor } from "../context/EditorContext";
import { TemplateIcon, DocumentOverviewIcon } from "./Icons";

export default function LeftToolbarButtonSet() {
  const {
    canUndo, canRedo,
    handleUndo, handleRedo,
    templatePickerOpen, setTemplatePickerOpen,
    listViewOpen, setListViewOpen,
    inserterOpen, setInserterOpen,
  } = useEditor();

  return (
    <div className='editor-toolbar'>
      <button
        className={`toolbar-inserter-btn${inserterOpen ? " active" : ""}`}
        data-inserter-open={inserterOpen ? 'true' : 'false'}
        onClick={() => setInserterOpen((o) => !o)}
        title='Add block'
      >
        <FaPlus />
      </button>

      {/* Templates button */}
      <button
        className={`toolbar-btn template-btn${templatePickerOpen ? " active" : ""}`}
        onClick={() => setTemplatePickerOpen((o) => !o)}
        title='Insert a pre-built block template'
      >
        <TemplateIcon />
      </button>

      {/* Undo / Redo */}
      <button className='toolbar-btn handledo-btn' onClick={handleUndo} disabled={!canUndo} title='Undo (Ctrl+Z)'>
        <LuUndo />
      </button>
      <button className='toolbar-btn handledo-btn' onClick={handleRedo} disabled={!canRedo} title='Redo (Ctrl+Y)'>
        <LuRedo />
      </button>

      {/* List View */}
      <button
        className={`toolbar-btn ${listViewOpen ? "active" : ""}`}
        onClick={() => setListViewOpen((prev) => !prev)}
        title='List View'
      >
        <DocumentOverviewIcon />
      </button>
    </div>
  );
}